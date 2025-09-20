const hre = require("hardhat");

async function main() {
    console.log("🚀 Starting KaiaPay Lending Protocol deployment...");
    
    const [deployer] = await hre.ethers.getSigners();
    console.log("📝 Deploying contracts with account:", deployer.address);
    console.log("💰 Account balance:", hre.ethers.formatEther(await hre.ethers.provider.getBalance(deployer.address)));

    // Load existing contract addresses
    const deploymentInfo = require('../deployment-addresses.json');
    const dummyUSDT = deploymentInfo.contracts.DummyUSDT;
    
    console.log("🔄 Using existing DummyUSDT:", dummyUSDT);

    // Mock addresses for testing (replace with actual addresses in production)
    const KAIA_ADDRESS = "0x0000000000000000000000000000000000000000"; // Native KAIA
    const USDY_ADDRESS = dummyUSDT; // Using DummyUSDT as collateral for now
    const FEED_ROUTER_ADDRESS = "0x16937cfcc9f86b46c8b3c24c6e12fd1c1db139cf"; // Kaia testnet FeedRouter (lowercase)
    
    try {
        // Deploy LP Tokens first
        console.log("\n🪙 Deploying LP Tokens...");
        
        const LPToken = await hre.ethers.getContractFactory("LPToken");
        
        // Deploy kKAIA (KAIA LP Token)
        const kKAIA = await LPToken.deploy(
            "KAIA LP Token",
            "kKAIA", 
            deployer.address, // Temporary, will be updated
            deployer.address
        );
        await kKAIA.waitForDeployment();
        const kKAIAAddress = await kKAIA.getAddress();
        console.log("✅ kKAIA deployed to:", kKAIAAddress);

        // Deploy kUSDT (USDT LP Token)
        const kUSDT = await LPToken.deploy(
            "USDT LP Token",
            "kUSDT",
            deployer.address, // Temporary, will be updated
            deployer.address
        );
        await kUSDT.waitForDeployment();
        const kUSDTAddress = await kUSDT.getAddress();
        console.log("✅ kUSDT deployed to:", kUSDTAddress);

        // Deploy Lending Protocol
        console.log("\n🏦 Deploying Lending Protocol...");
        const LendingProtocol = await hre.ethers.getContractFactory("LendingProtocol");
        
        const lendingProtocol = await LendingProtocol.deploy(
            KAIA_ADDRESS,        // KAIA token
            dummyUSDT,          // USDT token (using DummyUSDT)
            dummyUSDT,          // USDY token (collateral - using DummyUSDT for now)
            kKAIAAddress,       // kKAIA LP token
            kUSDTAddress,       // kUSDT LP token
            FEED_ROUTER_ADDRESS, // Orakl FeedRouter
            deployer.address    // Owner
        );
        await lendingProtocol.waitForDeployment();
        const lendingProtocolAddress = await lendingProtocol.getAddress();
        console.log("✅ Lending Protocol deployed to:", lendingProtocolAddress);

        // Update LP token configurations
        console.log("\n🔄 Updating LP token configurations...");
        
        // Update lending protocol addresses in LP tokens
        await kKAIA.updateLendingProtocol(lendingProtocolAddress);
        console.log("✅ kKAIA lending protocol address updated");
        
        await kUSDT.updateLendingProtocol(lendingProtocolAddress);
        console.log("✅ kUSDT lending protocol address updated");
        
        // Transfer ownership of LP tokens to the lending protocol
        await kKAIA.transferOwnership(lendingProtocolAddress);
        console.log("✅ kKAIA ownership transferred to lending protocol");
        
        await kUSDT.transferOwnership(lendingProtocolAddress);
        console.log("✅ kUSDT ownership transferred to lending protocol");

        // Verification info
        console.log("\n📋 Contract Addresses Summary:");
        console.log("================================");
        console.log("Lending Protocol:", lendingProtocolAddress);
        console.log("kKAIA LP Token:  ", kKAIAAddress);
        console.log("kUSDT LP Token:  ", kUSDTAddress);
        console.log("DummyUSDT:       ", dummyUSDT);
        console.log("Feed Router:     ", FEED_ROUTER_ADDRESS);

        // Save deployment info
        const newDeploymentInfo = {
            ...deploymentInfo,
            contracts: {
                ...deploymentInfo.contracts,
                LendingProtocol: lendingProtocolAddress,
                kKAIA: kKAIAAddress,
                kUSDT: kUSDTAddress
            },
            timestamp: new Date().toISOString()
        };

        require('fs').writeFileSync(
            './deployment-addresses.json', 
            JSON.stringify(newDeploymentInfo, null, 2)
        );

        console.log("\n✨ Deployment completed successfully!");
        console.log("📁 Deployment info saved to deployment-addresses.json");
        
    } catch (error) {
        console.error("❌ Deployment failed:", error);
        process.exitCode = 1;
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});