const { ethers } = require("hardhat");

async function main() {
  const deploymentData = require('./deployment-info.json');
  const contracts = deploymentData.contracts;
  
  const [deployer] = await ethers.getSigners();
  console.log("=== Debug Deposit Operation ===");
  console.log("Account:", deployer.address);
  
  // Load contracts
  const goldToken = await ethers.getContractAt("TokenizedGold", contracts.tokenizedGold);
  const lendingPlatform = await ethers.getContractAt("RWALendingPlatformWithBondingCurves", contracts.lendingPlatform);
  
  // Check current state
  const balance = await goldToken.balanceOf(deployer.address);
  console.log("Gold balance:", ethers.formatEther(balance));
  
  const depositAmount = ethers.parseEther("1");
  console.log("Attempting to deposit:", ethers.formatEther(depositAmount));
  
  // Check allowance
  const allowance = await goldToken.allowance(deployer.address, contracts.lendingPlatform);
  console.log("Current allowance:", ethers.formatEther(allowance));
  
  // Check if asset is configured
  try {
    const assetConfig = await lendingPlatform.assetConfigs(contracts.tokenizedGold);
    console.log("Asset config exists:", assetConfig.isActive);
    console.log("LTV ratio:", assetConfig.ltvRatio.toString());
    console.log("Liquidation threshold:", assetConfig.liquidationThreshold.toString());
  } catch (e) {
    console.log("Error getting asset config:", e.message);
  }
  
  // Check if user has existing deposits
  try {
    const userDeposit = await lendingPlatform.userDeposits(deployer.address, contracts.tokenizedGold);
    console.log("Existing deposit amount:", ethers.formatEther(userDeposit));
  } catch (e) {
    console.log("Error getting user deposits:", e.message);
  }
  
  // Try deposit with detailed error catching
  try {
    // First approve if needed
    if (allowance < depositAmount) {
      console.log("Approving tokens...");
      const approveTx = await goldToken.approve(contracts.lendingPlatform, depositAmount);
      await approveTx.wait();
      console.log("Approval successful");
    }
    
    // Estimate gas for deposit
    try {
      const gasEstimate = await lendingPlatform.deposit.estimateGas(contracts.tokenizedGold, depositAmount);
      console.log("Gas estimate:", gasEstimate.toString());
    } catch (gasError) {
      console.log("Gas estimation failed:", gasError.reason || gasError.message);
      
      // Try to get the revert reason
      try {
        await lendingPlatform.deposit.staticCall(contracts.tokenizedGold, depositAmount);
      } catch (staticError) {
        console.log("Static call error:", staticError.reason || staticError.message);
        if (staticError.data) {
          console.log("Error data:", staticError.data);
        }
      }
    }
    
    // Attempt actual deposit
    console.log("Attempting deposit...");
    const depositTx = await lendingPlatform.deposit(contracts.tokenizedGold, depositAmount);
    await depositTx.wait();
    console.log("Deposit successful!");
    
  } catch (e) {
    console.log("Deposit failed:");
    console.log("Error message:", e.message);
    console.log("Error reason:", e.reason);
    if (e.data) {
      console.log("Error data:", e.data);
    }
    
    // Try to decode the error
    try {
      const iface = new ethers.Interface([
        "error AssetNotSupported()",
        "error InsufficientBalance()",
        "error TransferFailed()",
        "error InvalidAmount()"
      ]);
      
      if (e.data) {
        const decoded = iface.parseError(e.data);
        console.log("Decoded error:", decoded.name);
      }
    } catch (decodeError) {
      console.log("Could not decode error");
    }
  }
}

main().catch(console.error);