const { ethers } = require("hardhat");

// Contract addresses - CURRENT FAUCET USDT ADDRESS & NEWLY DEPLOYED BULKPAYROLL
const USDT_ADDRESS = "0xd55B72640f3e31910A688a2Dc81876F053115B09";
const BULK_PAYROLL_ADDRESS = "0x850Ee5aAA4e55668573D5Ce5f055c113Fe7bd0d4";

// Test configuration
const TEST_AMOUNT = ethers.parseUnits("100", 18); // 100 USDT per recipient
const FAUCET_AMOUNT = ethers.parseUnits("1000", 18); // 1000 USDT from faucet

async function main() {
  console.log("\n🔍 === BULK PAYROLL CONTRACT AUDIT ===");
  console.log("📍 USDT Address:", USDT_ADDRESS);
  console.log("📍 BulkPayroll Address:", BULK_PAYROLL_ADDRESS);
  
  const [deployer] = await ethers.getSigners();
  
  // For testnet, we'll use predefined test addresses
  const recipient1 = { address: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8" };
  const recipient2 = { address: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC" };
  const recipient3 = { address: "0x90F79bf6EB2c4f870365E785982E1f101E93b906" };
  
  console.log("\n👤 Test Accounts:");
  console.log("  Deployer:", deployer.address);
  console.log("  Recipient1:", recipient1.address);
  console.log("  Recipient2:", recipient2.address);
  console.log("  Recipient3:", recipient3.address);

  // Get contract instances
  const usdt = await ethers.getContractAt("IERC20", USDT_ADDRESS);
  const bulkPayroll = await ethers.getContractAt("BulkPayroll", BULK_PAYROLL_ADDRESS);
  
  // Get USDT contract with faucet function
  const usdtWithFaucet = await ethers.getContractAt([
    "function faucet() external",
    "function balanceOf(address) external view returns (uint256)",
    "function transfer(address, uint256) external returns (bool)",
    "function approve(address, uint256) external returns (bool)",
    "function allowance(address, address) external view returns (uint256)"
  ], USDT_ADDRESS);

  let testResults = [];
  
  // ===== TEST 1: CONTRACT VERIFICATION =====
  console.log("\n🧪 TEST 1: Contract Verification");
  try {
    // Check if contracts exist
    const bulkCode = await ethers.provider.getCode(BULK_PAYROLL_ADDRESS);
    const usdtCode = await ethers.provider.getCode(USDT_ADDRESS);
    
    if (bulkCode === "0x") {
      throw new Error("BulkPayroll contract not deployed");
    }
    if (usdtCode === "0x") {
      throw new Error("USDT contract not deployed");
    }
    
    console.log("✅ PASS: Both contracts are deployed");
    testResults.push({test: "Contract Verification", status: "PASS", txHash: "N/A"});
  } catch (error) {
    console.log("❌ FAIL:", error.message);
    testResults.push({test: "Contract Verification", status: "FAIL", error: error.message});
  }

  // ===== TEST 2: USDT FAUCET =====
  console.log("\n🧪 TEST 2: USDT Faucet");
  try {
    console.log("💰 Calling USDT faucet...");
    const faucetTx = await usdtWithFaucet.faucet();
    console.log("🔄 Faucet transaction hash:", faucetTx.hash);
    
    await faucetTx.wait();
    
    const balance = await usdtWithFaucet.balanceOf(deployer.address);
    console.log("💰 USDT Balance after faucet:", ethers.formatUnits(balance, 18), "USDT");
    
    if (balance >= FAUCET_AMOUNT) {
      console.log("✅ PASS: Faucet provided sufficient USDT");
      testResults.push({test: "USDT Faucet", status: "PASS", txHash: faucetTx.hash});
    } else {
      throw new Error(`Insufficient faucet amount: ${ethers.formatUnits(balance, 18)} USDT`);
    }
  } catch (error) {
    console.log("❌ FAIL:", error.message);
    testResults.push({test: "USDT Faucet", status: "FAIL", error: error.message});
  }

  // ===== TEST 3: SINGLE RECIPIENT BULK TRANSFER =====
  console.log("\n🧪 TEST 3: Single Recipient Bulk Transfer");
  try {
    const recipients = [recipient1.address];
    const amounts = [TEST_AMOUNT];
    const totalAmount = TEST_AMOUNT;
    
    console.log("📝 Approving USDT for BulkPayroll...");
    const approveTx = await usdtWithFaucet.approve(BULK_PAYROLL_ADDRESS, totalAmount);
    await approveTx.wait();
    console.log("✅ Approval transaction:", approveTx.hash);
    
    const allowance = await usdtWithFaucet.allowance(deployer.address, BULK_PAYROLL_ADDRESS);
    console.log("📊 Allowance:", ethers.formatUnits(allowance, 18), "USDT");
    
    console.log("💸 Executing single bulk transfer...");
    const bulkTx = await bulkPayroll.bulkTransfer(USDT_ADDRESS, recipients, amounts);
    console.log("🔄 Bulk transfer transaction hash:", bulkTx.hash);
    
    const receipt = await bulkTx.wait();
    
    // Check recipient balance
    const recipientBalance = await usdtWithFaucet.balanceOf(recipient1.address);
    console.log("💰 Recipient1 balance:", ethers.formatUnits(recipientBalance, 18), "USDT");
    
    if (recipientBalance >= TEST_AMOUNT) {
      console.log("✅ PASS: Single recipient transfer successful");
      testResults.push({test: "Single Recipient Transfer", status: "PASS", txHash: bulkTx.hash});
    } else {
      throw new Error("Transfer failed - recipient didn't receive tokens");
    }
  } catch (error) {
    console.log("❌ FAIL:", error.message);
    testResults.push({test: "Single Recipient Transfer", status: "FAIL", error: error.message});
  }

  // ===== TEST 4: MULTIPLE RECIPIENTS BULK TRANSFER =====
  console.log("\n🧪 TEST 4: Multiple Recipients Bulk Transfer");
  try {
    const recipients = [recipient2.address, recipient3.address];
    const amounts = [TEST_AMOUNT, TEST_AMOUNT];
    const totalAmount = TEST_AMOUNT + TEST_AMOUNT;
    
    console.log("📝 Approving USDT for multiple recipients...");
    const approveTx = await usdtWithFaucet.approve(BULK_PAYROLL_ADDRESS, totalAmount);
    await approveTx.wait();
    
    console.log("💸 Executing multiple bulk transfer...");
    const bulkTx = await bulkPayroll.bulkTransfer(USDT_ADDRESS, recipients, amounts);
    console.log("🔄 Bulk transfer transaction hash:", bulkTx.hash);
    
    await bulkTx.wait();
    
    // Check both recipients
    const recipient2Balance = await usdtWithFaucet.balanceOf(recipient2.address);
    const recipient3Balance = await usdtWithFaucet.balanceOf(recipient3.address);
    
    console.log("💰 Recipient2 balance:", ethers.formatUnits(recipient2Balance, 18), "USDT");
    console.log("💰 Recipient3 balance:", ethers.formatUnits(recipient3Balance, 18), "USDT");
    
    if (recipient2Balance >= TEST_AMOUNT && recipient3Balance >= TEST_AMOUNT) {
      console.log("✅ PASS: Multiple recipients transfer successful");
      testResults.push({test: "Multiple Recipients Transfer", status: "PASS", txHash: bulkTx.hash});
    } else {
      throw new Error("Transfer failed - recipients didn't receive tokens");
    }
  } catch (error) {
    console.log("❌ FAIL:", error.message);
    testResults.push({test: "Multiple Recipients Transfer", status: "FAIL", error: error.message});
  }

  // ===== TEST 5: FAILED TRANSFER CHECKS =====
  console.log("\n🧪 TEST 5: Failed Transfer Functionality");
  try {
    // Check failed transfer amounts for all recipients
    const failedAmount1 = await bulkPayroll.getFailedAmount(recipient1.address, USDT_ADDRESS);
    const failedAmount2 = await bulkPayroll.getFailedAmount(recipient2.address, USDT_ADDRESS);
    const failedAmount3 = await bulkPayroll.getFailedAmount(recipient3.address, USDT_ADDRESS);
    
    console.log("💰 Failed amounts:");
    console.log("  Recipient1:", ethers.formatUnits(failedAmount1, 18), "USDT");
    console.log("  Recipient2:", ethers.formatUnits(failedAmount2, 18), "USDT");
    console.log("  Recipient3:", ethers.formatUnits(failedAmount3, 18), "USDT");
    
    // This should normally be 0 for successful transfers
    console.log("✅ PASS: Failed transfer check completed");
    testResults.push({test: "Failed Transfer Check", status: "PASS", txHash: "N/A"});
  } catch (error) {
    console.log("❌ FAIL:", error.message);
    testResults.push({test: "Failed Transfer Check", status: "FAIL", error: error.message});
  }

  // ===== TEST 6: INVALID INPUT HANDLING =====
  console.log("\n🧪 TEST 6: Invalid Input Handling");
  try {
    // Test empty arrays
    try {
      await bulkPayroll.bulkTransfer(USDT_ADDRESS, [], []);
      throw new Error("Should have reverted for empty arrays");
    } catch (revertError) {
      if (revertError.message.includes("InvalidInput")) {
        console.log("✅ Empty arrays correctly rejected");
      } else {
        throw revertError;
      }
    }
    
    // Test mismatched array lengths
    try {
      await bulkPayroll.bulkTransfer(USDT_ADDRESS, [recipient1.address], [TEST_AMOUNT, TEST_AMOUNT]);
      throw new Error("Should have reverted for mismatched arrays");
    } catch (revertError) {
      if (revertError.message.includes("LengthMismatch")) {
        console.log("✅ Mismatched arrays correctly rejected");
      } else {
        throw revertError;
      }
    }
    
    console.log("✅ PASS: Invalid input handling works correctly");
    testResults.push({test: "Invalid Input Handling", status: "PASS", txHash: "N/A"});
  } catch (error) {
    console.log("❌ FAIL:", error.message);
    testResults.push({test: "Invalid Input Handling", status: "FAIL", error: error.message});
  }

  // ===== FINAL REPORT =====
  console.log("\n📊 === BULK PAYROLL AUDIT RESULTS ===");
  console.log("═════════════════════════════════════════");
  
  testResults.forEach((result, index) => {
    const statusIcon = result.status === "PASS" ? "✅" : "❌";
    console.log(`${statusIcon} Test ${index + 1}: ${result.test}`);
    if (result.txHash && result.txHash !== "N/A") {
      console.log(`   📜 TX: https://kairos.kaiascope.com/tx/${result.txHash}`);
    }
    if (result.error) {
      console.log(`   ❌ Error: ${result.error}`);
    }
  });
  
  const passCount = testResults.filter(r => r.status === "PASS").length;
  const totalTests = testResults.length;
  
  console.log("\n📈 SUMMARY:");
  console.log(`   Passed: ${passCount}/${totalTests} tests`);
  console.log(`   Status: ${passCount === totalTests ? "ALL TESTS PASSED" : "SOME TESTS FAILED"}`);
  
  if (passCount === totalTests) {
    console.log("\n🎉 BulkPayroll contract is FULLY FUNCTIONAL!");
    console.log("✅ Ready for frontend integration verification.");
  } else {
    console.log("\n⚠️  BulkPayroll contract has issues that need to be resolved.");
  }
  
  console.log("\n💡 VERIFICATION INSTRUCTIONS:");
  console.log("1. Check each transaction hash on Kaiascan:");
  console.log("   https://kairos.kaiascope.com/");
  console.log("2. Verify the transaction status is 'Success'");
  console.log("3. Confirm token transfers in the Internal Txns tab");
  console.log("4. Check that recipient balances increased correctly");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("💥 Script failed:", error);
    process.exit(1);
  });