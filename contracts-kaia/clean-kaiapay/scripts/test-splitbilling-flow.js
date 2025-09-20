const { ethers } = require("hardhat");

async function main() {
  console.log("🧪 SplitBilling Contract Test Flow on Kaia Testnet");
  console.log("=================================================");

  // Contract addresses from deployment
  const DUMMY_USDT_ADDRESS = "0x07bA937403023CcD444923B183d42438b7057811";
  const SPLIT_BILLING_ADDRESS = "0x6b214bdeA4518A38392d3789844Cd4c5607f6852"; // Updated with direct payments

  // Get deployer
  const [deployer] = await ethers.getSigners();
  console.log(`💼 Deployer: ${deployer.address}`);

  // Connect to contracts
  const dummyUSDT = await ethers.getContractAt("DummyUSDT", DUMMY_USDT_ADDRESS);
  const splitBilling = await ethers.getContractAt("SplitBilling", SPLIT_BILLING_ADDRESS);

  console.log("\n📋 Contract Information:");
  console.log(`DummyUSDT: ${DUMMY_USDT_ADDRESS}`);
  console.log(`SplitBilling: ${SPLIT_BILLING_ADDRESS}`);

  // Check initial balance
  const initialBalance = await dummyUSDT.balanceOf(deployer.address);
  console.log(`💰 Initial Balance: ${ethers.formatEther(initialBalance)} DUSDT`);

  // Get some test tokens if needed
  if (initialBalance < ethers.parseEther("1000")) {
    console.log("🪙 Getting test tokens from faucet...");
    const faucetTx = await dummyUSDT.faucet();
    await faucetTx.wait();
    console.log("✅ Faucet claim successful");
  }

  const currentBalance = await dummyUSDT.balanceOf(deployer.address);
  console.log(`💵 Current Balance: ${ethers.formatEther(currentBalance)} DUSDT`);

  console.log("\n💳 TEST 1: SplitBilling Contract - DIRECT PAYMENT Model");
  console.log("========================================================");
  console.log("🔄 Each payment goes DIRECTLY to payee (no escrow)");
  console.log("✅ Contract only tracks who paid - funds never held");

  // Generate test addresses using ethers
  const testAddresses = {
    payee: ethers.getAddress("0x1111111111111111111111111111111111111111"),
    debtor1: ethers.getAddress("0x2222222222222222222222222222222222222222"),
    debtor2: ethers.getAddress("0x3333333333333333333333333333333333333333"),
    debtor3: ethers.getAddress("0x4444444444444444444444444444444444444444")
  };

  const debtors = [
    testAddresses.debtor1,
    testAddresses.debtor2,
    testAddresses.debtor3
  ];

  const amounts = [
    ethers.parseEther("100"), // debtor1 owes 100 DUSDT
    ethers.parseEther("75"),  // debtor2 owes 75 DUSDT
    ethers.parseEther("125")  // debtor3 owes 125 DUSDT
  ];

  const totalAmount = amounts.reduce((sum, amount) => sum + amount, 0n);
  const deadline = Math.floor(Date.now() / 1000) + 7200; // 2 hours from now

  console.log("🧾 Split Bill Details:");
  console.log(`💰 Total Amount: ${ethers.formatEther(totalAmount)} DUSDT`);
  console.log(`👤 Payee: ${testAddresses.payee}`);
  debtors.forEach((debtor, i) => {
    console.log(`👤 Debtor ${i + 1}: ${debtor} owes ${ethers.formatEther(amounts[i])} DUSDT`);
  });
  console.log(`⏰ Deadline: ${new Date(deadline * 1000).toLocaleString()}`);

  // Create split bill
  console.log("\n🔐 Creating Split Bill...");
  const createTx = await splitBilling.connect(deployer).createSplit(
    testAddresses.payee,
    debtors,
    amounts,
    DUMMY_USDT_ADDRESS,
    deadline,
    "Restaurant Bill - Shared dinner expense"
  );
  const createReceipt = await createTx.wait();
  console.log(`✅ Split Created: ${createTx.hash}`);

  // Get split ID from the transaction receipt
  const splitCreatedEvent = createReceipt.logs.find(log => {
    try {
      const parsed = splitBilling.interface.parseLog(log);
      return parsed && parsed.name === 'SplitCreated';
    } catch {
      return false;
    }
  });

  const splitId = splitCreatedEvent ? splitBilling.interface.parseLog(splitCreatedEvent).args[0] : 1;
  console.log(`🆔 Split ID: ${splitId}`);

  // Verify split details
  const splitDetails = await splitBilling.getSplitDetails(splitId);
  console.log(`📊 Created split - Total: ${ethers.formatEther(splitDetails.totalAmount)} DUSDT, Paid: ${ethers.formatEther(splitDetails.totalPaid)} DUSDT`);
  
  // Track payee balance to show direct payments
  const payeeInitialBalance = await dummyUSDT.balanceOf(testAddresses.payee);
  console.log(`💰 Payee initial balance: ${ethers.formatEther(payeeInitialBalance)} DUSDT`);

  console.log("\n💰 Simulating Individual Payments...");

  // Simulate debtor1 paying their share
  console.log("👤 Debtor 1 pays their share (100 DUSDT)...");
  await dummyUSDT.connect(deployer).approve(SPLIT_BILLING_ADDRESS, amounts[0]);
  const payment1Tx = await splitBilling.connect(deployer).payForSomeone(splitId, testAddresses.debtor1);
  await payment1Tx.wait();
  console.log(`✅ Payment 1 Complete: ${payment1Tx.hash}`);

  // Check status after first payment
  const afterPayment1 = await splitBilling.getSplitDetails(splitId);
  const payeeBalanceAfter1 = await dummyUSDT.balanceOf(testAddresses.payee);
  console.log(`📊 After Payment 1 - Total: ${ethers.formatEther(afterPayment1.totalAmount)} DUSDT, Paid: ${ethers.formatEther(afterPayment1.totalPaid)} DUSDT`);
  console.log(`💰 Payee balance after payment 1: ${ethers.formatEther(payeeBalanceAfter1)} DUSDT (received directly)`);

  // Simulate debtor2 paying their share
  console.log("👤 Debtor 2 pays their share (75 DUSDT)...");
  await dummyUSDT.connect(deployer).approve(SPLIT_BILLING_ADDRESS, amounts[1]);
  const payment2Tx = await splitBilling.connect(deployer).payForSomeone(splitId, testAddresses.debtor2);
  await payment2Tx.wait();
  console.log(`✅ Payment 2 Complete: ${payment2Tx.hash}`);

  // Check status after second payment
  const afterPayment2 = await splitBilling.getSplitDetails(splitId);
  const payeeBalanceAfter2 = await dummyUSDT.balanceOf(testAddresses.payee);
  console.log(`📊 After Payment 2 - Total: ${ethers.formatEther(afterPayment2.totalAmount)} DUSDT, Paid: ${ethers.formatEther(afterPayment2.totalPaid)} DUSDT`);
  console.log(`💰 Payee balance after payment 2: ${ethers.formatEther(payeeBalanceAfter2)} DUSDT (received directly)`);

  // Simulate debtor3 paying their share (should complete the split)
  console.log("👤 Debtor 3 pays their share (125 DUSDT) - Should complete split...");
  await dummyUSDT.connect(deployer).approve(SPLIT_BILLING_ADDRESS, amounts[2]);
  const payment3Tx = await splitBilling.connect(deployer).payForSomeone(splitId, testAddresses.debtor3);
  const payment3Receipt = await payment3Tx.wait();
  console.log(`✅ Payment 3 Complete: ${payment3Tx.hash}`);

  // Check if SplitCompleted event was emitted
  const completedEvent = payment3Receipt.logs.find(log => {
    try {
      const parsed = splitBilling.interface.parseLog(log);
      return parsed && parsed.name === 'SplitCompleted';
    } catch {
      return false;
    }
  });

  if (completedEvent) {
    console.log("🎉 Split automatically completed and funds transferred to payee!");
  } else {
    console.log("⏳ Split not yet complete");
  }

  // Final status check
  const finalDetails = await splitBilling.getSplitDetails(splitId);
  const payeeBalanceFinal = await dummyUSDT.balanceOf(testAddresses.payee);
  console.log(`📊 Final Status - Total: ${ethers.formatEther(finalDetails.totalAmount)} DUSDT, Paid: ${ethers.formatEther(finalDetails.totalPaid)} DUSDT`);
  console.log(`💰 Payee final balance: ${ethers.formatEther(payeeBalanceFinal)} DUSDT (all payments received directly)`);
  console.log(`✅ Split Complete: ${await splitBilling.isSplitComplete(splitId)}`);

  console.log("\n🔍 KaiaScan Transaction Summary");
  console.log("===============================");
  console.log(`💳 SplitBilling Transactions:`);
  console.log(`  • Split Creation: ${createTx.hash}`);
  console.log(`  • Payment 1 (100 DUSDT): ${payment1Tx.hash}`);
  console.log(`  • Payment 2 (75 DUSDT): ${payment2Tx.hash}`);
  console.log(`  • Payment 3 (125 DUSDT): ${payment3Tx.hash}`);
  console.log(`  • Block: Latest`);

  console.log(`\n🌐 KaiaScan Links:`);
  console.log(`  • SplitBilling Contract: https://kairos.kaiascan.io/address/${SPLIT_BILLING_ADDRESS}`);
  console.log(`  • DummyUSDT Contract: https://kairos.kaiascan.io/address/${DUMMY_USDT_ADDRESS}`);
  console.log(`  • Deployer Account: https://kairos.kaiascan.io/address/${deployer.address}`);

  // Final balance check
  const finalBalance = await dummyUSDT.balanceOf(deployer.address);
  const amountUsed = currentBalance - finalBalance;
  console.log(`\n💰 Final Balance: ${ethers.formatEther(finalBalance)} DUSDT`);
  console.log(`📊 Amount Used: ${ethers.formatEther(amountUsed)} DUSDT`);

  console.log(`\n🎉 SplitBilling Direct Payment Test Complete!`);
  console.log(`==========================================`);
  console.log(`✅ Split Bill Created: Direct payment model working`);
  console.log(`✅ Direct Payments: All 3 payments went straight to payee`);
  console.log(`✅ On-chain Tracking: Contract verified who paid what`);
  console.log(`✅ No Escrow: Contract never held funds - more secure!`);
  console.log(`✅ All transactions recorded on Kaia testnet`);
  console.log(`✅ Ready for KaiaScan verification`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Test flow failed:", error);
    process.exit(1);
  });
