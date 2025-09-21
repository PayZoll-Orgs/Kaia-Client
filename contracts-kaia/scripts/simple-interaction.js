const { ethers } = require("hardhat");

/**
 * 🚀 SIMPLIFIED KAIAPAY CONTRACT INTERACTION DEMONSTRATION
 * 
 * This script demonstrates all contract functions on Kaia testnet
 * for verification on KaiaScan using a single account approach.
 */

async function main() {
    console.log("🚀 KAIAPAY CONTRACT FUNCTIONS DEMONSTRATION");
    console.log("============================================================");
    console.log("Network: Kaia Testnet");
    console.log("Explorer: https://kairos.kaiascope.com");
    console.log("============================================================");

    // Contract addresses from deployment (checksummed)
    const CONTRACT_ADDRESSES = {
        USDT: ethers.getAddress("0xd55B72640f3e31910A688a2Dc81876F053115B09"),
        BulkPayroll: ethers.getAddress("0xE9bD986514a6d35B1B73BeA6F19804D3c7aed284"), 
        InvoiceService: ethers.getAddress("0xc70DfAf8d864125D37237fc7B034ACAE1f3397d9"),
        SplitBilling: ethers.getAddress("0x6892D8358bD3EE04a35Ad5844181BDED05dcdf2f")
    };

    const [signer] = await ethers.getSigners();
    console.log(`\n📝 Testing Account: ${signer.address}`);

    // Connect to contracts
    const usdt = await ethers.getContractAt("MyDummyTokenWithFaucet", CONTRACT_ADDRESSES.USDT);
    const bulkPayroll = await ethers.getContractAt("BulkPayroll", CONTRACT_ADDRESSES.BulkPayroll);
    const invoiceService = await ethers.getContractAt("InvoiceSubscriptionService", CONTRACT_ADDRESSES.InvoiceService);
    const splitBilling = await ethers.getContractAt("SplitBilling", CONTRACT_ADDRESSES.SplitBilling);

    try {
        // ================================================================
        // 1. USDT TOKEN FUNCTIONS
        // ================================================================
        console.log("\n" + "=".repeat(60));
        console.log("1️⃣  USDT TOKEN FUNCTIONS");
        console.log("=".repeat(60));

        const balance = await usdt.balanceOf(signer.address);
        console.log(`Current USDT Balance: ${ethers.formatUnits(balance, 18)} TUSDT`);

        // Test owner mint function
        console.log("\n⚡ Testing Owner Mint Function:");
        let tx = await usdt.mint(signer.address, ethers.parseUnits("1000", 18));
        console.log(`✅ Mint TX: ${tx.hash}`);
        console.log(`   View on KaiaScan: https://kairos.kaiascope.com/tx/${tx.hash}`);
        await tx.wait();

        // Test transfer function
        console.log("\n🔄 Testing Transfer Function:");
        // Create a dummy recipient address
        const dummyRecipient = "0x1234567890123456789012345678901234567890";
        tx = await usdt.transfer(dummyRecipient, ethers.parseUnits("100", 18));
        console.log(`✅ Transfer TX: ${tx.hash}`);
        console.log(`   View on KaiaScan: https://kairos.kaiascope.com/tx/${tx.hash}`);
        await tx.wait();

        // ================================================================
        // 2. BULK PAYROLL FUNCTIONS
        // ================================================================
        console.log("\n" + "=".repeat(60));
        console.log("2️⃣  BULK PAYROLL FUNCTIONS");
        console.log("=".repeat(60));

        // Prepare bulk payment data
        const recipient1 = "0x1111111111111111111111111111111111111111";
        const recipient2 = "0x2222222222222222222222222222222222222222";
        const recipient3 = "0x3333333333333333333333333333333333333333";
        
        const recipients = [recipient1, recipient2, recipient3];
        const amounts = [
            ethers.parseUnits("50", 18),
            ethers.parseUnits("75", 18),
            ethers.parseUnits("100", 18)
        ];

        const totalAmount = amounts.reduce((sum, amount) => sum + amount, 0n);

        console.log(`\n💳 Setting up bulk payment for ${ethers.formatUnits(totalAmount, 18)} TUSDT`);

        // Approve BulkPayroll contract
        tx = await usdt.approve(CONTRACT_ADDRESSES.BulkPayroll, totalAmount);
        console.log(`✅ Approval TX: ${tx.hash}`);
        console.log(`   View on KaiaScan: https://kairos.kaiascope.com/tx/${tx.hash}`);
        await tx.wait();

        // Execute bulk transfer
        console.log("\n🚀 Executing Bulk Transfer:");
        tx = await bulkPayroll.bulkTransfer(recipients, amounts);
        console.log(`✅ Bulk Transfer TX: ${tx.hash}`);
        console.log(`   View on KaiaScan: https://kairos.kaiascope.com/tx/${tx.hash}`);
        await tx.wait();

        // ================================================================
        // 3. INVOICE SERVICE FUNCTIONS
        // ================================================================
        console.log("\n" + "=".repeat(60));
        console.log("3️⃣  INVOICE SERVICE FUNCTIONS");
        console.log("=".repeat(60));

        // Create a service
        console.log("\n🛍️  Creating Service:");
        const servicePrice = ethers.parseUnits("200", 18);
        
        tx = await invoiceService.listService(
            "Web Development Service",
            "Complete web application development with modern tech stack",
            "https://example.com/service-image.jpg",
            servicePrice
        );
        console.log(`✅ Service Creation TX: ${tx.hash}`);
        console.log(`   View on KaiaScan: https://kairos.kaiascope.com/tx/${tx.hash}`);
        await tx.wait();

        // Purchase service (create invoice)  
        console.log("\n📋 Creating Invoice (Purchase Service):");
        tx = await invoiceService.purchaseService(
            1, // serviceId
            false, // allowSplitPayment
            7 // daysUntilDue
        );
        console.log(`✅ Invoice Creation TX: ${tx.hash}`);
        console.log(`   View on KaiaScan: https://kairos.kaiascope.com/tx/${tx.hash}`);
        await tx.wait();

        // Pay the invoice
        console.log("\n💸 Paying Invoice:");
        const invoice = await invoiceService.getInvoice(1);
        
        tx = await usdt.approve(CONTRACT_ADDRESSES.InvoiceService, invoice.totalAmount);
        console.log(`✅ Payment Approval TX: ${tx.hash}`);
        console.log(`   View on KaiaScan: https://kairos.kaiascope.com/tx/${tx.hash}`);
        await tx.wait();
        
        tx = await invoiceService.payInvoice(1);
        console.log(`✅ Invoice Payment TX: ${tx.hash}`);
        console.log(`   View on KaiaScan: https://kairos.kaiascope.com/tx/${tx.hash}`);
        await tx.wait();

        // Test admin function
        console.log("\n⚙️  Testing Admin Function:");
        tx = await invoiceService.updatePlatformFee(300); // 3%
        console.log(`✅ Platform Fee Update TX: ${tx.hash}`);
        console.log(`   View on KaiaScan: https://kairos.kaiascope.com/tx/${tx.hash}`);
        await tx.wait();

        // ================================================================
        // 4. SPLIT BILLING FUNCTIONS
        // ================================================================
        console.log("\n" + "=".repeat(60));
        console.log("4️⃣  SPLIT BILLING FUNCTIONS");
        console.log("=".repeat(60));

        // Create a split
        console.log("\n🍽️  Creating Split Bill:");
        const debtor1 = "0x4444444444444444444444444444444444444444";
        const debtor2 = "0x5555555555555555555555555555555555555555";
        const debtor3 = "0x6666666666666666666666666666666666666666";
        
        const debtors = [debtor1, debtor2, debtor3];
        const splitAmounts = [
            ethers.parseUnits("80", 18),
            ethers.parseUnits("120", 18), 
            ethers.parseUnits("60", 18)
        ];
        const deadline = Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60); // 7 days
        
        tx = await splitBilling.createSplit(
            signer.address, // payee
            debtors,
            splitAmounts,
            deadline,
            "Restaurant Dinner Split Bill"
        );
        console.log(`✅ Split Creation TX: ${tx.hash}`);
        console.log(`   View on KaiaScan: https://kairos.kaiascope.com/tx/${tx.hash}`);
        await tx.wait();

        // Simulate payment for someone else
        console.log("\n🤝 Paying for Someone Else:");
        const paymentAmount = splitAmounts[0]; // Pay for first debtor
        
        tx = await usdt.approve(CONTRACT_ADDRESSES.SplitBilling, paymentAmount);
        console.log(`✅ Payment Approval TX: ${tx.hash}`);
        console.log(`   View on KaiaScan: https://kairos.kaiascope.com/tx/${tx.hash}`);
        await tx.wait();
        
        tx = await splitBilling.payForSomeone(1, debtor1);
        console.log(`✅ Pay for Someone TX: ${tx.hash}`);
        console.log(`   View on KaiaScan: https://kairos.kaiascope.com/tx/${tx.hash}`);
        await tx.wait();

        // Create and cancel a split
        console.log("\n❌ Testing Split Cancellation:");
        tx = await splitBilling.createSplit(
            signer.address,
            [debtor1, debtor2],
            [ethers.parseUnits("50", 18), ethers.parseUnits("50", 18)],
            deadline,
            "Test Split for Cancellation"
        );
        console.log(`✅ Test Split Creation TX: ${tx.hash}`);
        console.log(`   View on KaiaScan: https://kairos.kaiascope.com/tx/${tx.hash}`);
        await tx.wait();
        
        tx = await splitBilling.cancelSplit(2);
        console.log(`✅ Split Cancellation TX: ${tx.hash}`);
        console.log(`   View on KaiaScan: https://kairos.kaiascope.com/tx/${tx.hash}`);
        await tx.wait();

        // ================================================================
        // 5. FINAL SUMMARY
        // ================================================================
        console.log("\n" + "=".repeat(60));
        console.log("🎉 ALL CONTRACT FUNCTIONS DEMONSTRATED!");
        console.log("=".repeat(60));
        
        console.log("\n🔍 VERIFICATION ON KAIASCAN:");
        console.log("Visit https://kairos.kaiascope.com and search for:");
        console.log(`• USDT Token: ${CONTRACT_ADDRESSES.USDT}`);
        console.log(`• BulkPayroll: ${CONTRACT_ADDRESSES.BulkPayroll}`);
        console.log(`• InvoiceService: ${CONTRACT_ADDRESSES.InvoiceService}`);
        console.log(`• SplitBilling: ${CONTRACT_ADDRESSES.SplitBilling}`);
        
        console.log("\n📋 FUNCTIONS SUCCESSFULLY TESTED:");
        console.log("✅ USDT Functions:");
        console.log("   - mint(): Owner minting tokens");
        console.log("   - transfer(): Token transfers");
        console.log("   - approve(): Token allowances");
        
        console.log("✅ BulkPayroll Functions:");
        console.log("   - bulkTransfer(): Multiple recipient payments");
        console.log("   - Approval and gas-efficient batch processing");
        
        console.log("✅ InvoiceService Functions:");
        console.log("   - listService(): Service creation");
        console.log("   - purchaseService(): Invoice generation");
        console.log("   - payInvoice(): Payment processing");
        console.log("   - updatePlatformFee(): Admin controls");
        
        console.log("✅ SplitBilling Functions:");
        console.log("   - createSplit(): Bill splitting");
        console.log("   - payForSomeone(): Third-party payments");
        console.log("   - cancelSplit(): Split management");
        
        console.log("\n🌟 ALL TRANSACTIONS VIEWABLE ON KAIASCAN!");
        console.log("Each transaction hash above can be searched on:");
        console.log("https://kairos.kaiascope.com");

        // Final balance check
        const finalBalance = await usdt.balanceOf(signer.address);
        console.log(`\n💰 Final USDT Balance: ${ethers.formatUnits(finalBalance, 18)} TUSDT`);

    } catch (error) {
        console.error("❌ Error during interaction:", error.message);
        console.error("Full error details:", error);
    }
}

// Execute the demonstration
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
