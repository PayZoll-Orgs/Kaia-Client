const { ethers } = require("hardhat");

async function main() {
  console.log("=== Deploying Simplified RWA Lending Platform ===");
  
  const [deployer] = await ethers.getSigners();
  console.log("Deployer:", deployer.address);
  
  // Get existing deployment data
  const deploymentData = require('../deployment-info.json');
  const contracts = deploymentData.contracts;
  
  console.log("Existing tokens will be reused:");
  console.log("- Gold:", contracts.tokenizedGold);
  
  // Deploy simplified lending platform
  console.log("\n🏦 Deploying Simplified RWA Lending Platform...");
  const SimplifiedRWALending = await ethers.getContractFactory("SimplifiedRWALending");
  const lendingPlatform = await SimplifiedRWALending.deploy();
  await lendingPlatform.waitForDeployment();
  
  const platformAddress = await lendingPlatform.getAddress();
  console.log("   ✅ Simplified RWA Lending Platform deployed to:", platformAddress);
  
  // Configure gold asset
  console.log("\n⚙️  Configuring Gold Asset...");
  await lendingPlatform.addAsset(
    contracts.tokenizedGold,
    7500,   // 75% base LTV
    8500,   // 85% liquidation threshold
    false,  // canBorrow
    true    // canCollateralize
  );
  console.log("   ✅ Gold configured");
  
  // Test deposit
  console.log("\n🔧 Testing Deposit Function...");
  const goldToken = await ethers.getContractAt("TokenizedGold", contracts.tokenizedGold);
  
  try {
    const balance = await goldToken.balanceOf(deployer.address);
    console.log("   Current gold balance:", ethers.formatEther(balance));
    
    if (balance > 0) {
      const depositAmount = ethers.parseEther("0.1");
      
      // Approve
      console.log("   Approving tokens...");
      const approveTx = await goldToken.approve(platformAddress, depositAmount);
      await approveTx.wait();
      console.log("   ✅ Approval successful");
      
      // Deposit
      console.log("   Attempting deposit...");
      const depositTx = await lendingPlatform.deposit(contracts.tokenizedGold, depositAmount);
      await depositTx.wait();
      console.log("   ✅ Deposit successful!");
      
      // Check new balance
      const newBalance = await goldToken.balanceOf(deployer.address);
      console.log("   New gold balance:", ethers.formatEther(newBalance));
      
      // Check user deposit
      const userDeposit = await lendingPlatform.getUserDeposit(deployer.address, contracts.tokenizedGold);
      console.log("   User deposit in platform:", ethers.formatEther(userDeposit));
      
      // Check platform total deposits
      const assetConfig = await lendingPlatform.assets(contracts.tokenizedGold);
      console.log("   Platform total deposits:", ethers.formatEther(assetConfig[5]));
    }
  } catch (e) {
    console.log("   ❌ Deposit test failed:", e.message);
  }
  
  // Save deployment info
  const fs = require('fs');
  const updatedDeployment = {
    ...deploymentData,
    contracts: {
      ...contracts,
      simplifiedLendingPlatform: platformAddress,
      originalLendingPlatform: contracts.lendingPlatform
    },
    simplifiedVersion: true,
    deployedAt: new Date().toISOString(),
    notes: "Simplified version without complex price feeds for testing basic functionality"
  };
  
  fs.writeFileSync('../deployment-info-simplified.json', JSON.stringify(updatedDeployment, null, 2));
  console.log("\n✅ Deployment info saved to deployment-info-simplified.json");
  console.log("\n🎉 Simplified deployment completed successfully!");
}

main().catch(console.error);