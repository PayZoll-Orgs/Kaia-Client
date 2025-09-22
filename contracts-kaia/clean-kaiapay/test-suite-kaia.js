/**
 * Comprehensive Test Suite for Enhanced Lending Protocol
 * Kaia Testnet Deployment Verification
 * 
 * This test suite verifies all functionality of the Enhanced Lending Protocol
 * deployed on Kaia testnet (Chain ID: 1001)
 */

const { ethers } = require("hardhat");

// Deployed contract addresses on Kaia testnet
const DEPLOYED_ADDRESSES = {
  EnhancedLendingProtocol: "0x59a817BA3FfB4a2590B96B3625F4Ac2B7B79c5D8",
  DummyUSDT: "0xd5578DD1B35713484DD8f872e36674F2ED2839a3",
  USDY: "0xE449AB36fA3DD7167D1A73Fd598E1377e5ff1461",
  kKAIA: "0xAc364154272d1B79539d2d7B35156ca7134EBfB7",
  kUSDT: "0x22cD2E80e3a63f8FF01AdFeBEA27bE08AB46aF3b"
};

class TestLogger {
  constructor() {
    this.passed = 0;
    this.failed = 0;
    this.total = 0;
  }

  log(test, status, message = "") {
    this.total++;
    if (status) {
      this.passed++;
      console.log(`✅ ${test} - PASSED ${message}`);
    } else {
      this.failed++;
      console.log(`❌ ${test} - FAILED ${message}`);
    }
  }

  summary() {
    console.log("\n" + "=".repeat(60));
    console.log(`📊 TEST SUITE SUMMARY`);
    console.log("=".repeat(60));
    console.log(`Total Tests: ${this.total}`);
    console.log(`Passed: ${this.passed} ✅`);
    console.log(`Failed: ${this.failed} ${this.failed > 0 ? '❌' : '✅'}`);
    console.log(`Success Rate: ${((this.passed / this.total) * 100).toFixed(1)}%`);
    console.log("=".repeat(60));
    
    if (this.failed === 0) {
      console.log("🎉 ALL TESTS PASSED - DEPLOYMENT SUCCESSFUL! 🎉");
    } else {
      console.log("⚠️  SOME TESTS FAILED - REVIEW REQUIRED");
    }
  }
}

async function runComprehensiveTestSuite() {
  const logger = new TestLogger();
  console.log("🚀 Starting Comprehensive Test Suite for Enhanced Lending Protocol");
  console.log("🌐 Network: Kaia Testnet (Kairos) - Chain ID: 1001\n");

  let enhancedLending, usdt, usdy, kKAIA, kUSDT;
  let deployer, user1, user2;

  try {
    // Get signers
    const signers = await ethers.getSigners();
    deployer = signers[0];
    user1 = signers[1] || deployer;
    user2 = signers[2] || deployer;
    
    console.log(`👤 Deployer: ${deployer.address}`);
    console.log(`👤 User1: ${user1.address}`);
    console.log(`👤 User2: ${user2.address}\n`);

    // Connect to deployed contracts
    console.log("📡 Connecting to deployed contracts...");
    
    const EnhancedLendingABI = require("./artifacts/contracts/EnhancedLendingProtocol.sol/EnhancedLendingProtocol.json");
    const ERC20ABI = require("./artifacts/contracts/DummyUSDT.sol/DummyUSDT.json");
    
    enhancedLending = new ethers.Contract(DEPLOYED_ADDRESSES.EnhancedLendingProtocol, EnhancedLendingABI.abi, deployer);
    usdt = new ethers.Contract(DEPLOYED_ADDRESSES.DummyUSDT, ERC20ABI.abi, deployer);
    usdy = new ethers.Contract(DEPLOYED_ADDRESSES.USDY, ERC20ABI.abi, deployer);
    kKAIA = new ethers.Contract(DEPLOYED_ADDRESSES.kKAIA, ERC20ABI.abi, deployer);
    kUSDT = new ethers.Contract(DEPLOYED_ADDRESSES.kUSDT, ERC20ABI.abi, deployer);

    logger.log("Contract Connection", true, "- All contracts connected successfully");

  } catch (error) {
    logger.log("Contract Connection", false, `- ${error.message}`);
    logger.summary();
    return;
  }

  // Test 1: Contract Deployment Verification
  console.log("\n🔍 Testing Contract Deployment...");
  
  try {
    const enhancedLendingCode = await ethers.provider.getCode(DEPLOYED_ADDRESSES.EnhancedLendingProtocol);
    logger.log("Enhanced Lending Deployment", enhancedLendingCode !== "0x", "- Contract has bytecode");
    
    const usdtCode = await ethers.provider.getCode(DEPLOYED_ADDRESSES.DummyUSDT);
    logger.log("USDT Deployment", usdtCode !== "0x", "- Contract has bytecode");
    
    const usdyCode = await ethers.provider.getCode(DEPLOYED_ADDRESSES.USDY);
    logger.log("USDY Deployment", usdyCode !== "0x", "- Contract has bytecode");
  } catch (error) {
    logger.log("Contract Deployment", false, `- ${error.message}`);
  }

  // Test 2: Basic Contract Info
  console.log("\n📋 Testing Contract Information...");
  
  try {
    const usdtName = await usdt.name();
    logger.log("USDT Name", usdtName === "DummyUSDT", `- Name: ${usdtName}`);
    
    const usdyName = await usdy.name();
    logger.log("USDY Name", usdyName === "USDY", `- Name: ${usdyName}`);
    
    const usdtSupply = await usdt.totalSupply();
    logger.log("USDT Supply", usdtSupply > 0, `- Supply: ${ethers.formatEther(usdtSupply)}`);
  } catch (error) {
    logger.log("Contract Information", false, `- ${error.message}`);
  }

  // Test 3: Token Faucet Functions
  console.log("\n🚰 Testing Token Faucets...");
  
  try {
    // Test USDT faucet
    const user1Balance = await usdt.balanceOf(user1.address);
    const faucetTx = await usdt.connect(user1).faucet();
    await faucetTx.wait();
    const newBalance = await usdt.balanceOf(user1.address);
    logger.log("USDT Faucet", newBalance > user1Balance, `- Received: ${ethers.formatEther(newBalance.sub(user1Balance))} USDT`);
    
    // Test USDY faucet
    const user1USDYBalance = await usdy.balanceOf(user1.address);
    const usdyFaucetTx = await usdy.connect(user1).faucet();
    await usdyFaucetTx.wait();
    const newUSDYBalance = await usdy.balanceOf(user1.address);
    logger.log("USDY Faucet", newUSDYBalance > user1USDYBalance, `- Received: ${ethers.formatEther(newUSDYBalance.sub(user1USDYBalance))} USDY`);
  } catch (error) {
    logger.log("Token Faucets", false, `- ${error.message}`);
  }

  // Test 4: Collateral Management
  console.log("\n🔒 Testing Collateral Management...");
  
  try {
    const collateralAmount = ethers.parseEther("100");
    
    // Approve USDY for collateral
    const approveTx = await usdy.connect(user1).approve(DEPLOYED_ADDRESSES.EnhancedLendingProtocol, collateralAmount);
    await approveTx.wait();
    logger.log("USDY Approval", true, "- Approved for collateral deposit");
    
    // Deposit collateral
    const depositTx = await enhancedLending.connect(user1).depositCollateral(collateralAmount);
    await depositTx.wait();
    
    // Check collateral balance
    const collateralBalance = await enhancedLending.getCollateralBalance(user1.address);
    logger.log("Collateral Deposit", collateralBalance >= collateralAmount, `- Deposited: ${ethers.formatEther(collateralBalance)} USDY`);
  } catch (error) {
    logger.log("Collateral Management", false, `- ${error.message}`);
  }

  // Test 5: Lending Operations
  console.log("\n🏦 Testing Lending Operations...");
  
  try {
    const lendAmount = ethers.parseEther("50");
    
    // Approve USDT for lending
    const lendApproveTx = await usdt.connect(user1).approve(DEPLOYED_ADDRESSES.EnhancedLendingProtocol, lendAmount);
    await lendApproveTx.wait();
    logger.log("USDT Lending Approval", true, "- Approved for lending");
    
    // Deposit for lending
    const lendTx = await enhancedLending.connect(user1).deposit(DEPLOYED_ADDRESSES.DummyUSDT, lendAmount);
    await lendTx.wait();
    
    // Check lender info
    const lenderInfo = await enhancedLending.getLenderInfo(user1.address, DEPLOYED_ADDRESSES.DummyUSDT);
    logger.log("Lending Deposit", lenderInfo.totalDeposited >= lendAmount, `- Deposited: ${ethers.formatEther(lenderInfo.totalDeposited)} USDT`);
  } catch (error) {
    logger.log("Lending Operations", false, `- ${error.message}`);
  }

  // Test 6: Borrowing Operations
  console.log("\n💳 Testing Borrowing Operations...");
  
  try {
    const borrowAmount = ethers.parseEther("25");
    
    // Attempt to borrow
    const borrowTx = await enhancedLending.connect(user1).borrow(DEPLOYED_ADDRESSES.DummyUSDT, borrowAmount);
    await borrowTx.wait();
    
    // Check borrower dashboard
    const borrowerInfo = await enhancedLending.getBorrowerDashboard(user1.address);
    logger.log("Borrowing Operation", borrowerInfo.totalBorrowed >= borrowAmount, `- Borrowed: ${ethers.formatEther(borrowerInfo.totalBorrowed)} USDT`);
  } catch (error) {
    logger.log("Borrowing Operations", false, `- ${error.message}`);
  }

  // Test 7: Analytics Functions
  console.log("\n📊 Testing Analytics Functions...");
  
  try {
    // Test LTV calculation
    const ltv = await enhancedLending.getLTV(user1.address);
    logger.log("LTV Calculation", ltv >= 0, `- LTV: ${ltv / 100}%`);
    
    // Test liquidation check
    const isLiquidatable = await enhancedLending.isLiquidatable(user1.address);
    logger.log("Liquidation Check", typeof isLiquidatable === 'boolean', `- Liquidatable: ${isLiquidatable}`);
    
    // Test debt breakdown
    const debtBreakdown = await enhancedLending.getDebtBreakdown(user1.address, DEPLOYED_ADDRESSES.DummyUSDT);
    logger.log("Debt Breakdown", true, `- Principal: ${ethers.formatEther(debtBreakdown.principal)} USDT`);
  } catch (error) {
    logger.log("Analytics Functions", false, `- ${error.message}`);
  }

  // Test 8: Referral System
  console.log("\n👥 Testing Referral System...");
  
  try {
    // Register referral code
    const referralCode = "TEST123";
    const registerTx = await enhancedLending.connect(user2).registerReferralCode(referralCode);
    await registerTx.wait();
    logger.log("Referral Registration", true, `- Code: ${referralCode}`);
    
    // Check referral info
    const referralInfo = await enhancedLending.getReferralInfo(user2.address);
    logger.log("Referral Info", referralInfo.referralCode === referralCode, `- Active code: ${referralInfo.referralCode}`);
  } catch (error) {
    logger.log("Referral System", false, `- ${error.message}`);
  }

  // Test 9: LP Token Operations
  console.log("\n🪙 Testing LP Token Operations...");
  
  try {
    // Check kUSDT balance
    const kUSDTBalance = await kUSDT.balanceOf(user1.address);
    logger.log("kUSDT Balance", kUSDTBalance > 0, `- Balance: ${ethers.formatEther(kUSDTBalance)} kUSDT`);
    
    // Check if LP tokens have proper metadata
    const kUSDTName = await kUSDT.name();
    logger.log("kUSDT Metadata", kUSDTName.includes("kUSDT"), `- Name: ${kUSDTName}`);
  } catch (error) {
    logger.log("LP Token Operations", false, `- ${error.message}`);
  }

  // Test 10: Error Handling
  console.log("\n⚠️  Testing Error Handling...");
  
  try {
    // Test borrowing without collateral (should fail)
    try {
      await enhancedLending.connect(user2).borrow(DEPLOYED_ADDRESSES.DummyUSDT, ethers.parseEther("1000"));
      logger.log("Error Handling - Over-borrowing", false, "- Should have failed but didn't");
    } catch (error) {
      logger.log("Error Handling - Over-borrowing", true, "- Properly rejected excessive borrowing");
    }
    
    // Test withdrawal without balance (should fail)
    try {
      await enhancedLending.connect(user2).withdrawCollateral(ethers.parseEther("100"));
      logger.log("Error Handling - Invalid withdrawal", false, "- Should have failed but didn't");
    } catch (error) {
      logger.log("Error Handling - Invalid withdrawal", true, "- Properly rejected invalid withdrawal");
    }
  } catch (error) {
    logger.log("Error Handling Tests", false, `- ${error.message}`);
  }

  // Test 11: Gas Estimation
  console.log("\n⛽ Testing Gas Estimation...");
  
  try {
    // Estimate gas for common operations
    const borrowGas = await enhancedLending.connect(user1).borrow.estimateGas(DEPLOYED_ADDRESSES.DummyUSDT, ethers.parseEther("1"));
    logger.log("Gas Estimation - Borrow", borrowGas < 500000n, `- Gas: ${borrowGas.toString()}`);
    
    const depositGas = await enhancedLending.connect(user1).deposit.estimateGas(DEPLOYED_ADDRESSES.DummyUSDT, ethers.parseEther("1"));
    logger.log("Gas Estimation - Deposit", depositGas < 300000n, `- Gas: ${depositGas.toString()}`);
  } catch (error) {
    logger.log("Gas Estimation", false, `- ${error.message}`);
  }

  // Test 12: Event Emission
  console.log("\n📡 Testing Event Emission...");
  
  try {
    // Listen for events on next transaction
    const filter = enhancedLending.filters.CollateralDeposited();
    const events = await enhancedLending.queryFilter(filter, -10);
    logger.log("Event Emission", events.length > 0, `- Found ${events.length} CollateralDeposited events`);
  } catch (error) {
    logger.log("Event Emission", false, `- ${error.message}`);
  }

  // Final Summary
  logger.summary();
  
  // Generate test report
  console.log("\n📄 Generating Test Report...");
  const report = {
    timestamp: new Date().toISOString(),
    network: "Kaia Testnet (Kairos)",
    chainId: 1001,
    contracts: DEPLOYED_ADDRESSES,
    testResults: {
      total: logger.total,
      passed: logger.passed,
      failed: logger.failed,
      successRate: `${((logger.passed / logger.total) * 100).toFixed(1)}%`
    }
  };
  
  console.log(JSON.stringify(report, null, 2));
  
  return report;
}

// Export for use in other scripts
module.exports = {
  runComprehensiveTestSuite,
  DEPLOYED_ADDRESSES
};

// Run if called directly
if (require.main === module) {
  runComprehensiveTestSuite()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error("❌ Test suite failed:", error);
      process.exit(1);
    });
}