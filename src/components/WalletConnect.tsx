"use client";

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { WalletType, TESTNET_USDT_CONTRACT } from '@/lib/wallet-service';
import { 
  WalletIcon, 
  BanknotesIcon, 
  ArrowPathIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XMarkIcon 
} from '@heroicons/react/24/outline';

interface WalletConnectProps {
  className?: string;
  showBalance?: boolean;
  compact?: boolean;
}

export default function WalletConnect({ 
  className = "", 
  showBalance = true, 
  compact = false 
}: WalletConnectProps) {
  const { 
    wallet, 
    connectWallet, 
    autoCreateWallet,
    disconnectWallet, 
    refreshWalletData, 
    getTokenBalance 
  } = useAuth();

  const [usdtBalance, setUsdtBalance] = useState<string | null>(null);
  const [isLoadingUsdt, setIsLoadingUsdt] = useState(false);

  const handleConnect = async () => {
    try {
      // Try to connect existing wallet first, if not available auto-create
      let address = await connectWallet();
      
      if (!address) {
        console.log('No existing wallet found, creating new one...');
        address = await autoCreateWallet();
      }
      
      if (address) {
        console.log('Wallet ready:', address);
        // Optionally load USDT balance
        if (showBalance) {
          loadUsdtBalance();
        }
      }
    } catch (error) {
      console.error('Failed to setup wallet:', error);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnectWallet();
      setUsdtBalance(null);
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
    }
  };

  const handleRefresh = async () => {
    try {
      await refreshWalletData();
      if (wallet.isConnected && showBalance) {
        loadUsdtBalance();
      }
    } catch (error) {
      console.error('Failed to refresh wallet data:', error);
    }
  };

  const loadUsdtBalance = async () => {
    if (!wallet.isConnected) return;
    
    setIsLoadingUsdt(true);
    try {
      const balance = await getTokenBalance(TESTNET_USDT_CONTRACT);
      setUsdtBalance(balance);
    } catch (error) {
      console.error('Failed to load USDT balance:', error);
      setUsdtBalance('0.00');
    } finally {
      setIsLoadingUsdt(false);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getWalletTypeDisplay = (type: WalletType) => {
    switch (type) {
      case WalletType.Liff:
        return 'LINE Wallet';
      case WalletType.Web:
        return 'Web Wallet';
      case WalletType.Extension:
        return 'Browser Extension';
      case WalletType.Mobile:
        return 'Mobile Wallet';
      case WalletType.OKX:
        return 'OKX Wallet';
      case WalletType.BITGET:
        return 'Bitget Wallet';
      default:
        return 'Wallet';
    }
  };

  if (compact) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {wallet.isConnected ? (
          <>
            <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-sm">
              <CheckCircleIcon className="w-4 h-4" />
              <span>{formatAddress(wallet.address!)}</span>
            </div>
            <button
              onClick={handleRefresh}
              disabled={wallet.isLoading}
              className="p-1.5 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
            >
              <ArrowPathIcon className={`w-4 h-4 ${wallet.isLoading ? 'animate-spin' : ''}`} />
            </button>
          </>
        ) : (
          <button
            onClick={handleConnect}
            disabled={wallet.isLoading}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors disabled:opacity-50"
          >
            {wallet.isLoading ? (
              <ArrowPathIcon className="w-4 h-4 animate-spin" />
            ) : (
              <WalletIcon className="w-4 h-4" />
            )}
            Setup Wallet
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-2xl p-6 shadow-lg border border-gray-100 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Kaia Testnet Wallet</h3>
        {wallet.isConnected && (
          <button
            onClick={handleRefresh}
            disabled={wallet.isLoading}
            className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
            title="Refresh wallet data"
          >
            <ArrowPathIcon className={`w-5 h-5 ${wallet.isLoading ? 'animate-spin' : ''}`} />
          </button>
        )}
      </div>

      {wallet.error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
          <ExclamationTriangleIcon className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm">{wallet.error}</span>
        </div>
      )}

      {!wallet.isConnected ? (
        <div className="text-center py-8">
          <WalletIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 mb-6">
            Your Kaia testnet wallet will be created automatically when you log in
          </p>
          <button
            onClick={handleConnect}
            disabled={wallet.isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {wallet.isLoading ? (
              <>
                <ArrowPathIcon className="w-5 h-5 animate-spin" />
                Setting up wallet...
              </>
            ) : (
              <>
                <WalletIcon className="w-5 h-5" />
                Setup Wallet
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Wallet Info */}
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Wallet Type</span>
              <span className="text-sm text-gray-900">
                {wallet.walletType ? getWalletTypeDisplay(wallet.walletType) : 'Unknown'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Address</span>
              <span className="text-sm font-mono text-gray-900">
                {formatAddress(wallet.address!)}
              </span>
            </div>
          </div>

          {/* Balances */}
          {showBalance && (
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-gray-900">Balances</h4>
              
              {/* KAIA Balance */}
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-blue-600">K</span>
                  </div>
                  <span className="font-medium text-gray-900">KAIA</span>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900">
                    {wallet.isLoading ? (
                      <ArrowPathIcon className="w-4 h-4 animate-spin inline" />
                    ) : (
                      `${wallet.balance || '0.000000'} KAIA`
                    )}
                  </div>
                  <div className="text-xs text-gray-500">Testnet</div>
                </div>
              </div>

              {/* USDT Balance */}
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <BanknotesIcon className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="font-medium text-gray-900">USDT</span>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900">
                    {isLoadingUsdt ? (
                      <ArrowPathIcon className="w-4 h-4 animate-spin inline" />
                    ) : (
                      `${usdtBalance || '0.00'} USDT`
                    )}
                  </div>
                  <div className="text-xs text-gray-500">Testnet</div>
                </div>
              </div>

              {usdtBalance === null && wallet.isConnected && (
                <button
                  onClick={loadUsdtBalance}
                  disabled={isLoadingUsdt}
                  className="w-full text-blue-600 hover:text-blue-700 text-sm font-medium py-2 transition-colors"
                >
                  Load Token Balances
                </button>
              )}
            </div>
          )}

          {/* Disconnect Button */}
          <button
            onClick={handleDisconnect}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2.5 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <XMarkIcon className="w-4 h-4" />
            Disconnect Wallet
          </button>
        </div>
      )}

      {/* Testnet Warning */}
      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-center gap-2 text-yellow-700">
          <ExclamationTriangleIcon className="w-4 h-4 flex-shrink-0" />
          <span className="text-xs">
            This is Kaia testnet. Tokens have no real value.
          </span>
        </div>
      </div>
    </div>
  );
}
