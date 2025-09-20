require("dotenv").config();
const { ethers } = require("ethers");

async function validateSetup() {
  console.log("🔍 Validating KaiaPay Deployment Setup");
  console.log("=====================================\n");

  // Check private key
  const privateKey = process.env.PRIVATE_KEY;
  
  if (!privateKey || privateKey === "your_private_key_here") {
    console.log("❌ Private key not set!");
    console.log("📝 Please edit .env file and set your PRIVATE_KEY");
    console.log("💡 Format: PRIVATE_KEY=0x1234567890abcdef...");
    console.log("📖 See DEPLOY_GUIDE.md for detailed instructions");
    return false;
  }

  if (!privateKey.startsWith("0x")) {
    console.log("❌ Private key must start with 0x");
    console.log("💡 Format: PRIVATE_KEY=0x1234567890abcdef...");
    return false;
  }

  if (privateKey.length !== 66) {
    console.log("❌ Private key must be 66 characters long (including 0x)");
    console.log(`📏 Current length: ${privateKey.length}`);
    console.log("💡 Format: PRIVATE_KEY=0x + 64 hex characters");
    return false;
  }

  try {
    // Test wallet creation
    const wallet = new ethers.Wallet(privateKey);
    console.log("✅ Private key format is valid");
    console.log(`📍 Wallet address: ${wallet.address}`);

    // Test network connection
    console.log("\n🌐 Testing network connection...");
    const provider = ethers.getDefaultProvider(process.env.KAIROS_RPC_URL);
    const balance = await provider.getBalance(wallet.address);
    
    console.log(`💰 Current balance: ${ethers.formatEther(balance)} KAIA`);
    
    if (balance === 0n) {
      console.log("⚠️  Warning: Balance is 0 KAIA");
      console.log("🚰 Get test KAIA from: https://kairos.wallet.klaytn.foundation/");
      console.log("💡 You need at least 0.1 KAIA for deployment");
    } else {
      console.log("✅ Sufficient balance for deployment");
    }

    console.log("\n🎉 Setup validation complete!");
    console.log("🚀 Ready to deploy with: npm run deploy:kairos");
    return true;

  } catch (error) {
    console.log("❌ Private key validation failed:");
    console.log(error.message);
    return false;
  }
}

if (require.main === module) {
  validateSetup()
    .then((success) => {
      process.exit(success ? 0 : 1);
    })
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = validateSetup;
