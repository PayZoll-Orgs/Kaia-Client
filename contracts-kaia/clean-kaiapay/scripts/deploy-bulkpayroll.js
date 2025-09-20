const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying BulkPayroll...");
  
  // Get deployer
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  
  // Deploy BulkPayroll
  const BulkPayroll = await ethers.getContractFactory("BulkPayroll");
  const bulkPayroll = await BulkPayroll.deploy();
  
  await bulkPayroll.waitForDeployment();
  const address = await bulkPayroll.getAddress();
  
  console.log("✅ BulkPayroll deployed to:", address);
  
  // Verify deployment
  const owner = await bulkPayroll.owner();
  const maxRecipients = await bulkPayroll.MAX_RECIPIENTS();
  const gasLimit = await bulkPayroll.GAS_LIMIT();
  
  console.log("\n📋 Contract Details:");
  console.log(`Owner: ${owner}`);
  console.log(`Max Recipients: ${maxRecipients}`);
  console.log(`Gas Limit: ${gasLimit}`);
  console.log("🔧 Features: Failure isolation, gas limit protection, excess refund");
  
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
