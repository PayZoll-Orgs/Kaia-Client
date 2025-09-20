const { ethers } = require("hardhat");

// Import individual deployment scripts
const deployDummyUSDT = require("./deploy-dummyusdt");
const deployBulkPayroll = require("./deploy-bulkpayroll");
const deploySplitBilling = require("./deploy-splitbilling");
const deployInvoiceSubscription = require("./deploy-invoicesubscription");

async function main() {
  console.log("🌟 KaiaPay Complete Deployment Script");
  console.log("=====================================\n");
  
  const [deployer] = await ethers.getSigners();
  console.log("💼 Deployer address:", deployer.address);
  
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💰 Deployer balance:", ethers.formatEther(balance), "KAIA");
  
  if (balance < ethers.parseEther("0.1")) {
    console.log("⚠️  Warning: Low balance. Get KAIA from faucet: https://kairos.wallet.klaytn.foundation/");
  }
  
  console.log("\n🚀 Starting deployment sequence...\n");
  
  try {
    // Deploy all contracts
    console.log("1️⃣ Deploying DummyUSDT...");
    const dummyUSDTAddress = await deployDummyUSDT();
    console.log("");
    
    console.log("2️⃣ Deploying BulkPayroll...");
    const bulkPayrollAddress = await deployBulkPayroll();
    console.log("");
    
    console.log("3️⃣ Deploying SplitBilling...");
    const splitBillingAddress = await deploySplitBilling();
    console.log("");
    
    console.log("4️⃣ Deploying InvoiceSubscription...");
    const invoiceSubscriptionAddress = await deployInvoiceSubscription();
    console.log("");
    
    // Summary
    console.log("🎉 DEPLOYMENT COMPLETE!");
    console.log("========================\n");
    
    console.log("📋 Contract Addresses:");
    console.log(`DummyUSDT:           ${dummyUSDTAddress}`);
    console.log(`BulkPayroll:         ${bulkPayrollAddress}`);
    console.log(`SplitBilling:        ${splitBillingAddress}`);
    console.log(`InvoiceSubscription: ${invoiceSubscriptionAddress}`);
    
    console.log("\n📖 Next Steps:");
    console.log("1. Copy these addresses to your .env file");
    console.log("2. Run simulation: npm run simulate");
    console.log("3. Set up Chainlink Automation for InvoiceSubscription");
    console.log("4. Use DummyUSDT faucet for testing: contract.faucet()");
    
    // Save addresses to file for easy access
    const deploymentInfo = {
      network: "kairos",
      timestamp: new Date().toISOString(),
      deployer: deployer.address,
      contracts: {
        DummyUSDT: dummyUSDTAddress,
        BulkPayroll: bulkPayrollAddress,
        SplitBilling: splitBillingAddress,
        InvoiceSubscription: invoiceSubscriptionAddress
      }
    };
    
    const fs = require('fs');
    fs.writeFileSync('deployment-addresses.json', JSON.stringify(deploymentInfo, null, 2));
    console.log("\n💾 Addresses saved to: deployment-addresses.json");
    
  } catch (error) {
    console.error("❌ Deployment failed:", error.message);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
