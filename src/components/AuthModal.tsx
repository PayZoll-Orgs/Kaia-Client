"use client";

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function AuthModal() {
  const { login, isLoading, isInLineApp } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleLogin = async () => {
    if (isLoading || isProcessing) return;
    
    setIsProcessing(true);
    try {
      await login();
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4">
        <div className="text-center">
          {/* LINE Logo */}
          <div className="w-16 h-16 mx-auto mb-6 bg-green-500 rounded-2xl flex items-center justify-center">
            <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
          
          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome to LINE DApp
          </h1>
          
          {/* Subtitle */}
          <p className="text-gray-600 mb-8">
            {isInLineApp 
              ? "Continue with your LINE account to access all features"
              : "Sign in with LINE to get started"
            }
          </p>
          
          {/* Login Button */}
          <button
            onClick={handleLogin}
            disabled={isLoading || isProcessing}
            className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white font-semibold py-4 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center space-x-3"
          >
            {isLoading || isProcessing ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Connecting...</span>
              </>
            ) : (
              <>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                <span>Continue with LINE</span>
              </>
            )}
          </button>
          
          {/* Info Text */}
          <p className="text-xs text-gray-500 mt-6">
            {isInLineApp 
              ? "You'll be authenticated using your LINE account"
              : "You'll be redirected to LINE for secure authentication"
            }
          </p>
        </div>
      </div>
    </div>
  );
}
