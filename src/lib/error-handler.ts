// Enhanced Error Handler for KaiaPay DApp
// Provides detailed error mapping for blockchain transactions

export interface TransactionError {
  code: string;
  message: string;
  userMessage: string;
  isRetryable: boolean;
  suggestedAction?: string;
}

export class KaiaPayErrorHandler {
  
  static handleContractError(error: unknown): TransactionError {
    const errorMessage = (error as { message?: string })?.message || 
                      (error as { toString?: () => string })?.toString?.() || 
                      'Unknown error';
    const errorCode = (error as { code?: string })?.code || 'UNKNOWN';

    console.log('🔍 Processing contract error:', {
      code: errorCode,
      message: errorMessage,
      error
    });

    // Network and connection errors
    if (errorMessage.includes('network') || errorCode === 'NETWORK_ERROR') {
      return {
        code: 'NETWORK_ERROR',
        message: errorMessage,
        userMessage: 'Network connection error. Please check your internet connection.',
        isRetryable: true,
        suggestedAction: 'Check your network connection and try again'
      };
    }

    // Wallet connection errors
    if (errorMessage.includes('wallet') || errorMessage.includes('not connected')) {
      return {
        code: 'WALLET_NOT_CONNECTED',
        message: errorMessage,
        userMessage: 'Wallet not connected. Please connect your wallet first.',
        isRetryable: true,
        suggestedAction: 'Connect your wallet and try again'
      };
    }

    // Insufficient balance errors
    if (errorMessage.includes('insufficient') || errorMessage.includes('balance')) {
      return {
        code: 'INSUFFICIENT_BALANCE',
        message: errorMessage,
        userMessage: 'Insufficient balance to complete the transaction.',
        isRetryable: false,
        suggestedAction: 'Add more USDT to your wallet or reduce the transaction amount'
      };
    }

    // Gas related errors
    if (errorMessage.includes('gas') || errorMessage.includes('limit')) {
      return {
        code: 'GAS_ERROR',
        message: errorMessage,
        userMessage: 'Transaction failed due to gas issues.',
        isRetryable: true,
        suggestedAction: 'Try again with higher gas limit'
      };
    }

    // Contract revert errors (specific to our contracts)
    if (errorMessage.includes('revert')) {
      if (errorMessage.includes('Insufficient token balance')) {
        return {
          code: 'INSUFFICIENT_TOKEN_BALANCE',
          message: errorMessage,
          userMessage: 'Insufficient USDT balance in your wallet.',
          isRetryable: false,
          suggestedAction: 'Get more USDT from the faucet or add funds to your wallet'
        };
      }

      if (errorMessage.includes('Transfer failed')) {
        return {
          code: 'TRANSFER_FAILED',
          message: errorMessage,
          userMessage: 'Token transfer failed. This may be due to insufficient allowance.',
          isRetryable: true,
          suggestedAction: 'Check token approval and try again'
        };
      }

      if (errorMessage.includes('Already claimed')) {
        return {
          code: 'FAUCET_ALREADY_CLAIMED',
          message: errorMessage,
          userMessage: 'You have already claimed from the faucet recently.',
          isRetryable: false,
          suggestedAction: 'Wait 24 hours before claiming again'
        };
      }

      return {
        code: 'CONTRACT_REVERT',
        message: errorMessage,
        userMessage: 'Contract execution failed. Please check your transaction parameters.',
        isRetryable: true,
        suggestedAction: 'Review transaction details and try again'
      };
    }

    // Transaction rejected by user
    if (errorMessage.includes('rejected') || errorMessage.includes('denied')) {
      return {
        code: 'USER_REJECTED',
        message: errorMessage,
        userMessage: 'Transaction was cancelled by user.',
        isRetryable: true,
        suggestedAction: 'Approve the transaction to continue'
      };
    }

    // Timeout errors
    if (errorMessage.includes('timeout') || errorMessage.includes('timed out')) {
      return {
        code: 'TIMEOUT',
        message: errorMessage,
        userMessage: 'Transaction timed out. It may still be processing.',
        isRetryable: true,
        suggestedAction: 'Wait a moment and check the transaction status, or try again'
      };
    }

    // Default error
    return {
      code: 'UNKNOWN_ERROR',
      message: errorMessage,
      userMessage: 'An unexpected error occurred. Please try again.',
      isRetryable: true,
      suggestedAction: 'Contact support if the problem persists'
    };
  }

  static handleFaucetError(error: unknown): TransactionError {
    const baseError = this.handleContractError(error);
    
    // Faucet-specific error handling
    if (baseError.message.includes('cooldown') || baseError.message.includes('24')) {
      return {
        code: 'FAUCET_COOLDOWN',
        message: baseError.message,
        userMessage: 'Faucet cooldown active. You can claim again in 24 hours.',
        isRetryable: false,
        suggestedAction: 'Wait for the cooldown period to end'
      };
    }

    return baseError;
  }

  static handleBulkPaymentError(error: unknown): TransactionError {
    const baseError = this.handleContractError(error);
    
    // Bulk payment specific errors
    if (baseError.message.includes('array') || baseError.message.includes('mismatch')) {
      return {
        code: 'BULK_ARRAY_MISMATCH',
        message: baseError.message,
        userMessage: 'Invalid recipient or amount data. Please check your inputs.',
        isRetryable: true,
        suggestedAction: 'Verify recipient addresses and amounts are correct'
      };
    }

    if (baseError.message.includes('empty') || baseError.message.includes('no recipients')) {
      return {
        code: 'NO_RECIPIENTS',
        message: baseError.message,
        userMessage: 'No recipients specified for bulk payment.',
        isRetryable: true,
        suggestedAction: 'Add at least one recipient'
      };
    }

    return baseError;
  }

  static handleSplitBillError(error: unknown): TransactionError {
    const baseError = this.handleContractError(error);
    
    // Split billing specific errors
    if (baseError.message.includes('not participant') || baseError.message.includes('unauthorized')) {
      return {
        code: 'NOT_PARTICIPANT',
        message: baseError.message,
        userMessage: 'You are not a participant in this split bill.',
        isRetryable: false,
        suggestedAction: 'Contact the bill creator for assistance'
      };
    }

    if (baseError.message.includes('already paid')) {
      return {
        code: 'ALREADY_PAID',
        message: baseError.message,
        userMessage: 'You have already paid your share of this bill.',
        isRetryable: false,
        suggestedAction: 'No further action needed'
      };
    }

    return baseError;
  }

  static getRetryDelay(attemptNumber: number): number {
    // Exponential backoff: 1s, 2s, 4s, 8s, max 10s
    return Math.min(1000 * Math.pow(2, attemptNumber), 10000);
  }

  static formatErrorForUser(error: TransactionError): string {
    let message = error.userMessage;
    
    if (error.suggestedAction) {
      message += `\n\nSuggested action: ${error.suggestedAction}`;
    }
    
    if (error.isRetryable) {
      message += '\n\nYou can try again.';
    }
    
    return message;
  }
}

export default KaiaPayErrorHandler;