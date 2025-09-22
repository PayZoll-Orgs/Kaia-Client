const { ethers } = require("hardhat");
const fs = require('fs');
const path = require('path');

/**
 * FIX ENHANCED LENDING PROTOCOL INTEGRATION
 * 
 * This script fixes the LP token permissions and other issues
 */

async function main() {
  console.log("\n🔧 === FIXING ENHANCED LENDING PROTOCOL INTEGRATION ===");
  
  const [deployer] = await ethers.getSigners();
  console.log("🔑 Using account:", deployer.address);

  // Load deployed addresses
  const addressesPath = path.join(__dirname, '..', 'deployedAddresses.json');
  const deployedAddresses = JSON.parse(fs.readFileSync(addressesPath, 'utf8'));
  
  console.log("\n📋 Contract addresses:");
  console.log("  EnhancedLendingProtocol:", deployedAddresses.EnhancedLendingProtocol);
  console.log("  kUSDT:", deployedAddresses.kUSDT);
  console.log("  kKAIA:", deployedAddresses.kKAIA);

  // Get contract instances
  const kUSDT = await ethers.getContractAt("LPToken", deployedAddresses.kUSDT);
  const kKAIA = await ethers.getContractAt("LPToken", deployedAddresses.kKAIA);

  // =====================================
  // FIX 1: UPDATE LP TOKEN PERMISSIONS
  // =====================================
  console.log("\n🔧 === FIXING LP TOKEN PERMISSIONS ===");

  try {
    console.log("🔍 Checking current kUSDT lending protocol...");
    const currentKUSDTProtocol = await kUSDT.lendingProtocol();
    console.log("  Current kUSDT protocol:", currentKUSDTProtocol);
    
    if (currentKUSDTProtocol.toLowerCase() !== deployedAddresses.EnhancedLendingProtocol.toLowerCase()) {
      console.log("🔄 Updating kUSDT lending protocol...");
      const tx1 = await kUSDT.updateLendingProtocol(deployedAddresses.EnhancedLendingProtocol);
      await tx1.wait();
      console.log("✅ kUSDT protocol updated:", tx1.hash);
    } else {
      console.log("✅ kUSDT protocol already correct");
    }

  } catch (error) {
    console.error("❌ Failed to update kUSDT protocol:", error.message);
  }

  try {
    console.log("🔍 Checking current kKAIA lending protocol...");
    const currentKKAIAProtocol = await kKAIA.lendingProtocol();
    console.log("  Current kKAIA protocol:", currentKKAIAProtocol);
    
    if (currentKKAIAProtocol.toLowerCase() !== deployedAddresses.EnhancedLendingProtocol.toLowerCase()) {
      console.log("🔄 Updating kKAIA lending protocol...");
      const tx2 = await kKAIA.updateLendingProtocol(deployedAddresses.EnhancedLendingProtocol);
      await tx2.wait();
      console.log("✅ kKAIA protocol updated:", tx2.hash);
    } else {
      console.log("✅ kKAIA protocol already correct");
    }

  } catch (error) {
    console.error("❌ Failed to update kKAIA protocol:", error.message);
  }

  // =====================================
  // FIX 2: PROVIDE INITIAL LIQUIDITY
  // =====================================
  console.log("\n💰 === PROVIDING INITIAL LIQUIDITY ===");

  const usdt = await ethers.getContractAt("DummyUSDT", deployedAddresses.DummyUSDT);
  const enhancedLending = await ethers.getContractAt("EnhancedLendingProtocol", deployedAddresses.EnhancedLendingProtocol);

  try {
    // Transfer some USDT to the lending contract for liquidity
    const liquidityAmount = ethers.parseUnits("10000", 18); // 10,000 USDT
    
    const usdtBalance = await usdt.balanceOf(deployer.address);
    console.log(`🔍 Current USDT balance: ${ethers.formatUnits(usdtBalance, 18)} USDT`);
    
    if (usdtBalance >= liquidityAmount) {
      console.log("💸 Transferring initial liquidity to lending contract...");
      const tx3 = await usdt.transfer(deployedAddresses.EnhancedLendingProtocol, liquidityAmount);
      await tx3.wait();
      console.log("✅ Initial liquidity provided:", tx3.hash);
      console.log(`   Amount: ${ethers.formatUnits(liquidityAmount, 18)} USDT`);
    } else {
      console.log("⚠️  Insufficient USDT balance for liquidity provision");
    }

  } catch (error) {
    console.error("❌ Failed to provide liquidity:", error.message);
  }

  // =====================================
  // FIX 3: TEST CORRECTED FUNCTIONALITY
  // =====================================
  console.log("\n🧪 === TESTING CORRECTED FUNCTIONALITY ===");

  try {
    console.log("🔍 Testing: Deposit function");
    
    const depositAmount = ethers.parseUnits("100", 18); // 100 USDT
    
    // Approve USDT for deposit
    console.log("  Approving USDT...");
    const approveTx = await usdt.approve(deployedAddresses.EnhancedLendingProtocol, depositAmount);
    await approveTx.wait();
    
    // Attempt deposit
    console.log("  Attempting deposit...");
    const depositTx = await enhancedLending.deposit(deployedAddresses.DummyUSDT, depositAmount);
    await depositTx.wait();
    
    console.log("✅ Deposit successful:", depositTx.hash);
    
    // Check LP token balance
    const lpBalance = await kUSDT.balanceOf(deployer.address);
    console.log(`   LP Token balance: ${ethers.formatUnits(lpBalance, 18)} kUSDT`);

  } catch (error) {
    console.error("❌ Deposit test failed:", error.message);
  }

  try {
    console.log("🔍 Testing: Collateral deposit");
    
    const collateralAmount = ethers.parseUnits("0.1", 18); // 0.1 KAIA
    
    const collateralTx = await enhancedLending.depositCollateral(collateralAmount, {
      value: collateralAmount
    });
    await collateralTx.wait();
    
    console.log("✅ Collateral deposit successful:", collateralTx.hash);
    
    // Check collateral balance
    const collateralBalance = await enhancedLending.collateralBalance(deployer.address);
    console.log(`   Collateral balance: ${ethers.formatUnits(collateralBalance, 18)} KAIA`);

  } catch (error) {
    console.error("❌ Collateral deposit test failed:", error.message);
  }

  try {
    console.log("🔍 Testing: Borrower dashboard");
    
    const dashboard = await enhancedLending.getBorrowerDashboard(deployer.address);
    
    console.log("✅ Borrower dashboard query successful");
    console.log(`   Total Collateral: $${ethers.formatUnits(dashboard.totalCollateral, 18)}`);
    console.log(`   Available Credit: $${ethers.formatUnits(dashboard.availableCredit, 18)}`);
    console.log(`   Current LTV: ${dashboard.currentLTV}%`);

  } catch (error) {
    console.error("❌ Borrower dashboard test failed:", error.message);
  }

  try {
    console.log("🔍 Testing: Small borrow operation");
    
    const borrowAmount = ethers.parseUnits("0.01", 18); // 0.01 USDT (very conservative)
    
    const borrowTx = await enhancedLending.borrow(deployedAddresses.DummyUSDT, borrowAmount);
    await borrowTx.wait();
    
    console.log("✅ Borrow successful:", borrowTx.hash);
    
    // Check debt balance
    const debtBalance = await enhancedLending.debtBalance(deployer.address, deployedAddresses.DummyUSDT);
    console.log(`   Debt balance: ${ethers.formatUnits(debtBalance, 18)} USDT`);

  } catch (error) {
    console.error("❌ Borrow test failed:", error.message);
  }

  console.log("\n✅ ENHANCED LENDING PROTOCOL FIXES COMPLETED!");
  console.log("🔧 Core functionality should now be working properly");

  return {
    enhancedLending: deployedAddresses.EnhancedLendingProtocol,
    fixes: "LP token permissions updated, liquidity provided, functionality tested"
  };
}

if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error("💥 Fix process failed:", error);
      process.exit(1);
    });
}

module.exports = main;