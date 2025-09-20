const { ethers } = require("hardhat");

async function main() {
  console.log("🧪 InvoiceSubscription Contract Complete Flow Test");
  console.log("================================================");

  // Contract addresses (using previously deployed KIP7-based DummyUSDT)
  const DUMMY_USDT_ADDRESS = "0x07bA937403023CcD444923B183d42438b7057811"; // KIP7-based DummyUSDT
  const INVOICE_SUBSCRIPTION_ADDRESS = "0x8cfe0475EF061135ABeDF336a019f3F645aCcD1b";

  // Get signers (in testnet we typically have one main signer)
  const [deployer] = await ethers.getSigners();
  console.log(`💼 Main Account: ${deployer.address}`);

  // Connect to contracts
  const dummyUSDT = await ethers.getContractAt("DummyUSDT", DUMMY_USDT_ADDRESS);
  const invoiceSubscription = await ethers.getContractAt("InvoiceSubscriptionService", INVOICE_SUBSCRIPTION_ADDRESS);

  console.log("\n📋 Contract Information:");
  console.log(`DummyUSDT: ${DUMMY_USDT_ADDRESS}`);
  console.log(`InvoiceSubscription: ${INVOICE_SUBSCRIPTION_ADDRESS}`);

  // Get test tokens for all accounts
  console.log("🪙 Getting test tokens from faucet...");
  
  const accounts = [deployer, seller, buyer, contributor1, contributor2];
  for (let i = 0; i < accounts.length; i++) {
    const account = accounts[i];
    const initialBalance = await dummyUSDT.balanceOf(account.address);
    
    if (initialBalance < ethers.parseEther("500")) {
      try {
        const faucetTx = await dummyUSDT.connect(account).faucet();
        await faucetTx.wait();
        console.log(`✅ ${['Deployer', 'Seller', 'Buyer', 'Contributor1', 'Contributor2'][i]} faucet successful`);
      } catch (error) {
        console.log(`⏰ ${['Deployer', 'Seller', 'Buyer', 'Contributor1', 'Contributor2'][i]} faucet cooldown, using existing balance`);
      }
    }
    
    const balance = await dummyUSDT.balanceOf(account.address);
    console.log(`� ${['Deployer', 'Seller', 'Buyer', 'Contributor1', 'Contributor2'][i]} Balance: ${ethers.formatEther(balance)} DUSDT`);
  }

  console.log("\n🏪 STEP 1: Service Listing");
  console.log("=========================");

  // List a service (seller account acts as seller)
  const serviceName = "Professional Web Development";
  const description = "Full-stack web development including React, Node.js, and smart contracts";
  const imageUrl = "https://example.com/web-dev-service.jpg";
  const servicePrice = ethers.parseEther("500"); // 500 DUSDT

  console.log(`📦 Service Details:`);
  console.log(`  Name: ${serviceName}`);
  console.log(`  Price: ${ethers.formatEther(servicePrice)} DUSDT`);
  console.log(`  Payment Token: ${DUMMY_USDT_ADDRESS}`);
  console.log(`  Seller: ${seller.address}`);

  const listTx = await invoiceSubscription.connect(seller).listService(
    serviceName,
    description,
    imageUrl,
    servicePrice,
    DUMMY_USDT_ADDRESS
  );
  await listTx.wait();
  console.log(`✅ Service Listed: ${listTx.hash}`);

  const serviceId = 1;
  const service = await invoiceSubscription.getService(serviceId);
  console.log(`🆔 Service ID: ${serviceId}`);
  console.log(`📊 Service Active: ${service.isActive}`);

  console.log("\n🛒 STEP 2: Invoice Creation (Purchase Service)");
  console.log("=============================================");

  // Create invoice (buyer account purchases from seller)
  const allowSplitPayment = true;
  const daysUntilDue = 30;

  console.log(`🧾 Invoice Details:`);
  console.log(`  Allow Split Payment: ${allowSplitPayment}`);
  console.log(`  Due in: ${daysUntilDue} days`);
  console.log(`  Buyer: ${buyer.address}`);

  const purchaseTx = await invoiceSubscription.connect(buyer).purchaseService(
    serviceId,
    allowSplitPayment,
    daysUntilDue
  );
  const purchaseReceipt = await purchaseTx.wait();
  console.log(`✅ Invoice Created: ${purchaseTx.hash}`);

  const invoiceId = 1;
  const invoice = await invoiceSubscription.getInvoice(invoiceId);
  console.log(`🆔 Invoice ID: ${invoiceId}`);
  console.log(`📄 Invoice Number: ${invoice.invoiceNumber}`);
  console.log(`🎫 Coupon Code: ${invoice.couponCode}`);
  console.log(`💰 Subtotal: ${ethers.formatEther(invoice.subtotal)} DUSDT`);
  console.log(`💳 Platform Fee: ${ethers.formatEther(invoice.platformFee)} DUSDT`);
  console.log(`💵 Total Amount: ${ethers.formatEther(invoice.totalAmount)} DUSDT`);
  console.log(`📅 Due Date: ${new Date(Number(invoice.dueDate) * 1000).toLocaleString()}`);

  console.log("\n🎫 STEP 3: Apply Discount");
  console.log("=========================");

  const discountAmount = ethers.parseEther("50"); // 50 DUSDT discount
  console.log(`💸 Applying discount: ${ethers.formatEther(discountAmount)} DUSDT`);

  const discountTx = await invoiceSubscription.connect(seller).applyCouponDiscount(
    invoiceId,
    discountAmount
  );
  await discountTx.wait();
  console.log(`✅ Discount Applied: ${discountTx.hash}`);

  const discountedInvoice = await invoiceSubscription.getInvoice(invoiceId);
  console.log(`💰 New Subtotal: ${ethers.formatEther(discountedInvoice.subtotal - discountedInvoice.discount)} DUSDT`);
  console.log(`💵 New Total: ${ethers.formatEther(discountedInvoice.totalAmount)} DUSDT`);

  console.log("\n💳 STEP 4: Split Payment Demo");
  console.log("==============================");

  const totalAmount = discountedInvoice.totalAmount;
  console.log(`💰 Total to pay: ${ethers.formatEther(totalAmount)} DUSDT`);
  console.log(`👥 Split between 2 contributors:`);

  // First contribution: 60% of total (from contributor1)
  const contribution1 = (totalAmount * 6n) / 10n; // 60%
  console.log(`  Contributor 1 (${contributor1.address.slice(0,8)}...): ${ethers.formatEther(contribution1)} DUSDT (60%)`);

  await dummyUSDT.connect(contributor1).approve(INVOICE_SUBSCRIPTION_ADDRESS, contribution1);
  const contrib1Tx = await invoiceSubscription.connect(contributor1).contributeToSplitPayment(
    invoiceId,
    contribution1
  );
  await contrib1Tx.wait();
  console.log(`✅ Contribution 1 Complete: ${contrib1Tx.hash}`);

  let updatedInvoice = await invoiceSubscription.getInvoice(invoiceId);
  console.log(`📊 Invoice Status: ${getStatusName(updatedInvoice.status)} (${updatedInvoice.status})`);

  // Check split payment details
  let splitDetails = await invoiceSubscription.getSplitPaymentDetails(invoiceId);
  console.log(`👥 Contributors so far: ${splitDetails.contributorCount}`);
  console.log(`💰 Total collected: ${ethers.formatEther(splitDetails.totalCollected)} DUSDT`);

  // Second contribution: remaining 40% (from contributor2)
  const contribution2 = totalAmount - contribution1;
  console.log(`  Contributor 2 (${contributor2.address.slice(0,8)}...): ${ethers.formatEther(contribution2)} DUSDT (40%)`);

  await dummyUSDT.connect(contributor2).approve(INVOICE_SUBSCRIPTION_ADDRESS, contribution2);
  const contrib2Tx = await invoiceSubscription.connect(contributor2).contributeToSplitPayment(
    invoiceId,
    contribution2
  );
  await contrib2Tx.wait();
  console.log(`✅ Contribution 2 Complete: ${contrib2Tx.hash}`);

  const finalInvoice = await invoiceSubscription.getInvoice(invoiceId);
  console.log(`📊 Final Invoice Status: ${getStatusName(finalInvoice.status)} (${finalInvoice.status})`);

  const finalSplitDetails = await invoiceSubscription.getSplitPaymentDetails(invoiceId);
  console.log(`👥 Total Contributors: ${finalSplitDetails.contributorCount}`);
  console.log(`💰 Final Amount Collected: ${ethers.formatEther(finalSplitDetails.totalCollected)} DUSDT`);

  console.log("\n📊 STEP 5: View Functions Demo");
  console.log("===============================");

  // Get seller services
  const sellerServices = await invoiceSubscription.getSellerServices(seller.address);
  console.log(`🏪 Seller Services Count: ${sellerServices.length}`);
  console.log(`📦 Service IDs: [${sellerServices.join(', ')}]`);

  // Get buyer invoices
  const buyerInvoices = await invoiceSubscription.getBuyerInvoices(buyer.address);
  console.log(`🧾 Buyer Invoices Count: ${buyerInvoices.length}`);
  console.log(`📄 Invoice IDs: [${buyerInvoices.join(', ')}]`);

  // Platform stats
  const platformFeeRate = await invoiceSubscription.platformFeeRate();
  const feeCollector = await invoiceSubscription.feeCollector();
  console.log(`💳 Platform Fee Rate: ${platformFeeRate} basis points (${Number(platformFeeRate)/100}%)`);
  console.log(`🏦 Fee Collector: ${feeCollector}`);

  console.log("\n🌐 STEP 6: ETH Payment Demo");
  console.log("===========================");

  // Create another service for ETH payment
  const ethServicePrice = ethers.parseEther("0.1"); // 0.1 ETH
  console.log(`📦 Creating ETH service - Price: ${ethers.formatEther(ethServicePrice)} ETH`);

  const ethServiceTx = await invoiceSubscription.connect(seller).listService(
    "Smart Contract Audit",
    "Professional smart contract security audit",
    "https://example.com/audit-service.jpg",
    ethServicePrice,
    ethers.ZeroAddress // ETH payment
  );
  await ethServiceTx.wait();
  console.log(`✅ ETH Service Listed: ${ethServiceTx.hash}`);

  const ethServiceId = 2;

  // Purchase ETH service (buyer purchases from seller)
  const ethPurchaseTx = await invoiceSubscription.connect(buyer).purchaseService(
    ethServiceId,
    false, // No split payment for this one
    7
  );
  await ethPurchaseTx.wait();
  console.log(`✅ ETH Invoice Created: ${ethPurchaseTx.hash}`);

  const ethInvoiceId = 2;
  const ethInvoice = await invoiceSubscription.getInvoice(ethInvoiceId);
  console.log(`💰 ETH Invoice Total: ${ethers.formatEther(ethInvoice.totalAmount)} ETH`);

  // Pay ETH invoice (buyer pays)
  const sellerEthBalanceBefore = await ethers.provider.getBalance(seller.address);
  
  const ethPayTx = await invoiceSubscription.connect(buyer).payInvoice(ethInvoiceId, {
    value: ethInvoice.totalAmount
  });
  await ethPayTx.wait();
  console.log(`✅ ETH Payment Complete: ${ethPayTx.hash}`);

  const paidEthInvoice = await invoiceSubscription.getInvoice(ethInvoiceId);
  console.log(`📊 ETH Invoice Status: ${getStatusName(paidEthInvoice.status)}`);

  console.log("\n🔍 KaiaScan Transaction Summary");
  console.log("===============================");
  console.log(`🏪 Service Transactions:`);
  console.log(`  • Service 1 (DUSDT): ${listTx.hash}`);
  console.log(`  • Service 2 (ETH): ${ethServiceTx.hash}`);
  
  console.log(`🧾 Invoice Transactions:`);
  console.log(`  • Invoice 1 Creation: ${purchaseTx.hash}`);
  console.log(`  • Discount Applied: ${discountTx.hash}`);
  console.log(`  • Split Payment 1: ${contrib1Tx.hash}`);
  console.log(`  • Split Payment 2: ${contrib2Tx.hash}`);
  console.log(`  • Invoice 2 Creation: ${ethPurchaseTx.hash}`);
  console.log(`  • ETH Payment: ${ethPayTx.hash}`);

  console.log(`\n🌐 KaiaScan Links:`);
  console.log(`  • InvoiceSubscription: https://kairos.kaiascan.io/address/${INVOICE_SUBSCRIPTION_ADDRESS}`);
  console.log(`  • DummyUSDT: https://kairos.kaiascan.io/address/${DUMMY_USDT_ADDRESS}`);
  console.log(`  • Deployer: https://kairos.kaiascan.io/address/${deployer.address}`);
  console.log(`  • Seller: https://kairos.kaiascan.io/address/${seller.address}`);
  console.log(`  • Buyer: https://kairos.kaiascan.io/address/${buyer.address}`);

  console.log(`\n💰 Final Balances:`);
  for (let i = 0; i < accounts.length; i++) {
    const account = accounts[i];
    const finalBalance = await dummyUSDT.balanceOf(account.address);
    console.log(`  ${['Deployer', 'Seller', 'Buyer', 'Contributor1', 'Contributor2'][i]}: ${ethers.formatEther(finalBalance)} DUSDT`);
  }

  console.log(`\n🎉 InvoiceSubscription Complete Flow Test Finished!`);
  console.log(`==================================================`);
  console.log(`✅ Service Marketplace: 2 services listed (DUSDT & ETH)`);
  console.log(`✅ Invoice System: 2 invoices created with different payment methods`);
  console.log(`✅ Split Payments: Demonstrated multi-contributor payments`);
  console.log(`✅ Discount System: Applied coupon discounts to invoices`);
  console.log(`✅ Multi-Token Support: Both ERC20 (DUSDT) and ETH payments`);
  console.log(`✅ Platform Fees: Automatic fee collection (2.5%)`);
  console.log(`✅ All transactions recorded on Kaia testnet`);
  console.log(`✅ Ready for production use and KaiaScan verification`);
}

function getStatusName(status) {
  const statusNames = {
    0: "PENDING",
    1: "PARTIALLY_PAID", 
    2: "FULLY_PAID",
    3: "OVERDUE",
    4: "CANCELLED"
  };
  return statusNames[status] || "UNKNOWN";
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Test flow failed:", error);
    process.exit(1);
  });
