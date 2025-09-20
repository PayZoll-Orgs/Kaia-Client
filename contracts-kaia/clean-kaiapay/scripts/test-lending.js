const hre = require("hardhat");

async function main() {
    console.log("🧪 Testing KaiaPay Lending Protocol functionality...");
    
    const signers = await hre.ethers.getSigners();
    const deployer = signers[0];
    const user1 = signers[0]; // Using same account for testing
    const user2 = signers[0]; // Using same account for testing
    
    console.log("🔧 Testing with account:");
    console.log("  Account:", deployer.address);

    // Load contract addresses
    const deploymentInfo = require('../deployment-addresses.json');
    const contracts = deploymentInfo.contracts;
    
    // Connect to contracts
    const dummyUSDT = await hre.ethers.getContractAt("DummyUSDT", contracts.DummyUSDT);
    const lendingProtocol = await hre.ethers.getContractAt("LendingProtocol", contracts.LendingProtocol);
    const kUSDT = await hre.ethers.getContractAt("LPToken", contracts.kUSDT);
    
    console.log("\n📊 Initial Setup and Price Testing:");
    console.log("===================================");
    
    try {
        // Test price feeds
        console.log("🔍 Testing KAIA price from Orakl Network...");
        const kaiaPrice = await lendingProtocol.getKaiaPrice();
        console.log("  KAIA Price:", hre.ethers.formatEther(kaiaPrice), "USD");
    } catch (error) {
        console.log("  ⚠️  KAIA price feed error (expected on testnet):", error.message);
        console.log("  📝 This is normal if KLAY-USDT feed is not available on testnet");
    }
    
    try {
        const usdtPrice = await lendingProtocol.getUsdtPrice();
        console.log("  USDT Price:", hre.ethers.formatEther(usdtPrice), "USD");
    } catch (error) {
        console.log("  ❌ USDT price error:", error.message);
    }

    console.log("\n💰 User Balance Check:");
    console.log("======================");
    
    // Check if users can claim from faucet
    const canClaim1 = await dummyUSDT.canClaimFaucet(user1.address);
    console.log("User1 can claim from faucet:", canClaim1);
    
    if (canClaim1) {
        try {
            await dummyUSDT.connect(user1).faucet();
            console.log("✅ User1 claimed 1000 DummyUSDT from faucet");
        } catch (error) {
            console.log("⚠️ Faucet claim failed:", error.message);
        }
    }
    
    const user1UsdtBalance = await dummyUSDT.balanceOf(user1.address);
    const user2UsdtBalance = await dummyUSDT.balanceOf(user2.address);
    console.log("  User1 USDT balance:", hre.ethers.formatEther(user1UsdtBalance));
    console.log("  User2 USDT balance:", hre.ethers.formatEther(user2UsdtBalance));
    
    if (user1UsdtBalance < hre.ethers.parseEther("100")) {
        console.log("⚠️  Insufficient USDT balance for testing. Using available balance.");
    }

    console.log("\n🏦 Testing Lending Functionality:");
    console.log("=================================");
    
    // Test USDT lending (deposit)
    const depositAmount = hre.ethers.parseEther("100"); // 100 USDT
    
    // Approve lending protocol to spend USDT
    await dummyUSDT.connect(user1).approve(contracts.LendingProtocol, depositAmount);
    console.log("✅ User1 approved lending protocol to spend 100 USDT");
    
    try {
        // Deposit USDT to get kUSDT (using DummyUSDT address as USDT)
        await lendingProtocol.connect(user1).deposit(contracts.DummyUSDT, depositAmount);
        console.log("✅ User1 deposited 100 USDT successfully");
        
        const user1LpBalance = await kUSDT.balanceOf(user1.address);
        console.log("  User1 kUSDT LP tokens received:", hre.ethers.formatEther(user1LpBalance));
        
        // Check LP token price
        const lpPrice = await lendingProtocol.getLpPrice(contracts.kUSDT);
        console.log("  Current kUSDT LP price:", hre.ethers.formatEther(lpPrice), "USDT");
        
    } catch (error) {
        console.log("❌ Deposit failed:", error.message);
    }

    console.log("\n💸 Testing Borrowing Functionality:");
    console.log("===================================");
    
    // Test collateral deposit and borrowing
    const collateralAmount = hre.ethers.parseEther("200"); // 200 USDT as collateral
    
    try {
        // Approve and deposit collateral
        await dummyUSDT.connect(user2).approve(contracts.LendingProtocol, collateralAmount);
        await lendingProtocol.connect(user2).depositCollateral(collateralAmount);
        console.log("✅ User2 deposited 200 USDT as collateral");
        
        const collateralBalance = await lendingProtocol.collateralBalance(user2.address);
        console.log("  User2 collateral balance:", hre.ethers.formatEther(collateralBalance));
        
        // Try to borrow USDT (should work as we have USDT liquidity from User1's deposit)
        const borrowAmount = hre.ethers.parseEther("50"); // Borrow 50 USDT
        await lendingProtocol.connect(user2).borrow(contracts.DummyUSDT, borrowAmount);
        console.log("✅ User2 borrowed 50 USDT successfully");
        
        const debtBalance = await lendingProtocol.debtBalance(user2.address, contracts.DummyUSDT);
        console.log("  User2 debt balance:", hre.ethers.formatEther(debtBalance), "USDT");
        
        // Check LTV
        const ltv = await lendingProtocol.getLTV(user2.address);
        console.log("  User2 LTV:", hre.ethers.formatEther(ltv), "%");
        
    } catch (error) {
        console.log("❌ Borrowing failed:", error.message);
        console.log("  This might be due to price feed issues on testnet");
    }

    console.log("\n🔄 Testing Repayment:");
    console.log("=====================");
    
    try {
        const repayAmount = hre.ethers.parseEther("25"); // Repay 25 USDT
        await dummyUSDT.connect(user2).approve(contracts.LendingProtocol, repayAmount);
        await lendingProtocol.connect(user2).repay(contracts.DummyUSDT, repayAmount);
        console.log("✅ User2 repaid 25 USDT successfully");
        
        const newDebtBalance = await lendingProtocol.debtBalance(user2.address, contracts.DummyUSDT);
        console.log("  User2 remaining debt:", hre.ethers.formatEther(newDebtBalance), "USDT");
        
    } catch (error) {
        console.log("❌ Repayment failed:", error.message);
    }

    console.log("\n📊 Final State Summary:");
    console.log("=======================");
    
    try {
        // Protocol liquidity
        const protocolUsdtBalance = await dummyUSDT.balanceOf(contracts.LendingProtocol);
        console.log("Protocol USDT liquidity:", hre.ethers.formatEther(protocolUsdtBalance));
        
        // LP token supplies
        const kUsdtSupply = await kUSDT.totalSupply();
        console.log("Total kUSDT LP tokens:", hre.ethers.formatEther(kUsdtSupply));
        
        // User balances
        const user1FinalUsdt = await dummyUSDT.balanceOf(user1.address);
        const user2FinalUsdt = await dummyUSDT.balanceOf(user2.address);
        console.log("User1 final USDT:", hre.ethers.formatEther(user1FinalUsdt));
        console.log("User2 final USDT:", hre.ethers.formatEther(user2FinalUsdt));
        
    } catch (error) {
        console.log("❌ State query failed:", error.message);
    }

    console.log("\n✨ Test completed!");
    console.log("📝 Note: Some price feed functions may fail on testnet due to limited oracle support");
    console.log("🔗 Check transactions on Kaiascan for verification");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});