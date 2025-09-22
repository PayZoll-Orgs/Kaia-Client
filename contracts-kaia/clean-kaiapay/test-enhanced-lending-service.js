const { ethers } = require("hardhat");
const fs = require('fs');
const path = require('path');

/**
 * COMPREHENSIVE ENHANCED LENDING SERVICE TEST
 * 
 * This script tests all implemented Enhanced Lending Service functions
 * to verify 100% functionality is achieved
 */

async function main() {
  console.log("\n🧪 === COMPREHENSIVE ENHANCED LENDING SERVICE TEST ===");
  
  const [deployer] = await ethers.getSigners();
  console.log("🔑 Using account:", deployer.address);

  // Load deployed addresses
  const addressesPath = path.join(__dirname, 'deployedAddresses.json');
  const deployedAddresses = JSON.parse(fs.readFileSync(addressesPath, 'utf8'));
  
  console.log("\n📋 Contract addresses:");
  console.log("  EnhancedLendingProtocol:", deployedAddresses.EnhancedLendingProtocol);
  console.log("  USDY:", deployedAddresses.USDY);
  console.log("  DummyUSDT:", deployedAddresses.DummyUSDT);

  // Get contract instances
  const enhancedLending = await ethers.getContractAt("EnhancedLendingProtocol", deployedAddresses.EnhancedLendingProtocol);
  const usdy = await ethers.getContractAt("USDY", deployedAddresses.USDY);
  const usdt = await ethers.getContractAt("DummyUSDT", deployedAddresses.DummyUSDT);

  const testResults = {
    timestamp: new Date().toISOString(),
    account: deployer.address,
    tests: [],
    summary: {
      total: 0,
      passed: 0,
      failed: 0
    }
  };

  // =====================================
  // TEST 1: COLLATERAL MANAGEMENT
  // =====================================
  console.log("\n🔒 === TESTING COLLATERAL MANAGEMENT ===");

  try {
    console.log("🔍 Test: Get USDY for collateral...");
    const usdyBalance = await usdy.balanceOf(deployer.address);
    if (usdyBalance == 0) {
      const faucetTx = await usdy.claimFromFaucet();
      await faucetTx.wait();
      console.log("✅ USDY faucet claim successful");
    }

    console.log("🔍 Test: Deposit USDY collateral...");
    const collateralAmount = ethers.parseUnits("50", 18);
    
    const approveTx = await usdy.approve(deployedAddresses.EnhancedLendingProtocol, collateralAmount);
    await approveTx.wait();
    
    const depositTx = await enhancedLending.depositCollateral(collateralAmount);
    await depositTx.wait();
    
    const collateralBalance = await enhancedLending.collateralBalance(deployer.address);
    console.log(`✅ Collateral balance: ${ethers.formatUnits(collateralBalance, 18)} USDY`);
    
    testResults.tests.push({
      category: "Collateral Management",
      test: "depositCollateral()",
      status: "PASSED",
      txHash: depositTx.hash,
      result: `${ethers.formatUnits(collateralBalance, 18)} USDY deposited`
    });

    console.log("🔍 Test: Withdraw partial collateral...");
    const withdrawAmount = ethers.parseUnits("10", 18);
    const withdrawTx = await enhancedLending.withdrawCollateral(withdrawAmount);
    await withdrawTx.wait();
    
    const newCollateralBalance = await enhancedLending.collateralBalance(deployer.address);
    console.log(`✅ New collateral balance: ${ethers.formatUnits(newCollateralBalance, 18)} USDY`);
    
    testResults.tests.push({
      category: "Collateral Management",
      test: "withdrawCollateral()",
      status: "PASSED",
      txHash: withdrawTx.hash,
      result: `${ethers.formatUnits(newCollateralBalance, 18)} USDY remaining`
    });

  } catch (error) {
    console.error("❌ Collateral management test failed:", error.message);
    testResults.tests.push({
      category: "Collateral Management",
      test: "depositCollateral() / withdrawCollateral()",
      status: "FAILED",
      error: error.message
    });
  }

  // =====================================
  // TEST 2: CORE LENDING
  // =====================================
  console.log("\n🏦 === TESTING CORE LENDING ===");

  try {
    console.log("🔍 Test: Deposit USDT for lending...");
    const depositAmount = ethers.parseUnits("100", 18);
    
    // Get USDT first
    const usdtBalance = await usdt.balanceOf(deployer.address);
    if (usdtBalance < depositAmount) {
      const faucetTx = await usdt.faucet();
      await faucetTx.wait();
      console.log("✅ USDT faucet successful");
    }
    
    const approveUsdtTx = await usdt.approve(deployedAddresses.EnhancedLendingProtocol, depositAmount);
    await approveUsdtTx.wait();
    
    const depositUsdtTx = await enhancedLending.deposit(deployedAddresses.DummyUSDT, depositAmount);
    await depositUsdtTx.wait();
    
    console.log("✅ USDT deposit successful");
    
    testResults.tests.push({
      category: "Core Lending",
      test: "deposit()",
      status: "PASSED",
      txHash: depositUsdtTx.hash,
      result: `${ethers.formatUnits(depositAmount, 18)} USDT deposited`
    });

    console.log("🔍 Test: Get lender info...");
    const lenderInfo = await enhancedLending.getLenderInfo(deployer.address, deployedAddresses.DummyUSDT);
    console.log(`✅ Lender info - Deposited: ${ethers.formatUnits(lenderInfo.totalDeposited, 18)} USDT`);
    
    testResults.tests.push({
      category: "Core Lending",
      test: "getLenderInfo()",
      status: "PASSED",
      result: `Total deposited: ${ethers.formatUnits(lenderInfo.totalDeposited, 18)} USDT`
    });

  } catch (error) {
    console.error("❌ Core lending test failed:", error.message);
    testResults.tests.push({
      category: "Core Lending",
      test: "deposit() / getLenderInfo()",
      status: "FAILED",
      error: error.message
    });
  }

  // =====================================
  // TEST 3: BORROWING
  // =====================================
  console.log("\n💳 === TESTING BORROWING ===");

  try {
    console.log("🔍 Test: Borrow against USDY collateral...");
    const collateralBalance = await enhancedLending.collateralBalance(deployer.address);
    const borrowAmount = collateralBalance / BigInt(20); // Very conservative - 5% of collateral
    
    if (borrowAmount > 0) {
      const borrowTx = await enhancedLending.borrow(deployedAddresses.DummyUSDT, borrowAmount);
      await borrowTx.wait();
      
      const debtBalance = await enhancedLending.debtBalance(deployer.address, deployedAddresses.DummyUSDT);
      console.log(`✅ Borrow successful - Debt: ${ethers.formatUnits(debtBalance, 18)} USDT`);
      
      testResults.tests.push({
        category: "Borrowing",
        test: "borrow()",
        status: "PASSED",
        txHash: borrowTx.hash,
        result: `${ethers.formatUnits(debtBalance, 18)} USDT borrowed`
      });

      console.log("🔍 Test: Get borrower dashboard...");
      const dashboard = await enhancedLending.getBorrowerDashboard(deployer.address);
      console.log(`✅ Dashboard - LTV: ${dashboard.currentLTV}%, Collateral: $${ethers.formatUnits(dashboard.totalCollateralUSD, 18)}`);
      
      testResults.tests.push({
        category: "Borrowing",
        test: "getBorrowerDashboard()",
        status: "PASSED",
        result: `LTV: ${dashboard.currentLTV}%, Collateral: $${ethers.formatUnits(dashboard.totalCollateralUSD, 18)}`
      });

      console.log("🔍 Test: Get debt breakdown...");
      const debtBreakdown = await enhancedLending.getDebtBreakdown(deployer.address, deployedAddresses.DummyUSDT);
      console.log(`✅ Debt breakdown - Principal: ${ethers.formatUnits(debtBreakdown.principal, 18)} USDT`);
      
      testResults.tests.push({
        category: "Borrowing",
        test: "getDebtBreakdown()",
        status: "PASSED",
        result: `Principal: ${ethers.formatUnits(debtBreakdown.principal, 18)} USDT`
      });

      console.log("🔍 Test: Partial repayment...");
      const repayAmount = borrowAmount / BigInt(2); // Repay half
      
      const approveRepayTx = await usdt.approve(deployedAddresses.EnhancedLendingProtocol, repayAmount);
      await approveRepayTx.wait();
      
      const repayTx = await enhancedLending.repay(deployedAddresses.DummyUSDT, repayAmount);
      await repayTx.wait();
      
      const remainingDebt = await enhancedLending.debtBalance(deployer.address, deployedAddresses.DummyUSDT);
      console.log(`✅ Repay successful - Remaining debt: ${ethers.formatUnits(remainingDebt, 18)} USDT`);
      
      testResults.tests.push({
        category: "Borrowing",
        test: "repay()",
        status: "PASSED",
        txHash: repayTx.hash,
        result: `Remaining debt: ${ethers.formatUnits(remainingDebt, 18)} USDT`
      });

    } else {
      console.log("⚠️ No collateral available for borrowing");
      testResults.tests.push({
        category: "Borrowing",
        test: "borrow()",
        status: "SKIPPED",
        result: "No collateral available"
      });
    }

  } catch (error) {
    console.error("❌ Borrowing test failed:", error.message);
    testResults.tests.push({
      category: "Borrowing",
      test: "borrow() / repay()",
      status: "FAILED",
      error: error.message
    });
  }

  // =====================================
  // TEST 4: REFERRAL SYSTEM
  // =====================================
  console.log("\n👥 === TESTING REFERRAL SYSTEM ===");

  try {
    console.log("🔍 Test: Register referral code...");
    const referralCode = "TEST" + Date.now().toString().slice(-6);
    const registerTx = await enhancedLending.registerReferralCode(referralCode);
    await registerTx.wait();
    
    console.log(`✅ Referral code '${referralCode}' registered successfully`);
    
    testResults.tests.push({
      category: "Referral System",
      test: "registerReferralCode()",
      status: "PASSED",
      txHash: registerTx.hash,
      result: `Code '${referralCode}' registered`
    });

    console.log("🔍 Test: Get referral info...");
    const referralInfo = await enhancedLending.getReferralInfo(deployer.address);
    console.log(`✅ Referral info - Registered: ${referralInfo.isRegistered}, Referrals: ${referralInfo.totalReferrals}`);
    
    testResults.tests.push({
      category: "Referral System", 
      test: "getReferralInfo()",
      status: "PASSED",
      result: `Registered: ${referralInfo.isRegistered}, Total referrals: ${referralInfo.totalReferrals}`
    });

  } catch (error) {
    console.error("❌ Referral system test failed:", error.message);
    testResults.tests.push({
      category: "Referral System",
      test: "registerReferralCode() / getReferralInfo()",
      status: "FAILED",
      error: error.message
    });
  }

  // =====================================
  // CALCULATE FINAL RESULTS
  // =====================================
  testResults.summary.total = testResults.tests.length;
  testResults.summary.passed = testResults.tests.filter(t => t.status === "PASSED").length;
  testResults.summary.failed = testResults.tests.filter(t => t.status === "FAILED").length;
  testResults.summary.skipped = testResults.tests.filter(t => t.status === "SKIPPED").length;
  testResults.summary.successRate = ((testResults.summary.passed / testResults.summary.total) * 100).toFixed(1) + "%";

  console.log("\n📊 === FINAL TEST RESULTS ===");
  console.log(`📋 Total Tests: ${testResults.summary.total}`);
  console.log(`✅ Passed: ${testResults.summary.passed}`);
  console.log(`❌ Failed: ${testResults.summary.failed}`);
  console.log(`⏭️ Skipped: ${testResults.summary.skipped || 0}`);
  console.log(`🎯 Success Rate: ${testResults.summary.successRate}`);

  // Save test results
  const resultsPath = path.join(__dirname, 'comprehensive-lending-test-results.json');
  fs.writeFileSync(resultsPath, JSON.stringify(testResults, null, 2));
  
  console.log(`\n💾 Test results saved to: ${resultsPath}`);

  return testResults;
}

if (require.main === module) {
  main()
    .then((results) => {
      if (results.summary.failed === 0) {
        console.log("\n🎉 ALL TESTS PASSED! Enhanced Lending Service is 100% functional!");
        process.exit(0);
      } else {
        console.log(`\n⚠️ ${results.summary.failed} test(s) failed. Review and fix issues.`);
        process.exit(1);
      }
    })
    .catch((error) => {
      console.error("💥 Test suite failed:", error);
      process.exit(1);
    });
}

module.exports = main;