const hre = require("hardhat");

async function main() {
    console.log("🚀 Deploying Enhanced Lending Protocol...");

    // Get the signer (deployer account)
    const [deployer] = await hre.ethers.getSigners();
    console.log("📝 Deploying with account:", deployer.address);
    console.log("💰 Account balance:", (await hre.ethers.provider.getBalance(deployer.address)).toString());

    // For simplicity, we'll use mock addresses for tokens that should already be deployed
    // In a real deployment, these would be the actual deployed token addresses
    const MOCK_KAIA = "0x0000000000000000000000000000000000000001"; // Mock KAIA address
    const MOCK_USDT = "0x8CCaC8CBE276a225B1Af2b85dEee8e12cFB48193"; // Use existing USDT from manual testing guide
    const MOCK_USDY = "0x0000000000000000000000000000000000000003"; // Mock USDY address
    const MOCK_kKAIA = "0x0000000000000000000000000000000000000004"; // Mock kKAIA LP token
    const MOCK_kUSDT = "0x0000000000000000000000000000000000000005"; // Mock kUSDT LP token
    const MOCK_FEED_ROUTER = "0x0000000000000000000000000000000000000006"; // Mock feed router

    try {
        // Deploy Enhanced Lending Protocol
        console.log("\n📦 Deploying EnhancedLendingProtocol...");
        
        const EnhancedLendingProtocol = await hre.ethers.getContractFactory("EnhancedLendingProtocol");
        const enhancedLending = await EnhancedLendingProtocol.deploy(
            MOCK_KAIA,
            MOCK_USDT,
            MOCK_USDY,
            MOCK_kKAIA,
            MOCK_kUSDT,
            MOCK_FEED_ROUTER,
            deployer.address // Initial owner
        );

        await enhancedLending.waitForDeployment();

        const enhancedLendingAddress = await enhancedLending.getAddress();
        console.log("✅ EnhancedLendingProtocol deployed to:", enhancedLendingAddress);

        // Verify contract on explorer (if not local network)
        if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
            console.log("\n🔍 Waiting for block confirmations...");
            await enhancedLending.deploymentTransaction().wait(5);
            
            console.log("🔍 Verifying contract on block explorer...");
            try {
                await hre.run("verify:verify", {
                    address: enhancedLendingAddress,
                    constructorArguments: [
                        MOCK_KAIA,
                        MOCK_USDT,
                        MOCK_USDY,
                        MOCK_kKAIA,
                        MOCK_kUSDT,
                        MOCK_FEED_ROUTER,
                        deployer.address
                    ],
                });
                console.log("✅ Contract verified successfully");
            } catch (error) {
                console.log("❌ Verification failed:", error.message);
            }
        }

        // Create deployment summary
        const deploymentInfo = {
            network: hre.network.name,
            deployer: deployer.address,
            timestamp: new Date().toISOString(),
            contracts: {
                EnhancedLendingProtocol: {
                    address: enhancedLendingAddress,
                    constructorArgs: {
                        KAIA: MOCK_KAIA,
                        USDT: MOCK_USDT,
                        USDY: MOCK_USDY,
                        kKAIA: MOCK_kKAIA,
                        kUSDT: MOCK_kUSDT,
                        feedRouter: MOCK_FEED_ROUTER,
                        owner: deployer.address
                    }
                }
            },
            gasUsed: {
                EnhancedLendingProtocol: enhancedLending.deploymentTransaction()?.gasUsed?.toString() || "N/A"
            }
        };

        console.log("\n📊 DEPLOYMENT SUMMARY");
        console.log("=".repeat(50));
        console.log(`Network: ${deploymentInfo.network}`);
        console.log(`Deployer: ${deploymentInfo.deployer}`);
        console.log(`Timestamp: ${deploymentInfo.timestamp}`);
        console.log("\n📋 Contract Addresses:");
        console.log(`EnhancedLendingProtocol: ${enhancedLendingAddress}`);
        console.log("\n⛽ Gas Usage:");
        console.log(`EnhancedLendingProtocol: ${deploymentInfo.gasUsed.EnhancedLendingProtocol}`);

        // Save deployment info to file
        const fs = require('fs');
        const path = require('path');
        
        const deploymentsDir = path.join(__dirname, '../deployments');
        if (!fs.existsSync(deploymentsDir)) {
            fs.mkdirSync(deploymentsDir, { recursive: true });
        }
        
        const filename = `enhanced-lending-${hre.network.name}-${Date.now()}.json`;
        const filepath = path.join(deploymentsDir, filename);
        
        fs.writeFileSync(filepath, JSON.stringify(deploymentInfo, null, 2));
        console.log(`\n💾 Deployment info saved to: ${filepath}`);

        // Test basic functionality
        console.log("\n🧪 Testing basic contract functionality...");
        
        try {
            // Test view functions
            const kaiaPrice = await enhancedLending.getKaiaPrice();
            const usdtPrice = await enhancedLending.getUsdtPrice();
            console.log(`✅ KAIA Price: $${hre.ethers.utils.formatEther(kaiaPrice)}`);
            console.log(`✅ USDT Price: $${hre.ethers.utils.formatEther(usdtPrice)}`);

            // Test referral info for deployer (should be empty initially)
            const referralInfo = await enhancedLending.getReferralInfo(deployer.address);
            console.log(`✅ Referral Info: ${referralInfo.totalReferrals} referrals, ${hre.ethers.utils.formatEther(referralInfo.claimableRewards)} USDT claimable`);

            console.log("✅ All basic tests passed!");
            
        } catch (error) {
            console.log("⚠️ Basic tests failed:", error.message);
        }

        console.log("\n🎉 Enhanced Lending Protocol deployment completed successfully!");
        console.log("\n📝 Next Steps:");
        console.log("1. Update frontend contract addresses");
        console.log("2. Create frontend service integrations");
        console.log("3. Test contract interactions");
        console.log("4. Deploy to testnet/mainnet");

        return {
            enhancedLending: enhancedLendingAddress,
            deployer: deployer.address,
            network: hre.network.name
        };

    } catch (error) {
        console.error("❌ Deployment failed:", error);
        process.exit(1);
    }
}

// Run the deployment
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });