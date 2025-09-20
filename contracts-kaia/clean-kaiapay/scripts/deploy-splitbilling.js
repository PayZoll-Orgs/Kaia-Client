const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying SplitBilling...");
  
  // Get deployer
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  
  // Deploy SplitBilling
  const SplitBilling = await ethers.getContractFactory("SplitBilling");
  const splitBilling = await SplitBilling.deploy();
  
  await splitBilling.waitForDeployment();
  const address = await splitBilling.getAddress();
  
  console.log("✅ SplitBilling deployed to:", address);
  
  // Verify deployment
  const maxRecipients = await splitBilling.MAX_RECIPIENTS();
  const gasLimit = await splitBilling.GAS_LIMIT();
  const ethToken = await splitBilling.ETH_TOKEN();
  
  console.log("\n📋 Contract Details:");
  console.log(`Deployer: ${deployer.address}`);
  console.log(`Max Recipients: ${maxRecipients}`);
  console.log(`Gas Limit: ${gasLimit}`);
  console.log(`ETH Token Address: ${ethToken}`);
  console.log("🔧 Features: Individual payments, deadline management, ETH & ERC20 support");
  
  return address;
}

if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = main;
