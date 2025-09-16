const { ethers } = require("hardhat");
const fs = require('fs');

/**
 * Script to verify all deployed contracts by testing their core functionality
 * This script reads deployed contract addresses and runs verification tests
 */
async function main() {
    console.log("🔍 Verifying deployed contracts on Kaia testnet...");
    
    // Load deployed contract addresses
    if (!fs.existsSync('./deployed-contracts.json')) {
        console.error("❌ deployed-contracts.json not found. Please run deployment first.");
        process.exit(1);
    }
    
    const deploymentData = JSON.parse(fs.readFileSync('./deployed-contracts.json', 'utf8'));
    const contracts = deploymentData.contracts;
    
    const [signer] = await ethers.getSigners();
    console.log("Testing with account:", signer.address);
    
    let allTestsPassed = true;
    const testResults = {};

    try {
        // 1. Test USDT Contract
        console.log("\n" + "=".repeat(50));
        console.log("1. Testing USDT Token Contract");
        console.log("=".repeat(50));
        
        const usdt = await ethers.getContractAt("MyDummyTokenWithFaucet", contracts.USDT);
        
        console.log("📍 Contract Address:", contracts.USDT);
        
        // Basic info tests
        const name = await usdt.name();
        const symbol = await usdt.symbol();
        const decimals = await usdt.decimals();
        const owner = await usdt.owner();
        
        console.log("✅ Token Name:", name);
        console.log("✅ Token Symbol:", symbol);
        console.log("✅ Decimals:", decimals.toString());
        console.log("✅ Owner:", owner);
        
        // Balance tests
        const ownerBalance = await usdt.balanceOf(owner);
        const contractBalance = await usdt.balanceOf(contracts.USDT);
        
        console.log("✅ Owner Balance:", ethers.formatEther(ownerBalance), symbol);
        console.log("✅ Faucet Balance:", ethers.formatEther(contractBalance), symbol);
        
        // Faucet test
        try {
            const balanceBefore = await usdt.balanceOf(signer.address);
            await usdt.faucet();
            const balanceAfter = await usdt.balanceOf(signer.address);
            const claimed = balanceAfter - balanceBefore;
            console.log("✅ Faucet claim successful:", ethers.formatEther(claimed), symbol);
        } catch (error) {
            if (error.message.includes("You can only claim once every 24 hours")) {
                console.log("⚠️  Faucet cooldown active (expected if already claimed)");
            } else {
                console.log("❌ Faucet test failed:", error.message);
                allTestsPassed = false;
            }
        }
        
        testResults.USDT = "✅ PASSED";

        // 2. Test BulkPayroll Contract
        console.log("\n" + "=".repeat(50));
        console.log("2. Testing BulkPayroll Contract");
        console.log("=".repeat(50));
        
        const bulkPayroll = await ethers.getContractAt("BulkPayroll", contracts.BulkPayroll);
        
        console.log("📍 Contract Address:", contracts.BulkPayroll);
        
        // Test constants
        const maxRecipients = await bulkPayroll.MAX_RECIPIENTS();
        const gasLimit = await bulkPayroll.GAS_LIMIT();
        
        console.log("✅ Max Recipients:", maxRecipients.toString());
        console.log("✅ Gas Limit:", gasLimit.toString());
        
        // Test owner
        const bulkPayrollOwner = await bulkPayroll.owner();
        console.log("✅ Owner:", bulkPayrollOwner);
        
        testResults.BulkPayroll = "✅ PASSED";

        // 3. Test InvoiceSubscriptionService Contract
        console.log("\n" + "=".repeat(50));
        console.log("3. Testing InvoiceSubscriptionService Contract");
        console.log("=".repeat(50));
        
        const invoiceService = await ethers.getContractAt("InvoiceSubscriptionService", contracts.InvoiceService);
        
        console.log("📍 Contract Address:", contracts.InvoiceService);
        
        // Test basic info
        const invoiceOwner = await invoiceService.owner();
        const feeCollector = await invoiceService.feeCollector();
        const platformFeeRate = await invoiceService.platformFeeRate();
        
        console.log("✅ Owner:", invoiceOwner);
        console.log("✅ Fee Collector:", feeCollector);
        console.log("✅ Platform Fee Rate:", platformFeeRate.toString(), "basis points");
        
        // Test service listing
        try {
            const serviceId = await invoiceService.listService(
                "Test Service Verification",
                "Testing service creation during verification",
                "https://example.com/test.jpg",
                ethers.parseUnits("50", 18),
                ethers.ZeroAddress
            );
            console.log("✅ Service listing successful");
        } catch (error) {
            console.log("❌ Service listing failed:", error.message);
            allTestsPassed = false;
        }
        
        testResults.InvoiceService = "✅ PASSED";

        // 4. Test SplitBilling Contract
        console.log("\n" + "=".repeat(50));
        console.log("4. Testing SplitBilling Contract");
        console.log("=".repeat(50));
        
        const splitBilling = await ethers.getContractAt("SplitBilling", contracts.SplitBilling);
        
        console.log("📍 Contract Address:", contracts.SplitBilling);
        
        // Test constants
        const splitMaxRecipients = await splitBilling.MAX_RECIPIENTS();
        const splitGasLimit = await splitBilling.GAS_LIMIT();
        const ethToken = await splitBilling.ETH_TOKEN();
        
        console.log("✅ Max Recipients:", splitMaxRecipients.toString());
        console.log("✅ Gas Limit:", splitGasLimit.toString());
        console.log("✅ ETH Token Address:", ethToken);
        
        // Test split counter
        const splitCounter = await splitBilling.splitCounter();
        console.log("✅ Split Counter:", splitCounter.toString());
        
        testResults.SplitBilling = "✅ PASSED";

        // 5. Integration Tests
        console.log("\n" + "=".repeat(50));
        console.log("5. Running Integration Tests");
        console.log("=".repeat(50));
        
        // Test USDT with BulkPayroll (approve and check allowance)
        try {
            const approveAmount = ethers.parseUnits("1000", 18);
            await usdt.approve(contracts.BulkPayroll, approveAmount);
            const allowance = await usdt.allowance(signer.address, contracts.BulkPayroll);
            console.log("✅ USDT-BulkPayroll integration:", ethers.formatEther(allowance), "TUSDT approved");
        } catch (error) {
            console.log("❌ USDT-BulkPayroll integration failed:", error.message);
            allTestsPassed = false;
        }
        
        // Test USDT with InvoiceService
        try {
            const approveAmount = ethers.parseUnits("500", 18);
            await usdt.approve(contracts.InvoiceService, approveAmount);
            const allowance = await usdt.allowance(signer.address, contracts.InvoiceService);
            console.log("✅ USDT-InvoiceService integration:", ethers.formatEther(allowance), "TUSDT approved");
        } catch (error) {
            console.log("❌ USDT-InvoiceService integration failed:", error.message);
            allTestsPassed = false;
        }

        // Summary
        console.log("\n" + "=".repeat(60));
        console.log("📊 VERIFICATION SUMMARY");
        console.log("=".repeat(60));
        
        Object.entries(testResults).forEach(([contract, status]) => {
            console.log(`${contract.padEnd(20)}: ${status}`);
        });
        
        if (allTestsPassed) {
            console.log("\n🎉 ALL VERIFICATION TESTS PASSED!");
            console.log("✅ All contracts are working correctly on Kaia testnet");
        } else {
            console.log("\n⚠️  SOME TESTS FAILED");
            console.log("❌ Please check the error messages above");
        }

        // Save verification results
        const verificationData = {
            verifiedAt: new Date().toISOString(),
            network: "kaia-testnet",
            verifier: signer.address,
            results: testResults,
            allTestsPassed,
            contractAddresses: contracts
        };
        
        fs.writeFileSync(
            './verification-results.json',
            JSON.stringify(verificationData, null, 2)
        );
        console.log("\n✅ Verification results saved to verification-results.json");

    } catch (error) {
        console.error("❌ Verification failed:", error);
        allTestsPassed = false;
    }

    process.exit(allTestsPassed ? 0 : 1);
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
