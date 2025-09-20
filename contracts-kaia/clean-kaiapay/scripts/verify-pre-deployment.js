const { ethers } = require("hardhat");

/**
 * Pre-Deployment Verification Script
 * Verifies environment, network connectivity, and contract compilation
 * before deploying the RWA platform on Kaia testnet
 */

const KAIA_DUMMY_USDT = "0x07bA937403023CcD444923B183d42438b7057811";
const REQUIRED_KAIA_BALANCE = ethers.parseEther("10"); // 10 KAIA minimum

async function main() {
  console.log("🔍 ============================================");
  console.log("🔍 PRE-DEPLOYMENT VERIFICATION");
  console.log("🔍 ============================================\n");

  let verificationPassed = true;
  const verificationResults = {
    environment: false,
    network: false,
    balance: false,
    contracts: false,
    dependencies: false,
    dummyUSDT: false
  };

  try {
    // =============================================================================
    // 1. ENVIRONMENT VERIFICATION
    // =============================================================================
    console.log("📋 Step 1: Environment Verification...");
    
    // Check required environment variables
    const requiredEnvVars = ["PRIVATE_KEY", "KAIROS_RPC_URL"];
    let envVarsValid = true;
    
    for (const envVar of requiredEnvVars) {
      if (!process.env[envVar]) {
        console.log(`   ❌ Missing environment variable: ${envVar}`);
        envVarsValid = false;
      } else {
        const value = envVar === "PRIVATE_KEY" ? "***hidden***" : process.env[envVar];
        console.log(`   ✅ ${envVar}: ${value}`);
      }
    }
    
    if (envVarsValid) {
      console.log("   ✅ All required environment variables present");
      verificationResults.environment = true;
    } else {
      console.log("   ❌ Environment variables validation failed");
    }

    // =============================================================================
    // 2. NETWORK CONNECTIVITY VERIFICATION
    // =============================================================================
    console.log("\n🌐 Step 2: Network Connectivity Verification...");
    
    try {
      const [deployer] = await ethers.getSigners();
      const network = await deployer.provider.getNetwork();
      
      console.log(`   📡 Connected to network: ${network.name} (Chain ID: ${network.chainId})`);
      
      if (network.chainId === 1001n) {
        console.log("   ✅ Connected to Kaia testnet (Kairos)");
        verificationResults.network = true;
      } else {
        console.log(`   ❌ Wrong network! Expected Kaia testnet (1001), got ${network.chainId}`);
      }
      
      // Test latest block
      const latestBlock = await deployer.provider.getBlockNumber();
      console.log(`   📦 Latest block: ${latestBlock}`);
      
      if (latestBlock > 0) {
        console.log("   ✅ Network is responsive");
      } else {
        console.log("   ❌ Network connectivity issues");
        verificationResults.network = false;
      }
      
    } catch (networkError) {
      console.log("   ❌ Network connection failed:", networkError.message);
    }

    // =============================================================================
    // 3. DEPLOYER ACCOUNT VERIFICATION
    // =============================================================================
    console.log("\n💰 Step 3: Deployer Account Verification...");
    
    try {
      const [deployer] = await ethers.getSigners();
      console.log(`   👤 Deployer address: ${deployer.address}`);
      
      const balance = await deployer.provider.getBalance(deployer.address);
      console.log(`   💰 Current balance: ${ethers.formatEther(balance)} KAIA`);
      
      if (balance >= REQUIRED_KAIA_BALANCE) {
        console.log(`   ✅ Sufficient balance for deployment (minimum ${ethers.formatEther(REQUIRED_KAIA_BALANCE)} KAIA)`);
        verificationResults.balance = true;
      } else {
        console.log(`   ❌ Insufficient balance! Need at least ${ethers.formatEther(REQUIRED_KAIA_BALANCE)} KAIA`);
        console.log("   💡 Get KAIA from faucet: https://kairos.wallet.klaytn.foundation/faucet");
      }
      
    } catch (balanceError) {
      console.log("   ❌ Balance check failed:", balanceError.message);
    }

    // =============================================================================
    // 4. CONTRACT COMPILATION VERIFICATION
    // =============================================================================
    console.log("\n🔨 Step 4: Contract Compilation Verification...");
    
    const contractsToVerify = [
      "RWALendingPlatformWithBondingCurves",
      "TokenizedGold",
      "TokenizedSilver", 
      "TokenizedRealEstate",
      "KaiaBondingCurveDemo",
      "DummyUSDT"
    ];
    
    let allContractsCompiled = true;
    
    for (const contractName of contractsToVerify) {
      try {
        const ContractFactory = await ethers.getContractFactory(contractName);
        console.log(`   ✅ ${contractName}: Compiled successfully`);
        
        // Check if contract has required functions
        if (contractName === "RWALendingPlatformWithBondingCurves") {
          const requiredFunctions = [
            "addAssetWithBondingCurves",
            "calculateBondingCurveInterestRate",
            "deposit",
            "borrow",
            "repay",
            "withdraw"
          ];
          
          const abi = ContractFactory.interface;
          for (const func of requiredFunctions) {
            if (abi.hasFunction(func)) {
              console.log(`     ✅ Has required function: ${func}`);
            } else {
              console.log(`     ❌ Missing required function: ${func}`);
              allContractsCompiled = false;
            }
          }
        }
        
      } catch (compileError) {
        console.log(`   ❌ ${contractName}: Compilation failed - ${compileError.message}`);
        allContractsCompiled = false;
      }
    }
    
    if (allContractsCompiled) {
      console.log("   ✅ All contracts compiled successfully");
      verificationResults.contracts = true;
    } else {
      console.log("   ❌ Contract compilation issues detected");
    }

    // =============================================================================
    // 5. DEPENDENCY VERIFICATION
    // =============================================================================
    console.log("\n📦 Step 5: Dependency Verification...");
    
    try {
      // Check OpenZeppelin contracts
      const ERC20 = await ethers.getContractFactory("ERC20");
      console.log("   ✅ OpenZeppelin ERC20 available");
      
      const Ownable = await ethers.getContractFactory("Ownable");
      console.log("   ✅ OpenZeppelin Ownable available");
      
      const ReentrancyGuard = await ethers.getContractFactory("ReentrancyGuard");
      console.log("   ✅ OpenZeppelin ReentrancyGuard available");
      
      console.log("   ✅ All required dependencies available");
      verificationResults.dependencies = true;
      
    } catch (depError) {
      console.log("   ❌ Dependency verification failed:", depError.message);
    }

    // =============================================================================
    // 6. EXISTING DUMMY USDT VERIFICATION
    // =============================================================================
    console.log("\n💵 Step 6: Existing DummyUSDT Verification...");
    
    try {
      const [deployer] = await ethers.getSigners();
      
      // Check if DummyUSDT exists and is accessible
      const dummyUSDT = await ethers.getContractAt("DummyUSDT", KAIA_DUMMY_USDT);
      
      // Test basic functions
      const name = await dummyUSDT.name();
      const symbol = await dummyUSDT.symbol();
      const decimals = await dummyUSDT.decimals();
      
      console.log(`   ✅ DummyUSDT found: ${name} (${symbol})`);
      console.log(`   📊 Decimals: ${decimals}`);
      
      // Check faucet availability
      try {
        const canClaim = await dummyUSDT.canClaimFaucet(deployer.address);
        const faucetBalance = await dummyUSDT.getFaucetBalance();
        
        console.log(`   🚰 Can claim faucet: ${canClaim}`);
        console.log(`   💧 Faucet balance: ${ethers.formatEther(faucetBalance)} DUSDT`);
        
        if (faucetBalance > 0) {
          console.log("   ✅ DummyUSDT faucet has funds available");
        } else {
          console.log("   ⚠️  DummyUSDT faucet is empty");
        }
        
      } catch (faucetError) {
        console.log("   ⚠️  Faucet check failed:", faucetError.message);
      }
      
      verificationResults.dummyUSDT = true;
      console.log("   ✅ DummyUSDT contract verified and accessible");
      
    } catch (usdtError) {
      console.log("   ❌ DummyUSDT verification failed:", usdtError.message);
      console.log("   💡 Make sure DummyUSDT is deployed at:", KAIA_DUMMY_USDT);
    }

    // =============================================================================
    // 7. GAS PRICE VERIFICATION
    // =============================================================================
    console.log("\n⛽ Step 7: Gas Price Verification...");
    
    try {
      const [deployer] = await ethers.getSigners();
      const feeData = await deployer.provider.getFeeData();
      
      console.log(`   ⛽ Current gas price: ${ethers.formatUnits(feeData.gasPrice, "gwei")} gwei`);
      
      // Estimate deployment costs
      const TokenizedGold = await ethers.getContractFactory("TokenizedGold");
      const goldEstimate = await deployer.provider.estimateGas({
        data: TokenizedGold.bytecode
      });
      
      const estimatedCost = goldEstimate * feeData.gasPrice;
      console.log(`   💰 Estimated cost per token contract: ${ethers.formatEther(estimatedCost)} KAIA`);
      console.log(`   💰 Total estimated deployment cost: ~${ethers.formatEther(estimatedCost * 4n)} KAIA`);
      
    } catch (gasError) {
      console.log("   ⚠️  Gas estimation failed:", gasError.message);
    }

    // =============================================================================
    // VERIFICATION SUMMARY
    // =============================================================================
    console.log("\n📋 ============================================");
    console.log("📋 VERIFICATION SUMMARY");
    console.log("📋 ============================================\n");
    
    const results = [
      { name: "Environment Variables", passed: verificationResults.environment },
      { name: "Network Connectivity", passed: verificationResults.network },
      { name: "Account Balance", passed: verificationResults.balance },
      { name: "Contract Compilation", passed: verificationResults.contracts },
      { name: "Dependencies", passed: verificationResults.dependencies },
      { name: "DummyUSDT Integration", passed: verificationResults.dummyUSDT }
    ];
    
    results.forEach(result => {
      const status = result.passed ? "✅ PASS" : "❌ FAIL";
      console.log(`   ${status} ${result.name}`);
      if (!result.passed) verificationPassed = false;
    });
    
    console.log("\n" + "=".repeat(50));
    
    if (verificationPassed) {
      console.log("🎉 ALL VERIFICATIONS PASSED!");
      console.log("🚀 Ready to deploy RWA platform to Kaia testnet");
      console.log("\n💡 Next steps:");
      console.log("   1. Run: npm run deploy:rwa");
      console.log("   2. Run post-deployment verification");
      console.log("   3. Test user flows");
    } else {
      console.log("❌ VERIFICATION FAILED!");
      console.log("🔧 Please fix the issues above before deployment");
      console.log("\n💡 Common fixes:");
      console.log("   - Set environment variables in .env file");
      console.log("   - Get KAIA from faucet: https://kairos.wallet.klaytn.foundation/faucet");
      console.log("   - Run: npm run compile");
      console.log("   - Check network connectivity");
    }
    
    return verificationPassed;
    
  } catch (error) {
    console.error("\n❌ Verification script failed:", error);
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