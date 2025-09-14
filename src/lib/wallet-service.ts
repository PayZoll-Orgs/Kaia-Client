// LINE DappPortal Wallet Service for Kaia Testnet
// This service handles wallet operations using LINE's DappPortal SDK
import DappPortalSDK from '@linenext/dapp-portal-sdk';
import { JsonRpcProvider, Wallet } from '@kaiachain/ethers-ext';

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
interface WalletProvider {
  getWalletType(): WalletType;
  request(args: { method: string; params?: any[] }): Promise<any>;
  disconnectWallet(): Promise<void>;
  getErc20TokenBalance(contractAddress: string, account: string): Promise<string>;
}

export class WalletService {
  private static instance: WalletService;
  private static sdkInstance: any = null; // Singleton DappPortal SDK instance
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
  private static async initializeDappPortalSDK(): Promise<any> {
    if (this.sdkInitialized && this.sdkInstance) {
      console.log('🔄 Using existing DappPortal SDK singleton instance');
      return this.sdkInstance;
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
      this.sdkInstance = await DappPortalSDK.init({
        clientId: clientId!,
        chainId: '1001' // '1001' for testnet
      });

      this.sdkInitialized = true;
      console.log('✅ DappPortal SDK singleton initialized successfully');
      console.log('🔍 SDK instance:', !!this.sdkInstance);
      console.log('🔍 SDK methods available:', Object.getOwnPropertyNames(this.sdkInstance));

      return this.sdkInstance;
    } catch (error) {
      console.error('❌ DappPortal SDK singleton initialization failed:', error);
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
  static getSDKInstance(): any | null {
    return this.sdkInstance;
  }

  // Create new wallet directly on Kaia testnet using ethers-ext
  private async createWalletOnKaiaTestnet(): Promise<{ address: string; privateKey: string }> {
    console.log('🚀 Creating new wallet directly on Kaia testnet...');
    
    try {
      // Connect to Kaia testnet RPC
      const provider = new JsonRpcProvider('https://public-en-kairos.node.kaia.io');
      console.log('✅ Connected to Kaia testnet RPC');
      
      // Create random wallet
      const wallet = Wallet.createRandom();
      console.log('✅ Generated new wallet:', wallet.address);
      
      // Connect wallet to provider
      const connectedWallet = wallet.connect(provider);
      
      // Check initial balance (should be 0)
      const balance = await connectedWallet.provider.getBalance(wallet.address);
      console.log('🔍 New wallet balance:', balance.toString(), 'peb (0 KAIA expected)');
      
      return {
        address: wallet.address,
        privateKey: wallet.privateKey
      };
    } catch (error) {
      console.error('❌ Failed to create wallet on Kaia testnet:', error);
      throw error;
    }
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

  // Get private key (for backend storage only)
  getPrivateKey(): string | null {
    return (this.walletState as any).privateKey || null;
  }

  // Clear private key after backend storage
  clearPrivateKey(): void {
    delete (this.walletState as any).privateKey;
    console.log('🔐 Private key cleared from wallet state');
  }

  // Development helper: Get all stored wallet info from sessionStorage
  static getStoredWalletInfo(): { [address: string]: any } {
    if (typeof window === 'undefined') return {};
    
    const walletInfo: { [address: string]: any } = {};
    
    // Iterate through sessionStorage to find wallet info
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key && key.startsWith('kaia_wallet_') && key.endsWith('_info')) {
        try {
          const info = JSON.parse(sessionStorage.getItem(key) || '{}');
          walletInfo[info.address] = info;
        } catch (error) {
          console.warn('Failed to parse wallet info:', key);
        }
      }
    }
    
    return walletInfo;
  }

  // Development helper: Log all stored wallets for easy copying
  static logStoredWallets(): void {
    const wallets = this.getStoredWalletInfo();
    
    if (Object.keys(wallets).length === 0) {
      console.log('📭 No wallets found in sessionStorage');
      return;
    }
    
    console.log('🔐 Development Wallets (SessionStorage):');
    console.log('=====================================');
    
    Object.values(wallets).forEach((wallet: any, index: number) => {
      console.log(`\n💳 Wallet ${index + 1}:`);
      console.log(`   Address: ${wallet.address}`);
      console.log(`   Private Key: ${wallet.privateKey}`);
      console.log(`   Network: ${wallet.network}`);
      console.log(`   Created: ${wallet.createdAt}`);
      console.log(`   Copy Command: sessionStorage.getItem("kaia_wallet_${wallet.address}")`);
    });
    
    console.log('\n📋 Quick Access:');
    console.log('   WalletService.logStoredWallets() - Show this list');
    console.log('   WalletService.getStoredWalletInfo() - Get wallet object');
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
      console.log('🔍 Wallet provider type:', typeof this.walletProvider);
      
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
      } catch (error) {
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

  // Auto-create wallet during login
  // Strategy 1: Create new wallet directly on Kaia testnet using ethers-ext
  // Strategy 2: Fallback to connect to existing wallet via DappPortal SDK
  async autoCreateWallet(): Promise<string | null> {
    console.log('🚀 Starting auto wallet creation process...');
    console.log('🔍 Wallet provider initialized:', !!this.walletProvider);
    console.log('🔍 Current wallet state:', {
      isConnected: this.walletState.isConnected,
      address: this.walletState.address,
      error: this.walletState.error
    });

    if (!this.walletProvider) {
      console.error('❌ Wallet provider not initialized - cannot create wallet');
      console.error('🔍 SDK initialization may have failed. Check previous errors.');
      throw new Error('Wallet provider not initialized');
    }

    this.updateState({ isLoading: true, error: null });

    try {
      console.log('🔍 Step 1: Checking for existing wallet accounts...');
      
      // Check if wallet already exists
      const existingAccounts = await this.walletProvider.request({ 
        method: 'kaia_accounts' 
      }) as string[];

      console.log('🔍 Existing accounts found:', existingAccounts);

      if (existingAccounts && existingAccounts.length > 0) {
        console.log('✅ Wallet already exists, connecting to:', existingAccounts[0]);
        // Wallet already exists, just connect
        return await this.connectWallet();
      }

      console.log('🔍 Step 2: No existing wallet found, creating new wallet...');
      console.log('🚀 Using direct Kaia testnet wallet creation');

      // Strategy 1: Create wallet directly on Kaia testnet
      let address: string;
      let privateKey: string | undefined;
      
      try {
        console.log('🔍 Creating wallet directly on Kaia testnet...');
        const newWallet = await this.createWalletOnKaiaTestnet();
        address = newWallet.address;
        privateKey = newWallet.privateKey;
        
        console.log('✅ Wallet created successfully on Kaia testnet:', address);
        
        // Store private key securely (will be saved to mock backend)
        console.log('🔐 Private key generated - will be stored in mock backend');
        
        // For development: Also store in sessionStorage for easy copying
        if (typeof window !== 'undefined') {
          sessionStorage.setItem(`kaia_wallet_${address}`, privateKey);
          sessionStorage.setItem(`kaia_wallet_${address}_info`, JSON.stringify({
            address,
            privateKey,
            network: 'testnet',
            createdAt: new Date().toISOString()
          }));
          console.log('💾 Private key also stored in sessionStorage for development');
          console.log('🔗 Access via: sessionStorage.getItem("kaia_wallet_' + address + '")');
          
          // Make WalletService globally accessible for development
          (window as any).WalletService = WalletService;
        }
        
      } catch (directCreationError) {
        console.error('❌ Direct wallet creation failed:', directCreationError);
        console.log('🔄 Falling back to DappPortal connection...');
        
        // Strategy 2: Fallback to DappPortal connection
        try {
          console.log('🔍 Calling kaia_requestAccounts to connect to existing wallet...');
          const accounts = await this.walletProvider.request({ 
            method: 'kaia_requestAccounts' 
          }) as string[];
          
          if (!accounts || accounts.length === 0) {
            throw new Error('No accounts returned from wallet connection');
          }
          
          address = accounts[0];
          console.log('✅ Connected to existing wallet:', address);
        } catch (connectionError) {
          console.error('❌ Both wallet creation and connection failed');
          const errorMessage = directCreationError instanceof Error ? directCreationError.message : String(directCreationError);
          throw new Error(`Wallet setup failed: ${errorMessage}`);
        }
      }

      console.log('🔍 Wallet setup complete. Address:', address);

      if (!address) {
        console.error('❌ No wallet address obtained');
        throw new Error('Failed to create or connect to wallet - no address returned');
      }

      const walletType = this.walletProvider ? this.walletProvider.getWalletType() : WalletType.Web;
      
      console.log('✅ Wallet ready!');
      console.log('🔍 Wallet details:', { address, walletType });
      console.log('📋 Note: Wallet created directly on Kaia testnet or connected to existing wallet');
      
      console.log('🔍 Step 3: Verifying testnet connection...');
      // Verify we're on testnet
      await this.verifyTestnetConnection();
      
      console.log('🔍 Step 4: Getting wallet balance...');
      // Get balance
      const balance = await this.getBalance(address);
      console.log('🔍 Wallet balance:', balance, 'KAIA');

      // Store private key temporarily in wallet state for backend saving
      (this.walletState as any).privateKey = privateKey || null;

      this.updateState({
        isConnected: true,
        address,
        balance,
        walletType,
        isLoading: false,
      });

      console.log('🎉 Auto-created wallet on Kaia testnet:', address);
      console.log('🔍 Final wallet state:', this.getState());
      console.log('🔐 Private key available for backend storage:', !!privateKey);
      
      // Show development access info
      if (privateKey) {
        console.log('\n🛠️  DEVELOPMENT ACCESS:');
        console.log('   📋 Copy private key: sessionStorage.getItem("kaia_wallet_' + address + '")');
        console.log('   📊 View all wallets: WalletService.logStoredWallets()');
      }
      
      return address;
    } catch (error) {
      console.error('❌ Auto wallet creation failed!');
      console.error('🔍 Error details:');
      console.error('  - Error type:', error instanceof Error ? error.constructor.name : typeof error);
      console.error('  - Error message:', error instanceof Error ? error.message : String(error));
      console.error('  - Stack trace:', error instanceof Error ? error.stack : 'N/A');
      
      // Additional context logging
      console.error('🔍 Context at failure:');
      console.error('  - Wallet provider available:', !!this.walletProvider);
      console.error('  - Current state:', this.getState());
      
      if (error instanceof Error) {
        if (error.message.includes('403') || error.message.includes('Forbidden')) {
          console.error('🚫 Authorization issue - check CLIENT_ID');
        } else if (error.message.includes('User denied')) {
          console.error('👤 User rejected wallet creation');
        } else if (error.message.includes('timeout')) {
          console.error('⏰ Request timed out');
        } else if (error.message.includes('Internal JSON-RPC error')) {
          console.error('🔌 JSON-RPC Internal Error - likely CLIENT_ID authorization issue');
          console.error('   This usually means:');
          console.error('   1. CLIENT_ID not authorized for wallet operations');
          console.error('   2. CLIENT_ID is for wrong environment (staging vs prod)');
          console.error('   3. DappPortal service configuration issue');
        }
      }
      
      // Check for JSON-RPC error object
      if (typeof error === 'object' && error !== null && 'code' in error) {
        const rpcError = error as { code: number; message: string };
        console.error('🔌 JSON-RPC Error Details:');
        console.error('   Code:', rpcError.code);
        console.error('   Message:', rpcError.message);
        
        if (rpcError.code === -32603) {
          console.error('🚫 -32603 = Internal Error');
          console.error('   Likely causes:');
          console.error('   • CLIENT_ID not authorized for wallet creation');
          console.error('   • CLIENT_ID environment mismatch');
          console.error('   • DappPortal service configuration issue');
          console.error('📋 Contact DappPortal support with CLIENT_ID: feab7d6b-52d3-4568-ab0f-ad72c35fe884');
        }
      }
      
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
      const klaytn = (window as any).klaytn;
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
