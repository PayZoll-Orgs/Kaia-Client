const { ethers } = require("hardhat");

/**
 * 🧪 FOCUSED BULK TRANSFER TEST
 * 
 * This script specifically tests the BulkPayroll contract's bulkTransfer function
 * using the correct 2-parameter signature: bulkTransfer(address[], uint256[])
 */

async function main() {
    console.log("🧪 FOCUSED BULK TRANSFER TEST");
    console.log("=" .repeat(60));
    console.log("Testing BulkPayroll.bulkTransfer(address[], uint256[])");
    console.log("=" .repeat(60));

    // ================================================================
    // CONTRACT ADDRESSES (Latest Deployed)
    // ================================================================
    const CONTRACTS = {
        USDT: "0xd55B72640f3e31910A688a2Dc81876F053115B09",          // MyDummyTokenWithFaucet
        BulkPayroll: "0xE9bD986514a6d35B1B73BeA6F19804D3c7aed284"   // BulkPayroll  
    };

    const [deployer] = await ethers.getSigners();
    console.log(`\n📝 Testing Account: ${deployer.address}`);
    console.log("KAIA Balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)));

    // Connect to contracts
    const usdt = await ethers.getContractAt("MyDummyTokenWithFaucet", CONTRACTS.USDT);
    const bulkPayroll = await ethers.getContractAt("BulkPayroll", CONTRACTS.BulkPayroll);

    console.log("\n🔗 Contract Connections:");
    console.log(`USDT: ${await usdt.name()} (${await usdt.symbol()})`);
    console.log(`BulkPayroll Max Recipients: ${await bulkPayroll.MAX_RECIPIENTS()}`);

    try {
        // ================================================================
        // PHASE 1: SETUP - MINT USDT AND CHECK BALANCES
        // ================================================================
        console.log("\n" + "=" .repeat(60));
        console.log("PHASE 1: SETUP - MINT USDT");
        console.log("=" .repeat(60));

        // Check initial USDT balance
        let usdtBalance = await usdt.balanceOf(deployer.address);
        console.log(`\n💰 Initial USDT Balance: ${ethers.formatUnits(usdtBalance, 18)} TUSDT`);

        // Mint 100,000 USDT if balance is low
        if (usdtBalance < ethers.parseUnits("50000", 18)) {
            console.log("\n💰 Minting 100,000 TUSDT...");
            const mintAmount = ethers.parseUnits("100000", 18);
            let tx = await usdt.mint(deployer.address, mintAmount);
            console.log(`✅ Mint TX: ${tx.hash}`);
            console.log(`   📋 KaiaScan: https://kairos.kaiascope.com/tx/${tx.hash}`);
            await tx.wait();
            
            usdtBalance = await usdt.balanceOf(deployer.address);
            console.log(`💰 New USDT Balance: ${ethers.formatUnits(usdtBalance, 18)} TUSDT`);
        }

        // ================================================================
        // PHASE 2: BULK TRANSFER TEST - SMALL BATCH
        // ================================================================
        console.log("\n" + "=" .repeat(60));
        console.log("PHASE 2: BULK TRANSFER TEST - SMALL BATCH");
        console.log("=" .repeat(60));

        // Define test recipients and amounts (small amounts for testing)
        const testRecipients = [
            "0x1111111111111111111111111111111111111111",
            "0x2222222222222222222222222222222222222222",
            "0x3333333333333333333333333333333333333333"
        ];

        const testAmounts = [
            ethers.parseUnits("10", 18),  // 10 TUSDT
            ethers.parseUnits("20", 18),  // 20 TUSDT  
            ethers.parseUnits("30", 18)   // 30 TUSDT
        ];

        const totalAmount = testAmounts.reduce((sum, amount) => sum + amount, 0n);
        console.log(`\n📊 Test Parameters:`);
        console.log(`Recipients: ${testRecipients.length}`);
        console.log(`Total Amount: ${ethers.formatUnits(totalAmount, 18)} TUSDT`);
        console.log(`Individual Amounts: ${testAmounts.map(a => ethers.formatUnits(a, 18)).join(', ')} TUSDT`);

        // Check if we have enough balance
        if (usdtBalance < totalAmount) {
            throw new Error(`Insufficient USDT balance. Need: ${ethers.formatUnits(totalAmount, 18)}, Have: ${ethers.formatUnits(usdtBalance, 18)}`);
        }

        // Step 1: Approve BulkPayroll contract
        console.log(`\n💳 Approving BulkPayroll contract for ${ethers.formatUnits(totalAmount, 18)} TUSDT...`);
        let tx = await usdt.approve(CONTRACTS.BulkPayroll, totalAmount);
        console.log(`✅ Approval TX: ${tx.hash}`);
        console.log(`   📋 KaiaScan: https://kairos.kaiascope.com/tx/${tx.hash}`);
        await tx.wait();

        // Verify approval
        const allowance = await usdt.allowance(deployer.address, CONTRACTS.BulkPayroll);
        console.log(`✅ Approval Confirmed: ${ethers.formatUnits(allowance, 18)} TUSDT`);

        // Step 2: Execute bulk transfer with correct 2-parameter signature
        console.log(`\n🚀 Executing bulk transfer: bulkTransfer(address[], uint256[])...`);
        
        // Calculate method ID to verify
        const methodSig = "bulkTransfer(address[],uint256[])";
        const methodId = ethers.keccak256(ethers.toUtf8Bytes(methodSig)).slice(0, 10);
        console.log(`📋 Method Signature: ${methodSig}`);
        console.log(`📋 Method ID: ${methodId}`);

        // Execute the bulk transfer
        tx = await bulkPayroll.bulkTransfer(testRecipients, testAmounts);
        console.log(`\n✅ BULK TRANSFER TX: ${tx.hash}`);
        console.log(`   📋 KaiaScan: https://kairos.kaiascope.com/tx/${tx.hash}`);
        
        // Wait for confirmation
        const receipt = await tx.wait();
        console.log(`✅ Transaction confirmed in block: ${receipt.blockNumber}`);
        console.log(`⛽ Gas used: ${receipt.gasUsed.toString()}`);

        // ================================================================
        // PHASE 3: VERIFY RESULTS
        // ================================================================
        console.log("\n" + "=" .repeat(60));
        console.log("PHASE 3: VERIFY RESULTS");
        console.log("=" .repeat(60));

        // Check recipient balances
        console.log("\n🔍 Recipient Balance Verification:");
        for (let i = 0; i < testRecipients.length; i++) {
            const balance = await usdt.balanceOf(testRecipients[i]);
            const expectedAmount = ethers.formatUnits(testAmounts[i], 18);
            const actualAmount = ethers.formatUnits(balance, 18);
            
            console.log(`${testRecipients[i]}: ${actualAmount} TUSDT (expected: ${expectedAmount})`);
            
            if (balance.toString() === testAmounts[i].toString()) {
                console.log(`  ✅ CORRECT`);
            } else {
                console.log(`  ❌ MISMATCH`);
            }
        }

        // Check sender balance
        const finalBalance = await usdt.balanceOf(deployer.address);
        const expectedFinalBalance = usdtBalance - totalAmount;
        console.log(`\n💰 Sender Balance After Transfer:`);
        console.log(`Expected: ${ethers.formatUnits(expectedFinalBalance, 18)} TUSDT`);
        console.log(`Actual: ${ethers.formatUnits(finalBalance, 18)} TUSDT`);
        
        if (finalBalance.toString() === expectedFinalBalance.toString()) {
            console.log(`✅ SENDER BALANCE CORRECT`);
        } else {
            console.log(`❌ SENDER BALANCE MISMATCH`);
        }

        // Check for failed transfers
        console.log(`\n🔍 Checking for failed transfers...`);
        for (const recipient of testRecipients) {
            const failedAmount = await bulkPayroll.getFailedAmount(recipient);
            if (failedAmount > 0n) {
                console.log(`❌ Failed transfer for ${recipient}: ${ethers.formatUnits(failedAmount, 18)} TUSDT`);
            }
        }

        // ================================================================
        // PHASE 4: LARGER BATCH TEST
        // ================================================================
        console.log("\n" + "=" .repeat(60));
        console.log("PHASE 4: LARGER BATCH TEST (10 Recipients)");
        console.log("=" .repeat(60));

        // Define larger batch
        const largeRecipients = [
            "0x4444444444444444444444444444444444444444",
            "0x5555555555555555555555555555555555555555", 
            "0x6666666666666666666666666666666666666666",
            "0x7777777777777777777777777777777777777777",
            "0x8888888888888888888888888888888888888888",
            "0x9999999999999999999999999999999999999999",
            "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
            "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
            "0xcccccccccccccccccccccccccccccccccccccccc",
            "0xdddddddddddddddddddddddddddddddddddddddd"
        ];

        const largeAmounts = [
            ethers.parseUnits("100", 18),   // 100 TUSDT
            ethers.parseUnits("150", 18),   // 150 TUSDT
            ethers.parseUnits("200", 18),   // 200 TUSDT
            ethers.parseUnits("125", 18),   // 125 TUSDT
            ethers.parseUnits("175", 18),   // 175 TUSDT
            ethers.parseUnits("300", 18),   // 300 TUSDT
            ethers.parseUnits("250", 18),   // 250 TUSDT
            ethers.parseUnits("180", 18),   // 180 TUSDT
            ethers.parseUnits("220", 18),   // 220 TUSDT
            ethers.parseUnits("160", 18)    // 160 TUSDT
        ];

        const largeTotalAmount = largeAmounts.reduce((sum, amount) => sum + amount, 0n);
        console.log(`\n📊 Large Batch Parameters:`);
        console.log(`Recipients: ${largeRecipients.length}`);
        console.log(`Total Amount: ${ethers.formatUnits(largeTotalAmount, 18)} TUSDT`);

        // Check balance and approve
        const currentBalance = await usdt.balanceOf(deployer.address);
        if (currentBalance < largeTotalAmount) {
            console.log(`❌ Insufficient balance for large batch test`);
            console.log(`Need: ${ethers.formatUnits(largeTotalAmount, 18)}, Have: ${ethers.formatUnits(currentBalance, 18)}`);
            return;
        }

        // Approve for large batch
        console.log(`\n💳 Approving for large batch: ${ethers.formatUnits(largeTotalAmount, 18)} TUSDT...`);
        tx = await usdt.approve(CONTRACTS.BulkPayroll, largeTotalAmount);
        await tx.wait();
        console.log(`✅ Large batch approved`);

        // Execute large batch
        console.log(`\n🚀 Executing large batch bulk transfer...`);
        tx = await bulkPayroll.bulkTransfer(largeRecipients, largeAmounts);
        console.log(`✅ LARGE BATCH TX: ${tx.hash}`);
        console.log(`   📋 KaiaScan: https://kairos.kaiascope.com/tx/${tx.hash}`);
        
        const largeReceipt = await tx.wait();
        console.log(`✅ Large batch confirmed in block: ${largeReceipt.blockNumber}`);
        console.log(`⛽ Gas used: ${largeReceipt.gasUsed.toString()}`);

        // Verify first few recipients
        console.log(`\n🔍 Large Batch Verification (first 3 recipients):`);
        for (let i = 0; i < 3; i++) { 
            const balance = await usdt.balanceOf(largeRecipients[i]);
            console.log(`${largeRecipients[i]}: ${ethers.formatUnits(balance, 18)} TUSDT`);
        }

        // ================================================================
        // FINAL SUMMARY
        // ================================================================
        console.log("\n" + "=" .repeat(60));
        console.log("🎉 BULK TRANSFER TEST COMPLETED SUCCESSFULLY!");
        console.log("=" .repeat(60));

        console.log("\n📊 TEST SUMMARY:");
        console.log(`✅ Small batch (3 recipients): ${ethers.formatUnits(totalAmount, 18)} TUSDT`);
        console.log(`✅ Large batch (10 recipients): ${ethers.formatUnits(largeTotalAmount, 18)} TUSDT`);
        console.log(`💎 Total processed: ${ethers.formatUnits(totalAmount + largeTotalAmount, 18)} TUSDT`);
        console.log(`🔧 Method used: bulkTransfer(address[], uint256[])`);
        console.log(`🆔 Method ID: ${methodId}`);

        console.log("\n🔍 All transactions are viewable on KaiaScan:");
        console.log(`https://kairos.kaiascope.com/address/${CONTRACTS.BulkPayroll}`);

    } catch (error) {
        console.error("❌ Error in bulk transfer test:", error.message);
        
        if (error.message.includes("execution reverted")) {
            console.error("\n🔍 Transaction reverted. Possible causes:");
            console.error("- Insufficient USDT balance");
            console.error("- Insufficient allowance");
            console.error("- Invalid recipient addresses");
            console.error("- Contract error (check contract state)");
        }
        
        console.error("\nFull error:", error);
    }
}

// Execute the test
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });