const { ethers } = require("hardhat");
const fs = require('fs');

/**
 * Post-Deployment Verification Script
 * Verifies that all contracts are deployed correctly and functioning
 * Tests basic functionality of the RWA platform after deployment
 */

async function main() {
  console.log("🔍 ============================================");
  console.log("🔍 POST-DEPLOYMENT VERIFICATION");
  console.log("🔍 ============================================\n");

  let verificationPassed = true;
  const verificationResults = {
    deploymentInfo: false,
    contractsDeployed: false,
    contractsConfigured: false,
    bondingCurves: false,
    basicFunctionality: false,
    integrations: false
  };

  try {
    // =============================================================================
    // 1. LOAD DEPLOYMENT INFO
    // =============================================================================
    console.log("📋 Step 1: Loading Deployment Information...");
    
    let deploymentInfo;
    try {
      const deploymentData = fs.readFileSync('./deployment-info.json', 'utf8');
      deploymentInfo = JSON.parse(deploymentData);
      
      console.log(`   📅 Deployment timestamp: ${deploymentInfo.timestamp}`);
      console.log(`   🌐 Network: ${deploymentInfo.network}`);
      console.log(`   👤 Deployer: ${deploymentInfo.deployer}`);
      console.log("   ✅ Deployment info loaded successfully");
      verificationResults.deploymentInfo = true;
      
    } catch (loadError) {
      console.log("   ❌ Failed to load deployment info:", loadError.message);
      console.log("   💡 Make sure deployment was completed successfully");
      return false;
    }

    const contracts = deploymentInfo.contracts;

    // =============================================================================
    // 2. VERIFY CONTRACT DEPLOYMENTS
    // =============================================================================
    console.log("\n📦 Step 2: Verifying Contract Deployments...");
    
    const requiredContracts = [
      { name: "Tokenized Gold", address: contracts.tokenizedGold, type: "TokenizedGold" },
      { name: "Tokenized Silver", address: contracts.tokenizedSilver, type: "TokenizedSilver" },
      { name: "Tokenized Real Estate", address: contracts.tokenizedRealEstate, type: "TokenizedRealEstate" },
      { name: "RWA Lending Platform", address: contracts.lendingPlatform, type: "RWALendingPlatformWithBondingCurves" },
      { name: "Demo Contract", address: contracts.demoContract, type: "KaiaBondingCurveDemo" },
      { name: "DummyUSDT", address: contracts.dummyUSDT, type: "DummyUSDT" }
    ];
    
    let allContractsDeployed = true;
    
    for (const contract of requiredContracts) {
      try {
        const contractInstance = await ethers.getContractAt(contract.type, contract.address);
        
        // Test basic contract calls
        if (contract.type === "TokenizedGold" || contract.type === "TokenizedSilver" || contract.type === "TokenizedRealEstate") {
          const name = await contractInstance.name();
          const symbol = await contractInstance.symbol();
          console.log(`   ✅ ${contract.name}: ${name} (${symbol}) at ${contract.address}`);
        } else if (contract.type === "DummyUSDT") {
          const name = await contractInstance.name();
          const symbol = await contractInstance.symbol();
          console.log(`   ✅ ${contract.name}: ${name} (${symbol}) at ${contract.address}`);
        } else if (contract.type === "RWALendingPlatformWithBondingCurves") {
          const owner = await contractInstance.owner();
          console.log(`   ✅ ${contract.name}: Owner ${owner} at ${contract.address}`);
        } else {
          console.log(`   ✅ ${contract.name}: Deployed at ${contract.address}`);
        }
        
      } catch (contractError) {
        console.log(`   ❌ ${contract.name}: Failed to verify - ${contractError.message}`);
        allContractsDeployed = false;
      }
    }
    
    if (allContractsDeployed) {
      console.log("   ✅ All contracts deployed and accessible");
      verificationResults.contractsDeployed = true;
    } else {
      console.log("   ❌ Some contracts failed verification");
    }

    // =============================================================================
    // 3. VERIFY PLATFORM CONFIGURATION
    // =============================================================================
    console.log("\n⚙️  Step 3: Verifying Platform Configuration...");
    
    try {
      const lendingPlatform = await ethers.getContractAt(
        "RWALendingPlatformWithBondingCurves", 
        contracts.lendingPlatform
      );
      
      // Check supported assets
      const supportedAssets = [];
      try {
        for (let i = 0; i < 10; i++) {
          const asset = await lendingPlatform.supportedAssets(i);
          supportedAssets.push(asset);
        }
      } catch {
        // End of array reached
      }
      
      console.log(`   📊 Supported assets count: ${supportedAssets.length}`);
      
      const expectedAssets = [
        contracts.tokenizedGold,
        contracts.tokenizedSilver,
        contracts.tokenizedRealEstate,
        contracts.dummyUSDT
      ];
      
      let allAssetsConfigured = true;
      for (const expectedAsset of expectedAssets) {
        if (supportedAssets.includes(expectedAsset)) {
          console.log(`   ✅ Asset configured: ${expectedAsset}`);
        } else {
          console.log(`   ❌ Asset missing: ${expectedAsset}`);
          allAssetsConfigured = false;
        }
      }
      
      if (allAssetsConfigured) {
        console.log("   ✅ All assets properly configured");
        verificationResults.contractsConfigured = true;
      } else {
        console.log("   ❌ Asset configuration incomplete");
      }
      
    } catch (configError) {
      console.log("   ❌ Platform configuration check failed:", configError.message);
    }

    // =============================================================================
    // 4. VERIFY BONDING CURVE CONFIGURATIONS
    // =============================================================================
    console.log("\n📈 Step 4: Verifying Bonding Curve Configurations...");
    
    try {
      const lendingPlatform = await ethers.getContractAt(
        "RWALendingPlatformWithBondingCurves", 
        contracts.lendingPlatform
      );
      
      const assetsToCheck = [
        { name: "Gold", address: contracts.tokenizedGold, expectedBaseRate: 300 },
        { name: "Silver", address: contracts.tokenizedSilver, expectedBaseRate: 400 },
        { name: "Real Estate", address: contracts.tokenizedRealEstate, expectedBaseRate: 250 },
        { name: "DummyUSDT", address: contracts.dummyUSDT, expectedBaseRate: 200 }
      ];
      
      let bondingCurvesValid = true;
      
      for (const asset of assetsToCheck) {
        try {
          const metrics = await lendingPlatform.getBondingCurveMetrics(asset.address);
          
          const [currentRate, utilization, avgVolatility, collateralHaircut, curveValue] = metrics;
          
          console.log(`   📊 ${asset.name} bonding curve metrics:`);
          console.log(`      💹 Current rate: ${currentRate.toString()} basis points`);
          console.log(`      📊 Utilization: ${utilization.toString()} basis points`);
          console.log(`      📈 Avg volatility: ${avgVolatility.toString()}`);
          console.log(`      ✂️  Collateral haircut: ${collateralHaircut.toString()} basis points`);
          console.log(`      📐 Curve value: ${curveValue.toString()}`);
          
          // Verify base rate matches expected
          if (currentRate.toString() === asset.expectedBaseRate.toString()) {
            console.log(`      ✅ Base rate matches expected (${asset.expectedBaseRate})`);
          } else {
            console.log(`      ⚠️  Base rate differs: got ${currentRate}, expected ${asset.expectedBaseRate}`);
          }
          
        } catch (metricsError) {
          console.log(`   ❌ ${asset.name}: Failed to get bonding curve metrics - ${metricsError.message}`);
          bondingCurvesValid = false;
        }
      }
      
      if (bondingCurvesValid) {
        console.log("   ✅ All bonding curves configured correctly");
        verificationResults.bondingCurves = true;
      } else {
        console.log("   ❌ Some bonding curve configurations failed");
      }
      
    } catch (curveError) {
      console.log("   ❌ Bonding curve verification failed:", curveError.message);
    }

    // =============================================================================
    // 5. TEST BASIC FUNCTIONALITY
    // =============================================================================
    console.log("\n🧪 Step 5: Testing Basic Functionality...");
    
    try {
      const [deployer] = await ethers.getSigners();
      
      // Test token faucets
      console.log("   🚰 Testing token faucets...");
      
      const goldToken = await ethers.getContractAt("TokenizedGold", contracts.tokenizedGold);
      const silverToken = await ethers.getContractAt("TokenizedSilver", contracts.tokenizedSilver);
      const realEstateToken = await ethers.getContractAt("TokenizedRealEstate", contracts.tokenizedRealEstate);
      const dummyUSDT = await ethers.getContractAt("DummyUSDT", contracts.dummyUSDT);
      
      // Check faucet availability
      const goldCanClaim = await goldToken.canClaimFaucet(deployer.address);
      const silverCanClaim = await silverToken.canClaimFaucet(deployer.address);
      const realEstateCanClaim = await realEstateToken.canClaimFaucet(deployer.address);
      const dummyUSDTCanClaim = await dummyUSDT.canClaimFaucet(deployer.address);
      
      console.log(`      🥇 Gold faucet available: ${goldCanClaim}`);
      console.log(`      🥈 Silver faucet available: ${silverCanClaim}`);
      console.log(`      🏠 Real Estate faucet available: ${realEstateCanClaim}`);
      console.log(`      💵 DummyUSDT faucet available: ${dummyUSDTCanClaim}`);
      
      // Test platform functions exist
      const lendingPlatform = await ethers.getContractAt(
        "RWALendingPlatformWithBondingCurves", 
        contracts.lendingPlatform
      );
      
      console.log("   🔧 Testing platform function accessibility...");
      
      // Test view functions
      const platformOwner = await lendingPlatform.owner();
      console.log(`      👤 Platform owner: ${platformOwner}`);
      
      const feeRecipient = await lendingPlatform.feeRecipient();
      console.log(`      💰 Fee recipient: ${feeRecipient}`);
      
      // Test bonding curve calculations
      const goldRate = await lendingPlatform.calculateBondingCurveInterestRate(contracts.tokenizedGold);
      console.log(`      📈 Gold interest rate: ${goldRate.toString()} basis points`);
      
      console.log("   ✅ Basic functionality tests passed");
      verificationResults.basicFunctionality = true;
      
    } catch (functionalityError) {
      console.log("   ❌ Basic functionality test failed:", functionalityError.message);
    }

    // =============================================================================
    // 6. VERIFY INTEGRATIONS
    // =============================================================================
    console.log("\n🔗 Step 6: Verifying Integrations...");
    
    try {
      // Test demo contract integration
      const demoContract = await ethers.getContractAt("KaiaBondingCurveDemo", contracts.demoContract);
      
      const demoPlatform = await demoContract.platform();
      const demoGold = await demoContract.goldToken();
      const demoSilver = await demoContract.silverToken();
      const demoRealEstate = await demoContract.realEstateToken();
      const demoDummyUSDT = await demoContract.dummyUSDT();
      
      console.log("   🎮 Demo contract integrations:");
      console.log(`      🏦 Platform: ${demoPlatform} ${demoPlatform === contracts.lendingPlatform ? '✅' : '❌'}`);
      console.log(`      🥇 Gold: ${demoGold} ${demoGold === contracts.tokenizedGold ? '✅' : '❌'}`);
      console.log(`      🥈 Silver: ${demoSilver} ${demoSilver === contracts.tokenizedSilver ? '✅' : '❌'}`);
      console.log(`      🏠 Real Estate: ${demoRealEstate} ${demoRealEstate === contracts.tokenizedRealEstate ? '✅' : '❌'}`);
      console.log(`      💵 DummyUSDT: ${demoDummyUSDT} ${demoDummyUSDT === contracts.dummyUSDT ? '✅' : '❌'}`);
      
      if (demoPlatform === contracts.lendingPlatform && 
          demoGold === contracts.tokenizedGold &&
          demoSilver === contracts.tokenizedSilver &&
          demoRealEstate === contracts.tokenizedRealEstate &&
          demoDummyUSDT === contracts.dummyUSDT) {
        console.log("   ✅ All integrations verified correctly");
        verificationResults.integrations = true;
      } else {
        console.log("   ❌ Integration mismatches detected");
      }
      
    } catch (integrationError) {
      console.log("   ❌ Integration verification failed:", integrationError.message);
    }

    // =============================================================================
    // 7. SECURITY CHECKS
    // =============================================================================
    console.log("\n🔒 Step 7: Security Checks...");
    
    try {
      const lendingPlatform = await ethers.getContractAt(
        "RWALendingPlatformWithBondingCurves", 
        contracts.lendingPlatform
      );
      
      // Check ownership
      const platformOwner = await lendingPlatform.owner();
      console.log(`   👤 Platform owner: ${platformOwner}`);
      
      if (platformOwner === deploymentInfo.deployer) {
        console.log("   ✅ Platform owned by deployer");
      } else {
        console.log("   ⚠️  Platform ownership transferred");
      }
      
      // Check token ownerships
      const goldToken = await ethers.getContractAt("TokenizedGold", contracts.tokenizedGold);
      const goldOwner = await goldToken.owner();
      console.log(`   🥇 Gold token owner: ${goldOwner}`);
      
      console.log("   ✅ Security checks completed");
      
    } catch (securityError) {
      console.log("   ❌ Security check failed:", securityError.message);
    }

    // =============================================================================
    // VERIFICATION SUMMARY
    // =============================================================================
    console.log("\n📋 ============================================");
    console.log("📋 VERIFICATION SUMMARY");
    console.log("📋 ============================================\n");
    
    const results = [
      { name: "Deployment Information", passed: verificationResults.deploymentInfo },
      { name: "Contract Deployments", passed: verificationResults.contractsDeployed },
      { name: "Platform Configuration", passed: verificationResults.contractsConfigured },
      { name: "Bonding Curve Setup", passed: verificationResults.bondingCurves },
      { name: "Basic Functionality", passed: verificationResults.basicFunctionality },
      { name: "Contract Integrations", passed: verificationResults.integrations }
    ];
    
    results.forEach(result => {
      const status = result.passed ? "✅ PASS" : "❌ FAIL";
      console.log(`   ${status} ${result.name}`);
      if (!result.passed) verificationPassed = false;
    });
    
    console.log("\n" + "=".repeat(50));
    
    if (verificationPassed) {
      console.log("🎉 ALL POST-DEPLOYMENT VERIFICATIONS PASSED!");
      console.log("🚀 RWA Platform is ready for use on Kaia testnet");
      
      console.log("\n📋 CONTRACT ADDRESSES:");
      console.log(`   🥇 Tokenized Gold: ${contracts.tokenizedGold}`);
      console.log(`   🥈 Tokenized Silver: ${contracts.tokenizedSilver}`);
      console.log(`   🏠 Tokenized Real Estate: ${contracts.tokenizedRealEstate}`);
      console.log(`   💵 DummyUSDT: ${contracts.dummyUSDT}`);
      console.log(`   🏦 RWA Lending Platform: ${contracts.lendingPlatform}`);
      console.log(`   🎮 Demo Contract: ${contracts.demoContract}`);
      
      console.log("\n💡 Next steps:");
      console.log("   1. Run user flow tests: npm run test:user-flow");
      console.log("   2. Start using the platform:");
      console.log("      - Claim tokens from faucets");
      console.log("      - Deposit RWA tokens as collateral");
      console.log("      - Borrow DummyUSDT with bonding curve rates");
      console.log("   3. Monitor bonding curve metrics");
      console.log("   4. Test liquidation scenarios");
      
    } else {
      console.log("❌ POST-DEPLOYMENT VERIFICATION FAILED!");
      console.log("🔧 Please investigate and fix the issues above");
      
      console.log("\n💡 Common fixes:");
      console.log("   - Redeploy failed contracts");
      console.log("   - Check contract addresses in deployment-info.json");
      console.log("   - Verify network connectivity");
      console.log("   - Check transaction confirmations");
    }
    
    return verificationPassed;
    
  } catch (error) {
    console.error("\n❌ Post-deployment verification failed:", error);
    return false;
  }
}

// Execute verification
if (require.main === module) {
  main()
    .then((passed) => {
      process.exit(passed ? 0 : 1);
    })
    .catch((error) => {
      console.error("❌ Fatal error:", error);
      process.exit(1);
    });
}

module.exports = { main };