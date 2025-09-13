// LINE DappPortal Wallet Service for Kaia Testnet
// This service handles wallet operations using LINE's DappPortal SDK

export interface WalletState {
  isConnected: boolean;
  address: string | null;
  balance: string | null;
  isLoading: boolean;
  error: string | null;
  walletType: WalletType | null;
}

export enum WalletType {
  Web = "Web",
  Liff = "Liff", 
  Extension = "Extension",
  Mobile = "Mobile",
  OKX = "OKX",
  BITGET = "BITGET"
}

// Kaia Testnet Configuration
export const KAIA_TESTNET_CONFIG = {
  chainId: '0x3e9', // 1001 in decimal (Kairos testnet)
  chainName: 'Kairos Testnet',
  nativeCurrency: {
    name: 'KAIA',
    symbol: 'KAIA',
    decimals: 18,
  },
  rpcUrls: ['https://public-en-kairos.node.kaia.io'],
  blockExplorerUrls: ['https://kairos.kaiascan.io/'],
  testnet: true,
} as const;

// USDT Contract on Kaia Testnet
export const TESTNET_USDT_CONTRACT = '0xd077a400968890eacc75cdc901f0356c943e4fdb';

// DappPortal SDK types (since we don't have npm package)
interface DappPortalSDK {
  getWalletProvider(): WalletProvider;
}

interface WalletProvider {
  getWalletType(): WalletType;
  request(args: { method: string; params?: any[] }): Promise<any>;
  disconnectWallet(): Promise<void>;
  getErc20TokenBalance(contractAddress: string, account: string): Promise<string>;
}

// Global SDK reference
declare global {
  interface Window {
    DappPortalSDK?: DappPortalSDK;
    klaytn?: any;
  }
}

export class WalletService {
  private static instance: WalletService;
  private walletProvider: WalletProvider | null = null;
  private walletState: WalletState = {
    isConnected: false,
    address: null,
    balance: null,
    isLoading: false,
    error: null,
    walletType: null,
  };
  private listeners: ((state: WalletState) => void)[] = [];

  private constructor() {}

  static getInstance(): WalletService {
    if (!this.instance) {
      this.instance = new WalletService();
    }
    return this.instance;
  }

  // Subscribe to wallet state changes
  subscribe(listener: (state: WalletState) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.walletState));
  }

  private updateState(updates: Partial<WalletState>): void {
    this.walletState = { ...this.walletState, ...updates };
    this.notifyListeners();
  }

  getState(): WalletState {
    return { ...this.walletState };
  }

  // Initialize the wallet service
  async initialize(): Promise<boolean> {
    this.updateState({ isLoading: true, error: null });

    try {
      // Check if DappPortal SDK is available
      if (!window.DappPortalSDK) {
        // Load SDK dynamically if not available
        await this.loadDappPortalSDK();
      }

      if (!window.DappPortalSDK) {
        throw new Error('DappPortal SDK not available');
      }

      // Initialize wallet provider
      this.walletProvider = window.DappPortalSDK.getWalletProvider();
      
      // Check if already connected
      try {
        const accounts = await this.walletProvider.request({ 
          method: 'kaia_accounts' 
        }) as string[];
        
        if (accounts && accounts.length > 0) {
          const address = accounts[0];
          const walletType = this.walletProvider.getWalletType();
          const balance = await this.getBalance(address);
          
          this.updateState({
            isConnected: true,
            address,
            balance,
            walletType,
            isLoading: false,
          });
        } else {
          this.updateState({ isLoading: false });
        }
      } catch (error) {
        // Not connected yet, which is fine
        this.updateState({ isLoading: false });
      }

      return true;
    } catch (error) {
      console.error('Wallet initialization failed:', error);
      this.updateState({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Wallet initialization failed',
      });
      return false;
    }
  }

  // Load DappPortal SDK dynamically
  private async loadDappPortalSDK(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (window.DappPortalSDK) {
        resolve();
        return;
      }

      // Create script tag for DappPortal SDK
      const script = document.createElement('script');
      script.src = 'https://sdk.dappportal.io/v1/sdk.js'; // This might need to be updated with actual CDN URL
      script.async = true;
      
      script.onload = () => {
        if (window.DappPortalSDK) {
          resolve();
        } else {
          reject(new Error('DappPortal SDK failed to load'));
        }
      };
      
      script.onerror = () => {
        reject(new Error('Failed to load DappPortal SDK'));
      };
      
      document.head.appendChild(script);
    });
  }

  // Connect wallet for testnet (automatically creates if needed)
  async connectWallet(): Promise<string | null> {
    if (!this.walletProvider) {
      throw new Error('Wallet provider not initialized');
    }

    this.updateState({ isLoading: true, error: null });

    try {
      // Request account connection (this will create wallet if it doesn't exist)
      const accounts = await this.walletProvider.request({ 
        method: 'kaia_requestAccounts' 
      }) as string[];

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts returned from wallet');
      }

      const address = accounts[0];
      const walletType = this.walletProvider.getWalletType();
      
      // Verify we're on testnet
      await this.verifyTestnetConnection();
      
      // Get balance
      const balance = await this.getBalance(address);

      this.updateState({
        isConnected: true,
        address,
        balance,
        walletType,
        isLoading: false,
      });

      return address;
    } catch (error) {
      console.error('Wallet connection failed:', error);
      this.updateState({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Wallet connection failed',
      });
      throw error;
    }
  }

  // Auto-create wallet during login (no user interaction needed)
  async autoCreateWallet(): Promise<string | null> {
    if (!this.walletProvider) {
      throw new Error('Wallet provider not initialized');
    }

    this.updateState({ isLoading: true, error: null });

    try {
      // Check if wallet already exists
      const existingAccounts = await this.walletProvider.request({ 
        method: 'kaia_accounts' 
      }) as string[];

      if (existingAccounts && existingAccounts.length > 0) {
        // Wallet already exists, just connect
        return await this.connectWallet();
      }

      // Create new wallet automatically (this might still require user consent depending on wallet type)
      const accounts = await this.walletProvider.request({ 
        method: 'kaia_requestAccounts' 
      }) as string[];

      if (!accounts || accounts.length === 0) {
        throw new Error('Failed to create wallet');
      }

      const address = accounts[0];
      const walletType = this.walletProvider.getWalletType();
      
      // Verify we're on testnet
      await this.verifyTestnetConnection();
      
      // Get balance
      const balance = await this.getBalance(address);

      this.updateState({
        isConnected: true,
        address,
        balance,
        walletType,
        isLoading: false,
      });

      console.log(`Auto-created wallet on Kaia testnet: ${address}`);
      return address;
    } catch (error) {
      console.error('Auto wallet creation failed:', error);
      this.updateState({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Auto wallet creation failed',
      });
      throw error;
    }
  }

  // Verify testnet connection
  private async verifyTestnetConnection(): Promise<void> {
    if (!this.walletProvider) return;

    try {
      // Check if we're on Kaia testnet (Kairos)
      if (window.klaytn && window.klaytn.networkVersion) {
        const networkVersion = window.klaytn.networkVersion;
        if (networkVersion !== '1001') {
          console.warn(`Connected to network ${networkVersion}, expected 1001 (Kairos testnet)`);
          // You might want to prompt user to switch networks here
        }
      }
    } catch (error) {
      console.warn('Could not verify network connection:', error);
    }
  }

  // Get KAIA balance
  async getBalance(address?: string): Promise<string> {
    if (!this.walletProvider) {
      throw new Error('Wallet provider not initialized');
    }

    const account = address || this.walletState.address;
    if (!account) {
      throw new Error('No wallet address available');
    }

    try {
      const balanceHex = await this.walletProvider.request({
        method: 'kaia_getBalance',
        params: [account, 'latest']
      }) as string;

      // Convert from kei to KAIA (divide by 10^18)
      const balanceWei = BigInt(balanceHex);
      const balanceKaia = Number(balanceWei) / Math.pow(10, 18);
      
      return balanceKaia.toFixed(6);
    } catch (error) {
      console.error('Failed to get balance:', error);
      return '0.000000';
    }
  }

  // Get ERC20 token balance (e.g., USDT)
  async getTokenBalance(contractAddress: string, address?: string): Promise<string> {
    if (!this.walletProvider) {
      throw new Error('Wallet provider not initialized');
    }

    const account = address || this.walletState.address;
    if (!account) {
      throw new Error('No wallet address available');
    }

    try {
      const balanceHex = await this.walletProvider.getErc20TokenBalance(contractAddress, account);
      
      // For USDT (6 decimals), convert from micro USDT to USDT
      if (contractAddress.toLowerCase() === TESTNET_USDT_CONTRACT.toLowerCase()) {
        const balanceWei = BigInt(balanceHex);
        const balanceUsdt = Number(balanceWei) / Math.pow(10, 6);
        return balanceUsdt.toFixed(2);
      }
      
      // For other tokens, assume 18 decimals
      const balanceWei = BigInt(balanceHex);
      const balance = Number(balanceWei) / Math.pow(10, 18);
      return balance.toFixed(6);
    } catch (error) {
      console.error('Failed to get token balance:', error);
      return '0.00';
    }
  }

  // Connect and sign message (useful for authentication)
  async connectAndSign(message: string): Promise<{ account: string; signature: string }> {
    if (!this.walletProvider) {
      throw new Error('Wallet provider not initialized');
    }

    this.updateState({ isLoading: true, error: null });

    try {
      const result = await this.walletProvider.request({
        method: 'kaia_connectAndSign',
        params: [message]
      }) as [string, string];

      const [account, signature] = result;
      const walletType = this.walletProvider.getWalletType();
      const balance = await this.getBalance(account);

      this.updateState({
        isConnected: true,
        address: account,
        balance,
        walletType,
        isLoading: false,
      });

      return { account, signature };
    } catch (error) {
      console.error('Connect and sign failed:', error);
      this.updateState({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Connect and sign failed',
      });
      throw error;
    }
  }

  // Sign message
  async signMessage(message: string): Promise<string> {
    if (!this.walletProvider || !this.walletState.address) {
      throw new Error('Wallet not connected');
    }

    try {
      const signature = await this.walletProvider.request({
        method: 'personal_sign',
        params: [message, this.walletState.address]
      }) as string;

      return signature;
    } catch (error) {
      console.error('Message signing failed:', error);
      throw error;
    }
  }

  // Send transaction
  async sendTransaction(to: string, value: string, gasLimit?: string): Promise<string> {
    if (!this.walletProvider || !this.walletState.address) {
      throw new Error('Wallet not connected');
    }

    try {
      const transaction = {
        from: this.walletState.address,
        to,
        value, // in hex format
        gas: gasLimit || '0x5208', // Default gas limit for simple transfer
      };

      const txHash = await this.walletProvider.request({
        method: 'kaia_sendTransaction',
        params: [transaction]
      }) as string;

      return txHash;
    } catch (error) {
      console.error('Transaction failed:', error);
      throw error;
    }
  }

  // Disconnect wallet
  async disconnectWallet(): Promise<void> {
    if (!this.walletProvider) return;

    try {
      await this.walletProvider.disconnectWallet();
      
      this.updateState({
        isConnected: false,
        address: null,
        balance: null,
        walletType: null,
        error: null,
      });
    } catch (error) {
      console.error('Wallet disconnection failed:', error);
      this.updateState({
        error: error instanceof Error ? error.message : 'Wallet disconnection failed',
      });
    }
  }

  // Refresh wallet data
  async refreshWalletData(): Promise<void> {
    if (!this.walletState.isConnected || !this.walletState.address) return;

    this.updateState({ isLoading: true });

    try {
      const balance = await this.getBalance();
      this.updateState({ balance, isLoading: false });
    } catch (error) {
      console.error('Failed to refresh wallet data:', error);
      this.updateState({ 
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to refresh wallet data'
      });
    }
  }

  // Get currently connected wallet (SDK limitation: cannot retrieve by LINE user ID)
  async getCurrentConnectedWallet(): Promise<{
    address: string | null;
    walletType: WalletType | null;
    source?: 'current' | 'none';
    error?: string;
  }> {
    if (!this.walletProvider) {
      return { address: null, walletType: null, error: 'Wallet provider not initialized' };
    }

    try {
      // SDK Reality: Can only get currently connected accounts
      // No method exists to retrieve wallet by LINE user ID
      const accounts = await this.walletProvider.request({ 
        method: 'kaia_accounts' 
      }) as string[];

      if (accounts && accounts.length > 0) {
        console.log('Found current connected wallet:', accounts[0]);
        return {
          address: accounts[0],
          walletType: this.walletProvider.getWalletType(),
          source: 'current'
        };
      }

      // No currently connected wallet
      return { 
        address: null, 
        walletType: null, 
        source: 'none',
        error: 'No wallet currently connected' 
      };
    } catch (error) {
      console.error('Failed to get current connected wallet:', error);
      return { 
        address: null, 
        walletType: null, 
        source: 'none',
        error: error instanceof Error ? error.message : 'SDK error' 
      };
    }
  }

  // SDK LIMITATION: Cannot retrieve wallet by LINE user ID
  // This method explains why we need backend storage
  async getWalletByLineUserId(lineUserId: string): Promise<{
    address: string | null;
    walletType: WalletType | null;
    source?: 'current' | 'none';
    error?: string;
    needsBackend: boolean;
  }> {
    console.warn('⚠️  SDK LIMITATION: DappPortal SDK cannot retrieve wallet by LINE user ID');
    console.warn('⚠️  The SDK only works with currently connected wallets');
    console.warn('⚠️  For persistent wallet-user mapping, backend storage is required');

    // Can only check currently connected wallet
    const currentWallet = await this.getCurrentConnectedWallet();
    
    return {
      ...currentWallet,
      needsBackend: true // Flag indicating backend is needed for user-wallet mapping
    };
  }

  // Check if user already has a wallet on DappPortal
  async hasExistingWallet(lineUserId: string): Promise<boolean> {
    try {
      const walletInfo = await this.getWalletByLineUserId(lineUserId);
      return walletInfo.address !== null;
    } catch (error) {
      console.error('Failed to check existing wallet:', error);
      return false;
    }
  }
}
