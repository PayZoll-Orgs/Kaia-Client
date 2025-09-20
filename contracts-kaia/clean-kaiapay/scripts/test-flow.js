const { ethers } = require("hardhat");

async function main() {
  console.log("🧪 KaiaPay BulkPayroll & SplitBilling Test Flow");
  console.log("==============================================");

  // Contract addresses from deployment
  const DUMMY_USDT_ADDRESS = "0xD68805CeC8704e0E262Afa2289EB298b1bD98ce8";
  const BULK_PAYROLL_ADDRESS = "0xC6D5Eca0d7390bf95e5331EbD4274D3b177961e8";
  const SPLIT_BILLING_ADDRESS = "0x2B0426A3ECE73A9E2e361f111d96bdc6b13495a3";

  const signers = await ethers.getSigners();
  const [deployer] = signers;
  
  console.log(`💼 Deployer: ${deployer.address}`);
  console.log(`👥 Available Signers: ${signers.length}`);
  
  // For testing, we'll use the deployer as multiple test accounts
  // In a real scenario, you'd have multiple accounts
  const employee1 = deployer;
  const employee2 = deployer; 
  const employee3 = deployer;
  const payer1 = deployer;
  const payer2 = deployer;
  
  console.log(`📝 Note: Using deployer address for all test accounts in this demo`);
  console.log();

  // Get contract instances
  const dummyUSDT = await ethers.getContractAt("DummyUSDT", DUMMY_USDT_ADDRESS);
  const bulkPayroll = await ethers.getContractAt("BulkPayroll", BULK_PAYROLL_ADDRESS);
  const splitBilling = await ethers.getContractAt("SplitBilling", SPLIT_BILLING_ADDRESS);

  console.log("📋 Contract Information:");
  console.log(`DummyUSDT: ${DUMMY_USDT_ADDRESS}`);
  console.log(`BulkPayroll: ${BULK_PAYROLL_ADDRESS}`);
  console.log(`SplitBilling: ${SPLIT_BILLING_ADDRESS}`);
  console.log();

  // ===============================================
  // STEP 1: Get tokens from faucet for all users
  // ===============================================
  console.log("💰 Step 1: Getting tokens from DummyUSDT faucet...");
  
  const accounts = [deployer, employee1, employee2, employee3, payer1, payer2];
  
  for (let i = 0; i < accounts.length; i++) {
    const account = accounts[i];
    try {
      console.log(`  Claiming faucet for ${account.address}...`);
      const tx = await dummyUSDT.connect(account).faucet();
      const receipt = await tx.wait();
      console.log(`  ✅ Faucet claimed: ${receipt.hash}`);
      
      const balance = await dummyUSDT.balanceOf(account.address);
      console.log(`  💵 Balance: ${ethers.formatEther(balance)} DUSDT`);
    } catch (error) {
      console.log(`  ⚠️ Faucet claim failed (may be in cooldown): ${error.message}`);
      const balance = await dummyUSDT.balanceOf(account.address);
      console.log(`  💵 Current Balance: ${ethers.formatEther(balance)} DUSDT`);
    }
    console.log();
  }

  // ===============================================
  // STEP 2: Test BulkPayroll Contract
  // ===============================================
  console.log("🏢 Step 2: Testing BulkPayroll Contract");
  console.log("======================================");

  // Prepare payroll data - using deployer address as multiple recipients for demo
  const recipients = [
    "0x742d35Cc6634C0532925a3b8D35a0dc198c7E088", // Example employee 1
    "0x8ba1f109551bD432803012645Hac136c99c42842", // Example employee 2 
    "0x1234567890123456789012345678901234567890"  // Example employee 3
  ];
  const amounts = [
    ethers.parseEther("100"), // Employee 1: 100 DUSDT
    ethers.parseEther("150"), // Employee 2: 150 DUSDT  
    ethers.parseEther("200")  // Employee 3: 200 DUSDT
  ];
  const totalAmount = amounts.reduce((sum, amount) => sum + amount, 0n);
  
  console.log("👥 Payroll Details:");
  recipients.forEach((recipient, i) => {
    console.log(`  ${recipient}: ${ethers.formatEther(amounts[i])} DUSDT`);
  });
  console.log(`  💰 Total Amount: ${ethers.formatEther(totalAmount)} DUSDT`);
  console.log();

  // Check deployer balance
  let deployerBalance = await dummyUSDT.balanceOf(deployer.address);
  console.log(`💼 Deployer Balance: ${ethers.formatEther(deployerBalance)} DUSDT`);

  if (deployerBalance < totalAmount) {
    console.log("❌ Insufficient balance for payroll. Need more tokens!");
    return;
  }

  // Approve BulkPayroll to spend tokens
  console.log("🔐 Approving BulkPayroll contract to spend tokens...");
  const approveTx = await dummyUSDT.connect(deployer).approve(BULK_PAYROLL_ADDRESS, totalAmount);
  console.log(`  📝 Approval TX: ${approveTx.hash}`);
  await approveTx.wait();
  console.log("  ✅ Approval confirmed");
  console.log();

  // Execute bulk payroll
  console.log("🚀 Executing Bulk Payroll...");
  const payrollTx = await bulkPayroll.connect(deployer).bulkTransfer(
    DUMMY_USDT_ADDRESS,
    recipients,
    amounts
  );
  console.log(`  📝 Payroll TX: ${payrollTx.hash}`);
  const payrollReceipt = await payrollTx.wait();
  console.log(`  ✅ Payroll completed in block: ${payrollReceipt.blockNumber}`);
  console.log();

  // Verify employee balances
  console.log("✅ Verifying Employee Balances:");
  for (let i = 0; i < recipients.length; i++) {
    const balance = await dummyUSDT.balanceOf(recipients[i]);
    console.log(`  ${recipients[i]}: ${ethers.formatEther(balance)} DUSDT`);
  }
  console.log();

  // ===============================================
  // STEP 3: Test SplitBilling Contract  
  // ===============================================
  console.log("💳 Step 3: Testing SplitBilling Contract");
  console.log("=======================================");

  // SplitBilling scenario: Company pays 500 DUSDT, split between 2 partners
  const splitTotalAmount = ethers.parseEther("500");
  const splitRecipients = [
    "0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2", // Example payer 1
    "0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db"  // Example payer 2
  ];
  const splitAmounts = [
    ethers.parseEther("180"), // Payer 1: 180 DUSDT (60%)
    ethers.parseEther("120")  // Payer 2: 120 DUSDT (40%)
  ];
  const deadline = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now

  console.log("🧾 Split Bill Details:");
  console.log(`  📍 Merchant: ${deployer.address}`);
  console.log(`  💰 Total Bill: ${ethers.formatEther(billAmount)} DUSDT`);
  splitRecipients.forEach((recipient, i) => {
    console.log(`  👤 ${recipient}: ${ethers.formatEther(splitAmounts[i])} DUSDT`);
  });
  console.log(`  ⏰ Deadline: ${new Date(deadline * 1000).toLocaleString()}`);
  console.log();

  // Create split billing request
  console.log("📝 Creating Split Billing Request...");
  const requestTx = await splitBilling.connect(deployer).createSplit(
    splitRecipients,
    splitAmounts,
    DUMMY_USDT_ADDRESS,
    deadline
  );
  console.log(`  📝 Request TX: ${requestTx.hash}`);
  const requestReceipt = await requestTx.wait();
  console.log(`  ✅ Split request created in block: ${requestReceipt.blockNumber}`);

  // Get the request ID from events
  const requestEvent = requestReceipt.logs.find(log => {
    try {
      const parsed = splitBilling.interface.parseLog(log);
      return parsed.name === 'SplitRequestCreated';
    } catch {
      return false;
    }
  });
  
  const requestId = splitBilling.interface.parseLog(requestEvent).args.requestId;
  console.log(`  🆔 Split Request ID: ${requestId}`);
  console.log();

  // For demo purposes, deployer will pay both split amounts
  console.log("💸 Processing Split Payments (Deployer paying both amounts for demo)...");
  
  const totalSplitAmount = splitAmounts.reduce((sum, amount) => sum + amount, 0n);
  
  // Approve total split amount
  console.log(`  � Approving total split amount: ${ethers.formatEther(totalSplitAmount)} DUSDT...`);
  const splitApprove = await dummyUSDT.connect(deployer).approve(SPLIT_BILLING_ADDRESS, totalSplitAmount);
  await splitApprove.wait();
  console.log(`    � Approval TX: ${splitApprove.hash}`);

  // Contribute for payer 1
  console.log(`  💰 Contributing for Payer 1: ${ethers.formatEther(splitAmounts[0])} DUSDT...`);
  const payer1Pay = await splitBilling.connect(deployer).contributeSplit(requestId, splitAmounts[0]);
  await payer1Pay.wait();
  console.log(`    � Payment TX: ${payer1Pay.hash}`);

  // Contribute for payer 2  
  console.log(`  💰 Contributing for Payer 2: ${ethers.formatEther(splitAmounts[1])} DUSDT...`);
  const payer2Pay = await splitBilling.connect(deployer).contributeSplit(requestId, splitAmounts[1]);
  await payer2Pay.wait();
  console.log(`    � Payment TX: ${payer2Pay.hash}`);
  console.log(`    ✅ All split contributions completed`);
  console.log();

  // Check split request status
  console.log("📊 Checking Split Request Status...");
  const splitRequest = await splitBilling.splitRequests(requestId);
  console.log(`  💰 Total Collected: ${ethers.formatEther(splitRequest.totalCollected)} DUSDT`);
  console.log(`  💰 Required Amount: ${ethers.formatEther(splitRequest.totalAmount)} DUSDT`);
  console.log(`  ✅ Completed: ${splitRequest.completed}`);
  console.log();

  // Merchant claims the collected funds
  console.log("💼 Merchant Claiming Split Payment...");
  const claimTx = await splitBilling.connect(deployer).claimSplit(requestId);
  const claimReceipt = await claimTx.wait();
  console.log(`  📝 Claim TX: ${claimTx.hash}`);
  console.log(`  ✅ Split payment claimed in block: ${claimReceipt.blockNumber}`);
  console.log();

  // ===============================================
  // STEP 4: Final Balance Check
  // ===============================================
  console.log("📊 Final Balance Summary");
  console.log("=======================");

  const finalBalances = [];
  const allAccounts = [
    { name: "Deployer", address: deployer.address },
    { name: "Employee 1", address: employee1.address },
    { name: "Employee 2", address: employee2.address },
    { name: "Employee 3", address: employee3.address },
    { name: "Payer 1", address: payer1.address },
    { name: "Payer 2", address: payer2.address }
  ];

  for (const account of allAccounts) {
    const balance = await dummyUSDT.balanceOf(account.address);
    finalBalances.push({ ...account, balance: ethers.formatEther(balance) });
    console.log(`${account.name}: ${ethers.formatEther(balance)} DUSDT`);
  }
  console.log();

  // ===============================================
  // STEP 5: Transaction Summary for KaiaScan
  // ===============================================
  console.log("🔍 KaiaScan Transaction Summary");
  console.log("==============================");
  console.log("📋 Key Transactions to Verify:");
  console.log();
  
  console.log("🏢 BulkPayroll Operations:");
  console.log(`  • Approval: ${approveTx.hash}`);
  console.log(`  • Payroll Execution: ${payrollTx.hash}`);
  console.log(`  • Block: ${payrollReceipt.blockNumber}`);
  console.log();
  
  console.log("💳 SplitBilling Operations:");
  console.log(`  • Split Request Creation: ${requestTx.hash}`);
  console.log(`  • Split Payment Approval: ${splitApprove.hash}`);
  console.log(`  • Payer 1 Payment: ${payer1Pay.hash}`);
  console.log(`  • Payer 2 Payment: ${payer2Pay.hash}`);
  console.log(`  • Merchant Claim: ${claimTx.hash}`);
  console.log(`  • Split Request ID: ${requestId}`);
  console.log();

  console.log("🌐 KaiaScan Links:");
  console.log(`  • BulkPayroll: https://kairos.kaiascan.io/address/${BULK_PAYROLL_ADDRESS}`);
  console.log(`  • SplitBilling: https://kairos.kaiascan.io/address/${SPLIT_BILLING_ADDRESS}`);
  console.log(`  • DummyUSDT: https://kairos.kaiascan.io/address/${DUMMY_USDT_ADDRESS}`);
  console.log();

  console.log("🎉 Test Flow Complete!");
  console.log("=====================");
  console.log("✅ BulkPayroll: Successfully processed 3 employee payments");
  console.log("✅ SplitBilling: Successfully processed split payment between 2 payers");
  console.log("✅ All transactions recorded on Kaia testnet");
  console.log("✅ Ready for KaiaScan verification");
}

if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error("❌ Test flow failed:", error);
      process.exit(1);
    });
}

module.exports = main;
