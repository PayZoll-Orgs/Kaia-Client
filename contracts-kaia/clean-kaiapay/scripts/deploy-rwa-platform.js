const { ethers } = require("hardhat");

// Existing DummyUSDT on Kaia testnet
const KAIA_DUMMY_USDT = "0x07bA937403023CcD444923B183d42438b7057811";

/**
 * Comprehensive RWA Platform Deployment Script for Kaia Testnet
 * Deploys all contracts with proper bonding curve configurations
 */
async function main() {
  console.log("🚀 Starting RWA Platform Deployment on Kaia Testnet...\n");
  
  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying contracts with account:", deployer.address);
  console.log("💰 Account balance:", ethers.formatEther(await deployer.provider.getBalance(deployer.address)), "KAIA\n");

  const deployedContracts = {};
  
  try {
    // =============================================================================
    // STEP 1: DEPLOY RWA COLLATERAL TOKENS
    // =============================================================================
    console.log("📦 Step 1: Deploying RWA Collateral Tokens...");
    
    // Deploy Tokenized Gold
    console.log("   🥇 Deploying Tokenized Gold...");
    const TokenizedGold = await ethers.getContractFactory("TokenizedGold");
    const goldToken = await TokenizedGold.deploy();
    await goldToken.waitForDeployment();
    deployedContracts.tokenizedGold = await goldToken.getAddress();
    console.log("   ✅ TokenizedGold deployed to:", deployedContracts.tokenizedGold);
    
    // Deploy Tokenized Silver
    console.log("   🥈 Deploying Tokenized Silver...");
    const TokenizedSilver = await ethers.getContractFactory("TokenizedSilver");
    const silverToken = await TokenizedSilver.deploy();
    await silverToken.waitForDeployment();
    deployedContracts.tokenizedSilver = await silverToken.getAddress();
    console.log("   ✅ TokenizedSilver deployed to:", deployedContracts.tokenizedSilver);
    
    // Deploy Tokenized Real Estate
    console.log("   🏠 Deploying Tokenized Real Estate...");
    const TokenizedRealEstate = await ethers.getContractFactory("TokenizedRealEstate");
    const realEstateToken = await TokenizedRealEstate.deploy();
    await realEstateToken.waitForDeployment();
    deployedContracts.tokenizedRealEstate = await realEstateToken.getAddress();
    console.log("   ✅ TokenizedRealEstate deployed to:", deployedContracts.tokenizedRealEstate);
    
    // Use existing DummyUSDT
    deployedContracts.dummyUSDT = KAIA_DUMMY_USDT;
    console.log("   💵 Using existing DummyUSDT at:", deployedContracts.dummyUSDT);
    
    // =============================================================================
    // STEP 2: DEPLOY MAIN RWA LENDING PLATFORM
    // =============================================================================
    console.log("\n🏦 Step 2: Deploying RWA Lending Platform...");
    
    const RWALendingPlatform = await ethers.getContractFactory("RWALendingPlatformWithBondingCurves");
    // For testnet, we'll use a dummy orakl router address or deployer address
    const dummyOraklRouter = deployer.address; // Using deployer address as dummy for testnet
    const lendingPlatform = await RWALendingPlatform.deploy(dummyOraklRouter, deployer.address);
    await lendingPlatform.waitForDeployment();
    deployedContracts.lendingPlatform = await lendingPlatform.getAddress();
    console.log("   ✅ RWA Lending Platform deployed to:", deployedContracts.lendingPlatform);
    
    // =============================================================================
    // STEP 3: CONFIGURE ASSETS WITH BONDING CURVES
    // =============================================================================
    console.log("\n⚙️  Step 3: Configuring Assets with Bonding Curves...");
    
    // Configure Gold with Conservative Bonding Curves
    console.log("   🥇 Configuring Gold with bonding curves...");
    const goldCurveConfig = {
      baseRate: 300,              // 3% base interest
      optimalUtilization: 7000,   // 70% optimal point
      curveExponent: ethers.parseEther("2"), // Quadratic increase
      maxRate: 1500,              // 15% maximum rate
      minPenalty: 800,            // 8% minimum liquidation penalty
      maxPenalty: 1500,           // 15% maximum penalty
      penaltyCurveSlope: 100,     // Penalty increase rate
      baseHaircut: 500,           // 5% base collateral haircut
      volatilityFactor: 1000,     // Moderate volatility sensitivity
      maxHaircut: 2000,           // 20% maximum haircut
      ltvDecayRate: 50,           // 0.5% LTV decay per period
      maxDecayPeriod: 180 * 24 * 60 * 60 // 6-month decay period
    };
    
    await lendingPlatform.addAssetWithBondingCurves(
      deployedContracts.tokenizedGold,
      7500,   // 75% base LTV
      8500,   // 85% liquidation threshold
      "tGOLD-USD", // Price feed name
      false,  // canBorrow (collateral only)
      true,   // canCollateralize
      goldCurveConfig
    );
    console.log("   ✅ Gold configured with bonding curves");
    
    // Configure Silver with Higher Volatility Curves
    console.log("   🥈 Configuring Silver with bonding curves...");
    const silverCurveConfig = {
      baseRate: 400,              // 4% base interest (higher than gold)
      optimalUtilization: 6000,   // 60% optimal (lower than gold)
      curveExponent: ethers.parseEther("3"), // Cubic increase (steeper)
      maxRate: 2000,              // 20% maximum rate
      minPenalty: 1000,           // 10% minimum penalty (higher risk)
      maxPenalty: 2000,           // 20% maximum penalty
      penaltyCurveSlope: 150,     // Faster penalty increases
      baseHaircut: 800,           // 8% base haircut (more volatile)
      volatilityFactor: 1500,     // Higher volatility sensitivity
      maxHaircut: 2500,           // 25% maximum haircut
      ltvDecayRate: 75,           // 0.75% LTV decay (faster)
      maxDecayPeriod: 120 * 24 * 60 * 60 // 4-month decay
    };
    
    await lendingPlatform.addAssetWithBondingCurves(
      deployedContracts.tokenizedSilver,
      6500,   // 65% base LTV (lower than gold)
      7500,   // 75% liquidation threshold
      "tSILVER-USD",
      false,  // canBorrow (collateral only)
      true,   // canCollateralize
      silverCurveConfig
    );
    console.log("   ✅ Silver configured with bonding curves");
    
    // Configure Real Estate with Stable Asset Curves
    console.log("   🏠 Configuring Real Estate with bonding curves...");
    const realEstateCurveConfig = {
      baseRate: 250,              // 2.5% base (most stable)
      optimalUtilization: 8000,   // 80% optimal (very stable)
      curveExponent: ethers.parseEther("2"), // Quadratic increase
      maxRate: 1200,              // 12% maximum
      minPenalty: 600,            // 6% minimum (lowest risk)
      maxPenalty: 1200,           // 12% maximum
      penaltyCurveSlope: 75,      // Gentle penalty increases
      baseHaircut: 300,           // 3% base (most stable)
      volatilityFactor: 500,      // Low volatility sensitivity
      maxHaircut: 1500,           // 15% maximum
      ltvDecayRate: 25,           // 0.25% decay (slowest)
      maxDecayPeriod: 365 * 24 * 60 * 60 // 1-year decay
    };
    
    await lendingPlatform.addAssetWithBondingCurves(
      deployedContracts.tokenizedRealEstate,
      8000,   // 80% base LTV (highest, most stable)
      9000,   // 90% liquidation threshold
      "tREAL-USD",
      false,  // canBorrow (collateral only)
      true,   // canCollateralize
      realEstateCurveConfig
    );
    console.log("   ✅ Real Estate configured with bonding curves");
    
    // Configure DummyUSDT as Borrowable Asset
    console.log("   💵 Configuring DummyUSDT as borrowable asset...");
    const usdtCurveConfig = {
      baseRate: 200,              // 2% base borrowing rate
      optimalUtilization: 8000,   // 80% optimal utilization
      curveExponent: ethers.parseEther("2"), // Quadratic supply curve
      maxRate: 1500,              // 15% maximum rate
      minPenalty: 0,              // No liquidation penalty (stable asset)
      maxPenalty: 0,
      penaltyCurveSlope: 0,
      baseHaircut: 0,             // No haircut (borrowable, not collateral)
      volatilityFactor: 0,
      maxHaircut: 0,
      ltvDecayRate: 0,            // No LTV decay
      maxDecayPeriod: 0
    };
    
    await lendingPlatform.addAssetWithBondingCurves(
      KAIA_DUMMY_USDT,
      0,      // No LTV (not collateral)
      0,      // No liquidation threshold
      "USDT-USD", // Price feed (should be 1.0)
      true,   // canBorrow (this is what users borrow)
      false,  // canCollateralize (not used as collateral)
      usdtCurveConfig
    );
    console.log("   ✅ DummyUSDT configured as borrowable asset");
    
    // =============================================================================
    // STEP 4: DEPLOY DEMO CONTRACT
    // =============================================================================
    console.log("\n🎮 Step 4: Deploying Demo Contract...");
    
    const KaiaBondingCurveDemo = await ethers.getContractFactory("KaiaBondingCurveDemo");
    const demoContract = await KaiaBondingCurveDemo.deploy(
      deployedContracts.lendingPlatform,
      deployedContracts.tokenizedGold,
      deployedContracts.tokenizedSilver,
      deployedContracts.tokenizedRealEstate,
      KAIA_DUMMY_USDT
    );
    await demoContract.waitForDeployment();
    deployedContracts.demoContract = await demoContract.getAddress();
    console.log("   ✅ Demo Contract deployed to:", deployedContracts.demoContract);
    
    // =============================================================================
    // STEP 5: FUND PLATFORM WITH INITIAL LIQUIDITY
    // =============================================================================
    console.log("\n💧 Step 5: Setting up initial liquidity...");
    
    // Fund platform with DummyUSDT for lending
    try {
      const dummyUSDT = await ethers.getContractAt("DummyUSDT", KAIA_DUMMY_USDT);
      
      // Claim from faucet if possible
      try {
        console.log("   🚰 Claiming DummyUSDT from faucet...");
        const faucetTx = await dummyUSDT.faucet();
        await faucetTx.wait();
        console.log("   ✅ Claimed DummyUSDT from faucet");
      } catch (faucetError) {
        console.log("   ⚠️  Faucet claim failed (may be on cooldown):", faucetError.reason || faucetError.message);
      }
      
      const balance = await dummyUSDT.balanceOf(deployer.address);
      console.log("   💰 Deployer DummyUSDT balance:", ethers.formatEther(balance));
      
      if (balance > 0) {
        // Transfer some DummyUSDT to lending platform for initial liquidity
        const liquidityAmount = balance / 2n; // Use half of balance
        console.log("   💧 Depositing", ethers.formatEther(liquidityAmount), "DummyUSDT to platform...");
        
        const approveTx = await dummyUSDT.approve(deployedContracts.lendingPlatform, liquidityAmount);
        await approveTx.wait();
        
        const depositTx = await lendingPlatform.deposit(KAIA_DUMMY_USDT, liquidityAmount);
        await depositTx.wait();
        console.log("   ✅ Initial liquidity deposited");
      }
    } catch (liquidityError) {
      console.log("   ⚠️  Initial liquidity setup failed:", liquidityError.message);
    }
    
    // =============================================================================
    // STEP 6: VERIFY DEPLOYMENT
    // =============================================================================
    console.log("\n🔍 Step 6: Verifying deployment...");
    
    // Check platform configuration
    const supportedAssets = [];
    try {
      for (let i = 0; i < 10; i++) { // Check up to 10 assets
        const asset = await lendingPlatform.supportedAssets(i);
        supportedAssets.push(asset);
      }
    } catch {
      // End of array reached
    }
    
    console.log("   📋 Supported assets count:", supportedAssets.length);
    console.log("   📋 Supported assets:", supportedAssets);
    
    // Check bonding curve metrics for each asset
    for (const asset of supportedAssets) {
      try {
        const metrics = await lendingPlatform.getBondingCurveMetrics(asset);
        console.log(`   📊 ${asset} metrics:`, {
          currentRate: metrics[0].toString(),
          utilization: metrics[1].toString(),
          avgVolatility: metrics[2].toString(),
          collateralHaircut: metrics[3].toString(),
          curveValue: metrics[4].toString()
        });
      } catch (metricsError) {
        console.log(`   ⚠️  Failed to get metrics for ${asset}:`, metricsError.message);
      }
    }
    
    // =============================================================================
    // DEPLOYMENT SUMMARY
    // =============================================================================
    console.log("\n🎉 ============================================");
    console.log("🎉 RWA PLATFORM DEPLOYMENT COMPLETED!");
    console.log("🎉 ============================================\n");
    
    console.log("📋 DEPLOYED CONTRACTS:");
    console.log("   🥇 Tokenized Gold:", deployedContracts.tokenizedGold);
    console.log("   🥈 Tokenized Silver:", deployedContracts.tokenizedSilver);
    console.log("   🏠 Tokenized Real Estate:", deployedContracts.tokenizedRealEstate);
    console.log("   💵 DummyUSDT (existing):", deployedContracts.dummyUSDT);
    console.log("   🏦 RWA Lending Platform:", deployedContracts.lendingPlatform);
    console.log("   🎮 Demo Contract:", deployedContracts.demoContract);
    
    console.log("\n📊 BONDING CURVE CONFIGURATION:");
    console.log("   🥇 Gold: Conservative (3% base, 75% LTV, 6-month decay)");
    console.log("   🥈 Silver: Volatile (4% base, 65% LTV, 4-month decay)");
    console.log("   🏠 Real Estate: Stable (2.5% base, 80% LTV, 1-year decay)");
    console.log("   💵 DummyUSDT: Borrowable (2% base, liquid asset)");
    
    console.log("\n🚀 NEXT STEPS:");
    console.log("   1. Run pre-deployment verification: npm run verify:pre");
    console.log("   2. Run post-deployment verification: npm run verify:post");
    console.log("   3. Run user flow tests: npm run test:flow");
    console.log("   4. Start using the RWA lending platform!");
    
    console.log("\n💡 QUICK START:");
    console.log("   1. Get RWA tokens from faucets:");
    console.log(`      - Gold.faucet() at ${deployedContracts.tokenizedGold}`);
    console.log(`      - Silver.faucet() at ${deployedContracts.tokenizedSilver}`);
    console.log(`      - RealEstate.faucet() at ${deployedContracts.tokenizedRealEstate}`);
    console.log(`      - DummyUSDT.faucet() at ${deployedContracts.dummyUSDT}`);
    console.log("   2. Deposit RWA tokens as collateral");
    console.log("   3. Borrow DummyUSDT with dynamic LTV calculations");
    console.log("   4. Experience bonding curve-driven interest rates!");
    
    // Save deployment info to file
    const fs = require('fs');
    const deploymentInfo = {
      timestamp: new Date().toISOString(),
      network: "kairos",
      deployer: deployer.address,
      contracts: deployedContracts
    };
    
    fs.writeFileSync('./deployment-info.json', JSON.stringify(deploymentInfo, null, 2));
    console.log("\n💾 Deployment info saved to deployment-info.json");
    
    return deployedContracts;
    
  } catch (error) {
    console.error("\n❌ Deployment failed:", error);
    throw error;
  }
}

// Execute deployment
if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error("❌ Fatal error:", error);
      process.exit(1);
    });
}

module.exports = { main };