// Bulk Payment Service - Clean deployment integration
import { CONFIG, METHOD_IDS } from '@/lib/config';
import KaiaPayErrorHandler from '@/lib/error-handler';
import transactionTracker from '@/lib/transaction-tracker';

export interface BulkPaymentRecipient {
  address: string;
  amount: string;
  userId?: string;
}

export interface BulkPaymentResult {
  success: boolean;
  transactionHash?: string;
  error?: string;
  failedRecipients?: string[];
}

export interface FailedTransferInfo {
  recipient: string;
  amount: string;
  reason: string;
}

class BulkPaymentService {
  
  async executeBulkPayment(
    tokenAddress: string,
    recipients: BulkPaymentRecipient[]
  ): Promise<BulkPaymentResult> {
    console.log('💸 Executing bulk payment...', {
      tokenAddress,
      recipientCount: recipients.length,
      contract: CONFIG.BULK_PAYROLL_ADDRESS
    });
    
    try {
      // Import wallet service dynamically
      const { WalletService } = await import('./wallet-service');
      const walletService = WalletService.getInstance();
      
      const walletState = walletService.getState();
      if (!walletState.isConnected || !walletState.address) {
        throw new Error('Wallet not connected');
      }

      // Prepare recipient addresses and amounts
      const recipientAddresses = recipients.map(r => r.address);
      const recipientAmounts = recipients.map(r => 
        Math.round(parseFloat(r.amount) * Math.pow(10, 18)) // Convert to wei
      );

      console.log('📝 Bulk payment parameters:', {
        tokenAddress,
        recipientAddresses,
        recipientAmounts: recipientAmounts.map(a => a.toString()),
        totalRecipients: recipientAddresses.length
      });

      // Create bulk transfer transaction data
      // Function signature: bulkTransfer(address,address[],uint256[])
      const bulkTransferMethodId = METHOD_IDS.BULK_PAYROLL.BULK_TRANSFER.slice(2);
      
      // Encode parameters using ABI encoding
      const transactionData = this.encodeBulkTransferData(
        bulkTransferMethodId,
        tokenAddress,
        recipientAddresses,
        recipientAmounts
      );

      console.log('📝 Transaction data prepared:', {
        methodId: METHOD_IDS.BULK_PAYROLL.BULK_TRANSFER,
        dataLength: transactionData.length,
        contract: CONFIG.BULK_PAYROLL_ADDRESS
      });

      // First approve the bulk payroll contract to spend tokens
      await this.approveTokenSpend(tokenAddress, recipientAmounts);

      // Send bulk transfer transaction
      const txHash = await walletService.sendTransaction(
        CONFIG.BULK_PAYROLL_ADDRESS,
        '0x0', // No native token value
        '0x493e0', // Higher gas limit for bulk operations (~300k gas)
        transactionData
      );

      console.log('✅ Bulk payment transaction sent:', txHash);
      console.log(`🔗 View on Kaiascan: https://kairos.kaiascope.com/tx/${txHash}`);

      // Track transaction status
      transactionTracker.trackBulkPaymentTransaction(
        txHash, 
        recipients.length, 
        recipients.reduce((sum, r) => sum + parseFloat(r.amount), 0).toString()
      );

      return {
        success: true,
        transactionHash: txHash
      };

    } catch (error) {
      console.error('❌ Bulk payment failed:', error);
      const errorDetails = KaiaPayErrorHandler.handleBulkPaymentError(error);
      return {
        success: false,
        error: errorDetails.userMessage
      };
    }
  }

  async claimFailedTransfer(tokenAddress: string): Promise<BulkPaymentResult> {
    console.log('🔄 Claiming failed transfer...', { tokenAddress });
    
    try {
      const { WalletService } = await import('./wallet-service');
      const walletService = WalletService.getInstance();
      
      const walletState = walletService.getState();
      if (!walletState.isConnected || !walletState.address) {
        throw new Error('Wallet not connected');
      }

      // Create claim failed transfer transaction data
      // Function signature: claimFailedTransfer(address)
      const claimMethodId = METHOD_IDS.BULK_PAYROLL.CLAIM_FAILED.slice(2);
      const paddedTokenAddress = tokenAddress.replace('0x', '').toLowerCase().padStart(64, '0');
      const transactionData = '0x' + claimMethodId + paddedTokenAddress;

      console.log('📝 Claim failed transfer data:', {
        methodId: METHOD_IDS.BULK_PAYROLL.CLAIM_FAILED,
        tokenAddress,
        data: transactionData
      });

      const txHash = await walletService.sendTransaction(
        CONFIG.BULK_PAYROLL_ADDRESS,
        '0x0',
        '0x15f90', // Standard gas limit
        transactionData
      );

      console.log('✅ Claim failed transfer successful:', txHash);
      return {
        success: true,
        transactionHash: txHash
      };

    } catch (error) {
      console.error('❌ Claim failed transfer error:', error);
      const errorDetails = KaiaPayErrorHandler.handleContractError(error);
      return {
        success: false,
        error: errorDetails.userMessage
      };
    }
  }

  async getFailedAmount(tokenAddress: string, userAddress: string): Promise<string> {
    console.log('🔍 Getting failed amount...', { tokenAddress, userAddress });
    
    try {
      const { WalletService } = await import('./wallet-service');
      const walletService = WalletService.getInstance();
      
      // This would typically be a view function call
      // For now, return 0 as placeholder
      return '0';
      
    } catch (error) {
      console.error('❌ Failed to get failed amount:', error);
      return '0';
    }
  }

  private async approveTokenSpend(tokenAddress: string, amounts: number[]): Promise<void> {
    const totalAmount = amounts.reduce((sum, amount) => sum + amount, 0);
    const approveAmount = totalAmount * 2; // Approve double for safety

    console.log('🔐 Approving token spend...', {
      tokenAddress,
      totalAmount,
      approveAmount
    });

    const { WalletService } = await import('./wallet-service');
    const walletService = WalletService.getInstance();

    // Create approve transaction data
    // Function signature: approve(address,uint256)
    const approveMethodId = METHOD_IDS.USDT.APPROVE.slice(2);
    const paddedSpender = CONFIG.BULK_PAYROLL_ADDRESS.replace('0x', '').toLowerCase().padStart(64, '0');
    const paddedAmount = approveAmount.toString(16).padStart(64, '0');
    const approveData = '0x' + approveMethodId + paddedSpender + paddedAmount;

    await walletService.sendTransaction(
      tokenAddress,
      '0x0',
      '0x15f90',
      approveData
    );

    console.log('✅ Token approval successful');
  }

  private encodeBulkTransferData(
    methodId: string,
    tokenAddress: string,
    recipients: string[],
    amounts: number[]
  ): string {
    // Simple ABI encoding for bulkTransfer(address,address[],uint256[])
    // This is a simplified version - in production, use proper ABI encoding library
    
    const paddedTokenAddress = tokenAddress.replace('0x', '').toLowerCase().padStart(64, '0');
    
    // Dynamic array offset for recipients (0x60 = 96 bytes)
    const recipientsOffset = '0000000000000000000000000000000000000000000000000000000000000060';
    
    // Dynamic array offset for amounts 
    const amountsOffset = (96 + 32 + recipients.length * 32).toString(16).padStart(64, '0');
    
    // Recipients array length
    const recipientsLength = recipients.length.toString(16).padStart(64, '0');
    
    // Recipients addresses
    const recipientsData = recipients.map(addr => 
      addr.replace('0x', '').toLowerCase().padStart(64, '0')
    ).join('');
    
    // Amounts array length
    const amountsLength = amounts.length.toString(16).padStart(64, '0');
    
    // Amounts data
    const amountsData = amounts.map(amount => 
      amount.toString(16).padStart(64, '0')
    ).join('');
    
    return '0x' + methodId + 
           paddedTokenAddress + 
           recipientsOffset + 
           amountsOffset + 
           recipientsLength + 
           recipientsData + 
           amountsLength + 
           amountsData;
  }
}

const bulkPaymentServiceInstance = new BulkPaymentService();
export default bulkPaymentServiceInstance;