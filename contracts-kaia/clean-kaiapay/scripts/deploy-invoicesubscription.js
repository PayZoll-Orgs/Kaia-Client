const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying InvoiceSubscription...");
  
  // Get deployer
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  
  // Deploy InvoiceSubscription (fee collector is deployer for now)
  const InvoiceSubscription = await ethers.getContractFactory("InvoiceSubscriptionService");
  const invoiceSubscription = await InvoiceSubscription.deploy(deployer.address);
  
  await invoiceSubscription.waitForDeployment();
  const address = await invoiceSubscription.getAddress();
  
  console.log("✅ InvoiceSubscription deployed to:", address);
  
  // Verify deployment
  const owner = await invoiceSubscription.owner();
  const feeCollector = await invoiceSubscription.feeCollector();
  const platformFeeRate = await invoiceSubscription.platformFeeRate();
  
  console.log("\n📋 Contract Details:");
  console.log(`Owner: ${owner}`);
  console.log(`Fee Collector: ${feeCollector}`);
  console.log(`Platform Fee Rate: ${platformFeeRate} basis points (${Number(platformFeeRate)/100}%)`);
  console.log("🔧 Features:");
  console.log("  • Service listing marketplace");
  console.log("  • Invoice creation and payment"); 
  console.log("  • Split payment support");
  console.log("  • ETH and ERC20 token payments");
  console.log("  • Refund mechanism for expired invoices");
  
  console.log("\n🤖 Chainlink Automation Setup:");
  console.log("📌 Contract Address:", address);
  console.log("🔍 Use this address in Chainlink Automation UI");
  console.log("⚙️  Functions: checkUpkeep() and performUpkeep()");
  
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
