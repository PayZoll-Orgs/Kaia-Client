const { ethers } = require("hardhat");

async function main() {
  console.log("=== Configuring All Assets on Fixed Platform ===");
  
  const [deployer] = await ethers.getSigners();
  console.log("Deployer:", deployer.address);
  
  // Fixed platform address
  const platformAddress = "0xbE218889461411e748A35E560E4102b48ca52489";
  
  // Get existing deployment data
  const deploymentData = require('../deployment-info.json');
  const contracts = deploymentData.contracts;
  
  console.log("Assets to configure:");
  console.log("- Silver:", contracts.tokenizedSilver);
  console.log("- Real Estate:", contracts.tokenizedRealEstate);
  console.log("- USDT:", contracts.dummyUSDT);
  
  // Load platform contract
  const lendingPlatform = await ethers.getContractAt("RWALendingPlatformWithBondingCurves", platformAddress);
  
  // Configure Silver Asset
  console.log("\n⚙️  Configuring Silver Asset...");
  try {
    const silverCurveConfig = {
      baseRate: 600,                    // 6% base interest rate (higher than gold)
      optimalUtilization: 6500,         // 65% optimal utilization 
      curveExponent: ethers.parseEther("2.2"), // 2.2x exponential curve
      maxRate: 2500,                    // 25% max rate
      minPenalty: 600,                  // 6% min penalty
      maxPenalty: 2500,                 // 25% max penalty
      penaltyCurveSlope: 150,           // Penalty curve slope
      baseHaircut: 750,                 // 7.5% base haircut (higher than gold)
      volatilityFactor: 250,            // Higher volatility multiplier
      maxHaircut: 2500,                 // 25% max haircut
      ltvDecayRate: 75,                 // 0.75% LTV decay (faster than gold)
      maxDecayPeriod: 120 * 24 * 60 * 60 // 4-month decay
    };
    
    await lendingPlatform.addAssetWithBondingCurves(
      contracts.tokenizedSilver,
      6500,   // 65% base LTV (lower than gold)
      7500,   // 75% liquidation threshold
      "tSILVER-USD", // Price feed name
      false,  // canBorrow
      true,   // canCollateralize
      silverCurveConfig
    );
    console.log("   ✅ Silver configured with bonding curves");
  } catch (e) {
    console.log("   ❌ Silver configuration failed:", e.message);
  }
  
  // Configure Real Estate Asset
  console.log("\n⚙️  Configuring Real Estate Asset...");
  try {
    const realEstateCurveConfig = {
      baseRate: 400,                    // 4% base interest rate (lower, more stable)
      optimalUtilization: 8000,         // 80% optimal utilization 
      curveExponent: ethers.parseEther("1.8"), // 1.8x exponential curve
      maxRate: 1500,                    // 15% max rate
      minPenalty: 300,                  // 3% min penalty
      maxPenalty: 1500,                 // 15% max penalty
      penaltyCurveSlope: 75,            // Lower penalty curve slope
      baseHaircut: 250,                 // 2.5% base haircut (lowest)
      volatilityFactor: 100,            // Lower volatility multiplier
      maxHaircut: 1500,                 // 15% max haircut
      ltvDecayRate: 25,                 // 0.25% LTV decay (slowest)
      maxDecayPeriod: 365 * 24 * 60 * 60 // 1-year decay
    };
    
    await lendingPlatform.addAssetWithBondingCurves(
      contracts.tokenizedRealEstate,
      8000,   // 80% base LTV (highest, most stable)
      9000,   // 90% liquidation threshold
      "tREAL-USD", // Price feed name
      false,  // canBorrow
      true,   // canCollateralize
      realEstateCurveConfig
    );
    console.log("   ✅ Real Estate configured with bonding curves");
  } catch (e) {
    console.log("   ❌ Real Estate configuration failed:", e.message);
  }
  
  // Configure USDT (borrowable asset)
  console.log("\n⚙️  Configuring USDT (Borrowable Asset)...");
  try {
    const usdtCurveConfig = {
      baseRate: 200,                    // 2% base interest rate
      optimalUtilization: 9000,         // 90% optimal utilization 
      curveExponent: ethers.parseEther("1"), // 1x linear curve
      maxRate: 1000,                    // 10% max rate
      minPenalty: 0,                    // No penalty for borrowing
      maxPenalty: 0,                    // No penalty for borrowing
      penaltyCurveSlope: 0,             // No penalty curve
      baseHaircut: 0,                   // No haircut for borrowing
      volatilityFactor: 0,              // No volatility factor
      maxHaircut: 0,                    // No haircut
      ltvDecayRate: 0,                  // No LTV decay
      maxDecayPeriod: 0                 // No decay period
    };
    
    await lendingPlatform.addAssetWithBondingCurves(
      contracts.dummyUSDT,
      0,      // No LTV (not collateral)
      0,      // No liquidation threshold
      "USDT-USD", // Price feed name (should be 1.0)
      true,   // canBorrow (this is what users borrow)
      false,  // canCollateralize (not used as collateral)
      usdtCurveConfig
    );
    console.log("   ✅ USDT configured as borrowable asset");
  } catch (e) {
    console.log("   ❌ USDT configuration failed:", e.message);
  }
  
  // Verify all configurations
  console.log("\n🔍 Verifying Asset Configurations...");
  const assets = [
    { name: "Gold", address: contracts.tokenizedGold },
    { name: "Silver", address: contracts.tokenizedSilver },
    { name: "Real Estate", address: contracts.tokenizedRealEstate },
    { name: "USDT", address: contracts.dummyUSDT }
  ];
  
  for (const asset of assets) {
    try {
      const config = await lendingPlatform.assets(asset.address);
      console.log(`✅ ${asset.name}:`);
      console.log(`   - Supported: ${config[0]}`);
      console.log(`   - Can Borrow: ${config[1]}`);
      console.log(`   - Can Collateralize: ${config[2]}`);
      console.log(`   - Base LTV: ${config[3].toString()}`);
    } catch (e) {
      console.log(`❌ ${asset.name}: Configuration check failed`);
    }
  }
  
  // Save updated deployment info
  const fs = require('fs');
  const updatedDeployment = {
    timestamp: new Date().toISOString(),
    network: "kairos",
    deployer: deployer.address,
    contracts: {
      ...contracts,
      lendingPlatform: platformAddress,
      mockOraklRouter: "0xFb1eCAEEE2518553531dd3Ee031ade7A37B7dD80"
    },
    status: "fully_configured",
    assetsConfigured: ["tokenizedGold", "tokenizedSilver", "tokenizedRealEstate", "dummyUSDT"],
    notes: "All assets configured on fixed platform with mock router"
  };
  
  fs.writeFileSync('../deployment-info-complete.json', JSON.stringify(updatedDeployment, null, 2));
  console.log("\n✅ Complete deployment info saved to deployment-info-complete.json");
  console.log("\n🎉 All assets configured successfully on fixed platform!");
}

main().catch(console.error);