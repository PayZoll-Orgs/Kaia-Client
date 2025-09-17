// Kaia Fee Delegation Service Integration
// Enables gasless transactions for users by having the service pay gas fees

import { TxType, parseKaia } from '@kaiachain/ethers-ext';
import { CONFIG } from '@/lib/config';

export interface FeeDelegatedTxRequest {
  type: TxType;
  from: string;
  to: string;
  value?: string;
  data?: string;
  gasLimit?: string;
  gasPrice?: string;
  nonce?: number;
}

export interface TransactionReceipt {
  blockHash: string;
  blockNumber: number;
  transactionHash: string;
  transactionIndex: number;
  from: string;
  to: string;
  gasUsed: string;
  status: string;
  logs?: Array<{
    address: string;
    topics: string[];
    data: string;
  }>;
}

export interface FeeDelegatedTxResult {
  success: boolean;
  transactionHash?: string;
  transactionReceipt?: TransactionReceipt;
  error?: string;
  message?: string;
}

export interface FeeDelegationBalance {
  sufficient: boolean;
  message: string;
}

/**
 * Fee Delegation Service wrapper for Kaia testnet
 * Handles gasless transactions by delegating fees to the service
 */
export class FeeDelegationService {
  private readonly serviceUrl: string;
  private readonly apiKey?: string;

  constructor(apiKey?: string) {
    this.serviceUrl = CONFIG.FEE_DELEGATION_URL;
    this.apiKey = apiKey;
    
    console.log('🔧 Fee Delegation Service initialized:', {
      serviceUrl: this.serviceUrl,
      hasApiKey: !!this.apiKey
    });
  }

  /**
   * Check if fee delegation service has sufficient balance
   */
  async checkBalance(): Promise<FeeDelegationBalance> {
    try {
      console.log('🔍 Checking fee delegation service balance...');
      
      const url = this.apiKey 
        ? `${this.serviceUrl}/api/balance`
        : `${this.serviceUrl}/api/balance?address=${CONFIG.USDT_ADDRESS}`;
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      if (this.apiKey) {
        headers['Authorization'] = `Bearer ${this.apiKey}`;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers,
      });

      const result = await response.json();
      
      if (response.ok && result.status) {
        return {
          sufficient: result.data === true,
          message: result.message || 'Balance check completed'
        };
      } else {
        return {
          sufficient: false,
          message: result.message || 'Failed to check balance'
        };
      }
    } catch (error) {
      console.error('❌ Fee delegation balance check failed:', error);
      return {
        sufficient: false,
        message: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Submit a fee-delegated transaction to the service
   */
  async submitFeeDelegatedTransaction(
    userSignedTx: string
  ): Promise<FeeDelegatedTxResult> {
    try {
      console.log('📤 Submitting fee-delegated transaction to service...');
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      if (this.apiKey) {
        headers['Authorization'] = `Bearer ${this.apiKey}`;
      }

      const requestBody = {
        userSignedTx: {
          raw: userSignedTx
        }
      };

      console.log('🔗 Calling fee delegation service:', {
        url: `${this.serviceUrl}/api/signAsFeePayer`,
        hasApiKey: !!this.apiKey,
        txLength: userSignedTx.length
      });

      const response = await fetch(`${this.serviceUrl}/api/signAsFeePayer`, {
        method: 'POST',
        headers,
        body: JSON.stringify(requestBody),
      });

      const result = await response.json();
      
      console.log('📥 Fee delegation service response:', {
        status: response.status,
        ok: response.ok,
        resultStatus: result.status,
        message: result.message
      });

      if (response.ok && result.status) {
        // Success - transaction was processed
        return {
          success: true,
          transactionHash: result.data?.hash || result.data?.transactionHash,
          transactionReceipt: result.data,
          message: result.message || 'Transaction successful'
        };
      } else {
        // Error response from service
        return {
          success: false,
          error: result.error || 'UNKNOWN_ERROR',
          message: result.data || result.message || 'Fee delegation failed'
        };
      }
    } catch (error) {
      console.error('❌ Fee delegation submission failed:', error);
      return {
        success: false,
        error: 'NETWORK_ERROR',
        message: error instanceof Error ? error.message : 'Network error occurred'
      };
    }
  }

  /**
   * Create a fee-delegated USDT faucet transaction
   */
  createFaucetTransaction(fromAddress: string): FeeDelegatedTxRequest {
    return {
      type: TxType.FeeDelegatedSmartContractExecution,
      from: fromAddress,
      to: CONFIG.USDT_ADDRESS,
      value: '0x0', // No ETH/KAIA value
      data: '0x0c11dedd', // faucet() function selector
      gasLimit: '0x186A0', // 100000 gas
    };
  }

  /**
   * Create a fee-delegated USDT transfer transaction
   */
  createTransferTransaction(
    fromAddress: string, 
    toAddress: string, 
    amount: string
  ): FeeDelegatedTxRequest {
    // transfer(address to, uint256 amount) function selector: 0xa9059cbb
    // Encode the function call data
    const transferSelector = '0xa9059cbb';
    const paddedToAddress = toAddress.slice(2).padStart(64, '0');
    const amountHex = BigInt(amount).toString(16).padStart(64, '0');
    const data = transferSelector + paddedToAddress + amountHex;

    return {
      type: TxType.FeeDelegatedSmartContractExecution,
      from: fromAddress,
      to: CONFIG.USDT_ADDRESS,
      value: '0x0',
      data,
      gasLimit: '0x186A0', // 100000 gas
    };
  }

  /**
   * Create a fee-delegated USDT approval transaction
   */
  createApprovalTransaction(
    fromAddress: string,
    spenderAddress: string,
    amount: string
  ): FeeDelegatedTxRequest {
    // approve(address spender, uint256 amount) function selector: 0x095ea7b3
    const approveSelector = '0x095ea7b3';
    const paddedSpenderAddress = spenderAddress.slice(2).padStart(64, '0');
    const amountHex = BigInt(amount).toString(16).padStart(64, '0');
    const data = approveSelector + paddedSpenderAddress + amountHex;

    return {
      type: TxType.FeeDelegatedSmartContractExecution,
      from: fromAddress,
      to: CONFIG.USDT_ADDRESS,
      value: '0x0',
      data,
      gasLimit: '0x186A0',
    };
  }

  /**
   * Create a fee-delegated value transfer transaction (for KAIA)
   */
  createValueTransferTransaction(
    fromAddress: string,
    toAddress: string,
    value: string
  ): FeeDelegatedTxRequest {
    return {
      type: TxType.FeeDelegatedValueTransfer,
      from: fromAddress,
      to: toAddress,
      value: parseKaia(value).toString(),
      gasLimit: '0x7530', // 30000 gas for simple transfer
    };
  }
}

/**
 * Get a singleton instance of the Fee Delegation Service
 */
let feeDelegationInstance: FeeDelegationService | null = null;

export function getFeeDelegationService(apiKey?: string): FeeDelegationService {
  if (!feeDelegationInstance) {
    feeDelegationInstance = new FeeDelegationService(apiKey);
  }
  return feeDelegationInstance;
}

/**
 * Utility to check if an error is from insufficient balance
 */
export function isInsufficientBalanceError(error: string): boolean {
  return error.includes('Insufficient balance') || error.includes('INSUFFICIENT_BALANCE');
}

/**
 * Utility to check if an error is from not being whitelisted
 */
export function isNotWhitelistedError(error: string): boolean {
  return error.includes('not whitelisted') || error.includes('NOT_WHITELISTED');
}

/**
 * Utility to format fee delegation error messages for users
 */
export function formatFeeDelegationError(error: string, data?: string): string {
  if (isInsufficientBalanceError(data || error)) {
    return 'Fee delegation service has insufficient balance. Please contact support.';
  }
  
  if (isNotWhitelistedError(data || error)) {
    return 'This transaction type is not supported for gasless transactions.';
  }
  
  if (error === 'NETWORK_ERROR') {
    return 'Network error. Please check your connection and try again.';
  }
  
  if (error === 'BAD_REQUEST') {
    return 'Invalid transaction. Please check your input and try again.';
  }
  
  return data || 'Transaction failed. Please try again or contact support.';
}

export default FeeDelegationService;