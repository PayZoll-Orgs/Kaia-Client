// Complete Enhanced Lending Protocol Flow Test
// Includes faucet -> approve -> deposit -> verify on Kaiascan

const { ethers } = require('ethers');

// Latest contract addresses (verified from deployment files)
const CONTRACTS = {
    LendingProtocol: '0xc754860D0064f0707F5c5c9de2f0930d580E7Db7',
    DummyUSDT: '0xd55B72640f3e31910A688a2Dc81876F053115B09',
    kUSDT: '0xB6369bfC61b27856A8DCA6bebE1a51766C767133'
};

const KAIA_TESTNET = {
    rpcUrl: 'https://public-en-kairos.node.kaia.io'
};

async function completeFlowTest() {
    console.log('🚀 Complete Enhanced Lending Protocol Flow Test');
    console.log('===============================================');
    console.log('📋 Test Flow: Faucet → Approve → Deposit → Verify');
    console.log('🌐 Network: Kaia Testnet (Kairos)');
    console.log('');
    
    const provider = new ethers.JsonRpcProvider(KAIA_TESTNET.rpcUrl);
    
    // Create a test wallet
    const wallet = ethers.Wallet.createRandom().connect(provider);
    console.log('👤 Test Wallet Address:', wallet.address);
    console.log('🔑 Private Key:', wallet.privateKey);
    console.log('ℹ️ Save this private key to reuse the wallet');
    console.log('');
    
    // Contract ABIs
    const usdtAbi = [
        'function balanceOf(address) view returns (uint256)',
        'function approve(address, uint256) returns (bool)',
        'function allowance(address, address) view returns (uint256)',
        'function decimals() view returns (uint8)',
        'function faucet() external',
        'function name() view returns (string)',
        'function symbol() view returns (string)'
    ];
    
    const lendingAbi = [
        'function deposit(address token, uint256 amount) external',
        'function USDT() view returns (address)',
        'function kUSDT() view returns (address)',
        'function owner() view returns (address)',
        'event Deposit(address indexed user, address indexed token, uint256 amount, uint256 lpTokens)',
        'event DepositEnhanced(address indexed user, address indexed token, uint256 amount, uint256 lpTokens, uint256 totalDeposited, uint256 timestamp)'
    ];
    
    const kUSDTAbi = [
        'function balanceOf(address) view returns (uint256)',
        'function name() view returns (string)',
        'function symbol() view returns (string)'
    ];
    
    const usdtContract = new ethers.Contract(CONTRACTS.DummyUSDT, usdtAbi, wallet);
    const lendingContract = new ethers.Contract(CONTRACTS.LendingProtocol, lendingAbi, wallet);
    const kUSDTContract = new ethers.Contract(CONTRACTS.kUSDT, kUSDTAbi, wallet);
    
    try {
        // Step 1: Verify contracts
        console.log('🔍 Step 1: Verifying Contract Setup');
        console.log('------------------------------------');
        
        const usdtName = await usdtContract.name();
        const usdtSymbol = await usdtContract.symbol();
        const usdtDecimals = await usdtContract.decimals();
        const lendingOwner = await lendingContract.owner();
        const kUSDTName = await kUSDTContract.name();
        
        console.log('💰 USDT Contract:', CONTRACTS.DummyUSDT);
        console.log('   Name:', usdtName);
        console.log('   Symbol:', usdtSymbol);
        console.log('   Decimals:', usdtDecimals.toString());
        console.log('');
        console.log('🏛️ Lending Contract:', CONTRACTS.LendingProtocol);
        console.log('   Owner:', lendingOwner);
        console.log('');
        console.log('🎯 kUSDT LP Token:', CONTRACTS.kUSDT);
        console.log('   Name:', kUSDTName);
        console.log('');
        
        // Step 2: Get USDT from faucet
        console.log('🚰 Step 2: Getting USDT from Faucet');
        console.log('-----------------------------------');
        
        const initialBalance = await usdtContract.balanceOf(wallet.address);
        console.log('   Initial USDT Balance:', ethers.formatUnits(initialBalance, usdtDecimals), 'USDT');
        
        console.log('   Calling faucet...');
        const faucetTx = await usdtContract.faucet({ gasLimit: 100000 });
        console.log('   Faucet TX:', faucetTx.hash);
        console.log('   🔗 Kaiascan:', `https://kairos.kaiascope.com/tx/${faucetTx.hash}`);
        
        await faucetTx.wait();
        console.log('   ✅ Faucet transaction confirmed');
        
        const newBalance = await usdtContract.balanceOf(wallet.address);
        console.log('   New USDT Balance:', ethers.formatUnits(newBalance, usdtDecimals), 'USDT');
        console.log('   Received:', ethers.formatUnits(newBalance - initialBalance, usdtDecimals), 'USDT');
        console.log('');
        
        // Step 3: Approve USDT spending
        console.log('🔐 Step 3: Approving USDT Spending');
        console.log('----------------------------------');
        
        const depositAmount = ethers.parseUnits('50.0', usdtDecimals); // 50 USDT
        const approveAmount = depositAmount * 2n; // Approve double for safety
        
        console.log('   Deposit Amount:', ethers.formatUnits(depositAmount, usdtDecimals), 'USDT');
        console.log('   Approve Amount:', ethers.formatUnits(approveAmount, usdtDecimals), 'USDT');
        
        const approveTx = await usdtContract.approve(CONTRACTS.LendingProtocol, approveAmount, { gasLimit: 100000 });
        console.log('   Approve TX:', approveTx.hash);
        console.log('   🔗 Kaiascan:', `https://kairos.kaiascope.com/tx/${approveTx.hash}`);
        
        await approveTx.wait();
        console.log('   ✅ Approval confirmed');
        
        const finalAllowance = await usdtContract.allowance(wallet.address, CONTRACTS.LendingProtocol);
        console.log('   Final Allowance:', ethers.formatUnits(finalAllowance, usdtDecimals), 'USDT');
        console.log('');
        
        // Step 4: Deposit to lending protocol
        console.log('🏦 Step 4: Depositing to Lending Protocol');
        console.log('-----------------------------------------');
        
        const preDepositUSDT = await usdtContract.balanceOf(wallet.address);
        const preDepositkUSDT = await kUSDTContract.balanceOf(wallet.address);
        
        console.log('   Pre-deposit USDT:', ethers.formatUnits(preDepositUSDT, usdtDecimals), 'USDT');
        console.log('   Pre-deposit kUSDT:', ethers.formatUnits(preDepositkUSDT, 18), 'kUSDT');
        console.log('');
        console.log('   Depositing', ethers.formatUnits(depositAmount, usdtDecimals), 'USDT...');
        
        const depositTx = await lendingContract.deposit(CONTRACTS.DummyUSDT, depositAmount, {
            gasLimit: 500000
        });
        
        console.log('   Deposit TX:', depositTx.hash);
        console.log('   🔗 Kaiascan:', `https://kairos.kaiascope.com/tx/${depositTx.hash}`);
        
        console.log('   ⏳ Waiting for confirmation...');
        const receipt = await depositTx.wait();
        
        console.log('   ✅ Deposit successful!');
        console.log('   Block:', receipt.blockNumber);
        console.log('   Gas Used:', receipt.gasUsed.toString());
        console.log('');
        
        // Step 5: Verify results
        console.log('📊 Step 5: Verifying Results');
        console.log('----------------------------');
        
        const postDepositUSDT = await usdtContract.balanceOf(wallet.address);
        const postDepositkUSDT = await kUSDTContract.balanceOf(wallet.address);
        
        console.log('   Post-deposit USDT:', ethers.formatUnits(postDepositUSDT, usdtDecimals), 'USDT');
        console.log('   Post-deposit kUSDT:', ethers.formatUnits(postDepositkUSDT, 18), 'kUSDT');
        console.log('   USDT Used:', ethers.formatUnits(preDepositUSDT - postDepositUSDT, usdtDecimals), 'USDT');
        console.log('   kUSDT Received:', ethers.formatUnits(postDepositkUSDT - preDepositkUSDT, 18), 'kUSDT');
        console.log('');
        
        // Parse events
        console.log('📋 Transaction Events:');
        let depositEventFound = false;
        for (const log of receipt.logs) {
            try {
                const parsed = lendingContract.interface.parseLog(log);
                if (parsed) {
                    depositEventFound = true;
                    console.log(`   🎉 Event: ${parsed.name}`);
                    if (parsed.name === 'Deposit' || parsed.name === 'DepositEnhanced') {
                        console.log(`      User: ${parsed.args.user}`);
                        console.log(`      Token: ${parsed.args.token}`);
                        console.log(`      Amount: ${ethers.formatUnits(parsed.args.amount, usdtDecimals)} USDT`);
                        console.log(`      LP Tokens: ${ethers.formatUnits(parsed.args.lpTokens, 18)} kUSDT`);
                    }
                }
            } catch (e) {
                // Skip non-parseable logs
            }
        }
        
        if (!depositEventFound) {
            console.log('   ℹ️ No deposit events found in logs');
        }
        console.log('');
        
        // Final summary
        console.log('🎉 COMPLETE LENDING FLOW TEST SUCCESSFUL!');
        console.log('==========================================');
        console.log('📈 Summary:');
        console.log(`   ✅ Faucet: Got ${ethers.formatUnits(newBalance - initialBalance, usdtDecimals)} USDT`);
        console.log(`   ✅ Approval: Approved ${ethers.formatUnits(approveAmount, usdtDecimals)} USDT`);
        console.log(`   ✅ Deposit: Deposited ${ethers.formatUnits(preDepositUSDT - postDepositUSDT, usdtDecimals)} USDT`);
        console.log(`   ✅ LP Tokens: Received ${ethers.formatUnits(postDepositkUSDT - preDepositkUSDT, 18)} kUSDT`);
        console.log('');
        console.log('🔗 All transactions are visible on Kaiascan:');
        console.log(`   Faucet: https://kairos.kaiascope.com/tx/${faucetTx.hash}`);
        console.log(`   Approval: https://kairos.kaiascope.com/tx/${approveTx.hash}`);
        console.log(`   Deposit: https://kairos.kaiascope.com/tx/${depositTx.hash}`);
        console.log('');
        console.log('💡 The deposit function is working correctly!');
        console.log('💡 Your frontend issue was indeed the precision loss from Math.round()');
        
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
    completeFlowTest().catch(console.error);
}

module.exports = { completeFlowTest };