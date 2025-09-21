// Test script to verify bulk transfer method ID and encoding

const crypto = require('crypto');

// Calculate method ID for bulkTransfer(address,address[],uint256[])
function calculateMethodId(signature) {
  const hash = crypto.createHash('sha3-256').update(signature).digest('hex');
  return '0x' + hash.slice(0, 8);
}

const correctMethodSignature = 'bulkTransfer(address,address[],uint256[])';
const incorrectMethodSignature = 'bulkTransfer(address[],uint256[])';

const correctMethodId = calculateMethodId(correctMethodSignature);
const incorrectMethodId = calculateMethodId(incorrectMethodSignature);

console.log('🔍 Method Signature Verification');
console.log('================================');
console.log('ABI Function Signature:', correctMethodSignature);
console.log('ABI Calculated Method ID:', correctMethodId);
console.log('Expected Method ID:', '0x153a1f3e');
console.log('ABI Match:', correctMethodId === '0x153a1f3e' ? '✅ YES' : '❌ NO');
console.log('');
console.log('Incorrect Signature:', incorrectMethodSignature);
console.log('Incorrect Method ID:', incorrectMethodId);
console.log('');

// Test with sample data including token address
const usdtAddress = '0xd55B72640f3e31910A688a2Dc81876F053115B09';
const testRecipients = [
  '0x1111111111111111111111111111111111111111',
  '0x2222222222222222222222222222222222222222'
];

const testAmounts = [
  '1000000000000000000', // 1 USDT in wei
  '2000000000000000000'  // 2 USDT in wei
];

console.log('📦 Correct Function Parameters');
console.log('==============================');
console.log('Token Address:', usdtAddress);
console.log('Recipients:', testRecipients);
console.log('Amounts:', testAmounts);

// Verify the BulkPayroll contract address from manual testing guide
console.log('\n🏗️ Contract Information');
console.log('======================');
console.log('BulkPayroll Address:', '0xE9bD986514a6d35B1B73BeA6F19804D3c7aed284');
console.log('USDT Address:', '0xd55B72640f3e31910A688a2Dc81876F053115B09');
console.log('Expected Gas Limit:', '~200,000');

console.log('\n✅ Verification Complete');