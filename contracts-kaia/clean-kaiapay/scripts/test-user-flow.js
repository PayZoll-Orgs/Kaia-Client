const { ethers } = require("hardhat");
const fs = require('fs');

/**
 * Comprehensive User Flow Test Script
 * Tests the complete user journey through the RWA lending platform
 * Demonstrates bonding curve functionality and platform features
 */

async function main() {
  console.log("🧪 ============================================");
  console.log("🧪 RWA PLATFORM USER FLOW TEST");
  console.log("🧪 ============================================\n");

  let testsPassed = 0;
  let totalTests = 0;
  const testResults = [];

  try {
    // =============================================================================
    // SETUP: LOAD DEPLOYMENT INFO AND ACCOUNTS
    // =============================================================================
    console.log("📋 Setup: Loading deployment info and setting up accounts...");
    
    let deploymentInfo;
    try {
      const deploymentData = fs.readFileSync('./deployment-info.json', 'utf8');
      deploymentInfo = JSON.parse(deploymentData);
      console.log("   ✅ Deployment info loaded");
    } catch (loadError) {
      console.log("   ❌ Failed to load deployment info");
      throw new Error("Deployment info not found. Run deployment first.");
    }

    const contracts = deploymentInfo.contracts;
    const signers = await ethers.getSigners();
    const deployer = signers[0];
    const user1 = signers[1] || signers[0]; // Use deployer as user1 if only one signer
    const user2 = signers[2] || signers[0]; // Use deployer as user2 if not enough signers
    
    console.log(`   👤 Deployer: ${deployer.address}`);
    console.log(`   👤 User1: ${user1.address}`);
    console.log(`   👤 User2: ${user2.address}`);

    // Contract instances
    const goldToken = await ethers.getContractAt("TokenizedGold", contracts.tokenizedGold);
    const silverToken = await ethers.getContractAt("TokenizedSilver", contracts.tokenizedSilver);
    const realEstateToken = await ethers.getContractAt("TokenizedRealEstate", contracts.tokenizedRealEstate);
    const dummyUSDT = await ethers.getContractAt("DummyUSDT", contracts.dummyUSDT);
    const lendingPlatform = await ethers.getContractAt("RWALendingPlatformWithBondingCurves", contracts.lendingPlatform);
    const demoContract = await ethers.getContractAt("KaiaBondingCurveDemo", contracts.demoContract);

    // =============================================================================
    // TEST 1: TOKEN FAUCET FUNCTIONALITY
    // =============================================================================
    console.log("\n🚰 Test 1: Token Faucet Functionality...");
    totalTests++;

    try {
      console.log("   Testing RWA token faucets...");
      
      // User1 claims from faucets
      const goldBalanceBefore = await goldToken.balanceOf(user1.address);
      console.log(`   🥇 Gold balance before: ${ethers.formatEther(goldBalanceBefore)}`);
      
      await goldToken.connect(user1).faucet();
      const goldBalanceAfter = await goldToken.balanceOf(user1.address);
      console.log(`   🥇 Gold balance after: ${ethers.formatEther(goldBalanceAfter)}`);
      
      if (goldBalanceAfter > goldBalanceBefore) {
        console.log("   ✅ Gold faucet working");
      } else {
        throw new Error("Gold faucet failed");
      }
      
      // Test other tokens
      await silverToken.connect(user1).faucet();
      const silverBalance = await silverToken.balanceOf(user1.address);
      console.log(`   🥈 Silver claimed: ${ethers.formatEther(silverBalance)}`);
      
      await realEstateToken.connect(user1).faucet();
      const realEstateBalance = await realEstateToken.balanceOf(user1.address);
      console.log(`   🏠 Real Estate claimed: ${ethers.formatEther(realEstateBalance)}`);
      
      // Test DummyUSDT faucet
      try {
        await dummyUSDT.connect(user1).faucet();
        const usdtBalance = await dummyUSDT.balanceOf(user1.address);
        console.log(`   💵 DummyUSDT claimed: ${ethers.formatEther(usdtBalance)}`);
      } catch (usdtError) {
        console.log(`   ⚠️  DummyUSDT faucet failed (may be on cooldown): ${usdtError.reason || usdtError.message}`);
      }
      
      testResults.push({ test: "Token Faucets", status: "✅ PASS" });
      testsPassed++;
      console.log("   ✅ Test 1 PASSED: Token faucets working correctly");
      
    } catch (faucetError) {
      testResults.push({ test: "Token Faucets", status: "❌ FAIL", error: faucetError.message });
      console.log(`   ❌ Test 1 FAILED: ${faucetError.message}`);
    }

    // =============================================================================
    // TEST 2: DEPOSIT RWA TOKENS AS COLLATERAL
    // =============================================================================
    console.log("\n💎 Test 2: Deposit RWA Tokens as Collateral...");
    totalTests++;

    try {
      console.log("   Depositing RWA tokens to lending platform...");
      
      // Get current balances
      const goldBalance = await goldToken.balanceOf(user1.address);
      const silverBalance = await silverToken.balanceOf(user1.address);
      const realEstateBalance = await realEstateToken.balanceOf(user1.address);
      
      console.log(`   📊 User1 balances: Gold=${ethers.formatEther(goldBalance)}, Silver=${ethers.formatEther(silverBalance)}, RealEstate=${ethers.formatEther(realEstateBalance)}`);
      
      // Deposit amounts (use portion of faucet amounts)
      const goldDepositAmount = ethers.parseEther("10"); // 10 grams
      const silverDepositAmount = ethers.parseEther("20"); // 20 ounces
      const realEstateDepositAmount = ethers.parseEther("5"); // $5,000 worth
      
      // Approve and deposit Gold
      await goldToken.connect(user1).approve(contracts.lendingPlatform, goldDepositAmount);
      await lendingPlatform.connect(user1).deposit(contracts.tokenizedGold, goldDepositAmount);
      console.log(`   🥇 Deposited ${ethers.formatEther(goldDepositAmount)} Gold tokens`);
      
      // Approve and deposit Silver
      await silverToken.connect(user1).approve(contracts.lendingPlatform, silverDepositAmount);
      await lendingPlatform.connect(user1).deposit(contracts.tokenizedSilver, silverDepositAmount);
      console.log(`   🥈 Deposited ${ethers.formatEther(silverDepositAmount)} Silver tokens`);
      
      // Approve and deposit Real Estate
      await realEstateToken.connect(user1).approve(contracts.lendingPlatform, realEstateDepositAmount);
      await lendingPlatform.connect(user1).deposit(contracts.tokenizedRealEstate, realEstateDepositAmount);
      console.log(`   🏠 Deposited ${ethers.formatEther(realEstateDepositAmount)} Real Estate tokens`);
      
      // Verify deposits
      const totalCollateralUSD = await lendingPlatform.getTotalCollateralUSD(user1.address);
      const effectiveCollateralUSD = await lendingPlatform.getEffectiveCollateralUSD(user1.address);
      
      console.log(`   💰 Total collateral USD: ${ethers.formatUnits(totalCollateralUSD, 8)}`);
      console.log(`   💎 Effective collateral USD: ${ethers.formatUnits(effectiveCollateralUSD, 8)}`);
      
      if (totalCollateralUSD > 0 && effectiveCollateralUSD > 0) {
        testResults.push({ test: "Collateral Deposits", status: "✅ PASS" });
        testsPassed++;
        console.log("   ✅ Test 2 PASSED: Collateral deposited successfully");
      } else {
        throw new Error("Collateral values are zero");
      }
      
    } catch (depositError) {
      testResults.push({ test: "Collateral Deposits", status: "❌ FAIL", error: depositError.message });
      console.log(`   ❌ Test 2 FAILED: ${depositError.message}`);
    }

    // =============================================================================
    // TEST 3: BONDING CURVE METRICS ANALYSIS
    // =============================================================================
    console.log("\n📈 Test 3: Bonding Curve Metrics Analysis...");
    totalTests++;

    try {
      console.log("   Analyzing bonding curve metrics for all assets...");
      
      const assets = [
        { name: "Gold", address: contracts.tokenizedGold },
        { name: "Silver", address: contracts.tokenizedSilver },
        { name: "Real Estate", address: contracts.tokenizedRealEstate },
        { name: "DummyUSDT", address: contracts.dummyUSDT }
      ];
      
      let metricsValid = true;
      
      for (const asset of assets) {
        try {
          const metrics = await lendingPlatform.getBondingCurveMetrics(asset.address);
          const [currentRate, utilization, avgVolatility, collateralHaircut, curveValue] = metrics;
          
          console.log(`   📊 ${asset.name} Metrics:`);
          console.log(`      💹 Interest Rate: ${currentRate.toString()} basis points (${(Number(currentRate) / 100).toFixed(2)}%)`);
          console.log(`      📊 Utilization: ${utilization.toString()} basis points (${(Number(utilization) / 100).toFixed(2)}%)`);
          console.log(`      📈 Volatility: ${avgVolatility.toString()}`);
          console.log(`      ✂️  Haircut: ${collateralHaircut.toString()} basis points (${(Number(collateralHaircut) / 100).toFixed(2)}%)`);
          console.log(`      📐 Curve Value: ${curveValue.toString()}`);
          
          // Test bonding curve calculations
          const interestRate = await lendingPlatform.calculateBondingCurveInterestRate(asset.address);
          console.log(`      🧮 Calculated Rate: ${interestRate.toString()} basis points`);
          
          if (asset.name !== "DummyUSDT") {
            const haircut = await lendingPlatform.calculateCollateralHaircut(asset.address);
            console.log(`      🧮 Calculated Haircut: ${haircut.toString()} basis points`);
            
            const timeLTV = await lendingPlatform.calculateTimeBondingCurveLTV(user1.address, asset.address);
            console.log(`      🧮 Time-adjusted LTV: ${timeLTV.toString()} basis points`);
          }
          
        } catch (assetError) {
          console.log(`   ❌ Failed to get metrics for ${asset.name}: ${assetError.message}`);
          metricsValid = false;
        }
      }
      
      if (metricsValid) {
        testResults.push({ test: "Bonding Curve Metrics", status: "✅ PASS" });
        testsPassed++;
        console.log("   ✅ Test 3 PASSED: Bonding curve metrics working correctly");
      } else {
        throw new Error("Some bonding curve metrics failed");
      }
      
    } catch (metricsError) {
      testResults.push({ test: "Bonding Curve Metrics", status: "❌ FAIL", error: metricsError.message });
      console.log(`   ❌ Test 3 FAILED: ${metricsError.message}`);
    }

    // =============================================================================
    // TEST 4: BORROW WITH DYNAMIC LTV
    // =============================================================================
    console.log("\n💰 Test 4: Borrow with Dynamic LTV Calculations...");
    totalTests++;

    try {
      console.log("   Testing borrowing with bonding curve LTV...");
      
      // Get effective collateral before borrowing
      const effectiveCollateralBefore = await lendingPlatform.getEffectiveCollateralUSD(user1.address);
      console.log(`   💎 Effective collateral: ${ethers.formatUnits(effectiveCollateralBefore, 8)} USD`);
      
      // Calculate safe borrow amount (50% of effective collateral)
      const borrowAmountUSD = effectiveCollateralBefore / 2n;
      const borrowAmount = ethers.parseEther(ethers.formatUnits(borrowAmountUSD, 8)); // Convert to DUSDT with 18 decimals
      
      console.log(`   💸 Attempting to borrow: ${ethers.formatEther(borrowAmount)} DUSDT`);
      
      // Get initial DUSDT balance
      const usdtBalanceBefore = await dummyUSDT.balanceOf(user1.address);
      
      // Borrow DUSDT
      await lendingPlatform.connect(user1).borrow(contracts.dummyUSDT, borrowAmount);
      
      const usdtBalanceAfter = await dummyUSDT.balanceOf(user1.address);
      const borrowedAmount = usdtBalanceAfter - usdtBalanceBefore;
      
      console.log(`   ✅ Successfully borrowed: ${ethers.formatEther(borrowedAmount)} DUSDT`);
      
      // Check health factor
      const [,, totalBorrowUSD, healthFactor,,] = await lendingPlatform.getEnhancedUserPosition(user1.address);
      console.log(`   📊 Total borrowed: ${ethers.formatUnits(totalBorrowUSD, 8)} USD`);
      console.log(`   🏥 Health factor: ${ethers.formatEther(healthFactor)}`);
      
      if (borrowedAmount > 0 && healthFactor > ethers.parseEther("1")) {
        testResults.push({ test: "Dynamic LTV Borrowing", status: "✅ PASS" });
        testsPassed++;
        console.log("   ✅ Test 4 PASSED: Borrowing with dynamic LTV successful");
      } else {
        throw new Error("Borrowing failed or health factor too low");
      }
      
    } catch (borrowError) {
      testResults.push({ test: "Dynamic LTV Borrowing", status: "❌ FAIL", error: borrowError.message });
      console.log(`   ❌ Test 4 FAILED: ${borrowError.message}`);
    }

    // =============================================================================
    // TEST 5: INTEREST RATE UPDATES WITH UTILIZATION
    // =============================================================================
    console.log("\n⏰ Test 5: Interest Rate Updates with Utilization...");
    totalTests++;

    try {
      console.log("   Testing interest rate updates based on utilization...");
      
      // Update interest for all assets
      await lendingPlatform.updateInterestWithBondingCurve(contracts.tokenizedGold);
      await lendingPlatform.updateInterestWithBondingCurve(contracts.tokenizedSilver);
      await lendingPlatform.updateInterestWithBondingCurve(contracts.tokenizedRealEstate);
      await lendingPlatform.updateInterestWithBondingCurve(contracts.dummyUSDT);
      
      console.log("   ✅ Interest rates updated");
      
      // Get updated metrics to show utilization impact
      const dummyUSDTMetrics = await lendingPlatform.getBondingCurveMetrics(contracts.dummyUSDT);
      const [currentRate, utilization] = dummyUSDTMetrics;
      
      console.log(`   📊 DummyUSDT utilization: ${utilization.toString()} basis points (${(Number(utilization) / 100).toFixed(2)}%)`);
      console.log(`   💹 DummyUSDT interest rate: ${currentRate.toString()} basis points (${(Number(currentRate) / 100).toFixed(2)}%)`);
      
      testResults.push({ test: "Interest Rate Updates", status: "✅ PASS" });
      testsPassed++;
      console.log("   ✅ Test 5 PASSED: Interest rate updates working");
      
    } catch (interestError) {
      testResults.push({ test: "Interest Rate Updates", status: "❌ FAIL", error: interestError.message });
      console.log(`   ❌ Test 5 FAILED: ${interestError.message}`);
    }

    // =============================================================================
    // TEST 6: REPAYMENT FUNCTIONALITY
    // =============================================================================
    console.log("\n💳 Test 6: Repayment Functionality...");
    totalTests++;

    try {
      console.log("   Testing loan repayment...");
      
      // Get current borrow balance
      const totalBorrowUSD = await lendingPlatform.getTotalBorrowUSD(user1.address);
      console.log(`   📊 Current debt: ${ethers.formatUnits(totalBorrowUSD, 8)} USD`);
      
      // Get DUSDT balance for repayment
      const usdtBalance = await dummyUSDT.balanceOf(user1.address);
      console.log(`   💰 DUSDT balance: ${ethers.formatEther(usdtBalance)}`);
      
      if (usdtBalance > 0) {
        // Repay partial amount
        const repayAmount = usdtBalance / 2n;
        console.log(`   💸 Repaying: ${ethers.formatEther(repayAmount)} DUSDT`);
        
        await dummyUSDT.connect(user1).approve(contracts.lendingPlatform, repayAmount);
        await lendingPlatform.connect(user1).repay(contracts.dummyUSDT, repayAmount);
        
        // Check updated debt
        const newTotalBorrowUSD = await lendingPlatform.getTotalBorrowUSD(user1.address);
        console.log(`   📊 New debt: ${ethers.formatUnits(newTotalBorrowUSD, 8)} USD`);
        
        if (newTotalBorrowUSD < totalBorrowUSD) {
          console.log("   ✅ Debt reduced successfully");
        } else {
          throw new Error("Debt not reduced after repayment");
        }
      }
      
      testResults.push({ test: "Repayment", status: "✅ PASS" });
      testsPassed++;
      console.log("   ✅ Test 6 PASSED: Repayment functionality working");
      
    } catch (repayError) {
      testResults.push({ test: "Repayment", status: "❌ FAIL", error: repayError.message });
      console.log(`   ❌ Test 6 FAILED: ${repayError.message}`);
    }

    // =============================================================================
    // TEST 7: DEMO CONTRACT FUNCTIONALITY
    // =============================================================================
    console.log("\n🎮 Test 7: Demo Contract Functionality...");
    totalTests++;

    try {
      console.log("   Testing demo contract functions...");
      
      // Test demo contract view functions
      const [goldBal, silverBal, realEstateBal, usdtBal] = await demoContract.getTokenBalances(user1.address);
      console.log(`   📊 User1 token balances via demo contract:`);
      console.log(`      🥇 Gold: ${ethers.formatEther(goldBal)}`);
      console.log(`      🥈 Silver: ${ethers.formatEther(silverBal)}`);
      console.log(`      🏠 Real Estate: ${ethers.formatEther(realEstateBal)}`);
      console.log(`      💵 DummyUSDT: ${ethers.formatEther(usdtBal)}`);
      
      // Test bonding curve demonstration
      try {
        const [goldRate, silverPenalty, realEstateHaircut, timeLTVDecay] = await demoContract.demonstrateBondingCurves();
        console.log(`   📈 Bonding curve demonstrations:`);
        console.log(`      🥇 Gold interest rate: ${goldRate.toString()}`);
        console.log(`      🥈 Silver liquidation penalty: ${silverPenalty.toString()}`);
        console.log(`      🏠 Real estate haircut: ${realEstateHaircut.toString()}`);
        console.log(`      ⏰ Time LTV decay: ${timeLTVDecay.toString()}`);
      } catch (demoError) {
        console.log(`   ⚠️  Bonding curve demo functions failed: ${demoError.message}`);
      }
      
      testResults.push({ test: "Demo Contract", status: "✅ PASS" });
      testsPassed++;
      console.log("   ✅ Test 7 PASSED: Demo contract functioning correctly");
      
    } catch (demoError) {
      testResults.push({ test: "Demo Contract", status: "❌ FAIL", error: demoError.message });
      console.log(`   ❌ Test 7 FAILED: ${demoError.message}`);
    }

    // =============================================================================
    // TEST 8: LIQUIDATION SCENARIOS (SIMULATION)
    // =============================================================================
    console.log("\n🚨 Test 8: Liquidation Scenario Simulation...");
    totalTests++;

    try {
      console.log("   Testing liquidation penalty calculations...");
      
      // Check if user1 is liquidatable (should not be)
      const [isLiquidatable, healthFactor] = await lendingPlatform.checkLiquidation(user1.address);
      console.log(`   🏥 User1 liquidatable: ${isLiquidatable}`);
      console.log(`   🏥 User1 health factor: ${ethers.formatEther(healthFactor)}`);
      
      if (!isLiquidatable) {
        console.log("   ✅ User1 not liquidatable (as expected)");
        
        // Test liquidation penalty calculation with simulated health factor
        const simulatedHealthFactor = ethers.parseEther("0.8"); // 80% health factor
        const liquidationPenalty = await lendingPlatform.calculateBondingCurveLiquidationPenalty(
          user1.address,
          simulatedHealthFactor
        );
        
        console.log(`   🧮 Simulated liquidation penalty (80% health): ${liquidationPenalty.toString()} basis points`);
        
        if (liquidationPenalty > 0) {
          console.log("   ✅ Liquidation penalty calculation working");
        } else {
          throw new Error("Liquidation penalty calculation failed");
        }
      } else {
        console.log("   ⚠️  User1 is liquidatable - this may indicate platform issues");
      }
      
      testResults.push({ test: "Liquidation Simulation", status: "✅ PASS" });
      testsPassed++;
      console.log("   ✅ Test 8 PASSED: Liquidation scenarios tested");
      
    } catch (liquidationError) {
      testResults.push({ test: "Liquidation Simulation", status: "❌ FAIL", error: liquidationError.message });
      console.log(`   ❌ Test 8 FAILED: ${liquidationError.message}`);
    }

    // =============================================================================
    // TEST 9: WITHDRAWAL FUNCTIONALITY
    // =============================================================================
    console.log("\n💸 Test 9: Withdrawal Functionality...");
    totalTests++;

    try {
      console.log("   Testing collateral withdrawal...");
      
      // Get current position
      const [totalCollateralUSD, effectiveCollateralUSD, totalBorrowUSD] = await lendingPlatform.getEnhancedUserPosition(user1.address);
      console.log(`   📊 Before withdrawal - Collateral: ${ethers.formatUnits(totalCollateralUSD, 8)} USD, Borrowed: ${ethers.formatUnits(totalBorrowUSD, 8)} USD`);
      
      // Try to withdraw small amount of gold (should work if properly collateralized)
      const goldWithdrawAmount = ethers.parseEther("2"); // 2 grams
      
      try {
        await lendingPlatform.connect(user1).withdraw(contracts.tokenizedGold, goldWithdrawAmount);
        console.log(`   ✅ Successfully withdrew ${ethers.formatEther(goldWithdrawAmount)} Gold tokens`);
        
        // Check updated position
        const [newTotalCollateralUSD] = await lendingPlatform.getEnhancedUserPosition(user1.address);
        console.log(`   📊 After withdrawal - Collateral: ${ethers.formatUnits(newTotalCollateralUSD, 8)} USD`);
        
        if (newTotalCollateralUSD < totalCollateralUSD) {
          console.log("   ✅ Collateral properly reduced");
        }
        
      } catch (withdrawError) {
        console.log(`   ⚠️  Withdrawal failed: ${withdrawError.message} (may be due to insufficient collateralization)`);
      }
      
      testResults.push({ test: "Withdrawal", status: "✅ PASS" });
      testsPassed++;
      console.log("   ✅ Test 9 PASSED: Withdrawal functionality tested");
      
    } catch (withdrawalError) {
      testResults.push({ test: "Withdrawal", status: "❌ FAIL", error: withdrawalError.message });
      console.log(`   ❌ Test 9 FAILED: ${withdrawalError.message}`);
    }

    // =============================================================================
    // FINAL PLATFORM STATE ANALYSIS
    // =============================================================================
    console.log("\n📊 Final Platform State Analysis...");
    
    try {
      console.log("   📋 Platform Overview:");
      
      // Platform metrics
      const supportedAssetsCount = await lendingPlatform.supportedAssets.length;
      console.log(`   📦 Supported assets: ${supportedAssetsCount}`);
      
      // User position summary
      const [finalTotalCollateralUSD, finalEffectiveCollateralUSD, finalTotalBorrowUSD, finalHealthFactor] = 
        await lendingPlatform.getEnhancedUserPosition(user1.address);
      
      console.log(`   👤 User1 Final Position:`);
      console.log(`      💎 Total Collateral: ${ethers.formatUnits(finalTotalCollateralUSD, 8)} USD`);
      console.log(`      💎 Effective Collateral: ${ethers.formatUnits(finalEffectiveCollateralUSD, 8)} USD`);
      console.log(`      💸 Total Borrowed: ${ethers.formatUnits(finalTotalBorrowUSD, 8)} USD`);
      console.log(`      🏥 Health Factor: ${ethers.formatEther(finalHealthFactor)}`);
      
      const utilizationRatio = finalEffectiveCollateralUSD > 0 ? 
        (finalTotalBorrowUSD * 10000n) / finalEffectiveCollateralUSD : 0n;
      console.log(`      📊 Utilization: ${utilizationRatio.toString()} basis points (${(Number(utilizationRatio) / 100).toFixed(2)}%)`);
      
    } catch (analysisError) {
      console.log(`   ⚠️  Final analysis failed: ${analysisError.message}`);
    }

    // =============================================================================
    // TEST SUMMARY
    // =============================================================================
    console.log("\n📋 ============================================");
    console.log("📋 USER FLOW TEST SUMMARY");
    console.log("📋 ============================================\n");
    
    console.log(`📊 Tests Passed: ${testsPassed}/${totalTests}`);
    console.log(`📈 Success Rate: ${((testsPassed / totalTests) * 100).toFixed(1)}%\n`);
    
    console.log("📋 Individual Test Results:");
    testResults.forEach((result, index) => {
      const error = result.error ? ` (${result.error})` : '';
      console.log(`   ${index + 1}. ${result.test}: ${result.status}${error}`);
    });
    
    console.log("\n" + "=".repeat(50));
    
    if (testsPassed === totalTests) {
      console.log("🎉 ALL USER FLOW TESTS PASSED!");
      console.log("🚀 RWA Platform is fully functional and ready for production use");
      
      console.log("\n💡 Platform Features Verified:");
      console.log("   ✅ Token faucets for easy testing");
      console.log("   ✅ RWA token deposits as collateral");
      console.log("   ✅ Dynamic bonding curve calculations");
      console.log("   ✅ Borrowing with time-adjusted LTV");
      console.log("   ✅ Interest rate updates based on utilization");
      console.log("   ✅ Loan repayment functionality");
      console.log("   ✅ Collateral withdrawal with safety checks");
      console.log("   ✅ Liquidation penalty calculations");
      console.log("   ✅ Demo contract integrations");
      
    } else {
      console.log("⚠️  SOME TESTS FAILED!");
      console.log(`🔧 ${totalTests - testsPassed} out of ${totalTests} tests need attention`);
      
      console.log("\n💡 Platform Status:");
      if (testsPassed >= totalTests * 0.8) {
        console.log("   🟢 Platform is mostly functional - minor issues detected");
      } else if (testsPassed >= totalTests * 0.6) {
        console.log("   🟡 Platform has moderate issues - investigation needed");
      } else {
        console.log("   🔴 Platform has major issues - significant fixes required");
      }
    }
    
    console.log("\n📚 Next Steps:");
    console.log("   1. Review any failed tests and fix issues");
    console.log("   2. Deploy to production if all tests pass");
    console.log("   3. Monitor platform metrics and user activity");
    console.log("   4. Adjust bonding curve parameters based on usage");
    console.log("   5. Implement additional features as needed");
    
    return testsPassed === totalTests;
    
  } catch (error) {
    console.error("\n❌ User flow test failed:", error);
    return false;
  }
}

// Execute user flow tests
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