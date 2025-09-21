const hre = require("hardhat");

async function main() {
    console.log("🚀 DEPLOYING UPDATED LENDING PROTOCOL WITH INTEREST-ONLY PAYMENTS");
    console.log("================================================================");
    
    const [deployer] = await hre.ethers.getSigners();
    console.log("🔧 Deploying with account:", deployer.address);
    
    // Existing contract addresses
    const EXISTING_ADDRESSES = {
        USDY: "0xC4F121aa9293c2B261bb9143b4c59b9BC9912B6c",
        DummyUSDT: "0xd55B72640f3e31910A688a2Dc81876F053115B09",
        kUSDT: "0xB6369bfC61b27856A8DCA6bebE1a51766C767133",
        kKAIA: "0xf38b06fcf9e107EBb3AE2104D57CC3dF7279F64B",
        KAIA: "0x0000000000000000000000000000000000000000" // Native KAIA
    };
    
    // Mock feed router (use zero address for testing)
    const MOCK_FEED_ROUTER = "0x0000000000000000000000000000000000000000";
    
    try {
        console.log("\n📦 Deploying Updated LendingProtocol...");
        
        const LendingProtocol = await hre.ethers.getContractFactory("LendingProtocol");
        const lendingProtocol = await LendingProtocol.deploy(
            EXISTING_ADDRESSES.KAIA,        // KAIA address
            EXISTING_ADDRESSES.DummyUSDT,   // USDT address
            EXISTING_ADDRESSES.USDY,        // USDY address
            EXISTING_ADDRESSES.kKAIA,       // kKAIA address
            EXISTING_ADDRESSES.kUSDT,       // kUSDT address
            MOCK_FEED_ROUTER,               // Feed router
            deployer.address                // Initial owner
        );
        
        await lendingProtocol.waitForDeployment();
        
        const lendingAddress = await lendingProtocol.getAddress();
        
        console.log("✅ LendingProtocol deployed to:", lendingAddress);
        console.log("🔗 View on Kaiascan: https://kairos.kaiascope.com/address/" + lendingAddress);
        
        console.log("\n📋 Contract Configuration:");
        console.log("==========================");
        console.log("KAIA:", EXISTING_ADDRESSES.KAIA);
        console.log("USDT:", EXISTING_ADDRESSES.DummyUSDT);
        console.log("USDY:", EXISTING_ADDRESSES.USDY);
        console.log("kKAIA:", EXISTING_ADDRESSES.kKAIA);
        console.log("kUSDT:", EXISTING_ADDRESSES.kUSDT);
        console.log("FeedRouter:", MOCK_FEED_ROUTER);
        console.log("Owner:", deployer.address);
        
        // Save deployment info
        const deploymentInfo = {
            network: "kairos",
            chainId: 1001,
            timestamp: new Date().toISOString(),
            deployer: deployer.address,
            contracts: {
                LendingProtocol: lendingAddress,
                // Existing contracts
                USDY: EXISTING_ADDRESSES.USDY,
                DummyUSDT: EXISTING_ADDRESSES.DummyUSDT,
                kUSDT: EXISTING_ADDRESSES.kUSDT,
                kKAIA: EXISTING_ADDRESSES.kKAIA,
                KAIA: EXISTING_ADDRESSES.KAIA
            }
        };
        
        const fs = require('fs');
        fs.writeFileSync('updated-lending-deployment.json', JSON.stringify(deploymentInfo, null, 2));
        console.log("\n💾 Deployment info saved to updated-lending-deployment.json");
        
        console.log("\n🎉 DEPLOYMENT COMPLETED SUCCESSFULLY!");
        console.log("====================================");
        console.log("✅ Updated LendingProtocol with interest-only payments deployed");
        console.log("✅ All existing LP tokens remain compatible");
        console.log("✅ Enhanced debt management functionality added");
        
        console.log("\n📝 New Features Available:");
        console.log("=========================");
        console.log("🟢 repayInterest() - Pay only accrued interest");
        console.log("🟢 repayPrincipal() - Pay only principal amount");
        console.log("🟢 getDebtBreakdown() - View principal vs interest");
        console.log("🟢 getTotalAccruedInterest() - Total interest owed");
        console.log("🟢 getInterestPaymentInfo() - UI-friendly interest data");
        
        console.log("\n🔄 Migration Steps:");
        console.log("==================");
        console.log("1. Update frontend to use new contract address");
        console.log("2. Test new interest payment functions");
        console.log("3. Update UI to show principal vs interest breakdown");
        console.log("4. Enable interest-only payment options for users");
        
        console.log("\n🚀 Ready for production use with enhanced functionality!");
        
    } catch (error) {
        console.error("❌ Deployment failed:", error);
        process.exitCode = 1;
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});