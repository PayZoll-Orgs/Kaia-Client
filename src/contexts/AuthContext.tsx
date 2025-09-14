"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { LineAuth, AuthState, LineUser, LineFriend } from '@/lib/line-auth';
import { WalletService, WalletState } from '@/lib/wallet-service';
import { getWalletBackendService } from '@/lib/wallet-backend';

// Context interface
interface AuthContextType {
  // Auth State
  isAuthenticated: boolean;
  isLoading: boolean;
  user: LineUser | null;
  friends: LineFriend[];
  error: string | null;
  isInLineApp: boolean;
  
  // Wallet State
  wallet: WalletState;
  
  // Auth Actions
  login: () => Promise<void>;
  logout: () => void;
  clearError: () => void;
  
  // Wallet Actions
  connectWallet: () => Promise<string | null>;
  autoCreateWallet: () => Promise<string | null>;
  disconnectWallet: () => Promise<void>;
  signMessage: (message: string) => Promise<string>;
  connectAndSign: (message: string) => Promise<{ account: string; signature: string }>;
  refreshWalletData: () => Promise<void>;
  sendTransaction: (to: string, value: string, gasLimit?: string) => Promise<string>;
  getTokenBalance: (contractAddress: string) => Promise<string>;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider props
interface AuthProviderProps {
  children: React.ReactNode;
}

// Provider component
export function AuthProvider({ children }: AuthProviderProps) {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    user: null,
    friends: [],
    error: null,
    isInLineApp: false,
  });

  const [walletState, setWalletState] = useState<WalletState>({
    isConnected: false,
    address: null,
    balance: null,
    isLoading: false,
    error: null,
    walletType: null,
  });

  const lineAuth = LineAuth.getInstance();
  const walletService = WalletService.getInstance();
  const backendService = getWalletBackendService();

  // Handle wallet setup: check backend first, then create if needed
  const handleWalletSetupForUser = async (lineUserId: string) => {
    try {
      console.log('🔍 Checking mock backend for existing wallet for dapp ID:', lineUserId);
      
      // Step 1: Check mock backend for existing wallet
      backendService.debugShowAllWallets(); // Show current storage state
      const backendWallet = await backendService.getWalletByLineUserId(lineUserId);
      
      if (backendWallet.success && backendWallet.data?.walletAddress) {
        console.log('✅ Found existing wallet in mock backend:', backendWallet.data.walletAddress);
        console.log('📋 Wallet details:', backendWallet.data);
        
        // Try to connect to existing wallet
        try {
          await walletService.connectWallet();
          console.log('✅ Connected to existing wallet successfully');
        } catch (connectError) {
          console.warn('⚠️ Could not connect to existing wallet, creating new one');
          await createAndSaveWallet(lineUserId);
        }
      } else {
        console.log('❌ No existing wallet found in mock backend for dapp ID:', lineUserId);
        console.log('🔧 Creating new wallet on Kaia testnet...');
        await createAndSaveWallet(lineUserId);
      }
    } catch (error) {
      console.error('❌ Wallet setup failed:', error);
      // Don't block the app if wallet setup fails
    }
  };

  // Create new wallet and save to backend
  const createAndSaveWallet = async (lineUserId: string) => {
    try {
      console.log('🚀 Creating new wallet on Kaia testnet for dapp ID:', lineUserId);
      const walletAddress = await walletService.autoCreateWallet();
      
      if (walletAddress) {
        const walletType = walletService.getState().walletType || 'DappPortal';
        const privateKey = walletService.getPrivateKey();
        
        console.log('✅ Wallet created successfully:', walletAddress);
        console.log('💾 Saving wallet to mock backend...');
        console.log('🔐 Including private key:', !!privateKey);
        
        // Save to mock backend with private key
        const backendResult = await backendService.saveWallet({
          lineUserId,
          walletAddress,
          walletType,
          network: 'testnet',
          privateKey: privateKey || undefined // Only include if exists
        });
        
        if (backendResult.success) {
          console.log('✅ Wallet saved to mock backend successfully!');
          console.log('📋 Saved data:', backendResult.data);
          
          // Clear private key from wallet service after successful backend storage
          if (privateKey) {
            walletService.clearPrivateKey();
          }
        } else {
          console.warn('⚠️ Wallet created but mock backend save failed:', backendResult.error);
        }
      }
    } catch (error) {
      console.error('❌ Failed to create and save wallet:', error);
      throw error;
    }
  };

  useEffect(() => {
    // Subscribe to auth state changes
    const unsubscribeAuth = lineAuth.subscribe((newState) => {
      setAuthState(newState);
      
      // Trigger wallet setup when user becomes authenticated
      if (newState.isAuthenticated && newState.user?.userId && !authState.isAuthenticated) {
        console.log('🔐 User just authenticated, setting up wallet...');
        handleWalletSetupForUser(newState.user.userId);
      }
    });

    // Subscribe to wallet state changes
    const unsubscribeWallet = walletService.subscribe((newState) => {
      setWalletState(newState);
    });

    // Initialize authentication and wallet
    const initializeServices = async () => {
      await lineAuth.initialize();
      await walletService.initialize();
      
      // Handle wallet setup after successful authentication
      if (authState.isAuthenticated && authState.user?.userId) {
        await handleWalletSetupForUser(authState.user.userId);
      }
    };

    initializeServices();

    // Cleanup subscriptions
    return () => {
      unsubscribeAuth();
      unsubscribeWallet();
    };
  }, [lineAuth, walletService]);

  const contextValue: AuthContextType = {
    // Auth State
    isAuthenticated: authState.isAuthenticated,
    isLoading: authState.isLoading,
    user: authState.user,
    friends: authState.friends,
    error: authState.error,
    isInLineApp: authState.isInLineApp,
    
    // Wallet State
    wallet: walletState,
    
    // Auth Actions
    login: async () => {
      try {
        await lineAuth.login();
        
        // After successful login, handle wallet setup (check backend first)
        if (authState.isAuthenticated && authState.user?.userId) {
          console.log('🔐 Login successful, setting up wallet for user:', authState.user.userId);
          await handleWalletSetupForUser(authState.user.userId);
        }
      } catch (error) {
        console.error('Login failed:', error);
      }
    },
    
    logout: () => {
      lineAuth.logout();
      // Also disconnect wallet on logout
      walletService.disconnectWallet().catch(console.error);
    },
    
    clearError: () => {
      // This would need to be implemented in LineAuth if needed
      console.log('Clear error called');
    },

    // Wallet Actions
    connectWallet: async () => {
      try {
        const walletAddress = await walletService.connectWallet();
        
        // If wallet connected successfully and user is authenticated, sync with backend
        if (walletAddress && authState.user?.userId) {
          const walletType = walletService.getState().walletType || 'Unknown';
          
          try {
            const backendResult = await backendService.syncWalletData(
              authState.user.userId,
              walletAddress,
              walletType
            );
            
            if (backendResult.success) {
              console.log('Wallet data synced with backend:', backendResult.data);
            } else {
              console.warn('Failed to sync wallet with backend:', backendResult.error);
            }
          } catch (backendError) {
            console.error('Backend sync error:', backendError);
            // Don't throw here - wallet connection should still work even if backend fails
          }
        }
        
        return walletAddress;
      } catch (error) {
        console.error('Wallet connection failed:', error);
        throw error;
      }
    },

    autoCreateWallet: async () => {
      try {
        const walletAddress = await walletService.autoCreateWallet();
        
        // If wallet created successfully and user is authenticated, sync with backend
        if (walletAddress && authState.user?.userId) {
          const walletType = walletService.getState().walletType || 'Unknown';
          
          try {
            const backendResult = await backendService.syncWalletData(
              authState.user.userId,
              walletAddress,
              walletType
            );
            
            if (backendResult.success) {
              console.log('Auto-created wallet synced with backend:', backendResult.data);
            }
          } catch (backendError) {
            console.error('Backend sync error during auto-creation:', backendError);
          }
        }
        
        return walletAddress;
      } catch (error) {
        console.error('Auto wallet creation failed:', error);
        throw error;
      }
    },

    disconnectWallet: async () => {
      try {
        await walletService.disconnectWallet();
      } catch (error) {
        console.error('Wallet disconnection failed:', error);
        throw error;
      }
    },

    signMessage: async (message: string) => {
      try {
        return await walletService.signMessage(message);
      } catch (error) {
        console.error('Message signing failed:', error);
        throw error;
      }
    },

    connectAndSign: async (message: string) => {
      try {
        return await walletService.connectAndSign(message);
      } catch (error) {
        console.error('Connect and sign failed:', error);
        throw error;
      }
    },

    refreshWalletData: async () => {
      try {
        await walletService.refreshWalletData();
      } catch (error) {
        console.error('Refresh wallet data failed:', error);
        throw error;
      }
    },

    sendTransaction: async (to: string, value: string, gasLimit?: string) => {
      try {
        return await walletService.sendTransaction(to, value, gasLimit);
      } catch (error) {
        console.error('Transaction failed:', error);
        throw error;
      }
    },

    getTokenBalance: async (contractAddress: string) => {
      try {
        return await walletService.getTokenBalance(contractAddress);
      } catch (error) {
        console.error('Get token balance failed:', error);
        throw error;
      }
    },
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use auth context
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}

// Hook to handle OAuth callback
export function useAuthCallback() {
  const lineAuth = LineAuth.getInstance();
  
  return {
    handleCallback: async (code: string, state: string) => {
      await lineAuth.handleOAuthCallback(code, state);
    },
  };
}