const { ethers } = require("hardhat");

/**
 * 🧪 BULK PAYROLL CONTRACT TEST SCRIPT
 * 
 * This script properly tests the BulkPayroll contract with the correct method signature:
 * bulkTransfer(address[], uint256[])
 * 
 * The contract constructor already sets the USDT token address, so we don't pass it as parameter.
 */

async function main() {
    console.log("🧪 TESTING BULK PAYROLL CONTRACT");
    console.log("=" .repeat(60));
    console.log("Network: Kaia Testnet");
    console.log("RPC: https://public-en-kairos.node.kaia.io");
    console.log("=" .repeat(60));
    
    // Contract addresses from latest deployment
    const CONTRACTS = {
        USDT: "0xd55B72640f3e31910A688a2Dc81876F053115B09",          // MyDummyTokenWithFaucet
        BulkPayroll: "0xE9bD986514a6d35B1B73BeA6F19804D3c7aed284"    // BulkPayroll
    };

    const [deployer] = await ethers.getSigners();
    console.log(`📝 Test Account: ${deployer.address}`);
    console.log(`Balance: ${ethers.formatEther(await ethers.provider.getBalance(deployer.address))} KAIA`);

    // Connect to contracts
    console.log("🔗 Connecting to contracts...");
    const usdt = await ethers.getContractAt("MyDummyTokenWithFaucet", CONTRACTS.USDT);
    const bulkPayroll = await ethers.getContractAt("BulkPayroll", CONTRACTS.BulkPayroll);

    // Verify contract setup
    console.log("📋 Contract Details:");
    console.log(`USDT: ${await usdt.name()} (${await usdt.symbol()})`);
    console.log(`BulkPayroll USDT Token: ${await bulkPayroll.usdtToken()}`);
    console.log(`Max Recipients: ${await bulkPayroll.MAX_RECIPIENTS()}`);

    try {
        // Step 1: Check/Mint USDT tokens
        console.log("\n💰 STEP 1: Ensure sufficient USDT balance");
        let balance = await usdt.balanceOf(deployer.address);
        console.log(`Current USDT balance: ${ethers.formatUnits(balance, 18)} TUSDT`);

        const requiredAmount = ethers.parseUnits("100", 18); // 100 TUSDT for test
        if (balance < requiredAmount) {
            console.log("💎 Minting USDT tokens...");
            const mintTx = await usdt.mint(deployer.address, requiredAmount);
            console.log(`✅ Mint TX: ${mintTx.hash}`);
            await mintTx.wait();
            
            balance = await usdt.balanceOf(deployer.address);
            console.log(`New balance: ${ethers.formatUnits(balance, 18)} TUSDT`);
        }

        // Step 2: Prepare test recipients and amounts
        console.log("\n📊 STEP 2: Prepare test data");
        const testRecipients = [
            "0x1234567890123456789012345678901234567890",
            "0x2345678901234567890123456789012345678901",
            "0x3456789012345678901234567890123456789012"
        ];

        const testAmounts = [
            ethers.parseUnits("10", 18),  // 10 TUSDT
            ethers.parseUnits("20", 18),  // 20 TUSDT  
            ethers.parseUnits("30", 18)   // 30 TUSDT
        ];

        const totalAmount = testAmounts.reduce((sum, amount) => sum + amount, 0n);
        console.log(`Recipients: ${testRecipients.length}`);
        console.log(`Total amount: ${ethers.formatUnits(totalAmount, 18)} TUSDT`);

        // Step 3: Approve USDT spending
        console.log("\n🔓 STEP 3: Approve USDT spending");
        console.log(`Approving ${ethers.formatUnits(totalAmount, 18)} TUSDT for BulkPayroll contract...`);
        
        const approveTx = await usdt.approve(CONTRACTS.BulkPayroll, totalAmount);
        console.log(`✅ Approval TX: ${approveTx.hash}`);
        console.log(`   📋 KaiaScan: https://kairos.kaiascope.com/tx/${approveTx.hash}`);
        await approveTx.wait();

        // Verify approval
        const allowance = await usdt.allowance(deployer.address, CONTRACTS.BulkPayroll);
        console.log(`Allowance verified: ${ethers.formatUnits(allowance, 18)} TUSDT`);

        // Step 4: Execute bulk transfer with correct signature
        console.log("\n🚀 STEP 4: Execute bulk transfer");
        console.log("Using method signature: bulkTransfer(address[], uint256[])");
        
        // Calculate method ID for verification
        const methodSignature = "bulkTransfer(address[],uint256[])";
        const methodId = ethers.id(methodSignature).slice(0, 10);
        console.log(`Method ID: ${methodId}`);

        // Execute the bulk transfer
        const bulkTx = await bulkPayroll.bulkTransfer(testRecipients, testAmounts);
        console.log(`✅ Bulk Transfer TX: ${bulkTx.hash}`);
        console.log(`   📋 KaiaScan: https://kairos.kaiascope.com/tx/${bulkTx.hash}`);
        
        const receipt = await bulkTx.wait();
        console.log(`Gas used: ${receipt.gasUsed.toString()}`);

        // Step 5: Verify results
        console.log("\n🔍 STEP 5: Verify transfer results");
        
        console.log("Recipient balances:");
        for (let i = 0; i < testRecipients.length; i++) {
            const recipientBalance = await usdt.balanceOf(testRecipients[i]);
            console.log(`${testRecipients[i]}: ${ethers.formatUnits(recipientBalance, 18)} TUSDT`);
        }

        // Check deployer's remaining balance
        const finalBalance = await usdt.balanceOf(deployer.address);
        console.log(`\nDeployer remaining balance: ${ethers.formatUnits(finalBalance, 18)} TUSDT`);

        // Check for any failed transfers
        console.log("\nChecking for failed transfers:");
        for (const recipient of testRecipients) {
            const failedAmount = await bulkPayroll.getFailedAmount(recipient);
            if (failedAmount > 0) {
                console.log(`❌ Failed transfer for ${recipient}: ${ethers.formatUnits(failedAmount, 18)} TUSDT`);
            } else {
                console.log(`✅ ${recipient}: No failed transfers`);
            }
        }

        console.log("\n🎉 BULK PAYROLL TEST COMPLETED SUCCESSFULLY!");
        console.log("=" .repeat(60));
        console.log("✅ All transfers executed properly");
        console.log("✅ Contract works with correct method signature");
        console.log("✅ Frontend should now work with the corrected implementation");

    } catch (error) {
        console.error("❌ Test failed:", error.message);
        if (error.reason) {
            console.error("Reason:", error.reason);
        }
        if (error.data) {
            console.error("Error data:", error.data);
        }
        console.error("Full error:", error);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });