const { ethers } = require("hardhat");

async function main() {
  console.log("=== Deploying RWA Platform with Mock Orakl Router ===");
  
  const [deployer] = await ethers.getSigners();
  console.log("Deployer:", deployer.address);
  
  // Get existing deployment data
  const deploymentData = require('../deployment-info.json');
  const contracts = deploymentData.contracts;
  
  console.log("Existing contracts will be reused:");
  console.log("- Gold:", contracts.tokenizedGold);
  
  // Deploy mock Orakl router first
  console.log("\n📡 Deploying Mock Orakl Router...");
  const MockOraklRouter = await ethers.getContractFactory("MockOraklRouter");
  const mockRouter = await MockOraklRouter.deploy();
  await mockRouter.waitForDeployment();
  
  const mockRouterAddress = await mockRouter.getAddress();
  console.log("   ✅ Mock Orakl Router deployed to:", mockRouterAddress);
  
  // Deploy lending platform with mock router
  console.log("\n🏦 Deploying RWA Lending Platform...");
  const RWALendingPlatform = await ethers.getContractFactory("RWALendingPlatformWithBondingCurves");
  const lendingPlatform = await RWALendingPlatform.deploy(mockRouterAddress, deployer.address);
  await lendingPlatform.waitForDeployment();
  
  const platformAddress = await lendingPlatform.getAddress();
  console.log("   ✅ RWA Lending Platform deployed to:", platformAddress);
  
  // Configure gold asset
  console.log("\n⚙️  Configuring Gold Asset...");
  const goldCurveConfig = {
    baseRate: 500,                    // 5% base interest rate
    optimalUtilization: 7000,         // 70% optimal utilization 
    curveExponent: ethers.parseEther("2"), // 2x exponential curve
    maxRate: 2000,                    // 20% max rate
    minPenalty: 500,                  // 5% min penalty
    maxPenalty: 2000,                 // 20% max penalty
    penaltyCurveSlope: 100,           // Penalty curve slope
    baseHaircut: 500,                 // 5% base haircut
    volatilityFactor: 200,            // Volatility multiplier
    maxHaircut: 2000,                 // 20% max haircut
    ltvDecayRate: 50,                 // 0.5% LTV decay
    maxDecayPeriod: 180 * 24 * 60 * 60 // 6-month decay
  };
  
  await lendingPlatform.addAssetWithBondingCurves(
    contracts.tokenizedGold,
    7500,   // 75% base LTV
    8500,   // 85% liquidation threshold
    "tGOLD-USD", // Price feed name (will use fallback)
    false,  // canBorrow
    true,   // canCollateralize
    goldCurveConfig
  );
  console.log("   ✅ Gold configured with bonding curves");
  
  // Test the price function
  console.log("\n🔧 Testing getAssetPrice Function...");
  try {
    const goldPrice = await lendingPlatform.getAssetPrice(contracts.tokenizedGold);
    console.log("   ✅ getAssetPrice working! Price:", ethers.formatUnits(goldPrice, 8));
  } catch (e) {
    console.log("   ❌ getAssetPrice failed:", e.message);
    return;
  }
  
  // Test deposit
  console.log("\n🔧 Testing Deposit Function...");
  const goldToken = await ethers.getContractAt("TokenizedGold", contracts.tokenizedGold);
  
  try {
    const balance = await goldToken.balanceOf(deployer.address);
    console.log("   Current gold balance:", ethers.formatEther(balance));
    
    if (balance > 0) {
      const depositAmount = ethers.parseEther("0.1");
      
      // Approve
      console.log("   Approving tokens...");
      const approveTx = await goldToken.approve(platformAddress, depositAmount);
      await approveTx.wait();
      console.log("   ✅ Approval successful");
      
      // Deposit
      console.log("   Attempting deposit...");
      const depositTx = await lendingPlatform.deposit(contracts.tokenizedGold, depositAmount);
      await depositTx.wait();
      console.log("   ✅ Deposit successful!");
      
      // Check new balance
      const newBalance = await goldToken.balanceOf(deployer.address);
      console.log("   New gold balance:", ethers.formatEther(newBalance));
      
      // Check platform deposits
      const assetConfig = await lendingPlatform.assets(contracts.tokenizedGold);
      console.log("   Platform total deposits:", ethers.formatEther(assetConfig[7]));
    }
  } catch (e) {
    console.log("   ❌ Deposit test failed:", e.message);
  }
  
  // Save deployment info
  const fs = require('fs');
  const updatedDeployment = {
    ...deploymentData,
    contracts: {
      ...contracts,
      lendingPlatform: platformAddress,
      mockOraklRouter: mockRouterAddress,
      originalLendingPlatform: contracts.lendingPlatform
    },
    deployedWithMockRouter: true,
    deployedAt: new Date().toISOString()
  };
  
  fs.writeFileSync('../deployment-info-with-mock.json', JSON.stringify(updatedDeployment, null, 2));
  console.log("\n✅ Deployment info saved to deployment-info-with-mock.json");
  console.log("\n🎉 Deployment with mock router completed successfully!");
}

main().catch(console.error);