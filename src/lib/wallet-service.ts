// LINE DappPortal Wallet Service for Kaia Testnet
// This service handles wallet operations using LINE's DappPortal SDK
// Wallet creation happens through DappPortal UI when user connects

// Dynamic import to handle SSR issues
let DappPortalSDK: typeof import('@linenext/dapp-portal-sdk').default | null = null;
if (typeof window !== 'undefined') {
  // Only import on client-side
  import('@linenext/dapp-portal-sdk').then((module) => {
    DappPortalSDK = module.default;
  }).catch(console.error);
}

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
  chainId: '1001', // Kaia testnet chain ID as string
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

// DappPortal SDK types
interface DappPortalSDK {
  getWalletProvider(): WalletProvider;
  // Add other SDK methods as needed
}

interface WalletProvider {
  getWalletType(): WalletType;
  request(args: { method: string; params?: unknown[] }): Promise<unknown>;
  disconnectWallet(): Promise<void>;
  getErc20TokenBalance(contractAddress: string, account: string): Promise<string>;
}

export class WalletService {
  private static instance: WalletService;
  private static sdkInstance: unknown = null; // Singleton DappPortal SDK instance
  private static sdkInitialized: boolean = false;
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

  // Singleton SDK initialization - called only once per application lifecycle
  private static async initializeDappPortalSDK(): Promise<DappPortalSDK> {
    if (this.sdkInitialized && this.sdkInstance) {
      console.log('🔄 Using existing DappPortal SDK singleton instance');
      return this.sdkInstance as DappPortalSDK;
    }

    // Ensure we're on the client side
    if (typeof window === 'undefined') {
      throw new Error('DappPortal SDK can only be initialized on the client side');
    }

    console.log('🚀 Initializing DappPortal SDK singleton for Kaia testnet...');
    
    const clientId = process.env.NEXT_PUBLIC_DAPP_PORTAL_CLIENT_ID;
    console.log('🔍 SDK Initialization params:');
    console.log('  - CLIENT_ID provided:', !!clientId);
    console.log('  - CLIENT_ID value:', clientId || 'NOT_SET');
    console.log('  - CLIENT_ID length:', clientId?.length || 0);
    console.log('  - Chain ID: 1001 (Kaia testnet)');
    
    if (!clientId || clientId === 'YOUR_CLIENT_ID_HERE') {
      console.error('🚫 Invalid CLIENT_ID detected!');
      console.error('   Current value:', clientId);
      console.error('   This will likely cause wallet provider to be null');
      throw new Error('Invalid CLIENT_ID configuration');
    }

    try {
      // Dynamic import the SDK module
      if (!DappPortalSDK) {
        const { default: SDK } = await import('@linenext/dapp-portal-sdk');
        DappPortalSDK = SDK;
      }

      this.sdkInstance = await DappPortalSDK.init({
        clientId: clientId!,
        chainId: '1001' // '1001' for testnet
      });

      this.sdkInitialized = true;
      console.log('✅ DappPortal SDK singleton initialized successfully');
      console.log('🔍 SDK instance:', !!this.sdkInstance);
      console.log('🔍 SDK methods available:', Object.getOwnPropertyNames(this.sdkInstance));

      return this.sdkInstance as DappPortalSDK;
    } catch (error) {
      console.error('❌ DappPortal SDK singleton initialization failed:', error);
      console.error('🔍 Error details:');
      console.error('  - Error type:', typeof error);
      console.error('  - Error message:', error instanceof Error ? error.message : 'Unknown error');
      console.error('  - Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      
      // Check for specific DApp Portal errors
      if (error instanceof Error) {
        if (error.message.includes('CLIENT_ID not authorized')) {
          console.error('🚫 AUTHORIZATION ERROR: Your DApp Portal CLIENT_ID is not authorized for wallet operations');
          console.error('📋 SOLUTION: Check your LINE Next DApp Portal registration');
          console.error('   1. Go to: https://dapp-portal.line.me/');
          console.error('   2. Verify CLIENT_ID:', clientId);
          console.error('   3. Ensure Kaia testnet is enabled');
          console.error('   4. Check wallet operations permissions');
        }
      }
      
      this.sdkInitialized = false;
      this.sdkInstance = null;
      throw error;
    }
  }

  // Reset SDK singleton (for testing or re-initialization)
  static resetSDKSingleton(): void {
    console.log('🔄 Resetting DappPortal SDK singleton');
    this.sdkInstance = null;
    this.sdkInitialized = false;
  }

  // Get current SDK instance (read-only)
  static getSDKInstance(): unknown | null {
    return this.sdkInstance;
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
    console.warn('initialize wallet called');

    try {
      // Use singleton SDK initialization
      const sdk = await WalletService.initializeDappPortalSDK();

      // Get wallet provider from singleton SDK
      console.log('🔍 Getting wallet provider from singleton SDK...');
      this.walletProvider = sdk.getWalletProvider();
      console.log('🔍 Wallet provider received:', !!this.walletProvider);
      console.warn('🔍 Wallet provider', this.walletProvider);
      
      // Check if already connected
      try {
        if (!this.walletProvider) {
          console.warn('⚠️ Wallet provider is null - skipping connection check');
          this.updateState({ isLoading: false });
          console.log('SDK initialized but no provider available yet');
          return true; // SDK initialized but no provider available yet
        }

        console.log('🔍 Checking for existing wallet connections...');
        const accounts = await this.walletProvider.request({ 
          method: 'kaia_accounts' 
        }) as string[];
        
        if (accounts && accounts.length > 0) {
          const address = accounts[0];
          const walletType = this.walletProvider.getWalletType();
          console.log('🔍 Wallet type:', walletType);
          const balance = await this.getBalance(address);
          
          console.log('✅ Found existing wallet connection:', address);
          
          this.updateState({
            isConnected: true,
            address,
            balance,
            walletType,
            isLoading: false,
          });
        } else {
          console.log('ℹ️ No existing wallet connection found');
          this.updateState({ isLoading: false });
        }
      } catch {
        // No wallet connected yet, which is fine
        console.log('ℹ️ No wallet connected yet');
        this.updateState({ isLoading: false });
      }

      return true;
    } catch (error) {
      console.error('❌ Wallet service initialization failed:', error);
      
      // Enhanced error logging for debugging
      console.error('🔍 Wallet service initialization error details:');
      console.error('  - Error type:', error instanceof Error ? error.constructor.name : typeof error);
      console.error('  - Error message:', error instanceof Error ? error.message : String(error));
      console.error('  - SDK singleton initialized:', WalletService.sdkInitialized);
      console.error('  - SDK singleton instance:', !!WalletService.sdkInstance);
      
      if (error instanceof Error && (error.message.includes('403') || error.message.includes('Forbidden'))) {
        console.error('🚫 Authorization failed - CLIENT_ID may be invalid or not authorized');
        console.error('📋 Get valid CLIENT_ID from: https://docs.dappportal.io/mini-dapp/mini-dapp-sdk/how-to-get-sdk-authorization');
      }
      
      this.updateState({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Initialization failed',
      });
      return false;
    }
  }



  // Connect wallet - this will show DappPortal UI for wallet creation if user has no wallet
  async connectWallet(): Promise<string | null> {
    if (!this.walletProvider) {
      throw new Error('Wallet provider not initialized');
    }

    this.updateState({ isLoading: true, error: null });
    console.log('🔗 Requesting wallet connection...');
    console.log('💡 If user has no wallet, DappPortal will show wallet creation UI');

    try {
      // This is the key call - it will show wallet creation UI if user has no wallet
      // DappPortal handles wallet creation through its secure interface
      const accounts = await this.walletProvider.request({ 
        method: 'kaia_requestAccounts' 
      }) as string[];

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts returned from wallet - user may have cancelled');
      }

      const address = accounts[0];
      const walletType = this.walletProvider.getWalletType();
      
      console.log('✅ Wallet connected successfully:', address);
      console.log('🔍 Wallet type:', walletType);
      
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
      console.error('❌ Wallet connection failed:', error);
      
      // Enhanced error handling for common DappPortal scenarios
      let errorMessage = 'Wallet connection failed';
      if (error instanceof Error) {
        if (error.message.includes('User denied') || error.message.includes('cancelled')) {
          errorMessage = 'User cancelled wallet connection';
        } else if (error.message.includes('No accounts')) {
          errorMessage = 'No wallet accounts available - please create a wallet first';
        } else {
          errorMessage = error.message;
        }
      }
      
      this.updateState({
        isLoading: false,
        error: errorMessage,
      });
      throw error;
    }
  }


  // Verify testnet connection
  private async verifyTestnetConnection(): Promise<void> {
    if (!this.walletProvider) return;

    try {
      // Check if we're on Kaia testnet (Kairos)
      const klaytn = (window as Window & { klaytn?: { networkVersion: string } }).klaytn;
      if (klaytn && klaytn.networkVersion) {
        const networkVersion = klaytn.networkVersion;
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
      console.log('🔍 Wallet type:', walletType);
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
  async getWalletByLineUserId(_lineUserId: string): Promise<{
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
