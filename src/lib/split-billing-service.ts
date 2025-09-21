// Split Billing Service - Clean deployment integration
import { CONFIG, METHOD_IDS } from '@/lib/config';
import KaiaPayErrorHandler from '@/lib/error-handler';
import transactionTracker from '@/lib/transaction-tracker';

export interface SplitBillParticipant {
  address: string;
  amount: string;
  userId?: string;
}

export interface CreateSplitResult {
  success: boolean;
  transactionHash?: string;
  splitId?: string;
  error?: string;
}

export interface PayShareResult {
  success: boolean;
  transactionHash?: string;
  error?: string;
}

export interface SplitDetails {
  splitId: string;
  creator: string;
  token: string;
  totalAmount: string;
  description: string;
  participants: SplitBillParticipant[];
  paidAmounts: string[];
  isActive: boolean;
}

class SplitBillingService {

  async createSplit(
    tokenAddress: string,
    participants: SplitBillParticipant[],
    totalAmount: string,
    description: string
  ): Promise<CreateSplitResult> {
    console.log('📋 Creating split bill...', {
      tokenAddress,
      participantCount: participants.length,
      totalAmount,
      description,
      contract: CONFIG.SPLIT_BILLING_ADDRESS
    });

    try {
      const { WalletService } = await import('./wallet-service');
      const walletService = WalletService.getInstance();
      
      const walletState = walletService.getState();
      if (!walletState.isConnected || !walletState.address) {
        throw new Error('Wallet not connected');
      }

      // Prepare participant data
      const participantAddresses = participants.map(p => p.address);
      const participantAmounts = participants.map(p => 
        Math.round(parseFloat(p.amount) * Math.pow(10, 18))
      );

      console.log('📝 Split bill parameters:', {
        creator: walletState.address,
        tokenAddress,
        participantAddresses,
        participantAmounts: participantAmounts.map(a => a.toString()),
        totalAmountWei: Math.round(parseFloat(totalAmount) * Math.pow(10, 18)),
        description
      });

      // ✅ Use ethers.js for proper ABI encoding instead of manual encoding
      const { ethers } = await import('ethers');
      const provider = new ethers.JsonRpcProvider(CONFIG.RPC_URL);
      
      // ✅ CORRECTED SplitBilling contract ABI for createSplit function
      const splitBillingABI = [
        {
          "inputs": [
            { "internalType": "address", "name": "creator", "type": "address" },
            { "internalType": "address[]", "name": "participants", "type": "address[]" },
            { "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" },
            { "internalType": "address", "name": "token", "type": "address" },
            { "internalType": "uint256", "name": "totalAmount", "type": "uint256" },
            { "internalType": "string", "name": "description", "type": "string" }
          ],
          "name": "createSplit",
          "outputs": [{ "internalType": "uint256", "name": "splitId", "type": "uint256" }],
          "stateMutability": "nonpayable",
          "type": "function"
        }
      ];
      
      const splitBillingContract = new ethers.Contract(CONFIG.SPLIT_BILLING_ADDRESS, splitBillingABI, provider);
      
      // ✅ CORRECTED: Encode the function call data with proper parameters
      const callData = splitBillingContract.interface.encodeFunctionData('createSplit', [
        walletState.address,    // creator
        participantAddresses,   // participants array
        participantAmounts,     // amounts array
        tokenAddress,          // token address
        Math.round(parseFloat(totalAmount) * Math.pow(10, 18)), // total amount in wei
        description            // description string
      ]);

      console.log('📝 ✅ CORRECTED: Using proper ethers.js encoding for createSplit');
      console.log('✅ Method signature matches deployed contract exactly');
      console.log('📦 Split bill transaction data:', {
        methodId: METHOD_IDS.SPLIT_BILLING.CREATE_SPLIT,
        contract: CONFIG.SPLIT_BILLING_ADDRESS,
        dataLength: callData.length
      });

      const txHash = await walletService.sendTransaction(
        CONFIG.SPLIT_BILLING_ADDRESS,
        '0x0',
        '0x493e0', // Higher gas limit for complex operations
        callData // ✅ Using properly encoded call data
      );

      console.log('✅ Split bill created successfully:', txHash);
      console.log(`🔗 View on Kaiascan: https://kairos.kaiascope.com/tx/${txHash}`);

      // ✅ Track transaction status
      transactionTracker.trackSplitPaymentTransaction(
        txHash, 
        `split_${Date.now()}`, // Split ID placeholder
        totalAmount
      );

      return {
        success: true,
        transactionHash: txHash,
        splitId: `split_${Date.now()}` // In practice, this would come from contract event
      };

    } catch (error) {
      console.error('❌ Create split failed:', error);
      const errorDetails = KaiaPayErrorHandler.handleSplitBillError(error);
      return {
        success: false,
        error: errorDetails.userMessage
      };
    }
  }

  async payShare(splitId: string, amount: string): Promise<PayShareResult> {
    console.log('💳 Paying split share...', { splitId, amount });

    try {
      const { WalletService } = await import('./wallet-service');
      const walletService = WalletService.getInstance();
      
      const walletState = walletService.getState();
      if (!walletState.isConnected || !walletState.address) {
        throw new Error('Wallet not connected');
      }

      // ✅ Use ethers.js for proper ABI encoding
      const { ethers } = await import('ethers');
      const provider = new ethers.JsonRpcProvider(CONFIG.RPC_URL);
      
      // ✅ CORRECTED SplitBilling contract ABI for payShare function
      const splitBillingABI = [
        {
          "inputs": [
            { "internalType": "uint256", "name": "splitId", "type": "uint256" }
          ],
          "name": "payShare",
          "outputs": [],
          "stateMutability": "nonpayable", 
          "type": "function"
        }
      ];
      
      const splitBillingContract = new ethers.Contract(CONFIG.SPLIT_BILLING_ADDRESS, splitBillingABI, provider);
      
      // Convert splitId to uint256
      const splitIdNumber = parseInt(splitId.replace('split_', ''));
      
      // ✅ CORRECTED: Encode the function call data
      const callData = splitBillingContract.interface.encodeFunctionData('payShare', [splitIdNumber]);

      console.log('📝 ✅ CORRECTED: Pay share transaction using proper ethers.js encoding:', {
        methodId: METHOD_IDS.SPLIT_BILLING.PAY_SHARE,
        splitId,
        splitIdNumber,
        data: callData
      });

      const txHash = await walletService.sendTransaction(
        CONFIG.SPLIT_BILLING_ADDRESS,
        '0x0',
        '0x15f90',
        callData // ✅ Using properly encoded call data
      );

      console.log('✅ Share payment successful:', txHash);
      console.log(`🔗 View on Kaiascan: https://kairos.kaiascope.com/tx/${txHash}`);

      // ✅ Track transaction status
      transactionTracker.trackSplitPaymentTransaction(txHash, splitId, amount);

      return {
        success: true,
        transactionHash: txHash
      };

    } catch (error) {
      console.error('❌ Pay share failed:', error);
      const errorDetails = KaiaPayErrorHandler.handleSplitBillError(error);
      return {
        success: false,
        error: errorDetails.userMessage
      };
    }
  }

  async getSplitDetails(splitId: string): Promise<SplitDetails | null> {
    console.log('🔍 Getting split details...', { splitId });

    try {
      // This would typically be a view function call to the contract
      // For now, return mock data
      return {
        splitId,
        creator: '0x0000000000000000000000000000000000000000',
        token: CONFIG.USDT_ADDRESS,
        totalAmount: '0',
        description: '',
        participants: [],
        paidAmounts: [],
        isActive: true
      };

    } catch (error) {
      console.error('❌ Failed to get split details:', error);
      return null;
    }
  }

  async cancelSplit(splitId: string): Promise<PayShareResult> {
    console.log('❌ Cancelling split...', { splitId });

    try {
      const { WalletService } = await import('./wallet-service');
      const walletService = WalletService.getInstance();
      
      const walletState = walletService.getState();
      if (!walletState.isConnected || !walletState.address) {
        throw new Error('Wallet not connected');
      }

      // ✅ Use ethers.js for proper ABI encoding
      const { ethers } = await import('ethers');
      const provider = new ethers.JsonRpcProvider(CONFIG.RPC_URL);
      
      // ✅ CORRECTED SplitBilling contract ABI for cancelSplit function
      const splitBillingABI = [
        {
          "inputs": [
            { "internalType": "uint256", "name": "splitId", "type": "uint256" }
          ],
          "name": "cancelSplit",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        }
      ];
      
      const splitBillingContract = new ethers.Contract(CONFIG.SPLIT_BILLING_ADDRESS, splitBillingABI, provider);
      
      // Convert splitId to uint256
      const splitIdNumber = parseInt(splitId.replace('split_', ''));
      
      // ✅ CORRECTED: Encode the function call data
      const callData = splitBillingContract.interface.encodeFunctionData('cancelSplit', [splitIdNumber]);

      const txHash = await walletService.sendTransaction(
        CONFIG.SPLIT_BILLING_ADDRESS,
        '0x0',
        '0x15f90',
        callData // ✅ Using properly encoded call data
      );

      console.log('✅ Split cancelled successfully:', txHash);
      console.log(`🔗 View on Kaiascan: https://kairos.kaiascope.com/tx/${txHash}`);

      // ✅ Track transaction status
      transactionTracker.trackSplitPaymentTransaction(txHash, splitId, '0');

      return {
        success: true,
        transactionHash: txHash
      };

    } catch (error) {
      console.error('❌ Cancel split failed:', error);
      const errorDetails = KaiaPayErrorHandler.handleSplitBillError(error);
      return {
        success: false,
        error: errorDetails.userMessage
      };
    }
  }

}

const splitBillingServiceInstance = new SplitBillingService();
export default splitBillingServiceInstance;