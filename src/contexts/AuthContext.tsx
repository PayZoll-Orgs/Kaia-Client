"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { LineAuth, AuthState, LineUser, LineFriend } from '@/lib/line-auth';

// Context interface
interface AuthContextType {
  // State
  isAuthenticated: boolean;
  isLoading: boolean;
  user: LineUser | null;
  friends: LineFriend[];
  error: string | null;
  isInLineApp: boolean;
  
  // Actions
  login: () => Promise<void>;
  logout: () => void;
  clearError: () => void;
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

  const lineAuth = LineAuth.getInstance();

  useEffect(() => {
    // Subscribe to auth state changes
    const unsubscribe = lineAuth.subscribe((newState) => {
      setAuthState(newState);
    });

    // Initialize authentication
    lineAuth.initialize();

    // Cleanup subscription
    return unsubscribe;
  }, [lineAuth]);

  const contextValue: AuthContextType = {
    // State
    isAuthenticated: authState.isAuthenticated,
    isLoading: authState.isLoading,
    user: authState.user,
    friends: authState.friends,
    error: authState.error,
    isInLineApp: authState.isInLineApp,
    
    // Actions
    login: async () => {
      try {
        await lineAuth.login();
      } catch (error) {
        console.error('Login failed:', error);
      }
    },
    
    logout: () => {
      lineAuth.logout();
    },
    
    clearError: () => {
      // This would need to be implemented in LineAuth if needed
      console.log('Clear error called');
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