const { ethers } = require("hardhat");

async function main() {
  console.log("🧪 KaiaPay BulkPayroll & SplitBilling Test Flow");
  console.log("==============================================");

  // Contract addresses from deployment
  const DUMMY_USDT_ADDRESS = "0xD68805CeC8704e0E262Afa2289EB298b1bD98ce8";
  const BULK_PAYROLL_ADDRESS = "0xC6D5Eca0d7390bf95e5331EbD4274D3b177961e8";
  const SPLIT_BILLING_ADDRESS = "0x2B0426A3ECE73A9E2e361f111d96bdc6b13495a3";

  const [deployer] = await ethers.getSigners();
  console.log(`💼 Deployer: ${deployer.address}`);
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

  // Check initial balance
  let balance = await dummyUSDT.balanceOf(deployer.address);
  console.log(`💰 Initial Balance: ${ethers.formatEther(balance)} DUSDT`);

  // Get tokens if needed
  if (balance < ethers.parseEther("1000")) {
    try {
      console.log("💰 Claiming faucet...");
      const faucetTx = await dummyUSDT.connect(deployer).faucet();
      await faucetTx.wait();
      console.log(`✅ Faucet claimed: ${faucetTx.hash}`);
      balance = await dummyUSDT.balanceOf(deployer.address);
    } catch (error) {
      console.log(`⚠️ Faucet claim failed: ${error.message}`);
    }
  }
  console.log(`💵 Current Balance: ${ethers.formatEther(balance)} DUSDT`);
  console.log();

  // ===============================================
  // TEST 1: BulkPayroll Contract
  // ===============================================
  console.log("🏢 TEST 1: BulkPayroll Contract");
  console.log("==============================");

  // Generate valid test addresses using ethers
  const testAddresses = {
    employee1: ethers.getAddress("0x742d35cc6634c0532925a3b8d35a0dc198c7e088"),
    employee2: ethers.getAddress("0x1234567890123456789012345678901234567890"),
    employee3: ethers.getAddress("0xabcdef1234567890abcdef1234567890abcdef12")
  };
  
  const recipients = [
    testAddresses.employee1,
    testAddresses.employee2,
    testAddresses.employee3
  ];
  
  const amounts = [
    ethers.parseEther("100"), // 100 DUSDT
    ethers.parseEther("150"), // 150 DUSDT  
    ethers.parseEther("200")  // 200 DUSDT
  ];
  const totalAmount = amounts.reduce((sum, amount) => sum + amount, 0n);
  
  console.log("👥 Payroll Details:");
  recipients.forEach((recipient, i) => {
    console.log(`  ${recipient}: ${ethers.formatEther(amounts[i])} DUSDT`);
  });
  console.log(`💰 Total: ${ethers.formatEther(totalAmount)} DUSDT`);
  console.log();

  // Approve and execute bulk payroll
  console.log("🔐 Approving BulkPayroll...");
  const approveTx = await dummyUSDT.connect(deployer).approve(BULK_PAYROLL_ADDRESS, totalAmount);
  await approveTx.wait();
  console.log(`✅ Approved: ${approveTx.hash}`);

  console.log("🚀 Executing Bulk Transfer...");
  const payrollTx = await bulkPayroll.connect(deployer).bulkTransfer(
    DUMMY_USDT_ADDRESS,
    recipients,
    amounts
  );
  const payrollReceipt = await payrollTx.wait();
  console.log(`✅ Bulk transfer complete: ${payrollTx.hash}`);
  console.log(`📦 Block: ${payrollReceipt.blockNumber}`);
  console.log();

  // ===============================================
  // TEST 2: SplitBilling Contract
  // ===============================================
  console.log("💳 TEST 2: SplitBilling Contract");
  console.log("================================");

  const splitAmount = ethers.parseEther("400");
  const splitRecipients = [
    "0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2",
    "0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db"
  ];
  const splitShares = [
    6000, // 60% (6000 basis points)
    4000  // 40% (4000 basis points) 
  ];
  const deadline = Math.floor(Date.now() / 1000) + 3600;

  console.log("🧾 Split Payment Details:");
  console.log(`💰 Total Amount: ${ethers.formatEther(splitAmount)} DUSDT`);
  console.log(`👤 Recipient 1: ${splitRecipients[0]} (${splitShares[0]/100}%)`);
  console.log(`👤 Recipient 2: ${splitRecipients[1]} (${splitShares[1]/100}%)`);
  console.log(`⏰ Deadline: ${new Date(deadline * 1000).toLocaleString()}`);
  console.log();

  // Approve and execute split payment
  console.log("🔐 Approving SplitBilling...");
  const splitApproveTx = await dummyUSDT.connect(deployer).approve(SPLIT_BILLING_ADDRESS, splitAmount);
  await splitApproveTx.wait();
  console.log(`✅ Approved: ${splitApproveTx.hash}`);

  console.log("🚀 Creating Split Payment...");
  const splitTx = await splitBilling.connect(deployer).createSplit(
    splitRecipients,
    splitShares,
    DUMMY_USDT_ADDRESS,
    deadline
  );
  const splitReceipt = await splitTx.wait();
  console.log(`✅ Split payment complete: ${splitTx.hash}`);
  console.log(`📦 Block: ${splitReceipt.blockNumber}`);
  
  // Get split ID from events
  const splitEvent = splitReceipt.logs.find(log => {
    try {
      const parsed = splitBilling.interface.parseLog(log);
      return parsed.name === 'SplitCreated';
    } catch {
      return false;
    }
  });
  
  if (splitEvent) {
    const splitId = splitBilling.interface.parseLog(splitEvent).args.splitId;
    console.log(`🆔 Split ID: ${splitId}`);
  }
  console.log();

  // ===============================================
  // SUMMARY
  // ===============================================
  console.log("🔍 KaiaScan Transaction Summary");
  console.log("==============================");
  
  console.log("🏢 BulkPayroll Transactions:");
  console.log(`  • Token Approval: ${approveTx.hash}`);
  console.log(`  • Bulk Transfer: ${payrollTx.hash}`);
  console.log(`  • Block: ${payrollReceipt.blockNumber}`);
  console.log();
  
  console.log("💳 SplitBilling Transactions:");
  console.log(`  • Token Approval: ${splitApproveTx.hash}`);
  console.log(`  • Split Creation: ${splitTx.hash}`);
  console.log(`  • Block: ${splitReceipt.blockNumber}`);
  console.log();

  console.log("🌐 KaiaScan Links:");
  console.log(`  • BulkPayroll: https://kairos.kaiascan.io/address/${BULK_PAYROLL_ADDRESS}`);
  console.log(`  • SplitBilling: https://kairos.kaiascan.io/address/${SPLIT_BILLING_ADDRESS}`);
  console.log(`  • DummyUSDT: https://kairos.kaiascan.io/address/${DUMMY_USDT_ADDRESS}`);
  console.log(`  • Deployer: https://kairos.kaiascan.io/address/${deployer.address}`);
  console.log();

  // Final balance check
  const finalBalance = await dummyUSDT.balanceOf(deployer.address);
  console.log(`💰 Final Balance: ${ethers.formatEther(finalBalance)} DUSDT`);
  console.log(`📊 Amount Used: ${ethers.formatEther(balance - finalBalance)} DUSDT`);
  console.log();

  console.log("🎉 Test Flow Complete!");
  console.log("======================");
  console.log("✅ BulkPayroll: Successfully transferred to 3 recipients");
  console.log("✅ SplitBilling: Successfully split payment between 2 recipients");
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
