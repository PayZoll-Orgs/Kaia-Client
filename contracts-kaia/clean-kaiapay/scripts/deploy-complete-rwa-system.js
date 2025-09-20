const hre = require("hardhat");

async function main() {
    console.log("🏦 DEPLOYING COMPLETE RWA LENDING SYSTEM WITH USDY");
    console.log("==================================================");
    
    const [deployer] = await hre.ethers.getSigners();
    console.log("📝 Deploying from account:", deployer.address);
    
    // Get account balance
    const balance = await hre.ethers.provider.getBalance(deployer.address);
    console.log("💰 Account balance:", hre.ethers.formatEther(balance), "KAIA");
    
    if (balance < hre.ethers.parseEther("0.1")) {
        throw new Error("❌ Insufficient balance for deployment. Need at least 0.1 KAIA");
    }
    
    console.log("\n🚀 PHASE 1: DEPLOYING TOKEN CONTRACTS");
    console.log("=====================================");
    
    // Deploy USDY (RWA token for collateral)
    console.log("📄 Deploying USDY (Real World Asset token)...");
    const USDY = await hre.ethers.getContractFactory("USDY");
    const usdy = await USDY.deploy();
    await usdy.waitForDeployment();
    const usdyAddress = await usdy.getAddress();
    console.log("   ✅ USDY deployed to:", usdyAddress);
    
    // Deploy DummyUSDT (for lending/borrowing)
    console.log("📄 Deploying DummyUSDT (for lending/borrowing)...");
    const DummyUSDT = await hre.ethers.getContractFactory("DummyUSDT");
    const dummyUSDT = await DummyUSDT.deploy(1000000); // 1M initial supply
    await dummyUSDT.waitForDeployment();
    const usdtAddress = await dummyUSDT.getAddress();
    console.log("   ✅ DummyUSDT deployed to:", usdtAddress);
    
    console.log("\n🚀 PHASE 2: DEPLOYING LP TOKEN CONTRACTS");
    console.log("========================================");
    
    // Deploy kKAIA (LP token for KAIA lending) - will update protocol address later
    console.log("📄 Deploying kKAIA (KAIA LP token)...");
    const LPTokenKAIA = await hre.ethers.getContractFactory("LPToken");
    const kKAIA = await LPTokenKAIA.deploy("Kaia LP Token", "kKAIA", deployer.address, deployer.address);
    await kKAIA.waitForDeployment();
    const kKAIAAddress = await kKAIA.getAddress();
    console.log("   ✅ kKAIA deployed to:", kKAIAAddress);
    
    // Deploy kUSDT (LP token for USDT lending) - will update protocol address later
    console.log("📄 Deploying kUSDT (USDT LP token)...");
    const LPTokenUSDT = await hre.ethers.getContractFactory("LPToken");
    const kUSDT = await LPTokenUSDT.deploy("USDT LP Token", "kUSDT", deployer.address, deployer.address);
    await kUSDT.waitForDeployment();
    const kUSDTAddress = await kUSDT.getAddress();
    console.log("   ✅ kUSDT deployed to:", kUSDTAddress);
    
    console.log("\n🚀 PHASE 3: DEPLOYING LENDING PROTOCOL");
    console.log("======================================");
    
    // Deploy LendingProtocol with all addresses
    console.log("📄 Deploying LendingProtocol (main contract)...");
    const LendingProtocol = await hre.ethers.getContractFactory("LendingProtocol");
    const lendingProtocol = await LendingProtocol.deploy(
        "0x0000000000000000000000000000000000000000", // KAIA (native token, use zero address)
        usdtAddress,     // USDT
        usdyAddress,     // USDY (for collateral)
        kKAIAAddress,    // kKAIA LP token
        kUSDTAddress,    // kUSDT LP token
        deployer.address, // Dummy feed router (for fallback pricing)
        deployer.address  // Initial owner
    );
    await lendingProtocol.waitForDeployment();
    const lendingProtocolAddress = await lendingProtocol.getAddress();
    console.log("   ✅ LendingProtocol deployed to:", lendingProtocolAddress);
    
    console.log("\n🚀 PHASE 4: CONFIGURING LP TOKEN OWNERSHIP");
    console.log("==========================================");
    
    // Update LP token contracts to use the lending protocol
    console.log("🔧 Configuring kKAIA...");
    await kKAIA.updateLendingProtocol(lendingProtocolAddress);
    console.log("   ✅ kKAIA configured");
    
    console.log("🔧 Configuring kUSDT...");
    await kUSDT.updateLendingProtocol(lendingProtocolAddress);
    console.log("   ✅ kUSDT configured");
    
    console.log("\n🚀 PHASE 5: TESTING DEPLOYMENTS");
    console.log("===============================");
    
    // Test USDY faucet
    console.log("🧪 Testing USDY faucet...");
    const canClaim = await usdy.canClaimFromFaucet(deployer.address);
    if (canClaim) {
        await usdy.claimFromFaucet();
        const usdyBalance = await usdy.balanceOf(deployer.address);
        console.log("   ✅ USDY faucet claim successful! Balance:", hre.ethers.formatEther(usdyBalance));
    } else {
        console.log("   ⚠️  USDY faucet claim not available");
    }
    
    // Test DummyUSDT faucet
    console.log("🧪 Testing USDT faucet...");
    const canClaimUSDT = await dummyUSDT.canClaimFaucet(deployer.address);
    if (canClaimUSDT) {
        await dummyUSDT.faucet();
        const usdtBalance = await dummyUSDT.balanceOf(deployer.address);
        console.log("   ✅ USDT faucet claim successful! Balance:", hre.ethers.formatEther(usdtBalance));
    } else {
        console.log("   ⚠️  USDT faucet claim not available");
    }
    
    // Test pricing functions
    console.log("🧪 Testing price functions...");
    const kaiaPrice = await lendingProtocol.getKaiaPrice();
    const usdtPrice = await lendingProtocol.getUsdtPrice();
    console.log("   KAIA Price:", hre.ethers.formatEther(kaiaPrice), "USD");
    console.log("   USDT Price:", hre.ethers.formatEther(usdtPrice), "USD");
    
    // Test LP token prices
    const kUsdtPrice = await lendingProtocol.getLpPrice(kUSDTAddress);
    console.log("   kUSDT LP Price:", hre.ethers.formatEther(kUsdtPrice), "USDT");
    
    console.log("\n📊 DEPLOYMENT VERIFICATION");
    console.log("==========================");
    
    // Verify all contract details
    const usdyName = await usdy.name();
    const usdtName = await dummyUSDT.name();
    const kkaiaName = await kKAIA.name();
    const kusdtName = await kUSDT.name();
    
    console.log("Contract Details:");
    console.log("  USDY:", usdyName, "at", usdyAddress);
    console.log("  USDT:", usdtName, "at", usdtAddress);
    console.log("  kKAIA:", kkaiaName, "at", kKAIAAddress);
    console.log("  kUSDT:", kusdtName, "at", kUSDTAddress);
    console.log("  LendingProtocol at:", lendingProtocolAddress);
    
    // Save comprehensive deployment information
    const deploymentInfo = {
        network: hre.network.name,
        chainId: (await hre.ethers.provider.getNetwork()).chainId.toString(),
        deployer: deployer.address,
        deploymentTime: new Date().toISOString(),
        gasUsed: "TBD", // Would need to track gas usage
        contracts: {
            USDY: usdyAddress,
            DummyUSDT: usdtAddress,
            kKAIA: kKAIAAddress,
            kUSDT: kUSDTAddress,
            LendingProtocol: lendingProtocolAddress
        },
        contractDetails: {
            USDY: {
                name: usdyName,
                symbol: await usdy.symbol(),
                purpose: "RWA collateral token with faucet",
                faucetAmount: "1000 USDY per claim",
                cooldown: "24 hours"
            },
            DummyUSDT: {
                name: usdtName,
                symbol: await dummyUSDT.symbol(),
                purpose: "Lending/borrowing token with faucet",
                faucetAmount: "1000 USDT per claim",
                cooldown: "24 hours"
            },
            kKAIA: {
                name: kkaiaName,
                symbol: await kKAIA.symbol(),
                purpose: "LP token for KAIA lending"
            },
            kUSDT: {
                name: kusdtName,
                symbol: await kUSDT.symbol(),
                purpose: "LP token for USDT lending"
            },
            LendingProtocol: {
                purpose: "Main lending/borrowing contract",
                features: ["USDY collateral", "KAIA/USDT lending", "Bonding curve LP tokens", "Orakl price feeds"]
            }
        },
        pricing: {
            kaiaPrice: hre.ethers.formatEther(kaiaPrice) + " USD",
            usdtPrice: hre.ethers.formatEther(usdtPrice) + " USD",
            lpTokenPrice: hre.ethers.formatEther(kUsdtPrice) + " USDT"
        }
    };
    
    console.log("\n💾 SAVING DEPLOYMENT INFO");
    console.log("=========================");
    
    const fs = require('fs');
    fs.writeFileSync(
        './rwa-deployment-complete.json',
        JSON.stringify(deploymentInfo, null, 2)
    );
    
    console.log("✅ Deployment info saved to: rwa-deployment-complete.json");
    
    console.log("\n🔐 CONTRACT VERIFICATION COMMANDS");
    console.log("=================================");
    console.log("To verify contracts on Kaiascope, run:");
    console.log(`npx hardhat verify --network kairos ${usdyAddress}`);
    console.log(`npx hardhat verify --network kairos ${usdtAddress}`);
    console.log(`npx hardhat verify --network kairos ${kKAIAAddress} "Kaia LP Token" "kKAIA"`);
    console.log(`npx hardhat verify --network kairos ${kUSDTAddress} "USDT LP Token" "kUSDT"`);
    console.log(`npx hardhat verify --network kairos ${lendingProtocolAddress} "0x0000000000000000000000000000000000000000" ${usdtAddress} ${usdyAddress} ${kKAIAAddress} ${kUSDTAddress} ${deployer.address} ${deployer.address}`);
    
    console.log("\n🎉 COMPLETE RWA LENDING SYSTEM DEPLOYED!");
    console.log("========================================");
    console.log("📋 Summary:");
    console.log("  Network:", hre.network.name);
    console.log("  Total Contracts Deployed: 5");
    console.log("  RWA Token (USDY): ✅");
    console.log("  Lending Token (USDT): ✅");
    console.log("  LP Tokens (kKAIA, kUSDT): ✅");
    console.log("  Lending Protocol: ✅");
    console.log("  Pricing System: ✅");
    console.log("  Faucets: ✅");
    
    console.log("\n🚀 USER WORKFLOW NOW AVAILABLE:");
    console.log("===============================");
    console.log("1. 💧 Claim USDY from faucet (RWA tokens)");
    console.log("2. 🏦 Deposit USDY as collateral");
    console.log("3. 💰 Borrow USDT against USDY collateral");
    console.log("4. 🔄 Repay borrowed USDT");
    console.log("5. 💎 Withdraw USDY collateral");
    console.log("6. 📈 Earn yield by providing USDT liquidity (LP tokens)");
    
    console.log("\n📝 NEXT STEPS:");
    console.log("==============");
    console.log("1. Run comprehensive RWA workflow test");
    console.log("2. Test with multiple users");
    console.log("3. Verify all contracts on block explorer");
    console.log("4. Integrate with frontend");
    
    return deploymentInfo;
}

main().catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exitCode = 1;
});