// Backend Integration Service for Wallet Management
// This service handles saving and retrieving wallet details using LINE user ID

export interface WalletBackendData {
  lineUserId: string;
  walletAddress: string;
  walletType: string;
  network: 'testnet' | 'mainnet';
  privateKey?: string; // Optional - only for wallets created directly on Kaia
  createdAt: string;
  lastUpdated: string;
  isActive: boolean;
}

export interface BackendResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// In-Memory Mock Storage for Development
class MockWalletStorage {
  private static instance: MockWalletStorage;
  private storage: Map<string, WalletBackendData> = new Map();

  private constructor() {
    // Add some sample data for testing
    this.storage.set('sample-dapp-id-1', {
      lineUserId: 'sample-dapp-id-1',
      walletAddress: '0x1234567890123456789012345678901234567890',
      walletType: 'DappPortal',
      network: 'testnet',
      createdAt: '2024-01-01T00:00:00.000Z',
      lastUpdated: '2024-01-01T00:00:00.000Z',
      isActive: true,
    });
    console.log('🗄️ Mock wallet storage initialized with sample data');
  }

  static getInstance(): MockWalletStorage {
    if (!this.instance) {
      this.instance = new MockWalletStorage();
    }
    return this.instance;
  }

  save(data: WalletBackendData): WalletBackendData {
    this.storage.set(data.lineUserId, data);
    
    // Log without exposing full private key
    const logData = { ...data };
    if (logData.privateKey) {
      logData.privateKey = `${logData.privateKey.substring(0, 6)}...${logData.privateKey.substring(-4)} (${logData.privateKey.length} chars)`;
    }
    console.log(`💾 Saved wallet for dapp ID: ${data.lineUserId}`, logData);
    console.log(`🔐 Private key included: ${!!data.privateKey}`);
    
    return data;
  }

  get(lineUserId: string): WalletBackendData | null {
    const result = this.storage.get(lineUserId) || null;
    console.log(`🔍 Looking up wallet for dapp ID: ${lineUserId}`, result ? '✅ Found' : '❌ Not found');
    return result;
  }

  update(lineUserId: string, updates: Partial<WalletBackendData>): WalletBackendData | null {
    const existing = this.storage.get(lineUserId);
    if (!existing) return null;

    const updated = {
      ...existing,
      ...updates,
      lastUpdated: new Date().toISOString(),
    };
    this.storage.set(lineUserId, updated);
    console.log(`📝 Updated wallet for dapp ID: ${lineUserId}`, updated);
    return updated;
  }

  delete(lineUserId: string): boolean {
    const deleted = this.storage.delete(lineUserId);
    console.log(`🗑️ Deleted wallet for dapp ID: ${lineUserId}`, deleted ? '✅ Success' : '❌ Not found');
    return deleted;
  }

  getAll(): WalletBackendData[] {
    return Array.from(this.storage.values());
  }

  clear(): void {
    this.storage.clear();
    console.log('🧹 Cleared all wallet data');
  }

  // Debug method to show all stored wallets
  debugShowAll(): void {
    console.log('📊 Mock Backend Storage Contents:');
    if (this.storage.size === 0) {
      console.log('   📭 No wallets stored');
    } else {
      this.storage.forEach((wallet, dappId) => {
        const hasPrivateKey = !!wallet.privateKey;
        console.log(`   👤 ${dappId}: ${wallet.walletAddress} (${wallet.walletType}) ${hasPrivateKey ? '🔐' : '🔓'}`);
      });
    }
  }

  // Get private key for a specific wallet (use with caution!)
  getPrivateKey(lineUserId: string): string | null {
    const data = this.storage.get(lineUserId);
    if (data && data.privateKey) {
      console.log(`🔐 Retrieved private key for dapp ID: ${lineUserId}`);
      return data.privateKey;
    }
    console.log(`❌ No private key found for dapp ID: ${lineUserId}`);
    return null;
  }
}

// Backend API configuration (kept for future real backend implementation)
const BACKEND_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001',
  endpoints: {
    saveWallet: '/api/wallet/save',
    getWallet: '/api/wallet/get',
    updateWallet: '/api/wallet/update',
    deleteWallet: '/api/wallet/delete',
    getUserWallets: '/api/wallet/user',
  }
} as const;

export class WalletBackendService {
  private static instance: WalletBackendService;
  private mockStorage: MockWalletStorage;

  private constructor() {
    this.mockStorage = MockWalletStorage.getInstance();
  }

  static getInstance(): WalletBackendService {
    if (!this.instance) {
      this.instance = new WalletBackendService();
    }
    return this.instance;
  }

  // Mock delay to simulate network requests
  private async simulateDelay(ms: number = 100): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Save wallet details to backend after wallet creation
   */
  async saveWallet(walletData: {
    lineUserId: string;
    walletAddress: string;
    walletType: string;
    network?: 'testnet' | 'mainnet';
    privateKey?: string;
  }): Promise<BackendResponse<WalletBackendData>> {
    await this.simulateDelay();
    
    try {
      const payload: WalletBackendData = {
        lineUserId: walletData.lineUserId,
        walletAddress: walletData.walletAddress,
        walletType: walletData.walletType,
        network: walletData.network || 'testnet',
        privateKey: walletData.privateKey,
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        isActive: true,
      };

      const saved = this.mockStorage.save(payload);
      
      return {
        success: true,
        data: saved,
        message: 'Wallet saved successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Failed to save wallet'
      };
    }
  }

  /**
   * Get wallet details by LINE user ID
   */
  async getWalletByLineUserId(lineUserId: string): Promise<BackendResponse<WalletBackendData>> {
    await this.simulateDelay();
    
    try {
      const wallet = this.mockStorage.get(lineUserId);
      
      if (wallet) {
        return {
          success: true,
          data: wallet,
          message: 'Wallet found'
        };
      } else {
        return {
          success: false,
          error: 'Wallet not found',
          message: `No wallet found for LINE user ID: ${lineUserId}`
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Failed to get wallet'
      };
    }
  }

  /**
   * Get all wallets for a user (in case they have multiple)
   */
  async getUserWallets(lineUserId: string): Promise<BackendResponse<WalletBackendData[]>> {
    await this.simulateDelay();
    
    try {
      const wallet = this.mockStorage.get(lineUserId);
      const wallets = wallet ? [wallet] : [];
      
      return {
        success: true,
        data: wallets,
        message: `Found ${wallets.length} wallet(s) for user`
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Failed to get user wallets'
      };
    }
  }

  /**
   * Update wallet details
   */
  async updateWallet(
    lineUserId: string,
    updates: Partial<Pick<WalletBackendData, 'walletAddress' | 'walletType' | 'isActive'>>
  ): Promise<BackendResponse<WalletBackendData>> {
    await this.simulateDelay();
    
    try {
      const updated = this.mockStorage.update(lineUserId, updates);
      
      if (updated) {
        return {
          success: true,
          data: updated,
          message: 'Wallet updated successfully'
        };
      } else {
        return {
          success: false,
          error: 'Wallet not found',
          message: `No wallet found for LINE user ID: ${lineUserId}`
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Failed to update wallet'
      };
    }
  }

  /**
   * Delete/deactivate wallet
   */
  async deleteWallet(lineUserId: string, _walletAddress: string): Promise<BackendResponse<void>> {
    await this.simulateDelay();
    
    try {
      const deleted = this.mockStorage.delete(lineUserId);
      
      if (deleted) {
        return {
          success: true,
          message: 'Wallet deleted successfully'
        };
      } else {
        return {
          success: false,
          error: 'Wallet not found',
          message: `No wallet found for LINE user ID: ${lineUserId}`
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Failed to delete wallet'
      };
    }
  }

  /**
   * Complete wallet creation flow:
   * 1. Create wallet on Kaia testnet
   * 2. Save wallet details to backend
   */
  async createAndSaveWallet(
    lineUserId: string,
    walletAddress: string,
    walletType: string
  ): Promise<BackendResponse<WalletBackendData>> {
    try {
      // First, check if user already has a wallet
      const existingWallet = await this.getWalletByLineUserId(lineUserId);
      
      if (existingWallet.success && existingWallet.data) {
        // Update existing wallet
        return this.updateWallet(lineUserId, {
          walletAddress,
          walletType,
          isActive: true,
        });
      } else {
        // Create new wallet record
        return this.saveWallet({
          lineUserId,
          walletAddress,
          walletType,
          network: 'testnet',
        });
      }
    } catch (error) {
      console.error('Failed to create and save wallet:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Failed to create and save wallet'
      };
    }
  }

  /**
   * Debug method to show all stored wallets
   */
  debugShowAllWallets(): void {
    this.mockStorage.debugShowAll();
  }

  /**
   * Sync wallet data with backend after connection
   */
  async syncWalletData(
    lineUserId: string,
    walletAddress: string,
    walletType: string
  ): Promise<BackendResponse<WalletBackendData>> {
    try {
      // Check if wallet exists in backend
      const existingWallet = await this.getWalletByLineUserId(lineUserId);
      
      if (existingWallet.success && existingWallet.data) {
        // Wallet exists, check if address matches
        if (existingWallet.data.walletAddress === walletAddress) {
          // Same wallet, just update last accessed
          return this.updateWallet(lineUserId, {
            walletType,
            isActive: true,
          });
        } else {
          // Different wallet address, update with new one
          return this.updateWallet(lineUserId, {
            walletAddress,
            walletType,
            isActive: true,
          });
        }
      } else {
        // No existing wallet, create new one
        return this.saveWallet({
          lineUserId,
          walletAddress,
          walletType,
          network: 'testnet',
        });
      }
    } catch (error) {
      console.error('Failed to sync wallet data:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Failed to sync wallet data'
      };
    }
  }
}

// Helper function to get backend service instance
export const getWalletBackendService = () => WalletBackendService.getInstance();

// Example backend API endpoints documentation
export const BACKEND_API_DOCS = {
  endpoints: [
    {
      path: '/api/wallet/save',
      method: 'POST',
      description: 'Save new wallet details',
      body: {
        lineUserId: 'string',
        walletAddress: 'string',
        walletType: 'string',
        network: 'testnet | mainnet',
        createdAt: 'ISO string',
        lastUpdated: 'ISO string',
        isActive: 'boolean'
      },
      response: {
        success: 'boolean',
        data: 'WalletBackendData',
        message: 'string'
      }
    },
    {
      path: '/api/wallet/get',
      method: 'GET',
      description: 'Get wallet by LINE user ID',
      query: {
        lineUserId: 'string'
      },
      response: {
        success: 'boolean',
        data: 'WalletBackendData',
        message: 'string'
      }
    },
    {
      path: '/api/wallet/user',
      method: 'GET',
      description: 'Get all wallets for a user',
      query: {
        lineUserId: 'string'
      },
      response: {
        success: 'boolean',
        data: 'WalletBackendData[]',
        message: 'string'
      }
    },
    {
      path: '/api/wallet/update',
      method: 'PUT',
      description: 'Update wallet details',
      body: {
        lineUserId: 'string',
        walletAddress: 'string (optional)',
        walletType: 'string (optional)',
        isActive: 'boolean (optional)',
        lastUpdated: 'ISO string'
      },
      response: {
        success: 'boolean',
        data: 'WalletBackendData',
        message: 'string'
      }
    },
    {
      path: '/api/wallet/delete',
      method: 'DELETE',
      description: 'Delete/deactivate wallet',
      body: {
        lineUserId: 'string',
        walletAddress: 'string'
      },
      response: {
        success: 'boolean',
        message: 'string'
      }
    }
  ]
} as const;
