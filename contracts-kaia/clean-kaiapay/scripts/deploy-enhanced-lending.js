const { ethers } = require("hardhat");
const fs = require('fs');
const path = require('path');

/**
 * DEPLOY ENHANCED LENDING PROTOCOL
 * 
 * This script deploys the EnhancedLendingProtocol contract with all dependencies
 */

async function main() {
  console.log("\n🚀 === DEPLOYING ENHANCED LENDING PROTOCOL ===");
  
  const [deployer] = await ethers.getSigners();
  console.log("🔑 Deploying from account:", deployer.address);
  console.log("💰 Account balance:", ethers.formatEther(await deployer.provider.getBalance(deployer.address)), "KAIA");

  // Load existing deployed addresses
  const addressesPath = path.join(__dirname, '..', 'deployedAddresses.json');
  let deployedAddresses = {};
  
  try {
    const addressesData = fs.readFileSync(addressesPath, 'utf8');
    deployedAddresses = JSON.parse(addressesData);
    console.log("📋 Loaded existing deployed addresses");
  } catch (error) {
    console.error("❌ Could not load existing addresses:", error.message);
    process.exit(1);
  }

  // Check required dependencies
  const requiredContracts = ['DummyUSDT', 'USDY', 'kUSDT', 'kKAIA'];
  for (const contract of requiredContracts) {
    if (!deployedAddresses[contract]) {
      console.error(`❌ Required contract ${contract} not found in deployed addresses`);
      process.exit(1);
    }
  }

  console.log("✅ All dependencies verified");

  // =====================================
  // DEPLOY FEED ROUTER (Mock for testing)
  // =====================================
  console.log("\n📦 [1/2] Deploying Mock Feed Router...");
  
  const MockFeedRouter = await ethers.getContractFactory("MockFeedRouter");
  const mockFeedRouter = await MockFeedRouter.deploy();
  await mockFeedRouter.waitForDeployment();
  
  const mockFeedRouterAddress = await mockFeedRouter.getAddress();
  console.log("✅ MockFeedRouter deployed to:", mockFeedRouterAddress);

  // =====================================
  // DEPLOY ENHANCED LENDING PROTOCOL
  // =====================================
  console.log("\n📦 [2/2] Deploying EnhancedLendingProtocol...");
  
  const EnhancedLendingProtocol = await ethers.getContractFactory("EnhancedLendingProtocol");
  
  // Constructor parameters from the contract
  const constructorArgs = [
    ethers.ZeroAddress,                    // KAIA (native token, use zero address)
    deployedAddresses.DummyUSDT,           // USDT
    deployedAddresses.USDY,                // USDY  
    deployedAddresses.kKAIA,               // kKAIA LP token
    deployedAddresses.kUSDT,               // kUSDT LP token
    await mockFeedRouter.getAddress(),     // Feed router
    deployer.address                       // Initial owner
  ];

  console.log("📝 Constructor arguments:", {
    KAIA: constructorArgs[0],
    USDT: constructorArgs[1], 
    USDY: constructorArgs[2],
    kKAIA: constructorArgs[3],
    kUSDT: constructorArgs[4],
    feedRouter: constructorArgs[5],
    initialOwner: constructorArgs[6]
  });

  const enhancedLending = await EnhancedLendingProtocol.deploy(...constructorArgs);
  await enhancedLending.waitForDeployment();
  
  const enhancedLendingAddress = await enhancedLending.getAddress();
  console.log("✅ EnhancedLendingProtocol deployed to:", enhancedLendingAddress);

  // =====================================
  // UPDATE DEPLOYED ADDRESSES
  // =====================================
  deployedAddresses.MockFeedRouter = await mockFeedRouter.getAddress();
  deployedAddresses.EnhancedLendingProtocol = enhancedLendingAddress;

  // Save updated addresses
  fs.writeFileSync(addressesPath, JSON.stringify(deployedAddresses, null, 2));
  console.log("💾 Updated addresses saved to:", addressesPath);

  // =====================================
  // UPDATE ABIs
  // =====================================
  try {
    const abisPath = path.join(__dirname, '..', 'deployedABIs.json');
    let contractABIs = {};
    
    try {
      const abisData = fs.readFileSync(abisPath, 'utf8');
      contractABIs = JSON.parse(abisData);
    } catch (error) {
      console.log("⚠️  Creating new ABIs file");
    }

    // Add new ABIs
    contractABIs.MockFeedRouter = JSON.stringify(mockFeedRouter.interface.fragments);
    contractABIs.EnhancedLendingProtocol = JSON.stringify(enhancedLending.interface.fragments);

    fs.writeFileSync(abisPath, JSON.stringify(contractABIs, null, 2));
    console.log("💾 Updated ABIs saved to:", abisPath);
  } catch (error) {
    console.warn("⚠️  Could not save ABIs:", error.message);
  }

  // =====================================
  // VERIFICATION INSTRUCTIONS
  // =====================================
  console.log("\n🔍 === VERIFICATION INSTRUCTIONS ===");
  console.log("1. Verify contracts on Kaiascan:");
  console.log(`   MockFeedRouter: https://kairos.kaiascope.com/account/${await mockFeedRouter.getAddress()}`);
  console.log(`   EnhancedLendingProtocol: https://kairos.kaiascope.com/account/${enhancedLendingAddress}`);
  
  console.log("\n2. Test basic functions:");
  console.log(`   - Register referral code`);
  console.log(`   - Deposit USDT for lending`);
  console.log(`   - Deposit KAIA as collateral`);
  console.log(`   - Borrow against collateral`);
  console.log(`   - Repay borrowed amount`);

  console.log("\n✅ ENHANCED LENDING PROTOCOL DEPLOYMENT SUCCESSFUL!");
  console.log("🔧 Ready for testing and frontend integration");

  return {
    mockFeedRouter: await mockFeedRouter.getAddress(),
    enhancedLendingProtocol: enhancedLendingAddress,
    deployedAddresses
  };
}

if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error("💥 Enhanced Lending deployment failed:", error);
      process.exit(1);
    });
}

module.exports = main;