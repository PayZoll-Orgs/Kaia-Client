const { ethers } = require("hardhat");

/**
 * 🔍 USDT TOKEN VERIFICATION ON KAIASCAN
 * 
 * This script checks the USDT token configuration and performs
 * transactions to verify visibility on KaiaScan explorer.
 */

async function main() {
    console.log("🔍 USDT TOKEN KAIASCAN VERIFICATION");
    console.log("============================================================");
    console.log("Network: Kaia Testnet");
    console.log("Explorer: https://kairos.kaiascope.com");
    console.log("============================================================");

    const USDT_ADDRESS = "0x8CCaC8CBE276a225B1Af2b85dEee8e12cFB48193";
    
    const [signer] = await ethers.getSigners();
    console.log(`\n📝 Testing Account: ${signer.address}`);

    // Connect to USDT contract
    const usdt = await ethers.getContractAt("MyDummyTokenWithFaucet", USDT_ADDRESS);

    try {
        // ================================================================
        // 1. CHECK TOKEN METADATA
        // ================================================================
        console.log("\n" + "=".repeat(60));
        console.log("1️⃣  TOKEN METADATA VERIFICATION");
        console.log("=".repeat(60));

        console.log("\n📊 Token Information:");
        const name = await usdt.name();
        const symbol = await usdt.symbol();
        const decimals = await usdt.decimals();
        const totalSupply = await usdt.totalSupply();
        
        console.log(`Token Name: "${name}"`);
        console.log(`Token Symbol: "${symbol}"`);
        console.log(`Decimals: ${decimals}`);
        console.log(`Total Supply: ${ethers.formatUnits(totalSupply, decimals)} ${symbol}`);
        
        // ================================================================
        // 2. CHECK CURRENT BALANCES
        // ================================================================
        console.log("\n" + "=".repeat(60));
        console.log("2️⃣  BALANCE VERIFICATION");
        console.log("=".repeat(60));

        const balance = await usdt.balanceOf(signer.address);
        console.log(`\n💰 Current Balance: ${ethers.formatUnits(balance, decimals)} ${symbol}`);
        console.log(`💰 Current Balance (raw): ${balance} wei`);

        // Check some other addresses to see balances
        const testAddresses = [
            "0x1111111111111111111111111111111111111111",
            "0x2222222222222222222222222222222222222222", 
            "0x3333333333333333333333333333333333333333"
        ];

        console.log("\n🔍 Checking test addresses for USDT balances:");
        for (const addr of testAddresses) {
            const testBalance = await usdt.balanceOf(addr);
            console.log(`${addr}: ${ethers.formatUnits(testBalance, decimals)} ${symbol}`);
        }

        // ================================================================
        // 3. PERFORM VISIBLE TRANSACTIONS
        // ================================================================
        console.log("\n" + "=".repeat(60));
        console.log("3️⃣  PERFORMING VISIBLE TRANSACTIONS");
        console.log("=".repeat(60));

        // Small transfer to make it visible
        console.log("\n🔄 Performing small test transfer:");
        const transferAmount = ethers.parseUnits("1", decimals); // 1 TUSDT
        const recipient = "0x1234567890123456789012345678901234567890";
        
        let tx = await usdt.transfer(recipient, transferAmount);
        console.log(`✅ Transfer TX: ${tx.hash}`);
        console.log(`   Amount: ${ethers.formatUnits(transferAmount, decimals)} ${symbol}`);
        console.log(`   To: ${recipient}`);
        console.log(`   📋 KaiaScan: https://kairos.kaiascope.com/tx/${tx.hash}`);
        await tx.wait();

        // Check recipient balance
        const recipientBalance = await usdt.balanceOf(recipient);
        console.log(`✅ Recipient balance: ${ethers.formatUnits(recipientBalance, decimals)} ${symbol}`);

        // ================================================================
        // 4. MINT NEW TOKENS WITH EVENTS
        // ================================================================
        console.log("\n" + "=".repeat(60));
        console.log("4️⃣  MINTING TOKENS FOR VISIBILITY");
        console.log("=".repeat(60));

        console.log("\n⚡ Minting new tokens:");
        const mintAmount = ethers.parseUnits("100", decimals); // 100 TUSDT
        
        tx = await usdt.mint(signer.address, mintAmount);
        console.log(`✅ Mint TX: ${tx.hash}`);
        console.log(`   Amount: ${ethers.formatUnits(mintAmount, decimals)} ${symbol}`);
        console.log(`   📋 KaiaScan: https://kairos.kaiascope.com/tx/${tx.hash}`);
        await tx.wait();

        // Check updated balance
        const newBalance = await usdt.balanceOf(signer.address);
        console.log(`✅ New balance: ${ethers.formatUnits(newBalance, decimals)} ${symbol}`);

        // ================================================================
        // 5. APPROVAL TRANSACTION
        // ================================================================
        console.log("\n" + "=".repeat(60));
        console.log("5️⃣  APPROVAL TRANSACTION");
        console.log("=".repeat(60));

        console.log("\n🔓 Creating approval transaction:");
        const approvalAmount = ethers.parseUnits("50", decimals); // 50 TUSDT
        const spender = "0x9999999999999999999999999999999999999999";
        
        tx = await usdt.approve(spender, approvalAmount);
        console.log(`✅ Approval TX: ${tx.hash}`);
        console.log(`   Amount: ${ethers.formatUnits(approvalAmount, decimals)} ${symbol}`);
        console.log(`   Spender: ${spender}`);
        console.log(`   📋 KaiaScan: https://kairos.kaiascope.com/tx/${tx.hash}`);
        await tx.wait();

        // Check allowance
        const allowance = await usdt.allowance(signer.address, spender);
        console.log(`✅ Allowance set: ${ethers.formatUnits(allowance, decimals)} ${symbol}`);

        // ================================================================
        // 6. MULTIPLE SMALL TRANSFERS
        // ================================================================
        console.log("\n" + "=".repeat(60));
        console.log("6️⃣  MULTIPLE TRANSFERS FOR VISIBILITY");
        console.log("=".repeat(60));

        console.log("\n🔄 Performing multiple small transfers:");
        const recipients = [
            "0xAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
            "0xBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB",
            "0xCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC"
        ];

        for (let i = 0; i < recipients.length; i++) {
            const amount = ethers.parseUnits((i + 1).toString(), decimals); // 1, 2, 3 TUSDT
            
            tx = await usdt.transfer(recipients[i], amount);
            console.log(`✅ Transfer ${i + 1} TX: ${tx.hash}`);
            console.log(`   Amount: ${ethers.formatUnits(amount, decimals)} ${symbol}`);
            console.log(`   To: ${recipients[i]}`);
            console.log(`   📋 KaiaScan: https://kairos.kaiascope.com/tx/${tx.hash}`);
            await tx.wait();
            
            // Small delay to avoid rate limits
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        // ================================================================
        // 7. FINAL VERIFICATION
        // ================================================================
        console.log("\n" + "=".repeat(60));
        console.log("7️⃣  FINAL VERIFICATION & INSTRUCTIONS");
        console.log("=".repeat(60));

        const finalBalance = await usdt.balanceOf(signer.address);
        console.log(`\n💰 Final Balance: ${ethers.formatUnits(finalBalance, decimals)} ${symbol}`);

        console.log("\n🔍 HOW TO VERIFY ON KAIASCAN:");
        console.log("=" .repeat(50));
        console.log("1. Visit: https://kairos.kaiascope.com");
        console.log(`2. Search for USDT token: ${USDT_ADDRESS}`);
        console.log("3. Click on 'Token Transfers' tab");
        console.log("4. You should see all transfer transactions");
        console.log("5. Click on individual transactions to see amounts");
        
        console.log("\n📋 SPECIFIC TRANSACTION LINKS TO CHECK:");
        console.log("Copy and paste these URLs in your browser:");
        console.log(`• Token contract: https://kairos.kaiascope.com/token/${USDT_ADDRESS}`);
        console.log(`• Your address: https://kairos.kaiascope.com/address/${signer.address}`);
        
        console.log("\n🔧 POSSIBLE REASONS FOR AMOUNT NOT SHOWING:");
        console.log("1. Explorer cache - may take a few minutes to update");
        console.log("2. Token not verified - amounts show as wei values");
        console.log("3. Metadata not fully indexed - refresh the page");
        console.log("4. Use 'Internal Transactions' tab if amounts not in main view");

        console.log("\n✨ TOKEN CONTRACT DETAILS FOR KAIASCAN:");
        console.log(`Contract Address: ${USDT_ADDRESS}`);
        console.log(`Token Name: ${name}`);
        console.log(`Token Symbol: ${symbol}`);
        console.log(`Decimals: ${decimals}`);
        console.log("Contract Type: ERC-20 / KIP-7 Compatible");

    } catch (error) {
        console.error("❌ Error during verification:", error.message);
        console.error("Full error:", error);
    }
}

// Execute the verification
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
