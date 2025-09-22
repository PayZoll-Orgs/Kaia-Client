const { ethers } = require("hardhat");
const fs = require('fs');
const path = require('path');

async function main() {
  console.log("🔍 === CHECKING CONTRACT DEPLOYMENTS ===");
  
  const [deployer] = await ethers.getSigners();
  console.log("🔑 Using account:", deployer.address);

  // Load deployed addresses
  const addressesPath = path.join(__dirname, 'deployedAddresses.json');
  const deployedAddresses = JSON.parse(fs.readFileSync(addressesPath, 'utf8'));
  
  console.log("\n📋 Checking contracts:");
  
  // Check USDY
  try {
    const usdy = await ethers.getContractAt("USDY", deployedAddresses.USDY);
    const name = await usdy.name();
    const symbol = await usdy.symbol();
    const balance = await usdy.balanceOf(deployer.address);
    console.log(`✅ USDY (${deployedAddresses.USDY}): ${name} (${symbol})`);
    console.log(`   Balance: ${ethers.formatUnits(balance, 18)} USDY`);
  } catch (error) {
    console.error(`❌ USDY contract failed:`, error.message);
  }

  // Check DummyUSDT
  try {
    const usdt = await ethers.getContractAt("DummyUSDT", deployedAddresses.DummyUSDT);
    const name = await usdt.name();
    const symbol = await usdt.symbol();
    const balance = await usdt.balanceOf(deployer.address);
    console.log(`✅ DummyUSDT (${deployedAddresses.DummyUSDT}): ${name} (${symbol})`);
    console.log(`   Balance: ${ethers.formatUnits(balance, 18)} USDT`);
  } catch (error) {
    console.error(`❌ DummyUSDT contract failed:`, error.message);
  }

  // Check Enhanced Lending Protocol
  try {
    const enhancedLending = await ethers.getContractAt("EnhancedLendingProtocol", deployedAddresses.EnhancedLendingProtocol);
    const usdy = await enhancedLending.USDY();
    const usdt = await enhancedLending.USDT();
    console.log(`✅ EnhancedLendingProtocol (${deployedAddresses.EnhancedLendingProtocol})`);
    console.log(`   USDY Address: ${usdy}`);
    console.log(`   USDT Address: ${usdt}`);
    
    // Test a simple read function
    const collateralBalance = await enhancedLending.collateralBalance(deployer.address);
    console.log(`   Collateral Balance: ${ethers.formatUnits(collateralBalance, 18)} USDY`);
  } catch (error) {
    console.error(`❌ EnhancedLendingProtocol contract failed:`, error.message);
  }

  console.log("\n✅ Contract deployment check completed!");
}

if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error("💥 Check failed:", error);
      process.exit(1);
    });
}

module.exports = main;