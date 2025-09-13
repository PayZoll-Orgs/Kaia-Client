// Backend Integration Service for Wallet Management
// This service handles saving and retrieving wallet details using LINE user ID

export interface WalletBackendData {
  lineUserId: string;
  walletAddress: string;
  walletType: string;
  network: 'testnet' | 'mainnet';
  createdAt: string;
  lastUpdated: string;
  isActive: boolean;
}

export interface BackendResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Backend API configuration
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

  private constructor() {}

  static getInstance(): WalletBackendService {
    if (!this.instance) {
      this.instance = new WalletBackendService();
    }
    return this.instance;
  }

  // Helper method to make API requests
  private async makeRequest<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<BackendResponse<T>> {
    try {
      const url = `${BACKEND_CONFIG.baseUrl}${endpoint}`;
      
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || `HTTP ${response.status}`,
          message: data.message || 'Request failed'
        };
      }

      return {
        success: true,
        data: data.data || data,
        message: data.message
      };
    } catch (error) {
      console.error('Backend request failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
        message: 'Failed to connect to backend'
      };
    }
  }

  /**
   * Save wallet details to backend after wallet creation
   */
  async saveWallet(walletData: {
    lineUserId: string;
    walletAddress: string;
    walletType: string;
    network?: 'testnet' | 'mainnet';
  }): Promise<BackendResponse<WalletBackendData>> {
    const payload = {
      lineUserId: walletData.lineUserId,
      walletAddress: walletData.walletAddress,
      walletType: walletData.walletType,
      network: walletData.network || 'testnet',
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      isActive: true,
    };

    return this.makeRequest<WalletBackendData>(
      BACKEND_CONFIG.endpoints.saveWallet,
      {
        method: 'POST',
        body: JSON.stringify(payload),
      }
    );
  }

  /**
   * Get wallet details by LINE user ID
   */
  async getWalletByLineUserId(lineUserId: string): Promise<BackendResponse<WalletBackendData>> {
    const params = new URLSearchParams({ lineUserId });
    
    return this.makeRequest<WalletBackendData>(
      `${BACKEND_CONFIG.endpoints.getWallet}?${params.toString()}`,
      {
        method: 'GET',
      }
    );
  }

  /**
   * Get all wallets for a user (in case they have multiple)
   */
  async getUserWallets(lineUserId: string): Promise<BackendResponse<WalletBackendData[]>> {
    const params = new URLSearchParams({ lineUserId });
    
    return this.makeRequest<WalletBackendData[]>(
      `${BACKEND_CONFIG.endpoints.getUserWallets}?${params.toString()}`,
      {
        method: 'GET',
      }
    );
  }

  /**
   * Update wallet details
   */
  async updateWallet(
    lineUserId: string,
    updates: Partial<Pick<WalletBackendData, 'walletAddress' | 'walletType' | 'isActive'>>
  ): Promise<BackendResponse<WalletBackendData>> {
    const payload = {
      lineUserId,
      ...updates,
      lastUpdated: new Date().toISOString(),
    };

    return this.makeRequest<WalletBackendData>(
      BACKEND_CONFIG.endpoints.updateWallet,
      {
        method: 'PUT',
        body: JSON.stringify(payload),
      }
    );
  }

  /**
   * Delete/deactivate wallet
   */
  async deleteWallet(lineUserId: string, walletAddress: string): Promise<BackendResponse<void>> {
    const payload = {
      lineUserId,
      walletAddress,
    };

    return this.makeRequest<void>(
      BACKEND_CONFIG.endpoints.deleteWallet,
      {
        method: 'DELETE',
        body: JSON.stringify(payload),
      }
    );
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
