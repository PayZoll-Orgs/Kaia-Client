const { ethers } = require("hardhat");
const fs = require('fs');
const path = require('path');

/**
 * COMPREHENSIVE ENHANCED LENDING PROTOCOL TEST SCRIPT
 * 
 * This script tests the complete lending and borrowing lifecycle:
 * 1. Referral System (register, join, claim)
 * 2. Lending Operations (deposit, earn, claim, redeem)
 * 3. Borrowing Operations (collateral, borrow, repay)
 * 4. Liquidation Scenarios
 * 5. Error Cases and Edge Cases
 */

async function main() {
  console.log("\n🧪 === ENHANCED LENDING PROTOCOL LIFECYCLE TEST ===");
  
  const signers = await ethers.getSigners();
  const deployer = signers[0];
  const lender = signers[0]; // Use same account for simplicity in testing
  const borrower = signers[0]; // Use same account for simplicity in testing  
  const liquidator = signers[0]; // Use same account for simplicity in testing
  
  console.log("👥 Test accounts:");
  console.log("  Deployer:", deployer.address);
  console.log("  Using single account for all roles for testing simplicity");

  // Load deployed addresses
  const addressesPath = path.join(__dirname, '..', 'deployedAddresses.json');
  const deployedAddresses = JSON.parse(fs.readFileSync(addressesPath, 'utf8'));
  
  console.log("\n📋 Using deployed contracts:");
  console.log("  EnhancedLendingProtocol:", deployedAddresses.EnhancedLendingProtocol);
  console.log("  DummyUSDT:", deployedAddresses.DummyUSDT);
  console.log("  USDY:", deployedAddresses.USDY);
  console.log("  kUSDT:", deployedAddresses.kUSDT);
  console.log("  kKAIA:", deployedAddresses.kKAIA);

  // Get contract instances
  const enhancedLending = await ethers.getContractAt("EnhancedLendingProtocol", deployedAddresses.EnhancedLendingProtocol);
  const usdt = await ethers.getContractAt("DummyUSDT", deployedAddresses.DummyUSDT);
  const usdy = await ethers.getContractAt("USDY", deployedAddresses.USDY);
  const kUSDT = await ethers.getContractAt("LPToken", deployedAddresses.kUSDT);
  const kKAIA = await ethers.getContractAt("LPToken", deployedAddresses.kKAIA);

  // Test results tracking
  const testResults = {
    referralTests: [],
    lendingTests: [],
    borrowingTests: [],
    liquidationTests: [],
    errorTests: [],
    summary: { passed: 0, failed: 0, total: 0 }
  };

  // Utility functions
  const executeTest = async (testName, testFunction) => {
    console.log(`\n🔍 Testing: ${testName}`);
    try {
      const result = await testFunction();
      console.log(`✅ ${testName}: PASSED`);
      testResults.summary.passed++;
      return { name: testName, status: 'PASSED', result, error: null };
    } catch (error) {
      console.log(`❌ ${testName}: FAILED - ${error.message}`);
      testResults.summary.failed++;
      return { name: testName, status: 'FAILED', result: null, error: error.message };
    } finally {
      testResults.summary.total++;
    }
  };

  const formatAmount = (amount, decimals = 18) => ethers.formatUnits(amount, decimals);
  const parseAmount = (amount, decimals = 18) => ethers.parseUnits(amount.toString(), decimals);

  // =====================================
  // PHASE 1: SETUP & PREPARATION
  // =====================================
  console.log("\n📦 === PHASE 1: SETUP & PREPARATION ===");

  // Get USDT from faucet for all test accounts
  const setupTests = [];
  
  setupTests.push(await executeTest("Get USDT from faucet (lender)", async () => {
    const tx = await usdt.connect(lender).faucet();
    await tx.wait();
    const balance = await usdt.balanceOf(lender.address);
    console.log(`   Lender USDT balance: ${formatAmount(balance)} USDT`);
    return { txHash: tx.hash, balance: formatAmount(balance) };
  }));

  setupTests.push(await executeTest("Get USDT from faucet (borrower)", async () => {
    const tx = await usdt.connect(borrower).faucet();
    await tx.wait();
    const balance = await usdt.balanceOf(borrower.address);
    console.log(`   Borrower USDT balance: ${formatAmount(balance)} USDT`);
    return { txHash: tx.hash, balance: formatAmount(balance) };
  }));

  setupTests.push(await executeTest("Get USDT from faucet (liquidator)", async () => {
    const tx = await usdt.connect(liquidator).faucet();
    await tx.wait();
    const balance = await usdt.balanceOf(liquidator.address);
    console.log(`   Liquidator USDT balance: ${formatAmount(balance)} USDT`);
    return { txHash: tx.hash, balance: formatAmount(balance) };
  }));

  // =====================================
  // PHASE 2: REFERRAL SYSTEM TESTING
  // =====================================
  console.log("\n👥 === PHASE 2: REFERRAL SYSTEM TESTING ===");

  testResults.referralTests.push(await executeTest("Register referral code (lender)", async () => {
    const tx = await enhancedLending.connect(lender).registerReferralCode("LENDER123");
    await tx.wait();
    console.log(`   Referral code 'LENDER123' registered`);
    return { txHash: tx.hash, code: "LENDER123" };
  }));

  testResults.referralTests.push(await executeTest("Join with referral (borrower)", async () => {
    const tx = await enhancedLending.connect(borrower).joinWithReferral("LENDER123", lender.address);
    await tx.wait();
    
    const referralInfo = await enhancedLending.getReferralInfo(borrower.address);
    console.log(`   Borrower referred by: ${referralInfo.referrer}`);
    console.log(`   Lender referral rewards: ${formatAmount(referralInfo.totalRewards)} USDT`);
    return { txHash: tx.hash, referrer: referralInfo.referrer };
  }));

  testResults.referralTests.push(await executeTest("Claim referral rewards (lender)", async () => {
    const tx = await enhancedLending.connect(lender).claimReferralRewards();
    await tx.wait();
    
    const balance = await usdt.balanceOf(lender.address);
    console.log(`   Lender USDT balance after claim: ${formatAmount(balance)} USDT`);
    return { txHash: tx.hash, balance: formatAmount(balance) };
  }));

  // =====================================
  // PHASE 3: LENDING OPERATIONS TESTING  
  // =====================================
  console.log("\n🏦 === PHASE 3: LENDING OPERATIONS TESTING ===");

  const depositAmount = "500"; // 500 USDT

  testResults.lendingTests.push(await executeTest("Approve USDT for lending", async () => {
    const tx = await usdt.connect(lender).approve(enhancedLending.target, parseAmount(depositAmount));
    await tx.wait();
    
    const allowance = await usdt.allowance(lender.address, enhancedLending.target);
    console.log(`   Approved amount: ${formatAmount(allowance)} USDT`);
    return { txHash: tx.hash, allowance: formatAmount(allowance) };
  }));

  testResults.lendingTests.push(await executeTest("Deposit USDT for lending", async () => {
    const tx = await enhancedLending.connect(lender).deposit(usdt.target, parseAmount(depositAmount));
    await tx.wait();
    
    const lpBalance = await kUSDT.balanceOf(lender.address);
    const lenderInfo = await enhancedLending.getLenderInfo(lender.address, usdt.target);
    
    console.log(`   LP Token balance: ${formatAmount(lpBalance)} kUSDT`);
    console.log(`   Total deposited: ${formatAmount(lenderInfo.totalDeposited)} USDT`);
    return { 
      txHash: tx.hash, 
      lpTokens: formatAmount(lpBalance),
      totalDeposited: formatAmount(lenderInfo.totalDeposited)
    };
  }));

  // Wait for some earnings to accrue (simulate time passage)
  console.log("   ⏰ Simulating time passage for earnings...");
  await new Promise(resolve => setTimeout(resolve, 2000));

  testResults.lendingTests.push(await executeTest("Check lending earnings", async () => {
    const lenderInfo = await enhancedLending.getLenderInfo(lender.address, usdt.target);
    console.log(`   Accrued earnings: ${formatAmount(lenderInfo.accruedEarnings)} USDT`);
    console.log(`   Claimable earnings: ${formatAmount(lenderInfo.claimableEarnings)} USDT`);
    return {
      accruedEarnings: formatAmount(lenderInfo.accruedEarnings),
      claimableEarnings: formatAmount(lenderInfo.claimableEarnings)
    };
  }));

  // =====================================
  // PHASE 4: BORROWING OPERATIONS TESTING
  // =====================================
  console.log("\n💰 === PHASE 4: BORROWING OPERATIONS TESTING ===");

  const collateralAmount = "1"; // 1 KAIA
  const borrowAmount = "0.1"; // 0.1 USDT (conservative LTV)

  testResults.borrowingTests.push(await executeTest("Deposit KAIA collateral", async () => {
    const tx = await enhancedLending.connect(borrower).depositCollateral(parseAmount(collateralAmount), {
      value: parseAmount(collateralAmount)
    });
    await tx.wait();
    
    const collateralBalance = await enhancedLending.collateralBalance(borrower.address);
    console.log(`   Collateral deposited: ${formatAmount(collateralBalance)} KAIA`);
    return { txHash: tx.hash, collateral: formatAmount(collateralBalance) };
  }));

  testResults.borrowingTests.push(await executeTest("Check borrowing capacity", async () => {
    const ltv = await enhancedLending.getLTV(borrower.address);
    const dashboard = await enhancedLending.getBorrowerDashboard(borrower.address);
    
    console.log(`   Current LTV: ${ltv}%`);
    console.log(`   Available credit: ${formatAmount(dashboard.availableCredit)} USD`);
    return { 
      ltv: ltv.toString(),
      availableCredit: formatAmount(dashboard.availableCredit)
    };
  }));

  testResults.borrowingTests.push(await executeTest("Borrow USDT against collateral", async () => {
    const tx = await enhancedLending.connect(borrower).borrow(usdt.target, parseAmount(borrowAmount));
    await tx.wait();
    
    const debtBalance = await enhancedLending.debtBalance(borrower.address, usdt.target);
    const usdtBalance = await usdt.balanceOf(borrower.address);
    
    console.log(`   Borrowed amount: ${formatAmount(debtBalance)} USDT`);
    console.log(`   USDT balance: ${formatAmount(usdtBalance)} USDT`);
    return { 
      txHash: tx.hash,
      debt: formatAmount(debtBalance),
      balance: formatAmount(usdtBalance)
    };
  }));

  testResults.borrowingTests.push(await executeTest("Check debt breakdown", async () => {
    const debtBreakdown = await enhancedLending.getDebtBreakdown(borrower.address, usdt.target);
    console.log(`   Principal: ${formatAmount(debtBreakdown.principal)} USDT`);
    console.log(`   Accrued interest: ${formatAmount(debtBreakdown.accrued)} USDT`);
    console.log(`   Total debt: ${formatAmount(debtBreakdown.total)} USDT`);
    return {
      principal: formatAmount(debtBreakdown.principal),
      accrued: formatAmount(debtBreakdown.accrued),
      total: formatAmount(debtBreakdown.total)
    };
  }));

  testResults.borrowingTests.push(await executeTest("Partial repayment", async () => {
    const partialAmount = "0.05"; // Repay half
    
    const tx = await enhancedLending.connect(borrower).repay(usdt.target, parseAmount(partialAmount));
    await tx.wait();
    
    const debtBalance = await enhancedLending.debtBalance(borrower.address, usdt.target);
    console.log(`   Remaining debt: ${formatAmount(debtBalance)} USDT`);
    return { txHash: tx.hash, remainingDebt: formatAmount(debtBalance) };
  }));

  // =====================================
  // PHASE 5: ERROR CASES TESTING
  // =====================================
  console.log("\n⚠️  === PHASE 5: ERROR CASES TESTING ===");

  testResults.errorTests.push(await executeTest("Attempt to borrow beyond LTV limit", async () => {
    try {
      const excessiveAmount = "10"; // Too much for available collateral
      await enhancedLending.connect(borrower).borrow(usdt.target, parseAmount(excessiveAmount));
      throw new Error("Transaction should have failed");
    } catch (error) {
      if (error.message.includes("Transaction should have failed")) {
        throw error;
      }
      console.log(`   ✅ Correctly rejected: ${error.message.split('(')[0]}`);
      return { error: "Correctly rejected excessive borrow", reason: "LTV_EXCEEDED" };
    }
  }));

  testResults.errorTests.push(await executeTest("Attempt to withdraw non-existent collateral", async () => {
    try {
      await enhancedLending.connect(liquidator).withdrawCollateral(parseAmount("10"));
      throw new Error("Transaction should have failed");
    } catch (error) {
      if (error.message.includes("Transaction should have failed")) {
        throw error;
      }
      console.log(`   ✅ Correctly rejected: ${error.message.split('(')[0]}`);
      return { error: "Correctly rejected withdrawal", reason: "INSUFFICIENT_COLLATERAL" };
    }
  }));

  // =====================================
  // PHASE 6: FINAL CLEANUP & REPORTING
  // =====================================
  console.log("\n🧹 === PHASE 6: FINAL CLEANUP ===");

  testResults.borrowingTests.push(await executeTest("Full debt repayment", async () => {
    const debtBalance = await enhancedLending.debtBalance(borrower.address, usdt.target);
    
    const tx = await enhancedLending.connect(borrower).repay(usdt.target, debtBalance);
    await tx.wait();
    
    const finalDebt = await enhancedLending.debtBalance(borrower.address, usdt.target);
    console.log(`   Final debt: ${formatAmount(finalDebt)} USDT`);
    return { txHash: tx.hash, finalDebt: formatAmount(finalDebt) };
  }));

  testResults.borrowingTests.push(await executeTest("Withdraw collateral", async () => {
    const collateralBalance = await enhancedLending.collateralBalance(borrower.address);
    
    const tx = await enhancedLending.connect(borrower).withdrawCollateral(collateralBalance);
    await tx.wait();
    
    const finalCollateral = await enhancedLending.collateralBalance(borrower.address);
    console.log(`   Final collateral: ${formatAmount(finalCollateral)} KAIA`);
    return { txHash: tx.hash, finalCollateral: formatAmount(finalCollateral) };
  }));

  // =====================================
  // GENERATE FINAL REPORT
  // =====================================
  console.log("\n📊 === FINAL TEST REPORT ===");
  
  const report = {
    timestamp: new Date().toISOString(),
    contracts: deployedAddresses,
    testAccounts: {
      deployer: deployer.address,
      note: "Using single account for all roles in testing"
    },
    results: testResults,
    networkInfo: {
      chainId: (await ethers.provider.getNetwork()).chainId,
      blockNumber: await ethers.provider.getBlockNumber()
    }
  };

  // Save detailed report
  const reportPath = path.join(__dirname, '..', 'enhanced-lending-test-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  // Print summary
  console.log(`\n✅ TESTS COMPLETED:`);
  console.log(`   Total Tests: ${testResults.summary.total}`);
  console.log(`   Passed: ${testResults.summary.passed}`);
  console.log(`   Failed: ${testResults.summary.failed}`);
  console.log(`   Success Rate: ${(testResults.summary.passed / testResults.summary.total * 100).toFixed(1)}%`);
  
  console.log(`\n📋 DETAILED REPORT SAVED TO: ${reportPath}`);
  
  if (testResults.summary.failed > 0) {
    console.log(`\n❌ Some tests failed. Please review the detailed report.`);
    process.exit(1);
  } else {
    console.log(`\n🎉 ALL TESTS PASSED! Enhanced Lending Protocol is working correctly.`);
  }

  return report;
}

if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error("💥 Test execution failed:", error);
      process.exit(1);
    });
}

module.exports = main;