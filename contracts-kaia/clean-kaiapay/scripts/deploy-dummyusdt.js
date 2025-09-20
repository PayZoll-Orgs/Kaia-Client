const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying DummyUSDT...");
  
  // Get deployer
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  
  // Deploy DummyUSDT with 1M initial supply
  const DummyUSDT = await ethers.getContractFactory("DummyUSDT");
  const dummyUSDT = await DummyUSDT.deploy(1000000); // 1M tokens
  
  await dummyUSDT.waitForDeployment();
  const address = await dummyUSDT.getAddress();
  
  console.log("✅ DummyUSDT deployed to:", address);
  console.log("📊 Initial supply: 1,000,000 DUSDT");
  console.log("💰 Faucet funded with: 100,000 DUSDT");
  
  // Verify deployment
  const name = await dummyUSDT.name();
  const symbol = await dummyUSDT.symbol();
  const totalSupply = await dummyUSDT.totalSupply();
  const faucetBalance = await dummyUSDT.getFaucetBalance();
  
  console.log("\n📋 Contract Details:");
  console.log(`Name: ${name}`);
  console.log(`Symbol: ${symbol}`);
  console.log(`Total Supply: ${ethers.formatEther(totalSupply)} ${symbol}`);
  console.log(`Faucet Balance: ${ethers.formatEther(faucetBalance)} ${symbol}`);
  
  return address;
}

if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = main;
