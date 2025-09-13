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

  useEffect(() => {
    // Subscribe to auth state changes
    const unsubscribeAuth = lineAuth.subscribe((newState) => {
      setAuthState(newState);
    });

    // Subscribe to wallet state changes
    const unsubscribeWallet = walletService.subscribe((newState) => {
      setWalletState(newState);
    });

    // Initialize authentication and wallet
    const initializeServices = async () => {
      await lineAuth.initialize();
      await walletService.initialize();
      
      // Auto-create wallet after successful authentication
      if (authState.isAuthenticated && authState.user?.userId) {
        try {
          // Check if user already has wallet from DappPortal or backend
          const existingWallet = await walletService.getWalletByLineUserId(authState.user.userId);
          
          if (existingWallet.address) {
            console.log('Found existing wallet for user:', existingWallet.address);
            // User has existing wallet, just connect to it
            await walletService.connectWallet();
          } else {
            console.log('No existing wallet found, creating new wallet for user');
            // Auto-create wallet for new user
            await walletService.autoCreateWallet();
          }
        } catch (error) {
          console.error('Auto wallet setup failed:', error);
          // Don't block the app if wallet creation fails
        }
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
        
        // After successful login, auto-create wallet
        if (authState.isAuthenticated && authState.user?.userId) {
          try {
            console.log('Auto-creating wallet for newly logged in user');
            const walletAddress = await walletService.autoCreateWallet();
            
            if (walletAddress) {
              // Sync with backend
              const walletType = walletService.getState().walletType || 'Unknown';
              const backendResult = await backendService.syncWalletData(
                authState.user.userId,
                walletAddress,
                walletType
              );
              
              if (backendResult.success) {
                console.log('Wallet auto-created and synced with backend');
              }
            }
          } catch (walletError) {
            console.error('Auto wallet creation failed after login:', walletError);
          }
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