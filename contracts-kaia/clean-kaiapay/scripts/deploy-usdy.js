const hre = require("hardhat");

async function main() {
    console.log("🏦 DEPLOYING USDY - USD YIELD TOKEN (RWA DEMO)");
    console.log("==============================================");
    
    const [deployer] = await hre.ethers.getSigners();
    console.log("📝 Deploying from account:", deployer.address);
    
    // Get account balance
    const balance = await hre.ethers.provider.getBalance(deployer.address);
    console.log("💰 Account balance:", hre.ethers.formatEther(balance), "KAIA");
    
    if (balance < hre.ethers.parseEther("0.01")) {
        throw new Error("❌ Insufficient balance for deployment. Need at least 0.01 KAIA");
    }
    
    console.log("\n🚀 Deploying USDY contract...");
    
    // Deploy USDY
    const USDY = await hre.ethers.getContractFactory("USDY");
    const usdy = await USDY.deploy();
    await usdy.waitForDeployment();
    
    const usdyAddress = await usdy.getAddress();
    console.log("✅ USDY deployed to:", usdyAddress);
    
    // Verify deployment
    console.log("\n🔍 VERIFYING DEPLOYMENT");
    console.log("========================");
    
    const name = await usdy.name();
    const symbol = await usdy.symbol();
    const decimals = await usdy.decimals();
    const totalSupply = await usdy.totalSupply();
    const owner = await usdy.owner();
    
    console.log("Token Name:", name);
    console.log("Token Symbol:", symbol);
    console.log("Decimals:", decimals);
    console.log("Total Supply:", hre.ethers.formatEther(totalSupply), symbol);
    console.log("Owner:", owner);
    
    // Test faucet configuration
    console.log("\n💧 FAUCET CONFIGURATION");
    console.log("======================");
    
    const faucetInfo = await usdy.getFaucetInfo();
    console.log("Faucet Amount:", hre.ethers.formatEther(faucetInfo.amount), symbol);
    console.log("Cooldown Period:", faucetInfo.cooldown.toString(), "seconds (", (faucetInfo.cooldown / 3600).toString(), "hours)");
    console.log("Total Claimed:", hre.ethers.formatEther(faucetInfo.totalClaimed), symbol);
    console.log("Remaining Supply:", hre.ethers.formatEther(faucetInfo.remainingSupply), symbol);
    
    // Test RWA metadata
    console.log("\n🏛️  RWA TOKEN METADATA");
    console.log("======================");
    
    const metadata = await usdy.getRWAMetadata();
    console.log("RWA Type:", metadata.rwaType);
    console.log("Backing Asset:", metadata.backingAsset);
    console.log("USD Value per Token:", hre.ethers.formatEther(metadata.valueUSD), "USD");
    console.log("Max Supply:", hre.ethers.formatEther(metadata.maxSupply), symbol);
    
    // Test faucet claim
    console.log("\n🧪 TESTING FAUCET FUNCTIONALITY");
    console.log("===============================");
    
    const canClaim = await usdy.canClaimFromFaucet(deployer.address);
    console.log("Can deployer claim from faucet?", canClaim);
    
    if (canClaim) {
        console.log("🎯 Claiming from faucet...");
        const claimTx = await usdy.claimFromFaucet();
        await claimTx.wait();
        
        const newBalance = await usdy.balanceOf(deployer.address);
        console.log("✅ Faucet claim successful!");
        console.log("   New deployer balance:", hre.ethers.formatEther(newBalance), symbol);
        
        const timeUntilNext = await usdy.timeUntilNextClaim(deployer.address);
        console.log("   Time until next claim:", timeUntilNext.toString(), "seconds");
    } else {
        console.log("⏳ Faucet claim not available (cooldown or supply limit)");
    }
    
    // Save deployment information
    const deploymentInfo = {
        network: hre.network.name,
        chainId: (await hre.ethers.provider.getNetwork()).chainId.toString(),
        deployer: deployer.address,
        deploymentTime: new Date().toISOString(),
        contracts: {
            USDY: usdyAddress
        },
        contractDetails: {
            USDY: {
                name: name,
                symbol: symbol,
                decimals: decimals,
                totalSupply: totalSupply.toString(),
                faucetAmount: faucetInfo.amount.toString(),
                faucetCooldown: faucetInfo.cooldown.toString(),
                maxSupply: metadata.maxSupply.toString()
            }
        }
    };
    
    console.log("\n💾 SAVING DEPLOYMENT INFO");
    console.log("=========================");
    
    const fs = require('fs');
    fs.writeFileSync(
        './usdy-deployment-info.json',
        JSON.stringify(deploymentInfo, null, 2)
    );
    
    console.log("✅ Deployment info saved to: usdy-deployment-info.json");
    
    // Generate verification command
    console.log("\n🔐 CONTRACT VERIFICATION");
    console.log("========================");
    console.log("To verify on Kaiascope, run:");
    console.log(`npx hardhat verify --network kairos ${usdyAddress}`);
    
    console.log("\n🎉 USDY DEPLOYMENT COMPLETE!");
    console.log("============================");
    console.log("📋 Summary:");
    console.log("   USDY Address:", usdyAddress);
    console.log("   Initial Supply:", hre.ethers.formatEther(totalSupply), symbol);
    console.log("   Faucet Ready:", canClaim ? "Yes" : "No");
    console.log("   Network:", hre.network.name);
    
    console.log("\n🚀 NEXT STEPS:");
    console.log("==============");
    console.log("1. Update main deployment script with USDY address");
    console.log("2. Deploy complete lending protocol with USDY integration");
    console.log("3. Test complete RWA workflow: faucet → collateral → borrow → repay");
    console.log("4. Users can now claim USDY from faucet and use as collateral!");
    
    return deploymentInfo;
}

main().catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exitCode = 1;
});