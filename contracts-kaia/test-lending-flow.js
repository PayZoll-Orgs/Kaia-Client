// Test Enhanced Lending Protocol Flow
// This script tests the lending deposit, withdraw, and claim earnings functions

const { ethers } = require('ethers');
require('dotenv').config();

// Contract addresses from latest deployment (updated-lending-deployment.json - 2025-09-20T19:17:20.180Z)
const CONTRACTS = {
    LendingProtocol: '0xc754860D0064f0707F5c5c9de2f0930d580E7Db7', // Latest Enhanced Lending Protocol
    DummyUSDT: '0xd55B72640f3e31910A688a2Dc81876F053115B09',      // Current USDT
    kUSDT: '0xB6369bfC61b27856A8DCA6bebE1a51766C767133',         // Latest kUSDT LP token
    kKAIA: '0xf38b06fcf9e107EBb3AE2104D57CC3dF7279F64B',         // Latest kKAIA LP token
    USDY: '0xC4F121aa9293c2B261bb9143b4c59b9BC9912B6c'           // USDY token
};

// Network configuration
const KAIA_TESTNET = {
    chainId: 1001,
    name: 'Kaia Testnet',
    rpcUrl: 'https://public-en-kairos.node.kaia.io'
};

// Test amounts
const TEST_DEPOSIT_AMOUNT = ethers.parseUnits('10', 18); // 10 USDT
const APPROVE_AMOUNT = ethers.parseUnits('1000', 18); // Approve 1000 USDT

async function main() {
    console.log('🧪 Testing Enhanced Lending Protocol Flow');
    console.log('=========================================');
    
    // Setup provider and wallet
    const provider = new ethers.JsonRpcProvider(KAIA_TESTNET.rpcUrl);
    
    // Use environment variable for private key or create a test wallet
    const privateKey = process.env.PRIVATE_KEY || ethers.Wallet.createRandom().privateKey;
    const wallet = new ethers.Wallet(privateKey, provider);
    
    console.log('👤 Test Wallet Address:', wallet.address);
    console.log('🌐 Network:', KAIA_TESTNET.name);
    console.log('🔗 RPC URL:', KAIA_TESTNET.rpcUrl);
    console.log('');
    
    // Contract ABIs (simplified for testing)
    const USDT_ABI = [
        'function balanceOf(address owner) view returns (uint256)',
        'function approve(address spender, uint256 amount) returns (bool)',
        'function transfer(address to, uint256 amount) returns (bool)',
        'function allowance(address owner, address spender) view returns (uint256)'
    ];
    
    const LENDING_ABI = [
        'function deposit(address token, uint256 amount) external',
        'function redeem(address lpToken, uint256 amount) external',
        'function claimLendingEarnings(address token) external',
        'function lenderData(address user, address token) view returns (uint256 totalDeposited, uint256 accruedEarnings, uint256 lastEarningsUpdate, uint256 claimableEarnings)',
        'event Deposit(address indexed user, address indexed token, uint256 amount, uint256 lpTokens)',
        'event DepositEnhanced(address indexed user, address indexed token, uint256 amount, uint256 lpTokens, uint256 totalDeposited, uint256 timestamp)'
    ];
    
    const LP_TOKEN_ABI = [
        'function balanceOf(address owner) view returns (uint256)',
        'function totalSupply() view returns (uint256)'
    ];
    
    // Initialize contracts
    const usdtContract = new ethers.Contract(CONTRACTS.DummyUSDT, USDT_ABI, wallet);
    const lendingContract = new ethers.Contract(CONTRACTS.LendingProtocol, LENDING_ABI, wallet);
    const kUSDTContract = new ethers.Contract(CONTRACTS.kUSDT, LP_TOKEN_ABI, wallet);
    
    try {
        // Step 1: Check initial balances
        console.log('📊 Initial State Check');
        console.log('----------------------');
        
        const usdtBalance = await usdtContract.balanceOf(wallet.address);
        const kUSDTBalance = await kUSDTContract.balanceOf(wallet.address);
        const allowance = await usdtContract.allowance(wallet.address, CONTRACTS.LendingProtocol);
        
        console.log('💰 USDT Balance:', ethers.formatUnits(usdtBalance, 18), 'USDT');
        console.log('🎯 kUSDT Balance:', ethers.formatUnits(kUSDTBalance, 18), 'kUSDT');
        console.log('✅ Allowance:', ethers.formatUnits(allowance, 18), 'USDT');
        console.log('');
        
        // Check lender data before deposit
        const lenderDataBefore = await lendingContract.lenderData(wallet.address, CONTRACTS.DummyUSDT);
        console.log('📈 Lender Data Before:');
        console.log('   Total Deposited:', ethers.formatUnits(lenderDataBefore[0], 18), 'USDT');
        console.log('   Accrued Earnings:', ethers.formatUnits(lenderDataBefore[1], 18), 'USDT');
        console.log('   Claimable Earnings:', ethers.formatUnits(lenderDataBefore[3], 18), 'USDT');
        console.log('');
        
        // Step 2: Approve USDT spending (if needed)
        if (allowance < APPROVE_AMOUNT) {
            console.log('🔐 Approving USDT spending...');
            const approveTx = await usdtContract.approve(CONTRACTS.LendingProtocol, APPROVE_AMOUNT);
            console.log('⏳ Approve Transaction:', approveTx.hash);
            await approveTx.wait();
            console.log('✅ Approval confirmed');
            console.log('');
        }
        
        // Step 3: Deposit USDT
        console.log('🏦 Depositing USDT to Lending Protocol');
        console.log('---------------------------------------');
        console.log('💵 Deposit Amount:', ethers.formatUnits(TEST_DEPOSIT_AMOUNT, 18), 'USDT');
        console.log('🎯 Token Address:', CONTRACTS.DummyUSDT);
        console.log('🏛️ Lending Contract:', CONTRACTS.LendingProtocol);
        
        const depositTx = await lendingContract.deposit(CONTRACTS.DummyUSDT, TEST_DEPOSIT_AMOUNT);
        console.log('⏳ Deposit Transaction:', depositTx.hash);
        console.log('🔗 View on Kaiascan: https://kairos.kaiascope.com/tx/' + depositTx.hash);
        
        const receipt = await depositTx.wait();
        console.log('✅ Deposit confirmed in block:', receipt.blockNumber);
        console.log('⛽ Gas Used:', receipt.gasUsed.toString());
        console.log('');
        
        // Parse events
        console.log('📋 Transaction Events:');
        for (const log of receipt.logs) {
            try {
                const parsed = lendingContract.interface.parseLog(log);
                if (parsed) {
                    console.log('   Event:', parsed.name);
                    console.log('   Args:', parsed.args);
                }
            } catch (e) {
                // Skip unparseable logs
            }
        }
        console.log('');
        
        // Step 4: Check balances after deposit
        console.log('📊 Post-Deposit State');
        console.log('---------------------');
        
        const usdtBalanceAfter = await usdtContract.balanceOf(wallet.address);
        const kUSDTBalanceAfter = await kUSDTContract.balanceOf(wallet.address);
        const lenderDataAfter = await lendingContract.lenderData(wallet.address, CONTRACTS.DummyUSDT);
        
        console.log('💰 USDT Balance:', ethers.formatUnits(usdtBalanceAfter, 18), 'USDT');
        console.log('🎯 kUSDT Balance:', ethers.formatUnits(kUSDTBalanceAfter, 18), 'kUSDT');
        console.log('📈 Lender Data After:');
        console.log('   Total Deposited:', ethers.formatUnits(lenderDataAfter[0], 18), 'USDT');
        console.log('   Accrued Earnings:', ethers.formatUnits(lenderDataAfter[1], 18), 'USDT');
        console.log('   Claimable Earnings:', ethers.formatUnits(lenderDataAfter[3], 18), 'USDT');
        console.log('');
        
        // Step 5: Wait a bit and try to claim earnings (if any)
        console.log('⏰ Waiting 30 seconds for potential earnings...');
        await new Promise(resolve => setTimeout(resolve, 30000));
        
        const lenderDataUpdated = await lendingContract.lenderData(wallet.address, CONTRACTS.DummyUSDT);
        const claimableEarnings = lenderDataUpdated[3];
        
        console.log('💎 Updated Claimable Earnings:', ethers.formatUnits(claimableEarnings, 18), 'USDT');
        
        if (claimableEarnings > 0n) {
            console.log('🎯 Claiming earnings...');
            const claimTx = await lendingContract.claimLendingEarnings(CONTRACTS.DummyUSDT);
            console.log('⏳ Claim Transaction:', claimTx.hash);
            console.log('🔗 View on Kaiascan: https://kairos.kaiascope.com/tx/' + claimTx.hash);
            await claimTx.wait();
            console.log('✅ Earnings claimed successfully');
        } else {
            console.log('ℹ️ No earnings to claim yet (earnings accrue over time)');
        }
        console.log('');
        
        // Step 6: Test withdrawal (redeem LP tokens)
        const kUSDTBalanceForRedeem = await kUSDTContract.balanceOf(wallet.address);
        if (kUSDTBalanceForRedeem > 0n) {
            console.log('🏧 Testing Withdrawal (Redeem)');
            console.log('------------------------------');
            const redeemAmount = kUSDTBalanceForRedeem / 2n; // Redeem half
            console.log('💱 Redeeming kUSDT:', ethers.formatUnits(redeemAmount, 18), 'kUSDT');
            
            const redeemTx = await lendingContract.redeem(CONTRACTS.kUSDT, redeemAmount);
            console.log('⏳ Redeem Transaction:', redeemTx.hash);
            console.log('🔗 View on Kaiascan: https://kairos.kaiascope.com/tx/' + redeemTx.hash);
            await redeemTx.wait();
            console.log('✅ Redemption successful');
        }
        
        // Final state
        console.log('📊 Final State');
        console.log('---------------');
        const finalUSDTBalance = await usdtContract.balanceOf(wallet.address);
        const finalKUSDTBalance = await kUSDTContract.balanceOf(wallet.address);
        const finalLenderData = await lendingContract.lenderData(wallet.address, CONTRACTS.DummyUSDT);
        
        console.log('💰 Final USDT Balance:', ethers.formatUnits(finalUSDTBalance, 18), 'USDT');
        console.log('🎯 Final kUSDT Balance:', ethers.formatUnits(finalKUSDTBalance, 18), 'kUSDT');
        console.log('📈 Final Lender Data:');
        console.log('   Total Deposited:', ethers.formatUnits(finalLenderData[0], 18), 'USDT');
        console.log('   Accrued Earnings:', ethers.formatUnits(finalLenderData[1], 18), 'USDT');
        console.log('   Claimable Earnings:', ethers.formatUnits(finalLenderData[3], 18), 'USDT');
        
        console.log('');
        console.log('🎉 Lending flow test completed successfully!');
        console.log('📍 All transactions are visible on Kaiascan');
        
    } catch (error) {
        console.error('❌ Test failed:', error);
        if (error.reason) console.error('Reason:', error.reason);
        if (error.code) console.error('Error Code:', error.code);
        if (error.data) console.error('Error Data:', error.data);
    }
}

// Function to test with different scenarios
async function testDifferentAmounts() {
    console.log('🧪 Testing Different Deposit Amounts');
    console.log('====================================');
    
    const amounts = [
        ethers.parseUnits('1', 18),    // 1 USDT
        ethers.parseUnits('5.5', 18),  // 5.5 USDT
        ethers.parseUnits('100', 18),  // 100 USDT
    ];
    
    for (const amount of amounts) {
        console.log('Testing amount:', ethers.formatUnits(amount, 18), 'USDT');
        // Test the amount conversion logic
        const amountInWei = BigInt(Math.floor(parseFloat(ethers.formatUnits(amount, 18)) * Math.pow(10, 18)));
        console.log('Converted with BigInt:', amountInWei.toString());
        console.log('Hex representation:', '0x' + amountInWei.toString(16));
        console.log('---');
    }
}

if (require.main === module) {
    // Run main test
    main().catch(console.error);
    
    // Also test amount conversions
    console.log('\n');
    testDifferentAmounts();
}

module.exports = { main, testDifferentAmounts };