const { ethers } = require("hardhat");
const fs = require('fs');

/**
 * EXTRACT METHOD IDs FOR ALL DEPLOYED CONTRACTS
 * 
 * This script reads the deployed ABIs and extracts the correct method IDs
 * that the frontend needs to make proper contract calls.
 */

async function main() {
  console.log("\n🔍 === EXTRACTING METHOD IDs FROM DEPLOYED CONTRACTS ===");
  
  // Read deployed ABIs
  const abisJson = fs.readFileSync('./deployedABIs.json', 'utf8');
  const abis = JSON.parse(abisJson);
  
  const methodIds = {};

  // =====================================
  // DUMMYUSDT METHOD IDs
  // =====================================
  console.log("\n📋 DummyUSDT Method IDs:");
  const usdtInterface = new ethers.Interface(abis.DummyUSDT);
  
  methodIds.DummyUSDT = {
    faucet: usdtInterface.getFunction("faucet").selector,
    transfer: usdtInterface.getFunction("transfer").selector,
    approve: usdtInterface.getFunction("approve").selector,
    balanceOf: usdtInterface.getFunction("balanceOf").selector,
    allowance: usdtInterface.getFunction("allowance").selector
  };
  
  console.log("  faucet():", methodIds.DummyUSDT.faucet);
  console.log("  transfer(address,uint256):", methodIds.DummyUSDT.transfer);
  console.log("  approve(address,uint256):", methodIds.DummyUSDT.approve);
  console.log("  balanceOf(address):", methodIds.DummyUSDT.balanceOf);
  console.log("  allowance(address,address):", methodIds.DummyUSDT.allowance);

  // =====================================
  // USDY METHOD IDs
  // =====================================
  console.log("\n📋 USDY Method IDs:");
  const usdyInterface = new ethers.Interface(abis.USDY);
  
  methodIds.USDY = {
    claimFromFaucet: usdyInterface.getFunction("claimFromFaucet").selector,
    transfer: usdyInterface.getFunction("transfer").selector,
    approve: usdyInterface.getFunction("approve").selector,
    balanceOf: usdyInterface.getFunction("balanceOf").selector,
    allowance: usdyInterface.getFunction("allowance").selector
  };
  
  console.log("  claimFromFaucet():", methodIds.USDY.claimFromFaucet);
  console.log("  transfer(address,uint256):", methodIds.USDY.transfer);
  console.log("  approve(address,uint256):", methodIds.USDY.approve);

  // =====================================
  // BULKPAYROLL METHOD IDs
  // =====================================
  console.log("\n📋 BulkPayroll Method IDs:");
  const bulkPayrollInterface = new ethers.Interface(abis.BulkPayroll);
  
  methodIds.BulkPayroll = {
    bulkTransfer: bulkPayrollInterface.getFunction("bulkTransfer").selector,
    claimFailedTransfer: bulkPayrollInterface.getFunction("claimFailedTransfer").selector,
    getFailedAmount: bulkPayrollInterface.getFunction("getFailedAmount").selector
  };
  
  console.log("  bulkTransfer(address,address[],uint256[]):", methodIds.BulkPayroll.bulkTransfer);
  console.log("  claimFailedTransfer(address):", methodIds.BulkPayroll.claimFailedTransfer);
  console.log("  getFailedAmount(address,address):", methodIds.BulkPayroll.getFailedAmount);

  // =====================================
  // SPLITBILLING METHOD IDs
  // =====================================
  console.log("\n📋 SplitBilling Method IDs:");
  const splitBillingInterface = new ethers.Interface(abis.SplitBilling);
  
  methodIds.SplitBilling = {
    createSplit: splitBillingInterface.getFunction("createSplit").selector,
    payShare: splitBillingInterface.getFunction("payShare").selector,
    getSplitDetails: splitBillingInterface.getFunction("getSplitDetails").selector,
    cancelSplit: splitBillingInterface.getFunction("cancelSplit").selector
  };
  
  console.log("  createSplit(address,address[],uint256[],address,uint256,string):", methodIds.SplitBilling.createSplit);
  console.log("  payShare(uint256):", methodIds.SplitBilling.payShare);
  console.log("  getSplitDetails(uint256):", methodIds.SplitBilling.getSplitDetails);

  // =====================================
  // LPTOKEN METHOD IDs
  // =====================================
  console.log("\n📋 LPToken Method IDs:");
  const lpTokenInterface = new ethers.Interface(abis.LPToken);
  
  methodIds.LPToken = {
    mint: lpTokenInterface.getFunction("mint").selector,
    burn: lpTokenInterface.getFunction("burn").selector,
    balanceOf: lpTokenInterface.getFunction("balanceOf").selector,
    transfer: lpTokenInterface.getFunction("transfer").selector
  };
  
  console.log("  mint(address,uint256):", methodIds.LPToken.mint);
  console.log("  burn(address,uint256):", methodIds.LPToken.burn);
  console.log("  balanceOf(address):", methodIds.LPToken.balanceOf);

  // =====================================
  // SAVE METHOD IDs
  // =====================================
  fs.writeFileSync('./methodIds.json', JSON.stringify(methodIds, null, 2));
  console.log("\n💾 Method IDs saved to: methodIds.json");

  // =====================================
  // GENERATE FRONTEND CONFIG
  // =====================================
  const addresses = JSON.parse(fs.readFileSync('./deployedAddresses.json', 'utf8'));
  
  const frontendConfig = {
    // Contract Addresses
    USDT_ADDRESS: addresses.DummyUSDT,
    USDY_ADDRESS: addresses.USDY,
    BULK_PAYROLL_ADDRESS: addresses.BulkPayroll,
    SPLIT_BILLING_ADDRESS: addresses.SplitBilling,
    K_USDT_ADDRESS: addresses.kUSDT,
    K_KAIA_ADDRESS: addresses.kKAIA,
    
    // Method IDs for direct contract calls
    METHOD_IDS: methodIds,
    
    // Key function signatures for verification
    FUNCTION_SIGNATURES: {
      // USDT/USDY
      FAUCET: "faucet()",
      USDY_FAUCET: "claimFromFaucet()",
      ERC20_TRANSFER: "transfer(address,uint256)",
      ERC20_APPROVE: "approve(address,uint256)",
      ERC20_BALANCE_OF: "balanceOf(address)",
      
      // BulkPayroll
      BULK_TRANSFER: "bulkTransfer(address,address[],uint256[])",
      CLAIM_FAILED: "claimFailedTransfer(address)",
      
      // SplitBilling
      CREATE_SPLIT: "createSplit(address,address[],uint256[],address,uint256,string)",
      PAY_SHARE: "payShare(uint256)"
    }
  };
  
  fs.writeFileSync('./frontendConfig.json', JSON.stringify(frontendConfig, null, 2));
  console.log("💾 Frontend config saved to: frontendConfig.json");

  console.log("\n✅ METHOD ID EXTRACTION COMPLETE!");
  console.log("🔧 Ready for frontend integration");

  return methodIds;
}

if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error("💥 Method ID extraction failed:", error);
      process.exit(1);
    });
}

module.exports = main;