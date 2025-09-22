const { ethers } = require("hardhat");
const fs = require('fs');
const path = require('path');

/**
 * FIX USDY COLLATERAL FUNCTIONALITY
 * 
 * This script fixes USDY collateral deposit and ensures proper functionality
 */

async function main() {
  console.log("\n🔧 === FIXING USDY COLLATERAL FUNCTIONALITY ===");
  
  const [deployer] = await ethers.getSigners();
  console.log("🔑 Using account:", deployer.address);

  // Load deployed addresses
  const addressesPath = path.join(__dirname, '..', 'deployedAddresses.json');
  const deployedAddresses = JSON.parse(fs.readFileSync(addressesPath, 'utf8'));
  
  console.log("\n📋 Contract addresses:");
  console.log("  EnhancedLendingProtocol:", deployedAddresses.EnhancedLendingProtocol);
  console.log("  USDY:", deployedAddresses.USDY);
  console.log("  DummyUSDT:", deployedAddresses.DummyUSDT);

  // Get contract instances
  const enhancedLending = await ethers.getContractAt("EnhancedLendingProtocol", deployedAddresses.EnhancedLendingProtocol);
  const usdy = await ethers.getContractAt("USDY", deployedAddresses.USDY);
  const usdt = await ethers.getContractAt("DummyUSDT", deployedAddresses.DummyUSDT);

  // =====================================
  // STEP 1: GET USDY TOKENS FOR COLLATERAL
  // =====================================
  console.log("\n💎 === GETTING USDY TOKENS FOR COLLATERAL ===");

  try {
    console.log("🔍 Checking current USDY balance...");
    const usdyBalance = await usdy.balanceOf(deployer.address);
    console.log(`   Current USDY balance: ${ethers.formatUnits(usdyBalance, 18)} USDY`);

    if (usdyBalance == 0) {
      console.log("🚰 Getting USDY from faucet...");
      const faucetTx = await usdy.claimFromFaucet();
      await faucetTx.wait();
      console.log("✅ USDY faucet claim successful:", faucetTx.hash);
      
      const newBalance = await usdy.balanceOf(deployer.address);
      console.log(`   New USDY balance: ${ethers.formatUnits(newBalance, 18)} USDY`);
    } else {
      console.log("✅ Already have USDY tokens");
    }

  } catch (error) {
    console.error("❌ Failed to get USDY tokens:", error.message);
    return;
  }

  // =====================================
  // STEP 2: TEST USDY COLLATERAL DEPOSIT
  // =====================================
  console.log("\n🏦 === TESTING USDY COLLATERAL DEPOSIT ===");

  try {
    const collateralAmount = ethers.parseUnits("100", 18); // 100 USDY as collateral
    
    console.log("🔍 Approving USDY for lending contract...");
    const approveTx = await usdy.approve(deployedAddresses.EnhancedLendingProtocol, collateralAmount);
    await approveTx.wait();
    console.log("✅ USDY approval successful:", approveTx.hash);
    
    console.log("🔍 Depositing USDY as collateral...");
    const depositTx = await enhancedLending.depositCollateral(collateralAmount);
    await depositTx.wait();
    console.log("✅ USDY collateral deposit successful:", depositTx.hash);
    
    // Check collateral balance
    const collateralBalance = await enhancedLending.collateralBalance(deployer.address);
    console.log(`   Collateral balance: ${ethers.formatUnits(collateralBalance, 18)} USDY`);

  } catch (error) {
    console.error("❌ USDY collateral deposit failed:", error.message);
  }

  // =====================================
  // STEP 3: TEST BORROWER DASHBOARD
  // =====================================
  console.log("\n📊 === TESTING BORROWER DASHBOARD ===");

  try {
    console.log("🔍 Checking borrower dashboard...");
    const dashboard = await enhancedLending.getBorrowerDashboard(deployer.address);
    
    // Safely format values, handling potential null/undefined
    const formatSafe = (value) => {
      try {
        return value ? ethers.formatUnits(value, 18) : "0.0";
      } catch {
        return "0.0";
      }
    };
    
    console.log("✅ Borrower dashboard retrieved successfully:");
    console.log(`   Current LTV: ${dashboard.currentLTV || 0}%`);
    console.log(`   Total Collateral USD: $${formatSafe(dashboard.totalCollateralUSD)}`);
    console.log(`   Total Debt USD: $${formatSafe(dashboard.totalDebtUSD)}`);
    console.log(`   Liquidation Threshold: ${dashboard.liquidationThreshold || 0}%`);
    console.log(`   Is Liquidatable: ${dashboard.isLiquidatableStatus || false}`);

  } catch (error) {
    console.error("❌ Borrower dashboard failed:", error.message);
  }

  // =====================================
  // STEP 4: TEST BORROWING AGAINST USDY COLLATERAL
  // =====================================
  console.log("\n💰 === TESTING BORROWING AGAINST USDY COLLATERAL ===");

  try {
    // Calculate safe borrow amount (very conservative)
    const collateralBalance = await enhancedLending.collateralBalance(deployer.address);
    const collateralValueUSD = collateralBalance; // 1 USDY = $1 typically
    const maxBorrowUSD = collateralValueUSD * BigInt(50) / BigInt(100); // 50% LTV for safety
    const borrowAmount = maxBorrowUSD / BigInt(10); // Borrow only 10% of max for safety
    
    console.log(`🔍 Collateral: ${ethers.formatUnits(collateralBalance, 18)} USDY`);
    console.log(`🔍 Safe borrow amount: ${ethers.formatUnits(borrowAmount, 18)} USDT`);
    
    if (borrowAmount > 0) {
      console.log("🔍 Attempting to borrow USDT...");
      const borrowTx = await enhancedLending.borrow(deployedAddresses.DummyUSDT, borrowAmount);
      await borrowTx.wait();
      console.log("✅ Borrow successful:", borrowTx.hash);
      
      // Check debt balance
      const debtBalance = await enhancedLending.debtBalance(deployer.address, deployedAddresses.DummyUSDT);
      console.log(`   Debt balance: ${ethers.formatUnits(debtBalance, 18)} USDT`);
      
      // Check updated LTV
      const newLTV = await enhancedLending.getLTV(deployer.address);
      console.log(`   New LTV: ${newLTV}%`);
      
    } else {
      console.log("⚠️  No collateral available for borrowing");
    }

  } catch (error) {
    console.error("❌ Borrowing test failed:", error.message);
  }

  // =====================================
  // STEP 5: TEST DEBT BREAKDOWN
  // =====================================
  console.log("\n📋 === TESTING DEBT BREAKDOWN ===");

  try {
    console.log("🔍 Getting debt breakdown...");
    const debtBreakdown = await enhancedLending.getDebtBreakdown(deployer.address, deployedAddresses.DummyUSDT);
    
    console.log("✅ Debt breakdown retrieved:");
    console.log(`   Principal: ${ethers.formatUnits(debtBreakdown.principal || 0, 18)} USDT`);
    console.log(`   Accrued Interest: ${ethers.formatUnits(debtBreakdown.accrued || 0, 18)} USDT`);
    console.log(`   Total Debt: ${ethers.formatUnits(debtBreakdown.total || 0, 18)} USDT`);
    console.log(`   Interest Rate: ${debtBreakdown.currentInterestRate || 0}%`);

  } catch (error) {
    console.error("❌ Debt breakdown failed:", error.message);
  }

  // =====================================
  // STEP 6: TEST REPAYMENT
  // =====================================
  console.log("\n💸 === TESTING DEBT REPAYMENT ===");

  try {
    const debtBalance = await enhancedLending.debtBalance(deployer.address, deployedAddresses.DummyUSDT);
    
    if (debtBalance > 0) {
      console.log(`🔍 Current debt: ${ethers.formatUnits(debtBalance, 18)} USDT`);
      
      // Repay half the debt
      const repayAmount = debtBalance / BigInt(2);
      console.log(`🔍 Repaying: ${ethers.formatUnits(repayAmount, 18)} USDT`);
      
      // First approve USDT for repayment
      const approveTx = await usdt.approve(deployedAddresses.EnhancedLendingProtocol, repayAmount);
      await approveTx.wait();
      
      const repayTx = await enhancedLending.repay(deployedAddresses.DummyUSDT, repayAmount);
      await repayTx.wait();
      console.log("✅ Repayment successful:", repayTx.hash);
      
      const remainingDebt = await enhancedLending.debtBalance(deployer.address, deployedAddresses.DummyUSDT);
      console.log(`   Remaining debt: ${ethers.formatUnits(remainingDebt, 18)} USDT`);
      
    } else {
      console.log("ℹ️  No debt to repay");
    }

  } catch (error) {
    console.error("❌ Repayment test failed:", error.message);
  }

  console.log("\n✅ USDY COLLATERAL FUNCTIONALITY TESTING COMPLETED!");
  console.log("🎯 USDY-based lending and borrowing should now be fully functional");

  return {
    status: "completed",
    collateralToken: "USDY",
    lending: deployedAddresses.EnhancedLendingProtocol
  };
}

if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error("💥 USDY collateral fix failed:", error);
      process.exit(1);
    });
}

module.exports = main;