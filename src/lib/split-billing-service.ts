// Split Billing Service - Clean deployment integration
import { CONFIG, METHOD_IDS } from '@/lib/config';

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

      // Create split bill transaction data
      // Function signature: createSplit(address,address[],uint256[],address,uint256,string)
      const createSplitMethodId = METHOD_IDS.SPLIT_BILLING.CREATE_SPLIT.slice(2);
      
      const transactionData = this.encodeCreateSplitData(
        createSplitMethodId,
        walletState.address, // creator
        participantAddresses,
        participantAmounts,
        tokenAddress,
        Math.round(parseFloat(totalAmount) * Math.pow(10, 18)),
        description
      );

      console.log('📝 Create split transaction prepared:', {
        methodId: METHOD_IDS.SPLIT_BILLING.CREATE_SPLIT,
        dataLength: transactionData.length
      });

      const txHash = await walletService.sendTransaction(
        CONFIG.SPLIT_BILLING_ADDRESS,
        '0x0',
        '0x493e0', // Higher gas limit for complex operations
        transactionData
      );

      console.log('✅ Split bill created successfully:', txHash);
      console.log(`🔗 View on Kaiascan: https://kairos.kaiascope.com/tx/${txHash}`);

      return {
        success: true,
        transactionHash: txHash,
        splitId: `split_${Date.now()}` // In practice, this would come from contract event
      };

    } catch (error) {
      console.error('❌ Create split failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Create split failed'
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

      // Create pay share transaction data
      // Function signature: payShare(uint256)
      const payShareMethodId = METHOD_IDS.SPLIT_BILLING.PAY_SHARE.slice(2);
      const paddedSplitId = parseInt(splitId.replace('split_', '')).toString(16).padStart(64, '0');
      const transactionData = '0x' + payShareMethodId + paddedSplitId;

      console.log('📝 Pay share transaction:', {
        methodId: METHOD_IDS.SPLIT_BILLING.PAY_SHARE,
        splitId,
        data: transactionData
      });

      const txHash = await walletService.sendTransaction(
        CONFIG.SPLIT_BILLING_ADDRESS,
        '0x0',
        '0x15f90',
        transactionData
      );

      console.log('✅ Share payment successful:', txHash);
      return {
        success: true,
        transactionHash: txHash
      };

    } catch (error) {
      console.error('❌ Pay share failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Pay share failed'
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

      // Create cancel split transaction data
      // Function signature: cancelSplit(uint256)
      const cancelMethodId = METHOD_IDS.SPLIT_BILLING.CANCEL_SPLIT.slice(2);
      const paddedSplitId = parseInt(splitId.replace('split_', '')).toString(16).padStart(64, '0');
      const transactionData = '0x' + cancelMethodId + paddedSplitId;

      const txHash = await walletService.sendTransaction(
        CONFIG.SPLIT_BILLING_ADDRESS,
        '0x0',
        '0x15f90',
        transactionData
      );

      console.log('✅ Split cancelled successfully:', txHash);
      return {
        success: true,
        transactionHash: txHash
      };

    } catch (error) {
      console.error('❌ Cancel split failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Cancel failed'
      };
    }
  }

  private encodeCreateSplitData(
    methodId: string,
    creator: string,
    participants: string[],
    amounts: number[],
    tokenAddress: string,
    totalAmount: number,
    description: string
  ): string {
    // Simplified ABI encoding for createSplit
    // In production, use proper ABI encoding library like ethers.js utils
    
    const paddedCreator = creator.replace('0x', '').toLowerCase().padStart(64, '0');
    
    // Offsets for dynamic data
    const participantsOffset = 'c0'; // 192 bytes
    const amountsOffset = (192 + 32 + participants.length * 32).toString(16).padStart(2, '0');
    const tokenOffset = tokenAddress.replace('0x', '').toLowerCase().padStart(64, '0');
    const paddedTotalAmount = totalAmount.toString(16).padStart(64, '0');
    const descriptionOffset = (192 + 64 + participants.length * 32 + amounts.length * 32).toString(16).padStart(2, '0');
    
    // Participants array
    const participantsLength = participants.length.toString(16).padStart(64, '0');
    const participantsData = participants.map(addr => 
      addr.replace('0x', '').toLowerCase().padStart(64, '0')
    ).join('');
    
    // Amounts array
    const amountsLength = amounts.length.toString(16).padStart(64, '0');
    const amountsData = amounts.map(amount => 
      amount.toString(16).padStart(64, '0')
    ).join('');
    
    // Description string
    const descriptionBytes = Buffer.from(description, 'utf8');
    const descriptionLength = descriptionBytes.length.toString(16).padStart(64, '0');
    const descriptionData = descriptionBytes.toString('hex').padEnd(Math.ceil(descriptionBytes.length / 32) * 64, '0');
    
    return '0x' + methodId + 
           paddedCreator +
           '00000000000000000000000000000000000000000000000000000000000000' + participantsOffset +
           '00000000000000000000000000000000000000000000000000000000000000' + amountsOffset +
           tokenOffset +
           paddedTotalAmount +
           '00000000000000000000000000000000000000000000000000000000000000' + descriptionOffset +
           participantsLength +
           participantsData +
           amountsLength +
           amountsData +
           descriptionLength +
           descriptionData;
  }
}

const splitBillingServiceInstance = new SplitBillingService();
export default splitBillingServiceInstance;