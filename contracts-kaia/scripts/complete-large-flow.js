const { ethers } = require("hardhat");

/**
 * 🚀 COMPLETE KAIAPAY FLOW WITH LARGE TRANSACTIONS
 * 
 * This script demonstrates the complete KaiaPay ecosystem using:
 * - USDT.sol (MyDummyTokenWithFaucet)  
 * - bulkPay.sol (BulkPayroll)
 * - splitbill.sol (SplitBilling)
 * 
 * All transactions use LARGE VALUES and only USDT generated from USDT.sol
 * Deployed on Kaia Testnet for KaiaScan verification
 */

async function main() {
    console.log("🚀 COMPLETE KAIAPAY ECOSYSTEM FLOW WITH LARGE TRANSACTIONS");
    console.log("=" .repeat(80));
    console.log("Network: Kaia Testnet");
    console.log("Explorer: https://kairos.kaiascope.com");
    console.log("All transactions use LARGE VALUES and USDT-only architecture");
    console.log("=" .repeat(80));

    // ================================================================
    // CONTRACT ADDRESSES (Latest Deployed)
    // ================================================================
    const CONTRACTS = {
        USDT: "0xd55B72640f3e31910A688a2Dc81876F053115B09",          // MyDummyTokenWithFaucet
        BulkPayroll: "0xE9bD986514a6d35B1B73BeA6F19804D3c7aed284",   // BulkPayroll  
        SplitBilling: "0x6892D8358bD3EE04a35Ad5844181BDED05dcdf2f"   // SplitBilling
    };

    const [deployer] = await ethers.getSigners();
    console.log(`\n📝 Main Account: ${deployer.address}`);
    console.log("Balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "KAIA");

    // Connect to contracts
    const usdt = await ethers.getContractAt("MyDummyTokenWithFaucet", CONTRACTS.USDT);
    const bulkPayroll = await ethers.getContractAt("BulkPayroll", CONTRACTS.BulkPayroll);
    const splitBilling = await ethers.getContractAt("SplitBilling", CONTRACTS.SplitBilling);

    console.log("\n🔗 Contract Connections Established");
    console.log(`USDT: ${await usdt.name()} (${await usdt.symbol()})`);
    console.log(`BulkPayroll Max Recipients: ${await bulkPayroll.MAX_RECIPIENTS()}`);
    console.log(`SplitBilling Max Recipients: ${await splitBilling.MAX_RECIPIENTS()}`);

    try {
        // ================================================================
        // PHASE 1: USDT TOKEN - LARGE SCALE OPERATIONS
        // ================================================================
        console.log("\n" + "=" .repeat(80));
        console.log("PHASE 1: USDT TOKEN - LARGE SCALE OPERATIONS (MyDummyTokenWithFaucet)");
        console.log("=" .repeat(80));

        // Check initial token state
        console.log("\n📊 Initial USDT State:");
        const initialBalance = await usdt.balanceOf(deployer.address);
        const totalSupply = await usdt.totalSupply();
        console.log(`Total Supply: ${ethers.formatUnits(totalSupply, 18)} TUSDT`);
        console.log(`Deployer Balance: ${ethers.formatUnits(initialBalance, 18)} TUSDT`);

        // 1.1 MASSIVE MINT OPERATION - 1 Million USDT
        console.log("\n💰 MASSIVE MINT: 1,000,000 TUSDT");
        const massiveMintAmount = ethers.parseUnits("1000000", 18); // 1 Million TUSDT
        let tx = await usdt.mint(deployer.address, massiveMintAmount);
        console.log(`✅ Mint TX: ${tx.hash}`);
        console.log(`   📋 KaiaScan: https://kairos.kaiascope.com/tx/${tx.hash}`);
        await tx.wait();
        
        const balanceAfterMint = await usdt.balanceOf(deployer.address);
        console.log(`New Balance: ${ethers.formatUnits(balanceAfterMint, 18)} TUSDT`);

        // 1.2 FUND FAUCET WITH LARGE AMOUNT - 100,000 TUSDT
        console.log("\n🪙 FUND FAUCET: 100,000 TUSDT");
        const faucetFunding = ethers.parseUnits("100000", 18); // 100k TUSDT for faucet
        tx = await usdt.transfer(CONTRACTS.USDT, faucetFunding);
        console.log(`✅ Faucet Funding TX: ${tx.hash}`);
        console.log(`   📋 KaiaScan: https://kairos.kaiascope.com/tx/${tx.hash}`);
        await tx.wait();

        const faucetBalance = await usdt.balanceOf(CONTRACTS.USDT);
        console.log(`Faucet Balance: ${ethers.formatUnits(faucetBalance, 18)} TUSDT`);

        // 1.3 LARGE TRANSFER OPERATIONS
        console.log("\n🔄 LARGE TRANSFER OPERATIONS:");
    // Large transfer operations with increasing amounts (using valid Kaia addresses)
    const recipients = [
        { address: "0x1234567890123456789012345678901234567890", amount: ethers.parseUnits("50000", 18) },
        { address: "0x2345678901234567890123456789012345678901", amount: ethers.parseUnits("75000", 18) },
        { address: "0x3456789012345678901234567890123456789012", amount: ethers.parseUnits("100000", 18) },
        { address: "0x4567890123456789012345678901234567890123", amount: ethers.parseUnits("125000", 18) },
        { address: "0x5678901234567890123456789012345678901234", amount: ethers.parseUnits("150000", 18) }
    ];        const transferAmounts = [
            ethers.parseUnits("50000", 18),  // 50k TUSDT
            ethers.parseUnits("75000", 18),  // 75k TUSDT
            ethers.parseUnits("100000", 18), // 100k TUSDT
            ethers.parseUnits("125000", 18), // 125k TUSDT
            ethers.parseUnits("150000", 18)  // 150k TUSDT
        ];

        for (let i = 0; i < recipients.length; i++) {
            tx = await usdt.transfer(recipients[i].address, transferAmounts[i]);
            console.log(`✅ Transfer ${i + 1}: ${ethers.formatUnits(transferAmounts[i], 18)} TUSDT → ${recipients[i].address}`);
            console.log(`   TX: ${tx.hash}`);
            console.log(`   📋 KaiaScan: https://kairos.kaiascope.com/tx/${tx.hash}`);
            await tx.wait();
            
            // Verify recipient balance
            const recipientBalance = await usdt.balanceOf(recipients[i].address);
            console.log(`   Balance: ${ethers.formatUnits(recipientBalance, 18)} TUSDT\n`);
        }

        // ================================================================
        // PHASE 2: BULK PAYROLL - MASSIVE BATCH OPERATIONS
        // ================================================================
        console.log("\n" + "=" .repeat(80));
        console.log("PHASE 2: BULK PAYROLL - MASSIVE BATCH OPERATIONS");
        console.log("=" .repeat(80));

        // 2.1 APPROVE MASSIVE AMOUNT FOR BULK OPERATIONS
        console.log("\n💳 APPROVE BULK PAYROLL: 300,000 TUSDT");
        const bulkApprovalAmount = ethers.parseUnits("300000", 18); // 300k TUSDT
        tx = await usdt.approve(CONTRACTS.BulkPayroll, bulkApprovalAmount);
        console.log(`✅ Bulk Approval TX: ${tx.hash}`);
        console.log(`   📋 KaiaScan: https://kairos.kaiascope.com/tx/${tx.hash}`);
        await tx.wait();

        // 2.2 EXECUTE MASSIVE BULK TRANSFER - 10 Recipients with Large Amounts
        console.log("\n🚀 MASSIVE BULK TRANSFER: 10 Recipients, 250,000 TUSDT Total");
        
        // Bulk payroll recipients (10 massive salaries)
        const bulkRecipients = [
            "0x1234567890123456789012345678901234567890",
            "0x2345678901234567890123456789012345678901",
            "0x3456789012345678901234567890123456789012",
            "0x4567890123456789012345678901234567890123",
            "0x5678901234567890123456789012345678901234",
            "0x6789012345678901234567890123456789012345",
            "0x7890123456789012345678901234567890123456",
            "0x8901234567890123456789012345678901234567",
            "0x9012345678901234567890123456789012345678",
            "0xa123456789012345678901234567890123456789"
        ];

        const bulkAmounts = [
            ethers.parseUnits("30000", 18), // 30k TUSDT
            ethers.parseUnits("25000", 18), // 25k TUSDT
            ethers.parseUnits("35000", 18), // 35k TUSDT
            ethers.parseUnits("20000", 18), // 20k TUSDT
            ethers.parseUnits("40000", 18), // 40k TUSDT
            ethers.parseUnits("15000", 18), // 15k TUSDT
            ethers.parseUnits("28000", 18), // 28k TUSDT
            ethers.parseUnits("22000", 18), // 22k TUSDT
            ethers.parseUnits("18000", 18), // 18k TUSDT
            ethers.parseUnits("17000", 18)  // 17k TUSDT
        ];

        const totalBulkAmount = bulkAmounts.reduce((sum, amount) => sum + amount, 0n);
        console.log(`Total Amount: ${ethers.formatUnits(totalBulkAmount, 18)} TUSDT`);
        console.log(`Recipients: ${bulkRecipients.length}`);

        tx = await bulkPayroll.bulkTransfer(bulkRecipients, bulkAmounts);
        console.log(`\n✅ MASSIVE BULK TRANSFER TX: ${tx.hash}`);
        console.log(`   📋 KaiaScan: https://kairos.kaiascope.com/tx/${tx.hash}`);
        await tx.wait();

        // Verify some recipient balances
        console.log("\n🔍 Verifying Bulk Transfer Results:");
        for (let i = 0; i < 3; i++) { // Check first 3 recipients
            const balance = await usdt.balanceOf(bulkRecipients[i]);
            console.log(`${bulkRecipients[i]}: ${ethers.formatUnits(balance, 18)} TUSDT`);
        }

        // ================================================================
        // PHASE 3: SPLIT BILLING - LARGE GROUP PAYMENTS
        // ================================================================
        console.log("\n" + "=" .repeat(80));
        console.log("PHASE 3: SPLIT BILLING - LARGE GROUP PAYMENTS");
        console.log("=" .repeat(80));

        // 3.1 APPROVE SPLIT BILLING CONTRACT
        console.log("\n💳 APPROVE SPLIT BILLING: 200,000 TUSDT");
        const splitApprovalAmount = ethers.parseUnits("200000", 18); // 200k TUSDT
        tx = await usdt.approve(CONTRACTS.SplitBilling, splitApprovalAmount);
        console.log(`✅ Split Approval TX: ${tx.hash}`);
        console.log(`   📋 KaiaScan: https://kairos.kaiascope.com/tx/${tx.hash}`);
        await tx.wait();

        // 3.2 CREATE LARGE CORPORATE EVENT SPLIT
        console.log("\n🎉 CREATE LARGE CORPORATE EVENT SPLIT: 80,000 TUSDT Total");
        
        const eventDebtors = [
            "0x1010101010101010101010101010101010101010",
            "0x2020202020202020202020202020202020202020",
            "0x3030303030303030303030303030303030303030",
            "0x4040404040404040404040404040404040404040",
            "0x5050505050505050505050505050505050505050"
        ];

        const eventAmounts = [
            ethers.parseUnits("20000", 18), // 20k TUSDT - Department A
            ethers.parseUnits("25000", 18), // 25k TUSDT - Department B  
            ethers.parseUnits("15000", 18), // 15k TUSDT - Department C
            ethers.parseUnits("12000", 18), // 12k TUSDT - Department D
            ethers.parseUnits("8000", 18)   // 8k TUSDT - Department E
        ];

        const eventDeadline = Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60); // 30 days
        const eventTotalAmount = eventAmounts.reduce((sum, amount) => sum + amount, 0n);

        tx = await splitBilling.createSplit(
            deployer.address, // Payee (company account)
            eventDebtors,
            eventAmounts, 
            eventDeadline,
            "Corporate Annual Event - Catering & Venue Split Payment (80,000 TUSDT)"
        );

        console.log(`✅ Corporate Event Split TX: ${tx.hash}`);
        console.log(`   Total: ${ethers.formatUnits(eventTotalAmount, 18)} TUSDT`);
        console.log(`   Debtors: ${eventDebtors.length} departments`);
        console.log(`   📋 KaiaScan: https://kairos.kaiascope.com/tx/${tx.hash}`);
        await tx.wait();

        // 3.3 CREATE LUXURY VACATION SPLIT
        console.log("\n🏖️ CREATE LUXURY VACATION SPLIT: 45,000 TUSDT Total");
        
        const vacationDebtors = [
            "0x6060606060606060606060606060606060606060",
            "0x7070707070707070707070707070707070707070", 
            "0x8080808080808080808080808080808080808080"
        ];

        const vacationAmounts = [
            ethers.parseUnits("18000", 18), // 18k TUSDT - Person 1 (2 people)
            ethers.parseUnits("15000", 18), // 15k TUSDT - Person 2 (single)
            ethers.parseUnits("12000", 18)  // 12k TUSDT - Person 3 (single)
        ];

        const vacationDeadline = Math.floor(Date.now() / 1000) + (14 * 24 * 60 * 60); // 14 days
        const vacationTotalAmount = vacationAmounts.reduce((sum, amount) => sum + amount, 0n);

        tx = await splitBilling.createSplit(
            deployer.address,
            vacationDebtors,
            vacationAmounts,
            vacationDeadline,
            "Luxury Maldives Vacation - Resort & Flight Split (45,000 TUSDT)"
        );

        console.log(`✅ Vacation Split TX: ${tx.hash}`);
        console.log(`   Total: ${ethers.formatUnits(vacationTotalAmount, 18)} TUSDT`);
        console.log(`   📋 KaiaScan: https://kairos.kaiascope.com/tx/${tx.hash}`);
        await tx.wait();

        // 3.4 PAY FOR SOMEONE ELSE (Large Amounts)
        console.log("\n🤝 PAY FOR SOMEONE ELSE - Corporate Event:");
        
        // Pay for Department A (20k TUSDT)
        tx = await splitBilling.payForSomeone(1, eventDebtors[0]);
        console.log(`✅ Paid for Department A: ${ethers.formatUnits(eventAmounts[0], 18)} TUSDT`);
        console.log(`   TX: ${tx.hash}`);
        console.log(`   📋 KaiaScan: https://kairos.kaiascope.com/tx/${tx.hash}`);
        await tx.wait();

        // Pay for Department B (25k TUSDT)  
        tx = await splitBilling.payForSomeone(1, eventDebtors[1]);
        console.log(`✅ Paid for Department B: ${ethers.formatUnits(eventAmounts[1], 18)} TUSDT`);
        console.log(`   TX: ${tx.hash}`);
        console.log(`   📋 KaiaScan: https://kairos.kaiascope.com/tx/${tx.hash}`);
        await tx.wait();

        // 3.5 CREATE AND CANCEL HIGH-VALUE SPLIT
        console.log("\n❌ CREATE & CANCEL HIGH-VALUE SPLIT: 150,000 TUSDT");
        
        const cancelTestDebtors = [
            "0x9090909090909090909090909090909090909090",
            "0xA0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0"
        ];

        const cancelTestAmounts = [
            ethers.parseUnits("80000", 18),  // 80k TUSDT
            ethers.parseUnits("70000", 18)   // 70k TUSDT
        ];

        tx = await splitBilling.createSplit(
            deployer.address,
            cancelTestDebtors,
            cancelTestAmounts,
            eventDeadline,
            "High-Value Split for Cancellation Test (150,000 TUSDT)"
        );

        console.log(`✅ Created Test Split: ${tx.hash}`);
        await tx.wait();

        // Cancel the split
        tx = await splitBilling.cancelSplit(3);
        console.log(`✅ Cancelled Split TX: ${tx.hash}`);
        console.log(`   📋 KaiaScan: https://kairos.kaiascope.com/tx/${tx.hash}`);
        await tx.wait();

        // ================================================================
        // PHASE 4: FINAL VERIFICATION & SUMMARY
        // ================================================================
        console.log("\n" + "=" .repeat(80));
        console.log("PHASE 4: FINAL VERIFICATION & TRANSACTION SUMMARY");
        console.log("=" .repeat(80));

        // Check final balances
        console.log("\n💰 FINAL USDT BALANCES:");
        const finalDeployerBalance = await usdt.balanceOf(deployer.address);
        console.log(`Deployer: ${ethers.formatUnits(finalDeployerBalance, 18)} TUSDT`);
        
        // Check some recipient balances
        const sampleAddresses = [
            recipients[0].address,
            bulkRecipients[0], 
            bulkRecipients[4]
        ];

        console.log("\nSample Recipient Balances:");
        for (const addr of sampleAddresses) {
            const balance = await usdt.balanceOf(addr);
            console.log(`${addr}: ${ethers.formatUnits(balance, 18)} TUSDT`);
        }

        // Get split information
        console.log("\n📊 SPLIT BILLING STATUS:");
        const split1 = await splitBilling.getSplitDetails(1);
        const split2 = await splitBilling.getSplitDetails(2);
        const split3 = await splitBilling.getSplitDetails(3);

        console.log(`Corporate Event Split: ${ethers.formatUnits(split1.totalPaid, 18)}/${ethers.formatUnits(split1.totalAmount, 18)} TUSDT paid`);
        console.log(`Vacation Split: ${ethers.formatUnits(split2.totalPaid, 18)}/${ethers.formatUnits(split2.totalAmount, 18)} TUSDT paid`);
        console.log(`Test Split: ${split3.cancelled ? 'CANCELLED' : 'ACTIVE'}`);

        // ================================================================
        // TRANSACTION SUMMARY FOR KAIASCAN VERIFICATION
        // ================================================================
        console.log("\n" + "=" .repeat(80));
        console.log("🎉 COMPLETE KAIAPAY FLOW EXECUTED SUCCESSFULLY!");
        console.log("=" .repeat(80));

        console.log("\n📊 TRANSACTION SUMMARY:");
        console.log("🔹 USDT Operations:");
        console.log("  - Minted: 1,000,000 TUSDT");
        console.log("  - Faucet Funded: 100,000 TUSDT");
        console.log("  - Large Transfers: 500,000 TUSDT to 5 addresses");
        console.log("\n🔹 Bulk Payroll:");
        console.log("  - Bulk Transfer: 250,000 TUSDT to 10 recipients");
        console.log("  - Gas-optimized batch processing");
        console.log("\n🔹 Split Billing:");
        console.log("  - Corporate Event: 80,000 TUSDT (45,000 paid)");
        console.log("  - Luxury Vacation: 45,000 TUSDT split");
        console.log("  - Test Split: 150,000 TUSDT (cancelled)");

        console.log("\n🔍 KAIASCAN VERIFICATION:");
        console.log("Visit these contracts on https://kairos.kaiascope.com:");
        console.log(`• USDT Token: ${CONTRACTS.USDT}`);
        console.log(`• BulkPayroll: ${CONTRACTS.BulkPayroll}`);
        console.log(`• SplitBilling: ${CONTRACTS.SplitBilling}`);

        console.log("\n💎 TOTAL VALUE PROCESSED: ~2,025,000 TUSDT");
        console.log("🌟 All transactions are USDT-only and viewable on KaiaScan!");

    } catch (error) {
        console.error("❌ Error in KaiaPay flow:", error.message);
        console.error("Full error:", error);
    }
}

// Execute the complete flow
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });