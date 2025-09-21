const { ethers } = require('ethers');

async function checkBulkPayrollContract() {
  const provider = new ethers.JsonRpcProvider('https://public-en-kairos.node.kaia.io');
  
  const bulkPayrollABI = [
    {
      'inputs': [],
      'name': 'usdtToken',
      'outputs': [{ 'internalType': 'contract IERC20', 'name': '', 'type': 'address' }],
      'stateMutability': 'view',
      'type': 'function'
    }
  ];
  
  // Check both contract addresses
  const addresses = {
    'CONFIG BulkPayroll': '0x850Ee5aAA4e55668573D5Ce5f055c113Fe7bd0d4',
    'OLD BulkPayroll': '0xE9bD986514a6d35B1B73BeA6F19804D3c7aed284'
  };
  
  for (const [name, address] of Object.entries(addresses)) {
    try {
      const contract = new ethers.Contract(address, bulkPayrollABI, provider);
      const usdtToken = await contract.usdtToken();
      console.log(`${name} (${address}):`);
      console.log(`  USDT Token: ${usdtToken}`);
    } catch (error) {
      console.log(`${name} (${address}): ERROR - ${error.message}`);
    }
  }
  
  console.log('\nCONFIG USDT Address: 0xd55B72640f3e31910A688a2Dc81876F053115B09');
}

checkBulkPayrollContract().catch(console.error);