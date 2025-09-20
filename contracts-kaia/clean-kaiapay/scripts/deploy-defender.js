const deployDummyUSDT = require('./deploy-dummyusdt');
const deployBulkPayroll = require('./deploy-bulkpayroll');
const deploySplitBilling = require('./deploy-splitbilling');
const deployInvoiceSubscription = require('./deploy-invoicesubscription-defender');
const fs = require('fs');
const path = require('path');

async function main() {
  console.log("🌟 KaiaPay Complete Deployment Script (Defender Edition)");
  console.log("=====================================================");

  const [deployer] = await ethers.getSigners();
  const balance = await ethers.provider.getBalance(deployer.address);
  
  console.log(`💼 Deployer address: ${deployer.address}`);
  console.log(`💰 Deployer balance: ${ethers.formatEther(balance)} KAIA\n`);

  console.log("🚀 Starting deployment sequence...\n");

  // Object to store all contract addresses
  const contractAddresses = {};

  try {
    // 1. Deploy DummyUSDT
    console.log("1️⃣ Deploying DummyUSDT...");
    contractAddresses.DummyUSDT = await deployDummyUSDT();
    console.log();

    // 2. Deploy BulkPayroll
    console.log("2️⃣ Deploying BulkPayroll...");
    contractAddresses.BulkPayroll = await deployBulkPayroll();
    console.log();

    // 3. Deploy SplitBilling
    console.log("3️⃣ Deploying SplitBilling...");
    contractAddresses.SplitBilling = await deploySplitBilling();
    console.log();

    // 4. Deploy InvoiceSubscription (Defender Edition)
    console.log("4️⃣ Deploying InvoiceSubscription (Defender Edition)...");
    contractAddresses.InvoiceSubscription = await deployInvoiceSubscription();
    console.log();

    // Save addresses to file
    const addressesFile = path.join(__dirname, '..', 'deployment-addresses-defender.json');
    const deploymentData = {
      network: 'kaia-testnet',
      chainId: 1001,
      timestamp: new Date().toISOString(),
      deployer: deployer.address,
      contracts: contractAddresses
    };

    fs.writeFileSync(addressesFile, JSON.stringify(deploymentData, null, 2));

    console.log("🎉 DEPLOYMENT COMPLETE (DEFENDER EDITION)!");
    console.log("==========================================");
    console.log();
    console.log("📋 Contract Addresses:");
    console.log(`DummyUSDT:           ${contractAddresses.DummyUSDT}`);
    console.log(`BulkPayroll:         ${contractAddresses.BulkPayroll}`);
    console.log(`SplitBilling:        ${contractAddresses.SplitBilling}`);
    console.log(`InvoiceSubscription: ${contractAddresses.InvoiceSubscription}`);
    console.log();
    console.log("🛡️ OpenZeppelin Defender Setup:");
    console.log("================================");
    console.log("📌 Primary Target Contract:", contractAddresses.InvoiceSubscription);
    console.log("🔧 Automation Functions:");
    console.log("  • getInvoicesNeedingProcessing()");
    console.log("  • processInvoices(invoiceIds[])");
    console.log("  • refundExpiredInvoices(invoiceIds[])");
    console.log();
    console.log("📖 Next Steps:");
    console.log("1. Set up Defender Relayer for Kaia testnet");
    console.log("2. Import contract into Defender Address Book");
    console.log("3. Grant DEFENDER_ROLE to Relayer address");
    console.log("4. Configure Monitor for contract events");
    console.log("5. Deploy Autotask with automation logic");
    console.log("6. Test automation with sample invoices");
    console.log();
    console.log("💾 Addresses saved to: deployment-addresses-defender.json");
    console.log("📚 See DEFENDER_AUTOTASKS_GUIDE.md for complete setup instructions");

  } catch (error) {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  }
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
