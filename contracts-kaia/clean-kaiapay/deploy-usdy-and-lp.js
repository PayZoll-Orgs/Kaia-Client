const { ethers } = require("hardhat");
const fs = require('fs');
const path = require('path');

/**
 * DEPLOY USDY AND LP TOKENS
 * 
 * This script deploys USDY and LP tokens needed for Enhanced Lending Protocol
 */

async function main() {
  console.log("\n🚀 === DEPLOYING USDY AND LP TOKENS ===");
  
  const [deployer] = await ethers.getSigners();
  console.log("🔑 Deploying from account:", deployer.address);
  console.log("💰 Account balance:", ethers.formatEther(await deployer.provider.getBalance(deployer.address)), "KAIA");

  // Load existing deployed addresses
  const addressesPath = path.join(__dirname, 'deployedAddresses.json');
  let deployedAddresses = {};
  if (fs.existsSync(addressesPath)) {
    deployedAddresses = JSON.parse(fs.readFileSync(addressesPath, 'utf8'));
    console.log("📋 Loaded existing deployed addresses");
  }

  // =====================================
  // DEPLOY USDY (Real World Asset Token)
  // =====================================
  console.log("\n📦 [1/3] Deploying USDY...");
  
  const USDY = await ethers.getContractFactory("USDY");
  const usdy = await USDY.deploy();
  await usdy.waitForDeployment();
  
  const usdyAddress = await usdy.getAddress();
  console.log("✅ USDY deployed to:", usdyAddress);
  
  // USDY has built-in faucet functionality - no need to fund separately
  const totalSupply = await usdy.totalSupply();
  console.log("💰 USDY initial supply:", ethers.formatUnits(totalSupply, 18), "USDY");

  deployedAddresses.USDY = usdyAddress;

  // =====================================
  // DEPLOY LP TOKENS
  // =====================================
  console.log("\n📦 [2/3] Deploying kKAIA LP Token...");
  
  const LPToken = await ethers.getContractFactory("LPToken");
  const kKAIA = await LPToken.deploy(
    "kKAIA LP Token",
    "kKAIA", 
    ethers.ZeroAddress, // Will be updated later with lending protocol address
    deployer.address
  );
  await kKAIA.waitForDeployment();
  
  const kKAIAAddress = await kKAIA.getAddress();
  console.log("✅ kKAIA LP Token deployed to:", kKAIAAddress);
  
  deployedAddresses.kKAIA = kKAIAAddress;

  console.log("\n📦 [3/3] Deploying kUSDT LP Token...");
  
  const kUSDT = await LPToken.deploy(
    "kUSDT LP Token",
    "kUSDT",
    ethers.ZeroAddress, // Will be updated later with lending protocol address
    deployer.address
  );
  await kUSDT.waitForDeployment();
  
  const kUSDTAddress = await kUSDT.getAddress();
  console.log("✅ kUSDT LP Token deployed to:", kUSDTAddress);
  
  deployedAddresses.kUSDT = kUSDTAddress;

  // =====================================
  // SAVE ADDRESSES
  // =====================================
  fs.writeFileSync(addressesPath, JSON.stringify(deployedAddresses, null, 2));
  console.log("\n💾 Updated addresses saved to:", addressesPath);

  console.log("\n✅ USDY AND LP TOKENS DEPLOYMENT SUCCESSFUL!");
  console.log("📋 Summary:");
  console.log("  USDY:", deployedAddresses.USDY);
  console.log("  kKAIA:", deployedAddresses.kKAIA);
  console.log("  kUSDT:", deployedAddresses.kUSDT);
  console.log("  DummyUSDT:", deployedAddresses.DummyUSDT);

  return deployedAddresses;
}

if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error("💥 Deployment failed:", error);
      process.exit(1);
    });
}

module.exports = main;