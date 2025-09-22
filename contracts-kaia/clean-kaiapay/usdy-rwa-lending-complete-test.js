const { ethers } = require("hardhat");
const fs = require('fs');

// Load deployed addresses
const deployedAddresses = JSON.parse(fs.readFileSync('./deployedAddresses.json', 'utf8'));

async function main() {
    console.log("🎉 FINAL USDY LENDING PROTOCOL COMPREHENSIVE TEST\n");
    console.log("=" * 60);
    
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
    console.log(`   USDY Token (RWA Collateral): ${deployedAddresses.USDY}`);
    console.log(`   USDT Token (Lending Asset): ${deployedAddresses.DummyUSDT}\n`);

    let testResults = {
        timestamp: new Date().toISOString(),
        testName: "Final USDY Lending Protocol Test",
        results: {},
        summary: {}
    };

    try {
        // ================================
        // PHASE 1: ACCOUNT SETUP & BALANCES
        // ================================
        console.log("📊 PHASE 1: ACCOUNT SETUP & BALANCES");
        console.log("-" * 40);
        
        const usdtBalance = await usdtToken.balanceOf(owner.address);
        const usdyBalance = await usdyToken.balanceOf(owner.address);
        const currentCollateral = await lendingProtocol.collateralBalance(owner.address);
        
        console.log(`   USDT Balance: ${ethers.formatUnits(usdtBalance, 6)} USDT`);
        console.log(`   USDY Balance: ${ethers.formatUnits(usdyBalance, 18)} USDY`);
        console.log(`   Current Collateral: ${ethers.formatUnits(currentCollateral, 18)} USDY\n`);

        testResults.results.initialState = {
            success: true,
            usdtBalance: ethers.formatUnits(usdtBalance, 6),
            usdyBalance: ethers.formatUnits(usdyBalance, 18),
            currentCollateral: ethers.formatUnits(currentCollateral, 18)
        };

        // ================================
        // PHASE 2: LIQUIDITY PROVISION
        // ================================
        console.log("🏦 PHASE 2: LIQUIDITY PROVISION");
        console.log("-" * 40);
        
        const depositAmount = ethers.parseUnits("1000", 6); // 1000 USDT
        
        try {
            console.log(`   Depositing ${ethers.formatUnits(depositAmount, 6)} USDT for lending...`);
            
            await usdtToken.approve(lendingProtocol.target, depositAmount);
            const depositTx = await lendingProtocol.deposit(deployedAddresses.DummyUSDT, depositAmount);
            await depositTx.wait();
            
            console.log(`   ✅ Successfully provided liquidity!\n`);

            testResults.results.liquidityProvision = {
                success: true,
                amount: ethers.formatUnits(depositAmount, 6)
            };

        } catch (error) {
            console.log(`   ❌ Liquidity provision failed: ${error.message}\n`);
            testResults.results.liquidityProvision = { success: false, error: error.message };
        }

        // ================================
        // PHASE 3: COLLATERAL MANAGEMENT
        // ================================
        console.log("🔒 PHASE 3: COLLATERAL MANAGEMENT (USDY as RWA)");
        console.log("-" * 40);
        
        const collateralAmount = ethers.parseUnits("500", 18); // 500 USDY
        
        try {
            console.log(`   Depositing ${ethers.formatUnits(collateralAmount, 18)} USDY as real-world asset collateral...`);
            
            await usdyToken.approve(lendingProtocol.target, collateralAmount);
            const collateralTx = await lendingProtocol.depositCollateral(collateralAmount);
            await collateralTx.wait();
            
            const newCollateral = await lendingProtocol.collateralBalance(owner.address);
            console.log(`   ✅ Collateral deposited successfully!`);
            console.log(`   📊 Total Collateral: ${ethers.formatUnits(newCollateral, 18)} USDY\n`);

            testResults.results.collateralDeposit = {
                success: true,
                amount: ethers.formatUnits(collateralAmount, 18),
                totalCollateral: ethers.formatUnits(newCollateral, 18)
            };

        } catch (error) {
            console.log(`   ❌ Collateral deposit failed: ${error.message}\n`);
            testResults.results.collateralDeposit = { success: false, error: error.message };
        }

        // ================================
        // PHASE 4: BORROWING AGAINST RWA
        // ================================
        console.log("💳 PHASE 4: BORROWING AGAINST RWA COLLATERAL");
        console.log("-" * 40);
        
        const borrowAmount = ethers.parseUnits("200", 6); // 200 USDT
        
        try {
            console.log(`   Borrowing ${ethers.formatUnits(borrowAmount, 6)} USDT against USDY collateral...`);
            
            const borrowTx = await lendingProtocol.borrow(deployedAddresses.DummyUSDT, borrowAmount);
            await borrowTx.wait();
            
            const debtBalance = await lendingProtocol.debtBalance(owner.address, deployedAddresses.DummyUSDT);
            const ltv = await lendingProtocol.getLTV(owner.address);
            
            console.log(`   ✅ Borrowing successful!`);
            console.log(`   📊 Debt Balance: ${ethers.formatUnits(debtBalance, 6)} USDT`);
            console.log(`   📈 LTV Ratio: ${ltv.toString()}%\n`);

            testResults.results.borrowing = {
                success: true,
                borrowAmount: ethers.formatUnits(borrowAmount, 6),
                debtBalance: ethers.formatUnits(debtBalance, 6),
                ltv: ltv.toString()
            };

        } catch (error) {
            console.log(`   ❌ Borrowing failed: ${error.message}\n`);
            testResults.results.borrowing = { success: false, error: error.message };
        }

        // ================================
        // PHASE 5: BORROWER DASHBOARD
        // ================================
        console.log("📋 PHASE 5: BORROWER DASHBOARD & ANALYTICS");
        console.log("-" * 40);
        
        try {
            const dashboard = await lendingProtocol.getBorrowerDashboard(owner.address);
            
            console.log(`   💰 Collateral Value: $${ethers.formatUnits(dashboard.collateralValue, 18)}`);
            console.log(`   💸 Total Debt: $${ethers.formatUnits(dashboard.totalDebt, 18)}`);
            console.log(`   📊 LTV Ratio: ${dashboard.ltv.toString()}%`);
            console.log(`   🏥 Health Factor: ${ethers.formatUnits(dashboard.healthFactor, 18)}`);
            console.log(`   ⚠️  Liquidatable: ${dashboard.isLiquidatable ? "YES" : "NO"}\n`);

            testResults.results.dashboard = {
                success: true,
                collateralValue: ethers.formatUnits(dashboard.collateralValue, 18),
                totalDebt: ethers.formatUnits(dashboard.totalDebt, 18),
                ltv: dashboard.ltv.toString(),
                healthFactor: ethers.formatUnits(dashboard.healthFactor, 18),
                isLiquidatable: dashboard.isLiquidatable
            };

        } catch (error) {
            console.log(`   ⚠️  Dashboard unavailable: ${error.message}\n`);
            testResults.results.dashboard = { success: false, error: error.message };
        }

        // ================================
        // PHASE 6: REPAYMENT TEST
        // ================================
        console.log("💸 PHASE 6: LOAN REPAYMENT");
        console.log("-" * 40);
        
        const repayAmount = ethers.parseUnits("50", 6); // 50 USDT
        
        try {
            console.log(`   Repaying ${ethers.formatUnits(repayAmount, 6)} USDT...`);
            
            await usdtToken.approve(lendingProtocol.target, repayAmount);
            const repayTx = await lendingProtocol.repay(deployedAddresses.DummyUSDT, repayAmount);
            await repayTx.wait();
            
            const newDebt = await lendingProtocol.debtBalance(owner.address, deployedAddresses.DummyUSDT);
            console.log(`   ✅ Repayment successful!`);
            console.log(`   📊 Remaining Debt: ${ethers.formatUnits(newDebt, 6)} USDT\n`);

            testResults.results.repayment = {
                success: true,
                repayAmount: ethers.formatUnits(repayAmount, 6),
                remainingDebt: ethers.formatUnits(newDebt, 6)
            };

        } catch (error) {
            console.log(`   ❌ Repayment failed: ${error.message}\n`);
            testResults.results.repayment = { success: false, error: error.message };
        }

        // ================================
        // PHASE 7: LENDER INFORMATION
        // ================================
        console.log("📈 PHASE 7: LENDER REWARDS & EARNINGS");
        console.log("-" * 40);
        
        try {
            const lenderInfo = await lendingProtocol.getLenderInfo(owner.address, deployedAddresses.DummyUSDT);
            
            console.log(`   💰 Total Deposited: ${ethers.formatUnits(lenderInfo.totalDeposited, 6)} USDT`);
            console.log(`   📈 Accrued Earnings: ${ethers.formatUnits(lenderInfo.accruedEarnings, 6)} USDT`);
            console.log(`   💎 Claimable Earnings: ${ethers.formatUnits(lenderInfo.claimableEarnings, 6)} USDT\n`);

            testResults.results.lenderInfo = {
                success: true,
                totalDeposited: ethers.formatUnits(lenderInfo.totalDeposited, 6),
                accruedEarnings: ethers.formatUnits(lenderInfo.accruedEarnings, 6),
                claimableEarnings: ethers.formatUnits(lenderInfo.claimableEarnings, 6)
            };

        } catch (error) {
            console.log(`   ⚠️  Lender info unavailable: ${error.message}\n`);
            testResults.results.lenderInfo = { success: false, error: error.message };
        }

        // ================================
        // FINAL RESULTS SUMMARY
        // ================================
        console.log("🎯 FINAL TEST RESULTS");
        console.log("=" * 60);
        
        let successCount = 0;
        let totalTests = Object.keys(testResults.results).length;
        
        for (const [testName, result] of Object.entries(testResults.results)) {
            if (result.success) successCount++;
            const status = result.success ? "✅ PASS" : "❌ FAIL";
            console.log(`   ${status} ${testName.toUpperCase()}`);
            if (!result.success && result.error) {
                console.log(`       Error: ${result.error}`);
            }
        }
        
        const successRate = Math.round((successCount / totalTests) * 100);
        console.log(`\n📊 Success Rate: ${successCount}/${totalTests} (${successRate}%)`);
        
        if (successRate >= 85) {
            console.log("🎉 EXCELLENT! USDY RWA lending protocol is fully functional!");
            console.log("✨ Key Features Verified:");
            console.log("   • USDY successfully used as real-world asset collateral"); 
            console.log("   • USDT lending and borrowing working");
            console.log("   • Loan repayment functioning");
            console.log("   • Dashboard analytics available");
        } else if (successRate >= 70) {
            console.log("✅ GOOD! Most core features are working with minor issues.");
        } else {
            console.log("⚠️  NEEDS IMPROVEMENT! Several core features need fixes.");
        }

        testResults.summary = {
            totalTests,
            successCount,
            successRate,
            status: successRate >= 85 ? "EXCELLENT" : successRate >= 70 ? "GOOD" : "NEEDS_IMPROVEMENT"
        };

    } catch (error) {
        console.error("❌ Test execution failed:", error);
        testResults.error = error.message;
    }

    // Save comprehensive test results
    fs.writeFileSync('./usdy-rwa-lending-complete-test-report.json', JSON.stringify(testResults, null, 2));
    console.log(`\n📄 Complete test report saved to: usdy-rwa-lending-complete-test-report.json`);

    return testResults;
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Script failed:", error);
        process.exit(1);
    });