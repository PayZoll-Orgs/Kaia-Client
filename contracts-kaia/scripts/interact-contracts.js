const { ethers } = require("hardhat");
const fs = require('fs');

/**
 * Comprehensive contract interaction script for testing all contract functions
 * This script demonstrates how to interact with all deployed contracts
 */
async function main() {
    console.log("🚀 Running comprehensive contract interaction tests...");
    
    // Load deployed contract addresses
    if (!fs.existsSync('./deployed-contracts.json')) {
        console.error("❌ deployed-contracts.json not found. Please run deployment first.");
        process.exit(1);
    }
    
    const deploymentData = JSON.parse(fs.readFileSync('./deployed-contracts.json', 'utf8'));
    const contracts = deploymentData.contracts;
    
    const [signer, user1, user2, user3] = await ethers.getSigners();
    console.log("Testing with accounts:");
    console.log("- Main:", signer.address);
    console.log("- User1:", user1.address);
    console.log("- User2:", user2.address);
    console.log("- User3:", user3.address);

    // Connect to contracts
    const usdt = await ethers.getContractAt("MyDummyTokenWithFaucet", contracts.USDT);
    const bulkPayroll = await ethers.getContractAt("BulkPayroll", contracts.BulkPayroll);
    const invoiceService = await ethers.getContractAt("InvoiceSubscriptionService", contracts.InvoiceService);
    const splitBilling = await ethers.getContractAt("SplitBilling", contracts.SplitBilling);

    try {
        // 1. USDT Token Tests
        console.log("\n" + "=".repeat(50));
        console.log("1. USDT TOKEN INTERACTION TESTS");
        console.log("=".repeat(50));

        // Give users some USDT from faucet
        console.log("🪙 Claiming USDT from faucet for users...");
        try {
            await usdt.connect(user1).faucet();
            console.log("✅ User1 claimed from faucet");
        } catch (e) {
            console.log("⚠️  User1 faucet claim:", e.message.includes("24 hours") ? "Cooldown active" : e.message);
        }

        try {
            await usdt.connect(user2).faucet();
            console.log("✅ User2 claimed from faucet");
        } catch (e) {
            console.log("⚠️  User2 faucet claim:", e.message.includes("24 hours") ? "Cooldown active" : e.message);
        }

        // Mint additional tokens for testing
        console.log("🪙 Minting additional tokens for testing...");
        await usdt.mint(user1.address, 1000);
        await usdt.mint(user2.address, 1000);
        await usdt.mint(user3.address, 1000);
        console.log("✅ Tokens minted for all test users");

        // Check balances
        const user1Balance = await usdt.balanceOf(user1.address);
        const user2Balance = await usdt.balanceOf(user2.address);
        console.log(`💰 User1 USDT Balance: ${ethers.formatEther(user1Balance)}`);
        console.log(`💰 User2 USDT Balance: ${ethers.formatEther(user2Balance)}`);

        // 2. BulkPayroll Tests
        console.log("\n" + "=".repeat(50));
        console.log("2. BULK PAYROLL INTERACTION TESTS");
        console.log("=".repeat(50));

        // ETH bulk transfer
        console.log("💸 Testing ETH bulk transfer...");
        const recipients = [user1.address, user2.address, user3.address];
        const amounts = [
            ethers.parseUnits("0.1", 18),
            ethers.parseUnits("0.2", 18),
            ethers.parseUnits("0.15", 18)
        ];
        const totalAmount = amounts.reduce((sum, amount) => sum + amount, 0n);

        const tx = await bulkPayroll.bulkTransfer(ethers.ZeroAddress, recipients, amounts, { value: totalAmount });
        await tx.wait();
        console.log("✅ ETH bulk transfer completed");

        // USDT bulk transfer
        console.log("💸 Testing USDT bulk transfer...");
        const usdtAmounts = [
            ethers.parseUnits("50", 18),
            ethers.parseUnits("75", 18),
            ethers.parseUnits("25", 18)
        ];
        const totalUsdtAmount = usdtAmounts.reduce((sum, amount) => sum + amount, 0n);

        await usdt.approve(contracts.BulkPayroll, totalUsdtAmount);
        const usdtTx = await bulkPayroll.bulkTransfer(contracts.USDT, recipients, usdtAmounts);
        await usdtTx.wait();
        console.log("✅ USDT bulk transfer completed");

        // 3. InvoiceSubscriptionService Tests
        console.log("\n" + "=".repeat(50));
        console.log("3. INVOICE SERVICE INTERACTION TESTS");
        console.log("=".repeat(50));

        // List a service
        console.log("📋 Listing a new service...");
        const servicePrice = ethers.parseUnits("25", 18);
        const listTx = await invoiceService.connect(user1).listService(
            "Smart Contract Development",
            "Professional smart contract development and audit services",
            "https://example.com/service.jpg",
            servicePrice,
            ethers.ZeroAddress // ETH payment
        );
        await listTx.wait();
        console.log("✅ Service listed successfully");

        // Purchase service (create invoice)
        console.log("🛒 Purchasing service (creating invoice)...");
        const purchaseTx = await invoiceService.connect(user2).purchaseService(1, false, 7); // 7 days due
        await purchaseTx.wait();
        console.log("✅ Invoice created successfully");

        // Get invoice details
        const invoice = await invoiceService.getInvoice(1);
        console.log(`📄 Invoice Total: ${ethers.formatEther(invoice.totalAmount)} ETH`);

        // Pay invoice
        console.log("💳 Paying invoice...");
        const payTx = await invoiceService.connect(user2).payInvoice(1, { value: invoice.totalAmount });
        await payTx.wait();
        console.log("✅ Invoice paid successfully");

        // Test split payment invoice
        console.log("📋 Creating split payment invoice...");
        const splitServiceTx = await invoiceService.connect(user1).listService(
            "Team Project Development",
            "Large project suitable for split payments",
            "https://example.com/team-project.jpg",
            ethers.parseUnits("100", 18),
            ethers.ZeroAddress
        );
        await splitServiceTx.wait();

        const splitPurchaseTx = await invoiceService.connect(user2).purchaseService(2, true, 14); // Enable split, 14 days due
        await splitPurchaseTx.wait();
        console.log("✅ Split payment invoice created");

        // Make split payment contributions
        const splitInvoice = await invoiceService.getInvoice(2);
        const contributionAmount = splitInvoice.totalAmount / 2n;
        
        const contributeTx1 = await invoiceService.connect(user2).contributeToSplitPayment(2, 0, { value: contributionAmount });
        await contributeTx1.wait();
        console.log("✅ First split payment contribution made");

        const contributeTx2 = await invoiceService.connect(user3).contributeToSplitPayment(2, 0, { value: contributionAmount });
        await contributeTx2.wait();
        console.log("✅ Split payment completed");

        // 4. SplitBilling Tests
        console.log("\n" + "=".repeat(50));
        console.log("4. SPLIT BILLING INTERACTION TESTS");
        console.log("=".repeat(50));

        // Create a split bill
        console.log("🧾 Creating split bill...");
        const splitDebtors = [user2.address, user3.address];
        const splitAmounts = [
            ethers.parseUnits("20", 18),
            ethers.parseUnits("30", 18)
        ];
        const deadline = Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60); // 7 days from now

        const createSplitTx = await splitBilling.connect(user1).createSplit(
            user1.address, // payee
            splitDebtors,
            splitAmounts,
            ethers.ZeroAddress, // ETH
            deadline,
            "Dinner bill split between friends"
        );
        await createSplitTx.wait();
        console.log("✅ Split bill created successfully");

        // Pay split shares
        console.log("💰 Users paying their split shares...");
        const payShare1Tx = await splitBilling.connect(user2).payShare(1, { value: splitAmounts[0] });
        await payShare1Tx.wait();
        console.log("✅ User2 paid their share");

        const payShare2Tx = await splitBilling.connect(user3).payShare(1, { value: splitAmounts[1] });
        await payShare2Tx.wait();
        console.log("✅ User3 paid their share - Split completed!");

        // Create USDT split bill
        console.log("🧾 Creating USDT split bill...");
        const usdtSplitAmounts = [
            ethers.parseUnits("40", 18),
            ethers.parseUnits("60", 18)
        ];

        const createUsdtSplitTx = await splitBilling.connect(user1).createSplit(
            user1.address,
            [user2.address, user3.address],
            usdtSplitAmounts,
            contracts.USDT,
            deadline,
            "Shopping split payment in USDT"
        );
        await createUsdtSplitTx.wait();
        console.log("✅ USDT split bill created");

        // Approve and pay USDT split
        await usdt.connect(user2).approve(contracts.SplitBilling, usdtSplitAmounts[0]);
        await usdt.connect(user3).approve(contracts.SplitBilling, usdtSplitAmounts[1]);

        const payUsdtShare1Tx = await splitBilling.connect(user2).payShare(2);
        await payUsdtShare1Tx.wait();
        console.log("✅ User2 paid USDT share");

        const payUsdtShare2Tx = await splitBilling.connect(user3).payShare(2);
        await payUsdtShare2Tx.wait();
        console.log("✅ User3 paid USDT share - USDT split completed!");

        // 5. Final Status Check
        console.log("\n" + "=".repeat(50));
        console.log("5. FINAL STATUS CHECK");
        console.log("=".repeat(50));

        // Check final balances
        const finalBalances = {
            user1: {
                eth: await ethers.provider.getBalance(user1.address),
                usdt: await usdt.balanceOf(user1.address)
            },
            user2: {
                eth: await ethers.provider.getBalance(user2.address),
                usdt: await usdt.balanceOf(user2.address)
            },
            user3: {
                eth: await ethers.provider.getBalance(user3.address),
                usdt: await usdt.balanceOf(user3.address)
            }
        };

        console.log("💰 Final Balances:");
        Object.entries(finalBalances).forEach(([user, balances]) => {
            console.log(`${user}: ${ethers.formatEther(balances.eth)} ETH, ${ethers.formatEther(balances.usdt)} USDT`);
        });

        // Check contract states
        const totalServices = await invoiceService._serviceIds().catch(() => 0n);
        const totalInvoices = await invoiceService._invoiceIds().catch(() => 0n);
        const totalSplits = await splitBilling.splitCounter();

        console.log("\n📊 Contract Statistics:");
        console.log(`- Total Services Listed: ${totalServices.toString()}`);
        console.log(`- Total Invoices Created: ${totalInvoices.toString()}`);
        console.log(`- Total Split Bills Created: ${totalSplits.toString()}`);

        // Save interaction results
        const interactionResults = {
            timestamp: new Date().toISOString(),
            network: "kaia-testnet",
            tester: signer.address,
            contractAddresses: contracts,
            testsSummary: {
                usdtTokenInteractions: "✅ PASSED",
                bulkPayrollInteractions: "✅ PASSED",
                invoiceServiceInteractions: "✅ PASSED",
                splitBillingInteractions: "✅ PASSED"
            },
            finalBalances,
            contractStats: {
                totalServices: totalServices.toString(),
                totalInvoices: totalInvoices.toString(),
                totalSplits: totalSplits.toString()
            }
        };

        fs.writeFileSync(
            './interaction-test-results.json',
            JSON.stringify(interactionResults, null, 2)
        );

        console.log("\n🎉 ALL INTERACTION TESTS COMPLETED SUCCESSFULLY!");
        console.log("✅ All contracts are fully functional and integrated");
        console.log("📄 Results saved to interaction-test-results.json");

    } catch (error) {
        console.error("❌ Interaction test failed:", error);
        process.exit(1);
    }
}

if (require.main === module) {
    main()
        .then(() => process.exit(0))
        .catch((error) => {
            console.error(error);
            process.exit(1);
        });
}

module.exports = { main };
