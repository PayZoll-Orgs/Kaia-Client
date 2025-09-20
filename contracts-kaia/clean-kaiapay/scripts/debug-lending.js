const hre = require("hardhat");

async function main() {
    console.log("🔍 Debug Contract State...");
    
    const deploymentInfo = require('../deployment-addresses.json');
    const contracts = deploymentInfo.contracts;
    
    const lendingProtocol = await hre.ethers.getContractAt("LendingProtocol", contracts.LendingProtocol);
    const dummyUSDT = await hre.ethers.getContractAt("DummyUSDT", contracts.DummyUSDT);
    
    console.log("Contract addresses:");
    console.log("LendingProtocol:", contracts.LendingProtocol);
    console.log("DummyUSDT:", contracts.DummyUSDT);
    
    try {
        // Check what USDT address is stored in the contract
        // We need to check the constructor parameters or add getter functions
        console.log("\nContract info:");
        
        // Check if user has sufficient balance and allowance
        const [user] = await hre.ethers.getSigners();
        const balance = await dummyUSDT.balanceOf(user.address);
        const allowance = await dummyUSDT.allowance(user.address, contracts.LendingProtocol);
        
        console.log("User USDT balance:", hre.ethers.formatEther(balance));
        console.log("User allowance to protocol:", hre.ethers.formatEther(allowance));
        
        // Try a small deposit to see exact error
        const testAmount = hre.ethers.parseEther("1");
        await dummyUSDT.approve(contracts.LendingProtocol, testAmount);
        console.log("✅ Approved 1 USDT");
        
        console.log("Testing deposit with token address:", contracts.DummyUSDT);
        await lendingProtocol.deposit(contracts.DummyUSDT, testAmount);
        console.log("✅ Deposit successful!");
        
    } catch (error) {
        console.log("❌ Error:", error.message);
        
        // Additional debug info
        if (error.message.includes("Invalid token")) {
            console.log("🔍 Token address validation failed");
            console.log("This means the DummyUSDT address doesn't match the USDT address in the contract");
        }
        
        if (error.message.includes("transfer amount exceeds balance")) {
            console.log("🔍 Insufficient balance");
        }
        
        if (error.message.includes("transfer amount exceeds allowance")) {
            console.log("🔍 Insufficient allowance");
        }
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});