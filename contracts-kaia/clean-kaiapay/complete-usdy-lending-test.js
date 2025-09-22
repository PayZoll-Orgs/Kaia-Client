const { ethers } = require("hardhat");
const fs = require('fs');

// Load deployed addresses
const deployedAddresses = JSON.parse(fs.readFileSync('./deployedAddresses.json', 'utf8'));

async function main() {
    console.log("🔄 Starting Complete USDY Lending Protocol Test...\n");
    
    const signers = await ethers.getSigners();
    const owner = signers[0];
    const lender = owner; // Using same account for simplicity
    const borrower = owner; // Using same account for simplicity
    
    console.log("👤 Test Accounts:");
    console.log(`   Owner/Lender/Borrower: ${owner.address}`);
    console.log("   (Using single account for all roles in test)\n");

    // Connect to contracts
    const lendingProtocol = await ethers.getContractAt("EnhancedLendingProtocol", deployedAddresses.EnhancedLendingProtocol);
    const usdyToken = await ethers.getContractAt("IERC20", deployedAddresses.USDY);
    const usdtToken = await ethers.getContractAt("IERC20", deployedAddresses.DummyUSDT); // Using DummyUSDT
    
    console.log("📋 Contract Addresses:");
    console.log(`   Enhanced Lending Protocol: ${deployedAddresses.EnhancedLendingProtocol}`);
    console.log(`   USDY Token: ${deployedAddresses.USDY}`);
    console.log(`   USDT Token: ${deployedAddresses.DummyUSDT}\n`);

    // Test amounts
    const usdyCollateralAmount = ethers.parseUnits("1000", 18); // 1000 USDY as collateral
    const usdtLendAmount = ethers.parseUnits("500", 6); // 500 USDT to lend
    const borrowAmount = ethers.parseUnits("300", 6); // 300 USDT to borrow

    let testResults = {
        timestamp: new Date().toISOString(),
        testName: "Complete USDY Lending Protocol Test",
        results: {}
    };

    try {
        // Step 1: Check initial balances
        console.log("💰 Initial Balances:");
        const lenderUSDTBalance = await usdtToken.balanceOf(lender.address);
        const borrowerUSDYBalance = await usdyToken.balanceOf(borrower.address);
        console.log(`   Lender USDT: ${ethers.formatUnits(lenderUSDTBalance, 6)}`);
        console.log(`   Borrower USDY: ${ethers.formatUnits(borrowerUSDYBalance, 18)}\n`);

        testResults.results.initialBalances = {
            lenderUSDT: ethers.formatUnits(lenderUSDTBalance, 6),
            borrowerUSDY: ethers.formatUnits(borrowerUSDYBalance, 18)
        };

        // Step 2: Lender provides liquidity (USDT)
        console.log("🏦 Step 2: Lender providing liquidity...");
        
        // Approve and lend USDT
        await usdtToken.connect(lender).approve(lendingProtocol.target, usdtLendAmount);
        const lendTx = await lendingProtocol.connect(lender).lend(deployedAddresses.DummyUSDT, usdtLendAmount, ethers.ZeroAddress);
        await lendTx.wait();
        
        console.log(`   ✅ Lender provided ${ethers.formatUnits(usdtLendAmount, 6)} USDT liquidity`);
        
        // Check pool balance
        const poolBalance = await lendingProtocol.poolBalances(deployedAddresses.DummyUSDT);
        console.log(`   📊 Pool USDT Balance: ${ethers.formatUnits(poolBalance, 6)}\n`);

        testResults.results.lendingStep = {
            success: true,
            amount: ethers.formatUnits(usdtLendAmount, 6),
            poolBalance: ethers.formatUnits(poolBalance, 6)
        };

        // Step 3: Borrower deposits USDY as collateral
        console.log("🔒 Step 3: Borrower depositing USDY collateral...");
        
        // Approve and deposit USDY as collateral
        await usdyToken.connect(borrower).approve(lendingProtocol.target, usdyCollateralAmount);
        const depositTx = await lendingProtocol.connect(borrower).depositCollateral(deployedAddresses.USDY, usdyCollateralAmount);
        await depositTx.wait();
        
        console.log(`   ✅ Borrower deposited ${ethers.formatUnits(usdyCollateralAmount, 18)} USDY as collateral`);
        
        // Check collateral balance
        const collateralBalance = await lendingProtocol.collateralBalances(borrower.address, deployedAddresses.USDY);
        console.log(`   📊 Borrower USDY Collateral: ${ethers.formatUnits(collateralBalance, 18)}\n`);

        testResults.results.collateralDeposit = {
            success: true,
            amount: ethers.formatUnits(usdyCollateralAmount, 18),
            balance: ethers.formatUnits(collateralBalance, 18)
        };

        // Step 4: Calculate borrowing capacity
        console.log("🧮 Step 4: Calculating borrowing capacity...");
        
        try {
            const borrowingPower = await lendingProtocol.getBorrowingPower(borrower.address);
            console.log(`   📈 Borrowing Power: ${ethers.formatUnits(borrowingPower, 6)} USDT equivalent`);
            
            testResults.results.borrowingPower = {
                success: true,
                power: ethers.formatUnits(borrowingPower, 6)
            };
        } catch (error) {
            console.log(`   ⚠️  Could not calculate borrowing power: ${error.message}`);
            testResults.results.borrowingPower = { success: false, error: error.message };
        }

        // Step 5: Borrower borrows USDT
        console.log("\n💳 Step 5: Borrower borrowing USDT...");
        
        try {
            const borrowTx = await lendingProtocol.connect(borrower).borrow(deployedAddresses.DummyUSDT, borrowAmount, ethers.ZeroAddress);
            await borrowTx.wait();
            
            console.log(`   ✅ Borrower borrowed ${ethers.formatUnits(borrowAmount, 6)} USDT`);
            
            // Check borrow balance
            const borrowBalance = await lendingProtocol.borrowBalances(borrower.address, deployedAddresses.DummyUSDT);
            console.log(`   📊 Borrower USDT Debt: ${ethers.formatUnits(borrowBalance, 6)}`);
            
            // Check borrower's USDT balance
            const borrowerUSDTBalance = await usdtToken.balanceOf(borrower.address);
            console.log(`   💰 Borrower USDT Balance: ${ethers.formatUnits(borrowerUSDTBalance, 6)}\n`);

            testResults.results.borrowing = {
                success: true,
                amount: ethers.formatUnits(borrowAmount, 6),
                debt: ethers.formatUnits(borrowBalance, 6),
                balance: ethers.formatUnits(borrowerUSDTBalance, 6)
            };

        } catch (error) {
            console.log(`   ❌ Borrowing failed: ${error.message}\n`);
            testResults.results.borrowing = { success: false, error: error.message };
        }

        // Step 6: Check health factor
        console.log("🏥 Step 6: Checking account health...");
        
        try {
            const healthFactor = await lendingProtocol.getHealthFactor(borrower.address);
            console.log(`   📊 Health Factor: ${ethers.formatUnits(healthFactor, 18)}`);
            
            const isLiquidatable = healthFactor < ethers.parseUnits("1", 18);
            console.log(`   ${isLiquidatable ? "⚠️  Account is liquidatable!" : "✅ Account is healthy"}\n`);

            testResults.results.healthCheck = {
                success: true,
                healthFactor: ethers.formatUnits(healthFactor, 18),
                isLiquidatable: isLiquidatable
            };

        } catch (error) {
            console.log(`   ⚠️  Could not check health factor: ${error.message}\n`);
            testResults.results.healthCheck = { success: false, error: error.message };
        }

        // Step 7: Test partial repayment
        console.log("💸 Step 7: Testing partial repayment...");
        
        try {
            const repayAmount = ethers.parseUnits("100", 6); // Repay 100 USDT
            
            // Check if borrower has enough USDT to repay
            const borrowerBalance = await usdtToken.balanceOf(borrower.address);
            if (borrowerBalance >= repayAmount) {
                await usdtToken.connect(borrower).approve(lendingProtocol.target, repayAmount);
                const repayTx = await lendingProtocol.connect(borrower).repay(deployedAddresses.DummyUSDT, repayAmount);
                await repayTx.wait();
                
                console.log(`   ✅ Repaid ${ethers.formatUnits(repayAmount, 6)} USDT`);
                
                // Check updated debt
                const newDebt = await lendingProtocol.borrowBalances(borrower.address, deployedAddresses.DummyUSDT);
                console.log(`   📊 Updated Debt: ${ethers.formatUnits(newDebt, 6)} USDT\n`);

                testResults.results.repayment = {
                    success: true,
                    amount: ethers.formatUnits(repayAmount, 6),
                    remainingDebt: ethers.formatUnits(newDebt, 6)
                };

            } else {
                console.log(`   ⚠️  Insufficient balance for repayment\n`);
                testResults.results.repayment = { success: false, error: "Insufficient balance" };
            }

        } catch (error) {
            console.log(`   ❌ Repayment failed: ${error.message}\n`);
            testResults.results.repayment = { success: false, error: error.message };
        }

        // Final summary
        console.log("📝 FINAL TEST SUMMARY:");
        console.log("=" * 50);
        
        let successCount = 0;
        let totalTests = 0;
        
        for (const [testName, result] of Object.entries(testResults.results)) {
            totalTests++;
            if (result.success) successCount++;
            console.log(`   ${result.success ? "✅" : "❌"} ${testName}: ${result.success ? "PASSED" : "FAILED"}`);
        }
        
        console.log(`\n🎯 Overall Result: ${successCount}/${totalTests} tests passed`);
        
        if (successCount === totalTests) {
            console.log("🎉 ALL TESTS PASSED! USDY lending protocol is fully functional!");
        } else {
            console.log("⚠️  Some tests failed. Check the details above.");
        }

        testResults.summary = {
            totalTests,
            successCount,
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