const { ethers } = require("hardhat");

async function main() {
    console.log("Deploying contracts to Kaia testnet...");
    
    const [deployer] = await ethers.getSigners();
    console.log("Deploying with account:", deployer.address);
    const initialBalance = await ethers.provider.getBalance(deployer.address);
    console.log("Account balance:", ethers.formatEther(initialBalance), "KAIA");

    // Contract deployment addresses will be stored here
    const deployedContracts = {};

    try {
        // 1. Deploy USDT Token
        console.log("\n1. Deploying MyDummyTokenWithFaucet (USDT)...");
        const USDTFactory = await ethers.getContractFactory("MyDummyTokenWithFaucet");
        const usdt = await USDTFactory.deploy(
            "Test USDT", 
            "TUSDT", 
            1000000 // 1M initial supply
        );
        await usdt.waitForDeployment();
        deployedContracts.USDT = await usdt.getAddress();
        console.log("✅ USDT deployed to:", deployedContracts.USDT);

        // 2. Deploy BulkPayroll
        console.log("\n2. Deploying BulkPayroll...");
        const BulkPayrollFactory = await ethers.getContractFactory("BulkPayroll");
        const bulkPayroll = await BulkPayrollFactory.deploy(deployedContracts.USDT);
        await bulkPayroll.waitForDeployment();
        deployedContracts.BulkPayroll = await bulkPayroll.getAddress();
        console.log("✅ BulkPayroll deployed to:", deployedContracts.BulkPayroll);
        console.log("   Using USDT token:", deployedContracts.USDT);

        // 3. Deploy InvoiceSubscriptionService
        console.log("\n3. Deploying InvoiceSubscriptionService...");
        const feeCollector = process.env.FEE_COLLECTOR_ADDRESS || deployer.address;
        const InvoiceServiceFactory = await ethers.getContractFactory("InvoiceSubscriptionService");
        const invoiceService = await InvoiceServiceFactory.deploy(deployedContracts.USDT, feeCollector);
        await invoiceService.waitForDeployment();
        deployedContracts.InvoiceService = await invoiceService.getAddress();
        console.log("✅ InvoiceService deployed to:", deployedContracts.InvoiceService);
        console.log("   Using USDT token:", deployedContracts.USDT);
        console.log("   Fee collector:", feeCollector);

        // 4. Deploy SplitBilling
        console.log("\n4. Deploying SplitBilling...");
        const SplitBillingFactory = await ethers.getContractFactory("SplitBilling");
        const splitBilling = await SplitBillingFactory.deploy(deployedContracts.USDT);
        await splitBilling.waitForDeployment();
        deployedContracts.SplitBilling = await splitBilling.getAddress();
        console.log("✅ SplitBilling deployed to:", deployedContracts.SplitBilling);
        console.log("   Using USDT token:", deployedContracts.USDT);

        // 5. Setup initial configurations
        console.log("\n5. Setting up initial configurations...");
        
        // Fund the USDT faucet
        const faucetFunding = ethers.parseUnits("50000", 18); // 50k tokens for faucet
        await usdt.transfer(deployedContracts.USDT, faucetFunding);
        console.log("✅ USDT faucet funded with 50,000 tokens");

        // Create a sample service in InvoiceService for testing
        await invoiceService.listService(
            "Sample Web Development Service",
            "Full-stack web development service for testing",
            "https://example.com/service-image.jpg",
            ethers.parseUnits("100", 18) // 100 USDT
        );
        console.log("✅ Sample service created in InvoiceService");

        // Summary
        console.log("\n" + "=".repeat(60));
        console.log("🎉 ALL CONTRACTS DEPLOYED SUCCESSFULLY!");
        console.log("=".repeat(60));
        console.log("Contract Addresses:");
        console.log("-------------------");
        Object.entries(deployedContracts).forEach(([name, address]) => {
            console.log(`${name.padEnd(20)}: ${address}`);
        });
        
        console.log("\nNetwork Information:");
        console.log("--------------------");
        console.log("Network:", "Kaia Testnet");
        console.log("Chain ID:", 1001);
        console.log("RPC URL:", "https://public-en-kairos.node.kaia.io");
        console.log("Explorer:", "https://kairos.kaiascope.com");

        console.log("\nGas Information:");
        console.log("----------------");
        const finalBalance = await ethers.provider.getBalance(deployer.address);
        const gasUsed = initialBalance - finalBalance;
        console.log("Deployer final balance:", ethers.formatEther(finalBalance), "KAIA");
        console.log("Total gas used:", ethers.formatEther(gasUsed), "KAIA");

        // Write contract addresses to file
        const fs = require('fs');
        const contractData = {
            network: "kaia-testnet",
            chainId: 1001,
            explorer: "https://kairos.kaiascope.com",
            deployedAt: new Date().toISOString(),
            deployer: deployer.address,
            contracts: deployedContracts
        };
        
        fs.writeFileSync(
            './deployed-contracts.json', 
            JSON.stringify(contractData, null, 2)
        );
        console.log("\n✅ Contract addresses saved to deployed-contracts.json");

        return deployedContracts;

    } catch (error) {
        console.error("❌ Deployment failed:", error);
        process.exit(1);
    }
}

// Execute deployment
if (require.main === module) {
    main()
        .then(() => process.exit(0))
        .catch((error) => {
            console.error(error);
            process.exit(1);
        });
}

module.exports = { main };
