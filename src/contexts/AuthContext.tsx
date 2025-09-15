"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
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
  
  // Onboarding State
  needsOnboarding: boolean;
  
  // Auth Actions
  login: () => Promise<void>;
  logout: () => void;
  clearError: () => void;
  
  // Wallet Actions
  connectWallet: () => Promise<string | null>;
  disconnectWallet: () => Promise<void>;
  signMessage: (message: string) => Promise<string>;
  connectAndSign: (message: string) => Promise<{ account: string; signature: string }>;
  refreshWalletData: () => Promise<void>;
  sendTransaction: (to: string, value: string, gasLimit?: string) => Promise<string>;
  getTokenBalance: (contractAddress: string) => Promise<string>;
  
  // Onboarding Actions
  completeOnboarding: () => void;
  
  // OAuth Callback
  handleOAuthCallback: (code: string, state: string) => Promise<void>;
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

  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  
  // Debug logging for onboarding state changes
  console.log('🎯 AuthContext needsOnboarding state:', needsOnboarding);

  const lineAuth = LineAuth.getInstance();
  const walletService = WalletService.getInstance();
  const backendService = getWalletBackendService();

  // Check if user has existing wallet in backend and determine if onboarding is needed
  const checkExistingWallet = useCallback(async (lineUserId: string) => {
    try {
      console.log('🔍 Checking backend for existing wallet for dapp ID:', lineUserId);
      
      backendService.debugShowAllWallets(); // Show current storage state
      const backendWallet = await backendService.getWalletByLineUserId(lineUserId);
      
      if (backendWallet.success && backendWallet.data?.walletAddress) {
        console.log('✅ Found existing wallet in backend:', backendWallet.data.walletAddress);
        console.log('💡 User has existing wallet - no onboarding needed');
        setNeedsOnboarding(false);
        return backendWallet.data.walletAddress;
      } else {
        console.log('🎯 No existing wallet found - user needs onboarding');
        console.log('🔄 Setting needsOnboarding to TRUE');
        setNeedsOnboarding(true);
        return null;
      }
    } catch (error) {
      console.error('❌ Failed to check existing wallet:', error);
      setNeedsOnboarding(true); // Default to onboarding if check fails
      return null;
    }
  }, [backendService]);

  // Save wallet to backend after user connects/creates it
  const saveWalletToBackend = async (lineUserId: string, walletAddress: string) => {
    try {
      console.log('💾 Saving wallet to backend...', { lineUserId, walletAddress });
      
      const walletState = walletService.getState();
      
      const saveResult = await backendService.saveWallet({
        lineUserId,
        walletAddress,
        walletType: walletState.walletType || 'Web',
        network: 'testnet'
      });
      
      if (saveResult.success) {
        console.log('✅ Wallet saved to backend successfully');
      } else {
        console.error('❌ Failed to save wallet to backend:', saveResult.error);
      }
      
      return saveResult.success;
    } catch (error) {
      console.error('❌ Wallet save failed:', error);
      return false;
    }
  };

  useEffect(() => {
    // Subscribe to auth state changes
    const unsubscribeAuth = lineAuth.subscribe((newState) => {
      setAuthState(newState);
      
      // Check for existing wallet when user becomes authenticated (no auto-creation)
      if (newState.isAuthenticated && newState.user?.userId && !authState.isAuthenticated) {
        console.log('🔐 User just authenticated, checking for existing wallet...');
        checkExistingWallet(newState.user.userId);
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
        await checkExistingWallet(authState.user.userId);
      }
    };

    initializeServices();

    // Cleanup subscriptions
    return () => {
      unsubscribeAuth();
      unsubscribeWallet();
    };
  }, [lineAuth, walletService, authState.isAuthenticated, authState.user?.userId, checkExistingWallet]);

  // Complete onboarding (called after wallet is set up)
  const completeOnboarding = () => {
    console.log('🎉 Onboarding completed!');
    setNeedsOnboarding(false);
  };

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
    
    // Onboarding State
    needsOnboarding,
    
    // Auth Actions
    login: async () => {
      try {
        await lineAuth.login();
        
        // After successful login, handle wallet setup (check backend first)
        if (authState.isAuthenticated && authState.user?.userId) {
          console.log('🔐 Login successful, setting up wallet for user:', authState.user.userId);
          await checkExistingWallet(authState.user.userId);
        }
      } catch (error) {
        console.error('Login failed:', error);
      }
    },
    
    logout: () => {
      lineAuth.logout();
      setNeedsOnboarding(false); // Reset onboarding state on logout
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
        
        // Save wallet to backend after successful connection
        if (walletAddress && authState.user?.userId) {
          await saveWalletToBackend(authState.user.userId, walletAddress);
          
          // If user was in onboarding, mark it as completed
          if (needsOnboarding) {
            console.log('🎯 Wallet created during onboarding - marking onboarding as completed');
            setNeedsOnboarding(false);
          }
        }
        
        return walletAddress;
      } catch (error) {
        console.error('Wallet connection failed:', error);
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
    
    // Onboarding Actions
    completeOnboarding,
    
    // OAuth Callback
    handleOAuthCallback: async (code: string, state: string) => {
      if (!lineAuth) return;
      await lineAuth.handleOAuthCallback(code, state);
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
  const { handleOAuthCallback } = useAuth();
  
  return {
    handleCallback: handleOAuthCallback,
  };
}