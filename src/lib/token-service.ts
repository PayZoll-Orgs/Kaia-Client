// Token service with fee delegation support
import { CONFIG } from '@/lib/config';
import { getGaslessTransactionService } from '@/lib/gasless-transactions';

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
    const rawBalance = Math.round(parseFloat(formattedBalance) * Math.pow(10, 6)).toString();
    
    console.log('✅ Real USDT balance:', balance, 'USDT');
    
    return {
      balance: balance,
      rawBalance: rawBalance,
      decimals: 6,
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
  console.log('🚰 Requesting USDT from faucet (with fee delegation)...');
  
  try {
    // Try gasless transaction first
    const gaslessService = getGaslessTransactionService();
    const gaslessResult = await gaslessService.executeGaslessFaucet(walletAddress);
    
    if (gaslessResult.success) {
      console.log('✅ Gasless faucet successful!');
      return {
        success: true,
        transactionHash: gaslessResult.transactionHash,
        amount: "50.00",
        gasless: true
      };
    } else {
      console.log('⚠️ Gasless faucet failed, using LIFF wallet for regular faucet transaction');
      
      // Import wallet service dynamically to avoid SSR issues
      const { WalletService } = await import('./wallet-service');
      const walletService = WalletService.getInstance();
      
      const walletState = walletService.getState();
      if (!walletState.isConnected || !walletState.address) {
        throw new Error('LIFF wallet not connected');
      }
      
      // Create faucet transaction data (calling faucet() function)
      // Function signature: faucet()
      const faucetMethodId = '0xde5f72fd'; // First 4 bytes of keccak256("faucet()")
      
      console.log('📝 Creating faucet transaction:', {
        contract: CONFIG.USDT_ADDRESS,
        data: faucetMethodId,
        from: walletState.address
      });
      
      // Send faucet transaction through LIFF wallet
      const txHash = await walletService.sendTransaction(
        CONFIG.USDT_ADDRESS, // USDT contract address
        '0x0', // No native token value for faucet call
        '0x15f90', // Gas limit for faucet call (~90000)
        faucetMethodId // Faucet function call data
      );
      
      console.log('✅ LIFF wallet faucet transaction sent:', txHash);
      
      return {
        success: true,
        transactionHash: txHash,
        amount: "50.00", // Standard faucet amount
        gasless: false
      };
    }
  } catch (error) {
    console.error('❌ Faucet request failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Faucet request failed',
      gasless: false
    };
  }
}

export async function transferUSDT(
  fromAddress: string,
  toAddress: string,
  amount: string
): Promise<TransferResult> {
  console.log('💸 Transferring USDT (with fee delegation)...', {
    from: fromAddress,
    to: toAddress,
    amount
  });
  
  try {
    // Try gasless transaction first
    const gaslessService = getGaslessTransactionService();
    const gaslessResult = await gaslessService.executeGaslessTransfer(
      fromAddress,
      toAddress,
      amount
    );
    
    if (gaslessResult.success) {
      console.log('✅ Gasless transfer successful!');
      return {
        success: true,
        transactionHash: gaslessResult.transactionHash,
        gasless: true
      };
    } else {
      console.log('⚠️ Gasless transfer failed, using LIFF wallet for regular transaction');
      
      // Import wallet service dynamically to avoid SSR issues
      const { WalletService } = await import('./wallet-service');
      const walletService = WalletService.getInstance();
      
      const walletState = walletService.getState();
      if (!walletState.isConnected || !walletState.address) {
        throw new Error('LIFF wallet not connected');
      }
      
      // Convert amount to wei (USDT has 6 decimals)
      const amountInWei = Math.round(parseFloat(amount) * Math.pow(10, 6));
      
      // Create ERC20 transfer transaction data
      // Function signature: transfer(address,uint256)
      const transferMethodId = 'a9059cbb'; // First 4 bytes of keccak256("transfer(address,uint256)")
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
    }
  } catch (error) {
    console.error('❌ USDT transfer failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Transfer failed',
      gasless: false
    };
  }
}
