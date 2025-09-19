"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { WalletType, TESTNET_USDT_CONTRACT } from '@/lib/wallet-service';
import { getUSDTBalance, requestUSDTFromFaucet, TokenBalance, FaucetResult } from '@/lib/token-service';
import { getGaslessTransactionService } from '@/lib/gasless-transactions';
import { 
  WalletIcon, 
  BanknotesIcon, 
  ArrowPathIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XMarkIcon,
  CurrencyDollarIcon
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
    disconnectWallet, 
    refreshWalletData, 
    getTokenBalance 
  } = useAuth();

  const [usdtBalance, setUsdtBalance] = useState<TokenBalance | null>(null);
  const [isLoadingUsdt, setIsLoadingUsdt] = useState(false);
  const [faucetLoading, setFaucetLoading] = useState(false);
  const [faucetError, setFaucetError] = useState<string | null>(null);
  const [faucetSuccess, setFaucetSuccess] = useState<string | null>(null);

  // Load USDT balance function
  const loadUsdtBalance = useCallback(async () => {
    if (!wallet.address) {
      setUsdtBalance(null);
      return;
    }
    
    setIsLoadingUsdt(true);
    try {
      console.log('🔍 Loading USDT balance for:', wallet.address);
      const balance = await getUSDTBalance(wallet.address);
      setUsdtBalance(balance);
      console.log('✅ USDT balance loaded:', balance);
    } catch (error) {
      console.error('❌ Failed to load USDT balance:', error);
      setUsdtBalance(null);
    } finally {
      setIsLoadingUsdt(false);
    }
  }, [wallet.address]);

  const handleConnect = async () => {
    try {
      console.log('🔗 Connecting wallet...');
      console.log('💡 DappPortal will show wallet creation UI if user has no wallet');
      
      const address = await connectWallet();
      
      if (address) {
        console.log('✅ Wallet connected:', address);
        // Auto-load USDT balance after connection
        if (showBalance) {
          setTimeout(() => {
            loadUsdtBalance();
          }, 1000); // Small delay to ensure wallet state is updated
        }
      }
    } catch (error) {
      console.error('❌ Wallet connection failed:', error);
    }
  };

  // Handle faucet request
  const handleFaucetRequest = async () => {
    if (!wallet.address) {
      setFaucetError('Wallet not connected');
      return;
    }

    setFaucetLoading(true);
    setFaucetError(null);
    setFaucetSuccess(null);

    try {
      console.log('🚰 Requesting USDT from faucet...');
      const result: FaucetResult = await requestUSDTFromFaucet(wallet.address);
      
      if (result.success) {
        const gaslessIndicator = result.gasless ? ' ⚡ (Gasless)' : ' 💰 (Paid Gas)';
        setFaucetSuccess(`Success! Transaction: ${result.transactionHash}${gaslessIndicator}`);
        // Reload balance after successful faucet
        setTimeout(() => {
          loadUsdtBalance();
        }, 5000); // Wait 5 seconds for transaction to be indexed
      } else {
        setFaucetError(result.error || 'Faucet request failed');
      }
    } catch (error) {
      console.error('❌ Faucet request error:', error);
      setFaucetError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setFaucetLoading(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnectWallet();
      setUsdtBalance(null);
      setFaucetError(null);
      setFaucetSuccess(null);
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

  // Auto-load USDT balance when wallet connects
  useEffect(() => {
    if (wallet.isConnected && wallet.address && showBalance) {
      loadUsdtBalance();
    }
  }, [wallet.isConnected, wallet.address, showBalance, loadUsdtBalance]);

  // Clear faucet messages after delay
  useEffect(() => {
    if (faucetSuccess || faucetError) {
      const timer = setTimeout(() => {
        setFaucetSuccess(null);
        setFaucetError(null);
      }, 10000); // Clear after 10 seconds
      return () => clearTimeout(timer);
    }
  }, [faucetSuccess, faucetError]);

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
              <div className="bg-green-50 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <BanknotesIcon className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">USDT</span>
                        <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
                          Testnet
                        </span>
                        {isLoadingUsdt && (
                          <ArrowPathIcon className="w-4 h-4 animate-spin text-green-500" />
                        )}
                      </div>
                      <div className="text-sm text-gray-500">
                        {isLoadingUsdt 
                          ? 'Loading...' 
                          : usdtBalance 
                            ? `${usdtBalance.balance} USDT`
                            : '0.00 USDT'
                        }
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleFaucetRequest}
                    disabled={faucetLoading || !wallet.address}
                    className="flex items-center gap-1 px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <CurrencyDollarIcon className="w-4 h-4" />
                    {faucetLoading ? 'Getting...' : 'Get USDT'}
                  </button>
                </div>
                
                {/* Faucet Status Messages */}
                {faucetSuccess && (
                  <div className="mt-3 p-3 bg-green-100 border border-green-200 rounded-lg">
                    <p className="text-green-800 text-sm font-medium">✅ Faucet Success!</p>
                    <p className="text-green-700 text-xs mt-1 break-all">{faucetSuccess}</p>
                  </div>
                )}
                {faucetError && (
                  <div className="mt-3 p-3 bg-red-100 border border-red-200 rounded-lg">
                    <p className="text-red-800 text-sm font-medium">❌ Faucet Error</p>
                    <p className="text-red-700 text-xs mt-1">{faucetError}</p>
                  </div>
                )}
              </div>
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
          
        </div>
      </div>
    </div>
  );
}
