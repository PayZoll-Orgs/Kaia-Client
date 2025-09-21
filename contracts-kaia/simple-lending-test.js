// Simple Enhanced Lending Protocol Test
// Test individual functions step by step

const { ethers } = require('ethers');

// Latest contract addresses (updated-lending-deployment.json - 2025-09-20T19:17:20.180Z)
const CONTRACTS = {
    LendingProtocol: '0xc754860D0064f0707F5c5c9de2f0930d580E7Db7',
    DummyUSDT: '0xd55B72640f3e31910A688a2Dc81876F053115B09',
    kUSDT: '0xB6369bfC61b27856A8DCA6bebE1a51766C767133',
    kKAIA: '0xf38b06fcf9e107EBb3AE2104D57CC3dF7279F64B'
};

const KAIA_TESTNET = {
    chainId: 1001,
    name: 'Kaia Testnet',
    rpcUrl: 'https://public-en-kairos.node.kaia.io'
};

async function testContract() {
    console.log('🔍 Enhanced Lending Protocol Contract Verification');
    console.log('================================================');
    
    const provider = new ethers.JsonRpcProvider(KAIA_TESTNET.rpcUrl);
    const testAddress = '0xEEFfe4C8B285A3f55EEC9fB50C9c96F69f9B453e'; // Deployer address
    
    // Minimal ABI for testing
    const abi = [
        'function USDT() view returns (address)',
        'function kUSDT() view returns (address)',
        'function lenderData(address user, address token) view returns (uint256 totalDeposited, uint256 accruedEarnings, uint256 lastEarningsUpdate, uint256 claimableEarnings)',
        'function deposit(address token, uint256 amount) external',
        'function owner() view returns (address)'
    ];
    
    const contract = new ethers.Contract(CONTRACTS.LendingProtocol, abi, provider);
    
    try {
        // Test 1: Check contract constants
        console.log('🏛️ Contract Constants:');
        const usdtAddress = await contract.USDT();
        const kUSDTAddress = await contract.kUSDT();
        const owner = await contract.owner();
        
        console.log('   USDT Address:', usdtAddress);
        console.log('   kUSDT Address:', kUSDTAddress);
        console.log('   Owner:', owner);
        console.log('   Expected USDT:', CONTRACTS.DummyUSDT);
        console.log('   Expected kUSDT:', CONTRACTS.kUSDT);
        console.log('   USDT Match:', usdtAddress.toLowerCase() === CONTRACTS.DummyUSDT.toLowerCase());
        console.log('   kUSDT Match:', kUSDTAddress.toLowerCase() === CONTRACTS.kUSDT.toLowerCase());
        console.log('');
        
        // Test 2: Try to read lender data with correct token address
        console.log('📊 Testing lenderData function:');
        console.log('   User Address:', testAddress);
        console.log('   Token Address (from contract):', usdtAddress);
        
        const lenderData = await contract.lenderData(testAddress, usdtAddress);
        console.log('   ✅ lenderData call successful!');
        console.log('   Total Deposited:', ethers.formatUnits(lenderData[0], 18), 'USDT');
        console.log('   Accrued Earnings:', ethers.formatUnits(lenderData[1], 18), 'USDT');
        console.log('   Last Update:', new Date(Number(lenderData[2]) * 1000).toISOString());
        console.log('   Claimable Earnings:', ethers.formatUnits(lenderData[3], 18), 'USDT');
        console.log('');
        
        // Test 3: Check USDT contract
        console.log('💰 Testing USDT Contract:');
        const usdtAbi = ['function balanceOf(address) view returns (uint256)', 'function decimals() view returns (uint8)'];
        const usdtContract = new ethers.Contract(usdtAddress, usdtAbi, provider);
        
        const balance = await usdtContract.balanceOf(testAddress);
        const decimals = await usdtContract.decimals();
        
        console.log('   USDT Balance:', ethers.formatUnits(balance, decimals), 'USDT');
        console.log('   USDT Decimals:', decimals);
        console.log('');
        
        console.log('🎉 All basic contract tests passed!');
        console.log('📋 Contract Summary:');
        console.log('   - Contract is deployed and functional');
        console.log('   - lenderData function works correctly');
        console.log('   - USDT token is configured properly');
        console.log('   - Ready for deposit/withdraw/claim testing');
        
    } catch (error) {
        console.error('❌ Contract test failed:', error.message);
        if (error.data) console.error('Error data:', error.data);
        if (error.reason) console.error('Reason:', error.reason);
    }
}

async function testDeposit() {
    console.log('\n🏦 Testing Deposit Function (Simulation)');
    console.log('=========================================');
    
    const provider = new ethers.JsonRpcProvider(KAIA_TESTNET.rpcUrl);
    
    // Test the BigInt conversion logic from our frontend
    const testAmounts = ['1.0', '5.5', '100.0', '0.1'];
    
    console.log('💡 Amount Conversion Test:');
    for (const amount of testAmounts) {
        const amountInWei = BigInt(Math.floor(parseFloat(amount) * Math.pow(10, 18)));
        console.log(`   ${amount} USDT -> ${amountInWei.toString()} wei (0x${amountInWei.toString(16)})`);
    }
    
    console.log('\n📝 Transaction Data Encoding Test:');
    const depositMethodId = '0x47e7ef24'; // deposit(address,uint256)
    const tokenAddress = CONTRACTS.DummyUSDT;
    const amount = '10.0';
    const amountInWei = BigInt(Math.floor(parseFloat(amount) * Math.pow(10, 18)));
    
    const paddedTokenAddress = tokenAddress.replace('0x', '').toLowerCase().padStart(64, '0');
    const paddedAmount = amountInWei.toString(16).padStart(64, '0');
    const transactionData = '0x' + depositMethodId.replace('0x', '') + paddedTokenAddress + paddedAmount;
    
    console.log('   Method ID:', depositMethodId);
    console.log('   Token Address:', tokenAddress);
    console.log('   Amount:', amount, 'USDT');
    console.log('   Amount in Wei:', amountInWei.toString());
    console.log('   Padded Token:', paddedTokenAddress);
    console.log('   Padded Amount:', paddedAmount);
    console.log('   Transaction Data:', transactionData);
    console.log('   Data Length:', transactionData.length, 'characters');
    
    console.log('\n✅ All encoding tests completed!');
}

if (require.main === module) {
    testContract()
        .then(() => testDeposit())
        .catch(console.error);
}

module.exports = { testContract, testDeposit };