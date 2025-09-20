const { ethers } = require("hardhat");

async function main() {
  // Use deployment info 
  const deploymentData = require('./deployment-info.json');
  const contracts = deploymentData.contracts;
  
  const [deployer] = await ethers.getSigners();
  console.log("Account:", deployer.address);
  
  // Test gold token faucet
  const goldToken = await ethers.getContractAt("TokenizedGold", contracts.tokenizedGold);
  console.log("Gold contract loaded");
  
  // Check if can claim faucet
  const canClaim = await goldToken.canClaimFaucet(deployer.address);
  console.log("Can claim faucet:", canClaim);
  
  const balance = await goldToken.balanceOf(deployer.address);
  console.log("Current balance:", ethers.formatEther(balance));
  
  if (canClaim) {
    try {
      const tx = await goldToken.faucet();
      await tx.wait();
      console.log("Faucet claim successful");
    } catch (e) {
      console.log("Faucet error:", e.message);
    }
  }
  
  // Test platform deposit
  const lendingPlatform = await ethers.getContractAt("RWALendingPlatformWithBondingCurves", contracts.lendingPlatform);
  console.log("Platform contract loaded");
  
  const depositAmount = ethers.parseEther("1");
  
  try {
    // Approve first
    const approveTx = await goldToken.approve(contracts.lendingPlatform, depositAmount);
    await approveTx.wait();
    console.log("Approval successful");
    
    // Then deposit
    const depositTx = await lendingPlatform.deposit(contracts.tokenizedGold, depositAmount);
    await depositTx.wait();
    console.log("Deposit successful");
  } catch (e) {
    console.log("Deposit error:", e.message);
  }
}

main().catch(console.error);
