const { ethers } = require("hardhat");

async function main() {
  console.log("=== Deploying Fixed RWA Lending Platform ===");
  
  const [deployer] = await ethers.getSigners();
  console.log("Deployer:", deployer.address);
  
  // Get existing deployment data
  const deploymentData = require('../deployment-info.json');
  const contracts = deploymentData.contracts;
  
  console.log("Existing contracts will be reused:");
  console.log("- Gold:", contracts.tokenizedGold);
  console.log("- Silver:", contracts.tokenizedSilver);
  console.log("- Real Estate:", contracts.tokenizedRealEstate);
  console.log("- USDT:", contracts.dummyUSDT);
  
  // Deploy new fixed lending platform
  console.log("\n🏦 Deploying Fixed RWA Lending Platform...");
  const RWALendingPlatform = await ethers.getContractFactory("RWALendingPlatformWithBondingCurves");
  const dummyOraklRouter = deployer.address; // Same as before
  const lendingPlatform = await RWALendingPlatform.deploy(dummyOraklRouter, deployer.address);
  await lendingPlatform.waitForDeployment();
  
  const newPlatformAddress = await lendingPlatform.getAddress();
  console.log("   ✅ Fixed RWA Lending Platform deployed to:", newPlatformAddress);
  
  // Configure gold asset (minimal for testing)
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
    "tGOLD-USD", // Price feed name
    false,  // canBorrow
    true,   // canCollateralize
    goldCurveConfig
  );
  console.log("   ✅ Gold configured with bonding curves");
  
  // Test the fix
  console.log("\n🔧 Testing Fixed getAssetPrice Function...");
  try {
    const goldPrice = await lendingPlatform.getAssetPrice(contracts.tokenizedGold);
    console.log("   ✅ getAssetPrice working! Price:", ethers.formatUnits(goldPrice, 8));
  } catch (e) {
    console.log("   ❌ getAssetPrice still failing:", e.message);
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
      const approveTx = await goldToken.approve(newPlatformAddress, depositAmount);
      await approveTx.wait();
      console.log("   ✅ Approval successful");
      
      // Deposit
      const depositTx = await lendingPlatform.deposit(contracts.tokenizedGold, depositAmount);
      await depositTx.wait();
      console.log("   ✅ Deposit successful!");
      
      // Check new balance
      const newBalance = await goldToken.balanceOf(deployer.address);
      console.log("   New gold balance:", ethers.formatEther(newBalance));
    }
  } catch (e) {
    console.log("   ❌ Deposit test failed:", e.message);
  }
  
  // Save updated deployment info
  const fs = require('fs');
  const updatedDeployment = {
    ...deploymentData,
    contracts: {
      ...contracts,
      lendingPlatform: newPlatformAddress,
      oldLendingPlatform: contracts.lendingPlatform
    },
    fixedAt: new Date().toISOString(),
    notes: "Fixed getAssetPrice function to handle dummy Orakl router"
  };
  
  fs.writeFileSync('../deployment-info-fixed.json', JSON.stringify(updatedDeployment, null, 2));
  console.log("\n✅ Updated deployment info saved to deployment-info-fixed.json");
  console.log("\n🎉 Fix deployment completed successfully!");
}

main().catch(console.error);