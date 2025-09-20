const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying InvoiceSubscription with Defender Autotasks...");

  const [deployer] = await ethers.getSigners();
  console.log(`Deploying with account: ${deployer.address}`);

  // Deploy InvoiceSubscription
  const InvoiceSubscription = await ethers.getContractFactory("InvoiceSubscription");
  const invoiceSubscription = await InvoiceSubscription.deploy();
  
  await invoiceSubscription.waitForDeployment();
  const contractAddress = await invoiceSubscription.getAddress();
  
  console.log(`✅ InvoiceSubscription deployed to: ${contractAddress}`);

  // Verify deployment
  const hasAdminRole = await invoiceSubscription.hasRole(
    await invoiceSubscription.DEFAULT_ADMIN_ROLE(), 
    deployer.address
  );
  const hasDefenderRole = await invoiceSubscription.hasRole(
    await invoiceSubscription.DEFENDER_ROLE(), 
    deployer.address
  );
  const isPaused = await invoiceSubscription.paused();
  
  console.log("\n📋 Contract Details:");
  console.log(`Admin: ${deployer.address} (has admin role: ${hasAdminRole})`);
  console.log(`Defender: ${deployer.address} (has defender role: ${hasDefenderRole})`);
  console.log(`Paused: ${isPaused}`);
  console.log("🔧 Features:");
  console.log("  • Invoice creation and funding");
  console.log("  • EIP-712 subscription signatures");
  console.log("  • Automatic escrow release via Defender Autotasks");
  console.log("  • Batch processing for efficiency");
  console.log("  • Emergency pause mechanism");
  console.log("  • Role-based access control");

  console.log("\n🤖 Defender Setup Required:");
  console.log("📌 Contract Address:", contractAddress);
  console.log("🔍 Key Functions for Autotasks:");
  console.log("  • getInvoicesNeedingProcessing() - View function");
  console.log("  • processInvoices(invoiceIds[]) - Release payments");
  console.log("  • refundExpiredInvoices(invoiceIds[]) - Process refunds");
  console.log("  • emergencyPause() - Emergency stop");
  
  console.log("\n⚙️ Next Steps:");
  console.log("1. Set up Defender Relayer on Kaia testnet");
  console.log("2. Grant DEFENDER_ROLE to Relayer address");
  console.log("3. Configure Monitor for contract events");
  console.log("4. Deploy Autotask with automation logic");
  console.log("5. Test with sample invoices");

  return contractAddress;
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
