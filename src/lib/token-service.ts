// Token service with fee delegation support
import { CONFIG, METHOD_IDS } from '@/lib/config';
import { getGaslessTransactionService } from '@/lib/gasless-transactions';
import KaiaPayErrorHandler from '@/lib/error-handler';

export interface TokenBalance {
  balance: string;
  rawBalance: string;
  decimals: number;
  symbol: string;
  contractAddress: string;
}

export interface FaucetResult {
  success: boolean;
  transactionHash?: string;
  error?: string;
  amount?: string;
  gasless?: boolean; // Indicates if transaction was gasless
}

export interface TransferResult {
  success: boolean;
  transactionHash?: string;
  error?: string;
  gasless?: boolean;
}

export async function getUSDTBalance(walletAddress: string): Promise<TokenBalance> {
  console.log('🔍 Getting real USDT balance for:', walletAddress);
  
  try {
    // Import wallet service dynamically to avoid SSR issues
    const { WalletService } = await import('./wallet-service');
    const walletService = WalletService.getInstance();
    
    // Get real USDT balance from blockchain - this returns formatted balance
    const formattedBalance = await walletService.getTokenBalance(CONFIG.USDT_ADDRESS, walletAddress);
    const balance = parseFloat(formattedBalance).toFixed(2);
    const rawBalance = Math.round(parseFloat(formattedBalance) * Math.pow(10, 18)).toString();
    
    console.log('✅ Real USDT balance:', balance, 'USDT');
    console.log('🔍 Balance details:', {
      formatted: formattedBalance,
      display: balance,
      rawWei: rawBalance,
      decimals: 18
    });
    
    return {
      balance: balance,
      rawBalance: rawBalance,
      decimals: 18, // DummyUSDT uses 18 decimals (ERC20 standard)
      symbol: "USDT",
      contractAddress: CONFIG.USDT_ADDRESS
    };
  } catch (error) {
    console.error('❌ Failed to get USDT balance:', error);
    // Return zero balance on error instead of dummy data
    return {
      balance: "0.00",
      rawBalance: "0",
      decimals: 6,
      symbol: "USDT",
      contractAddress: CONFIG.USDT_ADDRESS
    };
  }
}

export async function requestUSDTFromFaucet(walletAddress: string): Promise<FaucetResult> {
  console.log('🚰 Requesting USDT from faucet using LIFF wallet only...');
  console.log('🔍 Wallet address:', walletAddress);
  console.log('🔍 Target contract:', CONFIG.USDT_ADDRESS);
  
  try {
    // COMMENTED OUT: Gasless service to focus on direct LIFF wallet transactions
    // const gaslessService = getGaslessTransactionService();
    // const gaslessResult = await gaslessService.executeGaslessFaucet(walletAddress);
    
    console.log('🔄 Skipping gasless service - using LIFF wallet directly');
    
    // Import wallet service dynamically to avoid SSR issues
    const { WalletService } = await import('./wallet-service');
    const walletService = WalletService.getInstance();
    
    console.log('🔍 Checking wallet connection status...');
    const walletState = walletService.getState();
    console.log('📊 Wallet state:', {
      isConnected: walletState.isConnected,
      address: walletState.address,
      walletType: walletState.walletType,
      isLoading: walletState.isLoading,
      error: walletState.error
    });
    
    if (!walletState.isConnected || !walletState.address) {
      console.error('❌ LIFF wallet not connected:', walletState);
      throw new Error('LIFF wallet not connected');
    }
    
    // Verify addresses match
    if (walletState.address.toLowerCase() !== walletAddress.toLowerCase()) {
      console.warn('⚠️ Address mismatch:', {
        requested: walletAddress,
        connected: walletState.address
      });
    }
    
    // Create faucet transaction data (calling faucet() function)
    // Function signature: faucet() - no parameters
    const faucetMethodId = METHOD_IDS.USDT.FAUCET; // ✅ Using verified method ID from clean deployment
    
    console.log('📝 Creating faucet transaction with parameters:', {
      contract: CONFIG.USDT_ADDRESS,
      methodId: faucetMethodId,
      methodName: 'faucet()',
      from: walletState.address,
      to: CONFIG.USDT_ADDRESS,
      value: '0x0',
      gasLimit: '0x15f90',
      data: faucetMethodId
    });
    
    console.log('🔍 Contract analysis:');
    console.log('  - Contract: DummyUSDT');
    console.log('  - Function: faucet() external');
    console.log('  - No parameters required');
    console.log('  - Cooldown: 24 hours (FAUCET_COOLDOWN)');
    console.log('  - Amount: 1000 tokens (FAUCET_AMOUNT = 1000 * 10^18)');
    console.log('  - Requires contract to have balance');
    
    // Send transaction through LIFF wallet
    console.log('🚀 Sending faucet transaction through LIFF wallet...');
    const txHash = await walletService.sendTransaction(
      CONFIG.USDT_ADDRESS, // USDT contract address
      '0x0', // No native token value for faucet call
      '0x15f90', // Gas limit for faucet call (~90000)
      faucetMethodId // Faucet function call data
    );
    
    console.log('✅ LIFF wallet faucet transaction sent successfully!');
    console.log('📜 Transaction hash:', txHash);
    console.log('🔍 View on Kaiascan:', `https://kairos.kaiascope.com/tx/${txHash}`);
    
    return {
      success: true,
      transactionHash: txHash,
      amount: "1000.00", // Based on DummyUSDT FAUCET_AMOUNT = 1000 * 10^18
      gasless: false
    };
  } catch (error) {
    console.error('❌ Faucet request failed:', error);
    const errorDetails = KaiaPayErrorHandler.handleFaucetError(error);
    return {
      success: false,
      error: errorDetails.userMessage,
      gasless: false
    };
  }
}

export async function transferUSDT(
  fromAddress: string,
  toAddress: string,
  amount: string
): Promise<TransferResult> {
  console.log('💸 Transferring USDT using LIFF wallet only...', {
    from: fromAddress,
    to: toAddress,
    amount
  });
  
  try {
    // COMMENTED OUT: Gasless service to focus on direct LIFF wallet transactions
    // const gaslessService = getGaslessTransactionService();
    // const gaslessResult = await gaslessService.executeGaslessTransfer(fromAddress, toAddress, amount);
    
    console.log('🔄 Skipping gasless service - using LIFF wallet directly for P2P transfer');
    
    // Import wallet service dynamically to avoid SSR issues
    const { WalletService } = await import('./wallet-service');
    const walletService = WalletService.getInstance();
    
    const walletState = walletService.getState();
    console.log('🔍 P2P Transfer - Wallet state:', walletState);
    
    if (!walletState.isConnected || !walletState.address) {
      throw new Error('LIFF wallet not connected');
    }
    
    // Convert amount to wei (DummyUSDT uses 18 decimals)
    const amountInWei = Math.round(parseFloat(amount) * Math.pow(10, 18));
    console.log('💰 Amount conversion:', {
      originalAmount: amount,
      amountInWei: amountInWei,
      decimals: 18
    });      // Create ERC20 transfer transaction data
      // Function signature: transfer(address,uint256)
      const transferMethodId = METHOD_IDS.USDT.TRANSFER.slice(2); // ✅ Using verified method ID from clean deployment
      const paddedToAddress = toAddress.replace('0x', '').toLowerCase().padStart(64, '0');
      const paddedAmount = amountInWei.toString(16).padStart(64, '0');
      const transactionData = '0x' + transferMethodId + paddedToAddress + paddedAmount;
      
      console.log('📝 Creating ERC20 transfer transaction:', {
        contract: CONFIG.USDT_ADDRESS,
        data: transactionData,
        amountInWei
      });
      
      // Send transaction through LIFF wallet
      const txHash = await walletService.sendTransaction(
        CONFIG.USDT_ADDRESS, // USDT contract address
        '0x0', // No native token value for ERC20 transfer
        '0x15f90', // Gas limit for ERC20 transfer (~90000)
        transactionData // ERC20 transfer function call data
      );
      
      console.log('✅ LIFF wallet transaction sent:', txHash);
      
      return {
        success: true,
        transactionHash: txHash,
        gasless: false
      };
  } catch (error) {
    console.error('❌ USDT transfer failed:', error);
    const errorDetails = KaiaPayErrorHandler.handleContractError(error);
    return {
      success: false,
      error: errorDetails.userMessage,
      gasless: false
    };
  }
}
