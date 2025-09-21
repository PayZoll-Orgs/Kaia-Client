// Transaction Status Tracker for KaiaPay DApp
import { CONFIG } from '@/lib/config';

export interface TransactionStatus {
  hash: string;
  status: 'pending' | 'confirmed' | 'failed';
  blockNumber?: number;
  gasUsed?: string;
  timestamp: number;
  type: 'faucet' | 'transfer' | 'bulk_payment' | 'split_payment' | 'approve';
  confirmations: number;
  error?: string;
}

export interface TransactionReceipt {
  transactionHash: string;
  blockNumber: number;
  gasUsed: string;
  status: 'success' | 'failed';
  logs: Record<string, unknown>[];
}

class TransactionTracker {
  private pendingTransactions = new Map<string, TransactionStatus>();
  private confirmedTransactions = new Map<string, TransactionStatus>();
  private checkInterval: NodeJS.Timeout | null = null;

  startTracking() {
    if (this.checkInterval) return;

    console.log('🔍 Starting transaction status tracking...');
    this.checkInterval = setInterval(() => {
      this.checkPendingTransactions();
    }, 5000); // Check every 5 seconds
  }

  stopTracking() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
      console.log('⏹️ Stopped transaction tracking');
    }
  }

  addTransaction(
    hash: string, 
    type: TransactionStatus['type'],
    metadata?: Record<string, unknown>
  ): TransactionStatus {
    const transaction: TransactionStatus = {
      hash,
      status: 'pending',
      timestamp: Date.now(),
      type,
      confirmations: 0,
      ...metadata
    };

    this.pendingTransactions.set(hash, transaction);
    console.log(`📝 Added transaction to tracking: ${hash} (${type})`);
    
    // Start tracking if not already started
    this.startTracking();
    
    return transaction;
  }

  getTransaction(hash: string): TransactionStatus | null {
    return this.pendingTransactions.get(hash) || 
           this.confirmedTransactions.get(hash) || 
           null;
  }

  getAllPendingTransactions(): TransactionStatus[] {
    return Array.from(this.pendingTransactions.values());
  }

  getAllConfirmedTransactions(): TransactionStatus[] {
    return Array.from(this.confirmedTransactions.values());
  }

  private async checkPendingTransactions() {
    if (this.pendingTransactions.size === 0) {
      return;
    }

    console.log(`🔍 Checking ${this.pendingTransactions.size} pending transactions...`);

    const promises = Array.from(this.pendingTransactions.entries()).map(
      ([hash, tx]) => this.checkTransactionStatus(hash, tx)
    );

    await Promise.allSettled(promises);
  }

  private async checkTransactionStatus(hash: string, tx: TransactionStatus) {
    try {
      const receipt = await this.getTransactionReceipt(hash);
      
      if (receipt) {
        // Transaction is mined
        const updatedTx: TransactionStatus = {
          ...tx,
          status: receipt.status === 'success' ? 'confirmed' : 'failed',
          blockNumber: receipt.blockNumber,
          gasUsed: receipt.gasUsed,
          confirmations: await this.getConfirmationCount(receipt.blockNumber)
        };

        // Move from pending to confirmed
        this.pendingTransactions.delete(hash);
        this.confirmedTransactions.set(hash, updatedTx);

        console.log(`✅ Transaction ${hash} ${updatedTx.status} (block: ${receipt.blockNumber})`);

        // Emit custom event for UI updates
        this.emitTransactionUpdate(updatedTx);
        
      } else {
        // Still pending, update confirmations if we have block info
        const currentBlock = await this.getCurrentBlockNumber();
        if (tx.blockNumber && currentBlock) {
          const confirmations = Math.max(0, currentBlock - tx.blockNumber);
          tx.confirmations = confirmations;
        }
      }
    } catch (error) {
      console.error(`❌ Error checking transaction ${hash}:`, error);
      
      // Mark as failed after 10 minutes
      const timeElapsed = Date.now() - tx.timestamp;
      if (timeElapsed > 10 * 60 * 1000) { // 10 minutes
        tx.status = 'failed';
        tx.error = 'Transaction timeout';
        
        this.pendingTransactions.delete(hash);
        this.confirmedTransactions.set(hash, tx);
        
        this.emitTransactionUpdate(tx);
      }
    }
  }

  private async getTransactionReceipt(hash: string): Promise<TransactionReceipt | null> {
    try {
      const response = await fetch(CONFIG.RPC_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'eth_getTransactionReceipt',
          params: [hash],
          id: 1,
        }),
      });

      const data = await response.json();
      
      if (data.result) {
        return {
          transactionHash: data.result.transactionHash,
          blockNumber: parseInt(data.result.blockNumber, 16),
          gasUsed: parseInt(data.result.gasUsed, 16).toString(),
          status: data.result.status === '0x1' ? 'success' : 'failed',
          logs: data.result.logs || []
        };
      }
      
      return null;
    } catch (error) {
      console.error('❌ Error fetching transaction receipt:', error);
      return null;
    }
  }

  private async getCurrentBlockNumber(): Promise<number | null> {
    try {
      const response = await fetch(CONFIG.RPC_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'eth_blockNumber',
          params: [],
          id: 1,
        }),
      });

      const data = await response.json();
      return data.result ? parseInt(data.result, 16) : null;
    } catch (error) {
      console.error('❌ Error fetching block number:', error);
      return null;
    }
  }

  private async getConfirmationCount(blockNumber: number): Promise<number> {
    const currentBlock = await this.getCurrentBlockNumber();
    return currentBlock ? Math.max(0, currentBlock - blockNumber) : 0;
  }

  private emitTransactionUpdate(transaction: TransactionStatus) {
    // Emit custom event for React components to listen to
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('transaction-update', {
        detail: transaction
      }));
    }
  }

  // Utility methods for different transaction types
  trackFaucetTransaction(hash: string) {
    return this.addTransaction(hash, 'faucet');
  }

  trackTransferTransaction(hash: string, from: string, to: string, amount: string) {
    return this.addTransaction(hash, 'transfer', { from, to, amount });
  }

  trackBulkPaymentTransaction(hash: string, recipientCount: number, totalAmount: string) {
    return this.addTransaction(hash, 'bulk_payment', { recipientCount, totalAmount });
  }

  trackSplitPaymentTransaction(hash: string, splitId: string, amount: string) {
    return this.addTransaction(hash, 'split_payment', { splitId, amount });
  }

  trackApprovalTransaction(hash: string, spender: string, amount: string) {
    return this.addTransaction(hash, 'approve', { spender, amount });
  }

  // Get Kaiascan URL for transaction
  getKaiascanUrl(hash: string): string {
    return `https://kairos.kaiascope.com/tx/${hash}`;
  }

  // Clean up old transactions (keep last 100)
  cleanup() {
    const maxTransactions = 100;
    
    if (this.confirmedTransactions.size > maxTransactions) {
      const transactions = Array.from(this.confirmedTransactions.entries());
      transactions.sort((a, b) => b[1].timestamp - a[1].timestamp);
      
      // Keep only the most recent maxTransactions
      this.confirmedTransactions.clear();
      transactions.slice(0, maxTransactions).forEach(([hash, tx]) => {
        this.confirmedTransactions.set(hash, tx);
      });
      
      console.log(`🧹 Cleaned up old transactions, keeping ${maxTransactions} most recent`);
    }
  }
}

// Singleton instance
const transactionTracker = new TransactionTracker();
export default transactionTracker;