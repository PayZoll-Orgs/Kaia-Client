const { ethers } = require("hardhat");
const fs = require('fs');

// Load deployed addresses
const deployedAddresses = JSON.parse(fs.readFileSync('./deployedAddresses.json', 'utf8'));

async function main() {
    console.log("🔍 COMPREHENSIVE ENHANCED LENDING PROTOCOL FUNCTION TEST");
    console.log("=" * 80);
    console.log("Testing ALL 20+ lending functions systematically...\n");
    
    const signers = await ethers.getSigners();
    const user = signers[0];
    
    console.log("👤 Test Account:");
    console.log(`   Address: ${user.address}\n`);

    // Connect to contracts
    const lendingProtocol = await ethers.getContractAt("EnhancedLendingProtocol", deployedAddresses.EnhancedLendingProtocol);
    const usdyToken = await ethers.getContractAt("IERC20", deployedAddresses.USDY);
    const usdtToken = await ethers.getContractAt("IERC20", deployedAddresses.DummyUSDT);
    const kusdtToken = await ethers.getContractAt("IERC20", deployedAddresses.kUSDT);
    
    console.log("📋 Contract Addresses:");
    console.log(`   Enhanced Lending Protocol: ${deployedAddresses.EnhancedLendingProtocol}`);
    console.log(`   USDY Token: ${deployedAddresses.USDY}`);
    console.log(`   USDT Token: ${deployedAddresses.DummyUSDT}`);
    console.log(`   kUSDT LP Token: ${deployedAddresses.kUSDT}\n`);

    let testResults = {
        timestamp: new Date().toISOString(),
        testName: "Comprehensive Enhanced Lending Protocol Function Test",
        categories: {},
        summary: {}
    };

    // Test amounts
    const depositAmount = ethers.parseUnits("100", 6); // 100 USDT
    const collateralAmount = ethers.parseUnits("200", 18); // 200 USDY
    const borrowAmount = ethers.parseUnits("50", 6); // 50 USDT
    const repayAmount = ethers.parseUnits("25", 6); // 25 USDT

    try {
        // ===================================
        // CATEGORY 1: CORE LENDING FUNCTIONS
        // ===================================
        console.log("🏦 CATEGORY 1: CORE LENDING FUNCTIONS");
        console.log("-" * 50);
        
        let coreLendingResults = {};

        // Test 1: deposit() function
        console.log("📥 Test 1: deposit() - Deposit USDT for lending");
        try {
            await usdtToken.approve(lendingProtocol.target, depositAmount);
            const depositTx = await lendingProtocol.deposit(deployedAddresses.DummyUSDT, depositAmount);
            await depositTx.wait();
            
            console.log(`   ✅ Successfully deposited ${ethers.formatUnits(depositAmount, 6)} USDT`);
            coreLendingResults.deposit = { success: true, amount: ethers.formatUnits(depositAmount, 6) };
        } catch (error) {
            console.log(`   ❌ Deposit failed: ${error.message}`);
            coreLendingResults.deposit = { success: false, error: error.message };
        }

        // Test 2: claimLendingEarnings() function
        console.log("\\n💰 Test 2: claimLendingEarnings() - Claim lending rewards");
        try {
            const claimTx = await lendingProtocol.claimLendingEarnings(deployedAddresses.DummyUSDT);
            await claimTx.wait();
            
            console.log(`   ✅ Successfully claimed lending earnings`);
            coreLendingResults.claimEarnings = { success: true };
        } catch (error) {
            console.log(`   ❌ Claim earnings failed: ${error.message}`);
            coreLendingResults.claimEarnings = { success: false, error: error.message };
        }

        // Test 3: redeem() function  
        console.log("\\n📤 Test 3: redeem() - Withdraw LP tokens");
        try {
            const lpBalance = await kusdtToken.balanceOf(user.address);
            if (lpBalance > 0) {
                const redeemAmount = lpBalance / 2n; // Redeem half
                const redeemTx = await lendingProtocol.redeem(deployedAddresses.kUSDT, redeemAmount);
                await redeemTx.wait();
                
                console.log(`   ✅ Successfully redeemed ${ethers.formatUnits(redeemAmount, 18)} kUSDT`);
                coreLendingResults.redeem = { success: true, amount: ethers.formatUnits(redeemAmount, 18) };
            } else {
                console.log(`   ⚠️  No LP tokens to redeem`);
                coreLendingResults.redeem = { success: false, error: "No LP tokens available" };
            }
        } catch (error) {
            console.log(`   ❌ Redeem failed: ${error.message}`);
            coreLendingResults.redeem = { success: false, error: error.message };
        }

        testResults.categories.coreLending = coreLendingResults;

        // ======================================
        // CATEGORY 2: COLLATERAL MANAGEMENT
        // ======================================
        console.log("\\n\\n🔒 CATEGORY 2: COLLATERAL MANAGEMENT");
        console.log("-" * 50);
        
        let collateralResults = {};

        // Test 4: depositCollateral() function
        console.log("📥 Test 4: depositCollateral() - Deposit USDY collateral");
        try {
            await usdyToken.approve(lendingProtocol.target, collateralAmount);
            const collateralTx = await lendingProtocol.depositCollateral(collateralAmount);
            await collateralTx.wait();
            
            const totalCollateral = await lendingProtocol.collateralBalance(user.address);
            console.log(`   ✅ Successfully deposited ${ethers.formatUnits(collateralAmount, 18)} USDY`);
            console.log(`   📊 Total collateral: ${ethers.formatUnits(totalCollateral, 18)} USDY`);
            collateralResults.depositCollateral = { 
                success: true, 
                amount: ethers.formatUnits(collateralAmount, 18),
                totalCollateral: ethers.formatUnits(totalCollateral, 18)
            };
        } catch (error) {
            console.log(`   ❌ Deposit collateral failed: ${error.message}`);
            collateralResults.depositCollateral = { success: false, error: error.message };
        }

        // Test 5: withdrawCollateral() function (small amount)
        console.log("\\n📤 Test 5: withdrawCollateral() - Withdraw USDY collateral");
        try {
            const withdrawAmount = ethers.parseUnits("50", 18); // 50 USDY
            const withdrawTx = await lendingProtocol.withdrawCollateral(withdrawAmount);
            await withdrawTx.wait();
            
            const remainingCollateral = await lendingProtocol.collateralBalance(user.address);
            console.log(`   ✅ Successfully withdrew ${ethers.formatUnits(withdrawAmount, 18)} USDY`);
            console.log(`   📊 Remaining collateral: ${ethers.formatUnits(remainingCollateral, 18)} USDY`);
            collateralResults.withdrawCollateral = { 
                success: true, 
                withdrawn: ethers.formatUnits(withdrawAmount, 18),
                remaining: ethers.formatUnits(remainingCollateral, 18)
            };
        } catch (error) {
            console.log(`   ❌ Withdraw collateral failed: ${error.message}`);
            collateralResults.withdrawCollateral = { success: false, error: error.message };
        }

        testResults.categories.collateralManagement = collateralResults;

        // ===============================
        // CATEGORY 3: BORROWING FUNCTIONS
        // ===============================
        console.log("\\n\\n💳 CATEGORY 3: BORROWING FUNCTIONS");
        console.log("-" * 50);
        
        let borrowingResults = {};

        // Test 6: borrow() function
        console.log("💰 Test 6: borrow() - Borrow USDT against collateral");
        try {
            const borrowTx = await lendingProtocol.borrow(deployedAddresses.DummyUSDT, borrowAmount);
            await borrowTx.wait();
            
            const debtBalance = await lendingProtocol.debtBalance(user.address, deployedAddresses.DummyUSDT);
            console.log(`   ✅ Successfully borrowed ${ethers.formatUnits(borrowAmount, 6)} USDT`);
            console.log(`   📊 Total debt: ${ethers.formatUnits(debtBalance, 6)} USDT`);
            borrowingResults.borrow = { 
                success: true, 
                amount: ethers.formatUnits(borrowAmount, 6),
                totalDebt: ethers.formatUnits(debtBalance, 6)
            };
        } catch (error) {
            console.log(`   ❌ Borrow failed: ${error.message}`);
            borrowingResults.borrow = { success: false, error: error.message };
        }

        // Test 7: repay() function
        console.log("\\n💸 Test 7: repay() - Repay borrowed amount");
        try {
            await usdtToken.approve(lendingProtocol.target, repayAmount);
            const repayTx = await lendingProtocol.repay(deployedAddresses.DummyUSDT, repayAmount);
            await repayTx.wait();
            
            const remainingDebt = await lendingProtocol.debtBalance(user.address, deployedAddresses.DummyUSDT);
            console.log(`   ✅ Successfully repaid ${ethers.formatUnits(repayAmount, 6)} USDT`);
            console.log(`   📊 Remaining debt: ${ethers.formatUnits(remainingDebt, 6)} USDT`);
            borrowingResults.repay = { 
                success: true, 
                amount: ethers.formatUnits(repayAmount, 6),
                remainingDebt: ethers.formatUnits(remainingDebt, 6)
            };
        } catch (error) {
            console.log(`   ❌ Repay failed: ${error.message}`);
            borrowingResults.repay = { success: false, error: error.message };
        }

        // Test 8: repayInterest() function
        console.log("\\n💰 Test 8: repayInterest() - Repay only interest portion");
        try {
            const smallAmount = ethers.parseUnits("1", 6); // 1 USDT
            await usdtToken.approve(lendingProtocol.target, smallAmount);
            const repayInterestTx = await lendingProtocol.repayInterest(deployedAddresses.DummyUSDT, smallAmount);
            await repayInterestTx.wait();
            
            console.log(`   ✅ Successfully repaid ${ethers.formatUnits(smallAmount, 6)} USDT interest`);
            borrowingResults.repayInterest = { success: true, amount: ethers.formatUnits(smallAmount, 6) };
        } catch (error) {
            console.log(`   ❌ Repay interest failed: ${error.message}`);
            borrowingResults.repayInterest = { success: false, error: error.message };
        }

        // Test 9: repayPrincipal() function
        console.log("\\n🏦 Test 9: repayPrincipal() - Repay principal portion");
        try {
            const principalAmount = ethers.parseUnits("5", 6); // 5 USDT
            await usdtToken.approve(lendingProtocol.target, principalAmount);
            const repayPrincipalTx = await lendingProtocol.repayPrincipal(deployedAddresses.DummyUSDT, principalAmount);
            await repayPrincipalTx.wait();
            
            console.log(`   ✅ Successfully repaid ${ethers.formatUnits(principalAmount, 6)} USDT principal`);
            borrowingResults.repayPrincipal = { success: true, amount: ethers.formatUnits(principalAmount, 6) };
        } catch (error) {
            console.log(`   ❌ Repay principal failed: ${error.message}`);
            borrowingResults.repayPrincipal = { success: false, error: error.message };
        }

        testResults.categories.borrowing = borrowingResults;

        // ===============================
        // CATEGORY 4: VIEW/ANALYTICS FUNCTIONS
        // ===============================
        console.log("\\n\\n📊 CATEGORY 4: VIEW/ANALYTICS FUNCTIONS");
        console.log("-" * 50);
        
        let analyticsResults = {};

        // Test 10: getLenderInfo() function
        console.log("📈 Test 10: getLenderInfo() - Get lender statistics");
        try {
            const lenderInfo = await lendingProtocol.getLenderInfo(user.address, deployedAddresses.DummyUSDT);
            console.log(`   ✅ Lender info retrieved successfully`);
            console.log(`   📊 Total deposited: ${ethers.formatUnits(lenderInfo.totalDeposited, 6)} USDT`);
            console.log(`   💰 Current earnings: ${ethers.formatUnits(lenderInfo.currentEarnings, 6)} USDT`);
            console.log(`   💎 Claimable earnings: ${ethers.formatUnits(lenderInfo.claimableEarnings, 6)} USDT`);
            analyticsResults.getLenderInfo = { 
                success: true,
                totalDeposited: ethers.formatUnits(lenderInfo.totalDeposited, 6),
                currentEarnings: ethers.formatUnits(lenderInfo.currentEarnings, 6)
            };
        } catch (error) {
            console.log(`   ❌ Get lender info failed: ${error.message}`);
            analyticsResults.getLenderInfo = { success: false, error: error.message };
        }

        // Test 11: getBorrowerDashboard() function
        console.log("\\n📋 Test 11: getBorrowerDashboard() - Get borrower analytics");
        try {
            const dashboard = await lendingProtocol.getBorrowerDashboard(user.address);
            console.log(`   ✅ Borrower dashboard retrieved successfully`);
            console.log(`   💰 Collateral USD: $${ethers.formatUnits(dashboard.totalCollateralUSD, 18)}`);
            console.log(`   💸 Total debt USD: $${ethers.formatUnits(dashboard.totalDebtUSD, 18)}`);
            console.log(`   📊 Current LTV: ${ethers.formatUnits(dashboard.currentLTV, 16)}%`);
            analyticsResults.getBorrowerDashboard = { 
                success: true,
                collateralUSD: ethers.formatUnits(dashboard.totalCollateralUSD, 18),
                debtUSD: ethers.formatUnits(dashboard.totalDebtUSD, 18)
            };
        } catch (error) {
            console.log(`   ❌ Get borrower dashboard failed: ${error.message}`);
            analyticsResults.getBorrowerDashboard = { success: false, error: error.message };
        }

        // Test 12: getLTV() function
        console.log("\\n📈 Test 12: getLTV() - Get loan-to-value ratio");
        try {
            const ltv = await lendingProtocol.getLTV(user.address);
            console.log(`   ✅ LTV retrieved: ${ethers.formatUnits(ltv, 16)}%`);
            analyticsResults.getLTV = { success: true, ltv: ethers.formatUnits(ltv, 16) };
        } catch (error) {
            console.log(`   ❌ Get LTV failed: ${error.message}`);
            analyticsResults.getLTV = { success: false, error: error.message };
        }

        // Test 13: isLiquidatable() function
        console.log("\\n⚠️  Test 13: isLiquidatable() - Check liquidation status");
        try {
            const isLiquidatable = await lendingProtocol.isLiquidatable(user.address);
            console.log(`   ✅ Liquidation status: ${isLiquidatable ? "LIQUIDATABLE ⚠️" : "SAFE ✅"}`);
            analyticsResults.isLiquidatable = { success: true, liquidatable: isLiquidatable };
        } catch (error) {
            console.log(`   ❌ Check liquidation failed: ${error.message}`);
            analyticsResults.isLiquidatable = { success: false, error: error.message };
        }

        // Test 14: getDebtBreakdown() function
        console.log("\\n🔍 Test 14: getDebtBreakdown() - Get detailed debt info");
        try {
            const debtBreakdown = await lendingProtocol.getDebtBreakdown(user.address, deployedAddresses.DummyUSDT);
            console.log(`   ✅ Debt breakdown retrieved`);
            console.log(`   🏦 Principal: ${ethers.formatUnits(debtBreakdown.principal, 6)} USDT`);
            console.log(`   💰 Accrued Interest: ${ethers.formatUnits(debtBreakdown.accrued, 6)} USDT`);
            console.log(`   📊 Total: ${ethers.formatUnits(debtBreakdown.total, 6)} USDT`);
            analyticsResults.getDebtBreakdown = { 
                success: true,
                principal: ethers.formatUnits(debtBreakdown.principal, 6),
                interest: ethers.formatUnits(debtBreakdown.accrued, 6),
                total: ethers.formatUnits(debtBreakdown.total, 6)
            };
        } catch (error) {
            console.log(`   ❌ Get debt breakdown failed: ${error.message}`);
            analyticsResults.getDebtBreakdown = { success: false, error: error.message };
        }

        // Test 15: getUserTransactions() function
        console.log("\\n📚 Test 15: getUserTransactions() - Get transaction history");
        try {
            const transactions = await lendingProtocol.getUserTransactions(user.address, 0, 10);
            console.log(`   ✅ Retrieved ${transactions.length} transaction records`);
            if (transactions.length > 0) {
                console.log(`   📝 Latest transaction: ${transactions[0].transactionType}`);
            }
            analyticsResults.getUserTransactions = { 
                success: true, 
                count: transactions.length 
            };
        } catch (error) {
            console.log(`   ❌ Get transactions failed: ${error.message}`);
            analyticsResults.getUserTransactions = { success: false, error: error.message };
        }

        testResults.categories.analytics = analyticsResults;

        // ===============================
        // CATEGORY 5: REFERRAL SYSTEM
        // ===============================
        console.log("\\n\\n👥 CATEGORY 5: REFERRAL SYSTEM");
        console.log("-" * 50);
        
        let referralResults = {};

        // Test 16: registerReferralCode() function
        console.log("🔗 Test 16: registerReferralCode() - Register referral code");
        try {
            const registerTx = await lendingProtocol.registerReferralCode("TESTCODE123");
            await registerTx.wait();
            console.log(`   ✅ Successfully registered referral code`);
            referralResults.registerReferralCode = { success: true };
        } catch (error) {
            console.log(`   ❌ Register referral code failed: ${error.message}`);
            referralResults.registerReferralCode = { success: false, error: error.message };
        }

        // Test 17: getReferralInfo() function
        console.log("\\n📊 Test 17: getReferralInfo() - Get referral statistics");
        try {
            const referralInfo = await lendingProtocol.getReferralInfo(user.address);
            console.log(`   ✅ Referral info retrieved`);
            console.log(`   👥 Total referrals: ${referralInfo.totalReferrals.toString()}`);
            console.log(`   💰 Total rewards: ${ethers.formatUnits(referralInfo.totalRewardsEarned, 18)} USDT`);
            console.log(`   💎 Claimable: ${ethers.formatUnits(referralInfo.claimableRewards, 18)} USDT`);
            referralResults.getReferralInfo = { 
                success: true,
                totalReferrals: referralInfo.totalReferrals.toString(),
                totalRewards: ethers.formatUnits(referralInfo.totalRewardsEarned, 18)
            };
        } catch (error) {
            console.log(`   ❌ Get referral info failed: ${error.message}`);
            referralResults.getReferralInfo = { success: false, error: error.message };
        }

        // Test 18: claimReferralRewards() function
        console.log("\\n💎 Test 18: claimReferralRewards() - Claim referral rewards");
        try {
            const claimReferralTx = await lendingProtocol.claimReferralRewards();
            await claimReferralTx.wait();
            console.log(`   ✅ Successfully claimed referral rewards`);
            referralResults.claimReferralRewards = { success: true };
        } catch (error) {
            console.log(`   ❌ Claim referral rewards failed: ${error.message}`);
            referralResults.claimReferralRewards = { success: false, error: error.message };
        }

        testResults.categories.referralSystem = referralResults;

    } catch (error) {
        console.error("❌ Test execution failed:", error);
        testResults.error = error.message;
    }

    // ===============================
    // FINAL RESULTS SUMMARY
    // ===============================
    console.log("\\n\\n🎯 COMPREHENSIVE TEST RESULTS SUMMARY");
    console.log("=" * 80);
    
    let totalTests = 0;
    let totalPassed = 0;
    
    for (const [categoryName, categoryResults] of Object.entries(testResults.categories)) {
        console.log(`\\n📂 ${categoryName.toUpperCase()}:`);
        let categoryPassed = 0;
        let categoryTotal = 0;
        
        for (const [testName, result] of Object.entries(categoryResults)) {
            categoryTotal++;
            totalTests++;
            if (result.success) {
                categoryPassed++;
                totalPassed++;
            }
            const status = result.success ? "✅ PASS" : "❌ FAIL";
            console.log(`   ${status} ${testName}`);
        }
        
        const categoryRate = Math.round((categoryPassed / categoryTotal) * 100);
        console.log(`   📊 Category Success Rate: ${categoryPassed}/${categoryTotal} (${categoryRate}%)`);
    }
    
    const overallRate = Math.round((totalPassed / totalTests) * 100);
    console.log(`\\n🏆 OVERALL SUCCESS RATE: ${totalPassed}/${totalTests} (${overallRate}%)`);
    
    if (overallRate >= 90) {
        console.log("🎉 EXCELLENT! Enhanced Lending Protocol is fully functional!");
    } else if (overallRate >= 75) {
        console.log("✅ GOOD! Most lending functions are working properly.");
    } else if (overallRate >= 50) {
        console.log("⚠️  PARTIAL! Core functions work but some features need fixes.");
    } else {
        console.log("❌ CRITICAL! Major lending functions need immediate attention.");
    }

    testResults.summary = {
        totalTests,
        totalPassed,
        overallSuccessRate: overallRate,
        status: overallRate >= 90 ? "EXCELLENT" : overallRate >= 75 ? "GOOD" : overallRate >= 50 ? "PARTIAL" : "CRITICAL"
    };

    // Save comprehensive test results
    fs.writeFileSync('./enhanced-lending-protocol-comprehensive-test-report.json', JSON.stringify(testResults, null, 2));
    console.log(`\\n📄 Comprehensive test report saved to: enhanced-lending-protocol-comprehensive-test-report.json`);

    return testResults;
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Script failed:", error);
        process.exit(1);
    });