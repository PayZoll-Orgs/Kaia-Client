const fs = require('fs');

const deploymentInfo = {
  network: "kairos",
  timestamp: new Date().toISOString(),
  deployer: "0xEEFfe4C8B285A3f55EEC9fB50C9c96F69f9B453e",
  contracts: {
    DummyUSDT: "0x07bA937403023CcD444923B183d42438b7057811",
    BulkPayroll: "0x02C922635f0E55857c2fD304Da416089945Fee7c",
    SplitBilling: "0x53970C03Daa04471e2bdDA7488fbcc557D4899d9",
    InvoiceSubscription: "0x56CFAFDdb032BCb5c1697053993aB3406efd6Eb9" // Previous deployment
  }
};

fs.writeFileSync('deployment-addresses.json', JSON.stringify(deploymentInfo, null, 2));
console.log("✅ Updated deployment addresses saved!");
console.log("📋 New Contract Addresses:");
console.log(`DummyUSDT:          ${deploymentInfo.contracts.DummyUSDT}`);
console.log(`BulkPayroll:        ${deploymentInfo.contracts.BulkPayroll}`);
console.log(`SplitBilling:       ${deploymentInfo.contracts.SplitBilling}`);
console.log(`InvoiceSubscription: ${deploymentInfo.contracts.InvoiceSubscription}`);
