const hre = require("hardhat");

async function main() {
    console.log("🔍 Testing KAIA Price Function...");
    
    const deploymentInfo = require('../deployment-addresses.json');
    const lendingProtocol = await hre.ethers.getContractAt("LendingProtocol", deploymentInfo.contracts.LendingProtocol);
    
    try {
        console.log("Testing getKaiaPrice()...");
        const kaiaPrice = await lendingProtocol.getKaiaPrice();
        console.log("✅ KAIA Price (with fallback):", hre.ethers.formatEther(kaiaPrice), "USD");
        
        console.log("Testing getUsdtPrice()...");
        const usdtPrice = await lendingProtocol.getUsdtPrice();
        console.log("✅ USDT Price:", hre.ethers.formatEther(usdtPrice), "USD");
        
        // Test bonding curve functions
        console.log("\nTesting LP pricing...");
        const kUsdtPrice = await lendingProtocol.getLpPrice(deploymentInfo.contracts.kUSDT);
        console.log("✅ kUSDT LP Price:", hre.ethers.formatEther(kUsdtPrice), "USDT");
        
    } catch (error) {
        console.log("❌ Price function error:", error.message);
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});