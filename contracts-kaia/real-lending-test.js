// Real Lending Protocol Transaction Test
// Tests actual deposits with a funded wallet

const { ethers } = require('ethers');

// Latest contract addresses
const CONTRACTS = {
    LendingProtocol: '0xc754860D0064f0707F5c5c9de2f0930d580E7Db7',
    DummyUSDT: '0xd55B72640f3e31910A688a2Dc81876F053115B09',
    kUSDT: '0xB6369bfC61b27856A8DCA6bebE1a51766C767133'
};

const KAIA_TESTNET = {
    rpcUrl: 'https://public-en-kairos.node.kaia.io'
};

async function testRealDeposit() {
    console.log('🔥 Real Enhanced Lending Protocol Test');
    console.log('======================================');
    console.log('🎯 Testing with deployed contracts on Kaia testnet');
    console.log('');
    
    const provider = new ethers.JsonRpcProvider(KAIA_TESTNET.rpcUrl);
    
    // Using the deployer's private key for testing (if available in env)
    const privateKey = process.env.PRIVATE_KEY || '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'; // Default hardhat key
    const wallet = new ethers.Wallet(privateKey, provider);
    
    console.log('👤 Test Wallet:', wallet.address);
    
    // Contract ABIs
    const usdtAbi = [
        'function balanceOf(address) view returns (uint256)',
        'function approve(address, uint256) returns (bool)',
        'function allowance(address, address) view returns (uint256)',
        'function decimals() view returns (uint8)'
    ];
    
    const lendingAbi = [
        'function deposit(address token, uint256 amount) external',
        'function USDT() view returns (address)',
        'function owner() view returns (address)',
        'event Deposit(address indexed user, address indexed token, uint256 amount, uint256 lpTokens)'
    ];
    
    const usdtContract = new ethers.Contract(CONTRACTS.DummyUSDT, usdtAbi, wallet);
    const lendingContract = new ethers.Contract(CONTRACTS.LendingProtocol, lendingAbi, wallet);
    
    try {
        // Check balances
        console.log('💰 Checking balances...');
        const usdtBalance = await usdtContract.balanceOf(wallet.address);
        const decimals = await usdtContract.decimals();
        console.log('   USDT Balance:', ethers.formatUnits(usdtBalance, decimals), 'USDT');
        console.log('   USDT Decimals:', decimals);
        console.log('');
        
        if (usdtBalance === 0n) {
            console.log('⚠️ No USDT balance. Please get some USDT from faucet first.');
            return;
        }
        
        // Test deposit
        const depositAmount = ethers.parseUnits('1.0', decimals); // 1 USDT
        console.log('🏦 Testing deposit of 1 USDT...');
        console.log('   Deposit Amount:', ethers.formatUnits(depositAmount, decimals), 'USDT');
        console.log('   Amount in Wei:', depositAmount.toString());
        console.log('');
        
        // Check allowance
        const currentAllowance = await usdtContract.allowance(wallet.address, CONTRACTS.LendingProtocol);
        console.log('🔍 Current allowance:', ethers.formatUnits(currentAllowance, decimals), 'USDT');
        
        if (currentAllowance < depositAmount) {
            console.log('🔐 Approving USDT spend...');
            const approveTx = await usdtContract.approve(CONTRACTS.LendingProtocol, depositAmount * 10n);
            console.log('   Approve TX:', approveTx.hash);
            console.log('   🔗 Kaiascan:', `https://kairos.kaiascope.com/tx/${approveTx.hash}`);
            await approveTx.wait();
            console.log('   ✅ Approval confirmed');
            console.log('');
        }
        
        // Perform deposit
        console.log('💳 Performing deposit...');
        const depositTx = await lendingContract.deposit(CONTRACTS.DummyUSDT, depositAmount, {
            gasLimit: 500000 // Set explicit gas limit
        });
        
        console.log('   Deposit TX:', depositTx.hash);
        console.log('   🔗 Kaiascan:', `https://kairos.kaiascope.com/tx/${depositTx.hash}`);
        
        console.log('⏳ Waiting for confirmation...');
        const receipt = await depositTx.wait();
        
        console.log('✅ Deposit successful!');
        console.log('   Block Number:', receipt.blockNumber);
        console.log('   Gas Used:', receipt.gasUsed.toString());
        console.log('');
        
        // Parse events
        console.log('📋 Transaction Events:');
        for (const log of receipt.logs) {
            try {
                const parsed = lendingContract.interface.parseLog(log);
                if (parsed) {
                    console.log(`   Event: ${parsed.name}`);
                    console.log(`   User: ${parsed.args.user}`);
                    console.log(`   Token: ${parsed.args.token}`);
                    console.log(`   Amount: ${ethers.formatUnits(parsed.args.amount, decimals)} USDT`);
                    console.log(`   LP Tokens: ${ethers.formatUnits(parsed.args.lpTokens, 18)} kUSDT`);
                }
            } catch (e) {
                // Skip non-parseable logs
            }
        }
        console.log('');
        
        // Check balance after
        const newUsdtBalance = await usdtContract.balanceOf(wallet.address);
        console.log('📊 Post-transaction state:');
        console.log('   New USDT Balance:', ethers.formatUnits(newUsdtBalance, decimals), 'USDT');
        console.log('   USDT Used:', ethers.formatUnits(usdtBalance - newUsdtBalance, decimals), 'USDT');
        console.log('');
        
        console.log('🎉 Lending deposit test completed successfully!');
        console.log('🔗 Transaction is visible on Kaiascan');
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
        if (error.data) console.error('Error data:', error.data);
        if (error.reason) console.error('Reason:', error.reason);
        if (error.code) console.error('Error code:', error.code);
        
        // Try to decode revert reason
        if (error.data && error.data.startsWith('0x08c379a0')) {
            try {
                const reason = ethers.AbiCoder.defaultAbiCoder().decode(['string'], '0x' + error.data.slice(10))[0];
                console.error('Revert reason:', reason);
            } catch (e) {
                console.error('Could not decode revert reason');
            }
        }
    }
}

if (require.main === module) {
    testRealDeposit().catch(console.error);
}

module.exports = { testRealDeposit };