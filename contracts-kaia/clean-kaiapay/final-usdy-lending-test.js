const { ethers } = require("hardhat");
const fs = require('fs');

// Load deployed addresses
const deployedAddresses = JSON.parse(fs.readFileSync('./deployedAddresses.json', 'utf8'));

async function main() {
    console.log("🔄 Starting Complete USDY Lending Protocol Test...\n");
    
    const signers = await ethers.getSigners();
    const owner = signers[0];
    
    console.log("👤 Test Account:");
    console.log(`   Address: ${owner.address}\n`);

    // Connect to contracts
    const lendingProtocol = await ethers.getContractAt("EnhancedLendingProtocol", deployedAddresses.EnhancedLendingProtocol);
    const usdyToken = await ethers.getContractAt("IERC20", deployedAddresses.USDY);
    const usdtToken = await ethers.getContractAt("IERC20", deployedAddresses.DummyUSDT);
    
    console.log("📋 Contract Addresses:");
    console.log(`   Enhanced Lending Protocol: ${deployedAddresses.EnhancedLendingProtocol}`);
    console.log(`   USDY Token (Collateral): ${deployedAddresses.USDY}`);
    console.log(`   USDT Token (Lending): ${deployedAddresses.DummyUSDT}\n`);

    // Test amounts
    const usdyCollateralAmount = ethers.parseUnits("1000", 18); // 1000 USDY as collateral
    const usdtDepositAmount = ethers.parseUnits("500", 6); // 500 USDT to deposit for lending
    const borrowAmount = ethers.parseUnits("300", 6); // 300 USDT to borrow

    let testResults = {
        timestamp: new Date().toISOString(),
        testName: "Complete USDY Lending Protocol Test",
        results: {}
    };

    try {
        // Step 1: Check initial balances
        console.log("💰 Step 1: Checking Initial Balances:");
        const userUSDTBalance = await usdtToken.balanceOf(owner.address);
        const userUSDYBalance = await usdyToken.balanceOf(owner.address);
        console.log(`   User USDT Balance: ${ethers.formatUnits(userUSDTBalance, 6)}`);
        console.log(`   User USDY Balance: ${ethers.formatUnits(userUSDYBalance, 18)}\n`);

        testResults.results.initialBalances = {
            success: true,
            userUSDT: ethers.formatUnits(userUSDTBalance, 6),
            userUSDY: ethers.formatUnits(userUSDYBalance, 18)
        };

        // Step 2: Deposit USDT for lending (provide liquidity)
        console.log("🏦 Step 2: Depositing USDT for lending...");
        
        try {
            await usdtToken.approve(lendingProtocol.target, usdtDepositAmount);
            const depositTx = await lendingProtocol.deposit(deployedAddresses.DummyUSDT, usdtDepositAmount);
            await depositTx.wait();
            
            console.log(`   ✅ Deposited ${ethers.formatUnits(usdtDepositAmount, 6)} USDT for lending`);
            
            testResults.results.usdtDeposit = {
                success: true,
                amount: ethers.formatUnits(usdtDepositAmount, 6)
            };

        } catch (error) {
            console.log(`   ❌ USDT deposit failed: ${error.message}`);
            testResults.results.usdtDeposit = { success: false, error: error.message };
        }

        // Step 3: Deposit USDY as collateral
        console.log("\n🔒 Step 3: Depositing USDY as collateral...");
        
        try {
            await usdyToken.approve(lendingProtocol.target, usdyCollateralAmount);
            const collateralTx = await lendingProtocol.depositCollateral(usdyCollateralAmount);
            await collateralTx.wait();
            
            console.log(`   ✅ Deposited ${ethers.formatUnits(usdyCollateralAmount, 18)} USDY as collateral`);
            
            // Check collateral balance
            const collateralBalance = await lendingProtocol.collateralBalance(owner.address);
            console.log(`   📊 Collateral Balance: ${ethers.formatUnits(collateralBalance, 18)} USDY`);

            testResults.results.collateralDeposit = {
                success: true,
                amount: ethers.formatUnits(usdyCollateralAmount, 18),
                balance: ethers.formatUnits(collateralBalance, 18)
            };

        } catch (error) {
            console.log(`   ❌ Collateral deposit failed: ${error.message}`);
            testResults.results.collateralDeposit = { success: false, error: error.message };
        }

        // Step 4: Calculate borrowing capacity
        console.log("\n🧮 Step 4: Calculating borrowing capacity...");
        
        try {
            const collateralValue = await lendingProtocol.getCollateralValue(owner.address);
            console.log(`   📈 Collateral Value: $${ethers.formatUnits(collateralValue, 18)}`);
            
            const maxBorrow = await lendingProtocol.getMaxBorrowAmount(owner.address);
            console.log(`   💰 Max Borrow Amount: ${ethers.formatUnits(maxBorrow, 6)} USDT`);
            
            testResults.results.borrowingCapacity = {
                success: true,
                collateralValue: ethers.formatUnits(collateralValue, 18),
                maxBorrow: ethers.formatUnits(maxBorrow, 6)
            };

        } catch (error) {
            console.log(`   ⚠️  Could not calculate borrowing capacity: ${error.message}`);
            testResults.results.borrowingCapacity = { success: false, error: error.message };
        }

        // Step 5: Borrow USDT
        console.log("\n💳 Step 5: Borrowing USDT...");
        
        try {
            const borrowTx = await lendingProtocol.borrow(deployedAddresses.DummyUSDT, borrowAmount);
            await borrowTx.wait();
            
            console.log(`   ✅ Borrowed ${ethers.formatUnits(borrowAmount, 6)} USDT`);
            
            // Check debt balance
            const debtBalance = await lendingProtocol.debtBalance(owner.address, deployedAddresses.DummyUSDT);
            console.log(`   📊 Debt Balance: ${ethers.formatUnits(debtBalance, 6)} USDT`);
            
            // Check user's new USDT balance
            const newUSDTBalance = await usdtToken.balanceOf(owner.address);
            console.log(`   💰 New USDT Balance: ${ethers.formatUnits(newUSDTBalance, 6)}`);

            testResults.results.borrowing = {
                success: true,
                amount: ethers.formatUnits(borrowAmount, 6),
                debt: ethers.formatUnits(debtBalance, 6),
                newBalance: ethers.formatUnits(newUSDTBalance, 6)
            };

        } catch (error) {
            console.log(`   ❌ Borrowing failed: ${error.message}`);
            testResults.results.borrowing = { success: false, error: error.message };
        }

        // Step 6: Check health factor
        console.log("\n🏥 Step 6: Checking account health...");
        
        try {
            const healthFactor = await lendingProtocol.getHealthFactor(owner.address);
            console.log(`   📊 Health Factor: ${ethers.formatUnits(healthFactor, 18)}`);
            
            const isLiquidatable = healthFactor < ethers.parseUnits("1", 18);
            console.log(`   ${isLiquidatable ? "⚠️  Account is liquidatable!" : "✅ Account is healthy"}`);

            testResults.results.healthCheck = {
                success: true,
                healthFactor: ethers.formatUnits(healthFactor, 18),
                isLiquidatable: isLiquidatable
            };

        } catch (error) {
            console.log(`   ⚠️  Could not check health factor: ${error.message}`);
            testResults.results.healthCheck = { success: false, error: error.message };
        }

        // Step 7: Test partial repayment
        console.log("\n💸 Step 7: Testing partial repayment...");
        
        try {
            const repayAmount = ethers.parseUnits("100", 6); // Repay 100 USDT
            
            // Check if user has enough USDT to repay
            const currentBalance = await usdtToken.balanceOf(owner.address);
            if (currentBalance >= repayAmount) {
                await usdtToken.approve(lendingProtocol.target, repayAmount);
                const repayTx = await lendingProtocol.repay(deployedAddresses.DummyUSDT, repayAmount);
                await repayTx.wait();
                
                console.log(`   ✅ Repaid ${ethers.formatUnits(repayAmount, 6)} USDT`);
                
                // Check updated debt
                const newDebt = await lendingProtocol.debtBalance(owner.address, deployedAddresses.DummyUSDT);
                console.log(`   📊 Updated Debt: ${ethers.formatUnits(newDebt, 6)} USDT`);

                testResults.results.repayment = {
                    success: true,
                    amount: ethers.formatUnits(repayAmount, 6),
                    remainingDebt: ethers.formatUnits(newDebt, 6)
                };

            } else {
                console.log(`   ⚠️  Insufficient balance for repayment (have ${ethers.formatUnits(currentBalance, 6)}, need ${ethers.formatUnits(repayAmount, 6)})`);
                testResults.results.repayment = { success: false, error: "Insufficient balance" };
            }

        } catch (error) {
            console.log(`   ❌ Repayment failed: ${error.message}`);
            testResults.results.repayment = { success: false, error: error.message };
        }

        // Final summary
        console.log("\n📝 FINAL TEST SUMMARY:");
        console.log("=".repeat(50));
        
        let successCount = 0;
        let totalTests = 0;
        
        for (const [testName, result] of Object.entries(testResults.results)) {
            totalTests++;
            if (result.success) successCount++;
            console.log(`   ${result.success ? "✅" : "❌"} ${testName}: ${result.success ? "PASSED" : "FAILED"}`);
            if (!result.success && result.error) {
                console.log(`      Error: ${result.error}`);
            }
        }
        
        console.log(`\n🎯 Overall Result: ${successCount}/${totalTests} tests passed`);
        
        if (successCount === totalTests) {
            console.log("🎉 ALL TESTS PASSED! USDY lending protocol is fully functional!");
        } else if (successCount >= totalTests * 0.7) {
            console.log("✅ Most tests passed! Protocol is mostly functional with minor issues.");
        } else {
            console.log("⚠️  Several tests failed. Protocol needs fixes.");
        }

        testResults.summary = {
            totalTests,
            successCount,
            successRate: Math.round((successCount / totalTests) * 100),
            allPassed: successCount === totalTests
        };

    } catch (error) {
        console.error("❌ Test execution failed:", error);
        testResults.error = error.message;
    }

    // Save test results
    fs.writeFileSync('./complete-usdy-lending-test-report.json', JSON.stringify(testResults, null, 2));
    console.log("\n📄 Test report saved to: complete-usdy-lending-test-report.json");

    return testResults;
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Script failed:", error);
        process.exit(1);
    });