'use client';

import { useState } from 'react';
import { requestUSDTFromFaucet, FaucetResult } from '@/lib/token-service';
import { useAuth } from '@/contexts/AuthContext';
import { 
  XMarkIcon, 
  CurrencyDollarIcon, 
  ExclamationTriangleIcon 
} from '@heroicons/react/24/outline';

interface InsufficientBalanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBalance: string;
  requiredAmount: string;
  onBalanceUpdated: () => void;
}

export default function InsufficientBalanceModal({ 
  isOpen, 
  onClose, 
  currentBalance, 
  requiredAmount, 
  onBalanceUpdated 
}: InsufficientBalanceModalProps) {
  const { wallet } = useAuth();
  const [isFaucetLoading, setIsFaucetLoading] = useState(false);
  const [faucetError, setFaucetError] = useState<string | null>(null);
  const [faucetSuccess, setFaucetSuccess] = useState(false);

  const handleFaucetRequest = async () => {
    if (!wallet.address) {
      setFaucetError('Wallet not connected');
      return;
    }

    setIsFaucetLoading(true);
    setFaucetError(null);

    try {
      const result: FaucetResult = await requestUSDTFromFaucet(wallet.address);
      
      if (result.success) {
        setFaucetSuccess(true);
        // Wait a bit then trigger balance update
        setTimeout(() => {
          onBalanceUpdated();
          onClose();
        }, 3000);
      } else {
        setFaucetError(result.error || 'Failed to get USDT from faucet');
      }
    } catch (error) {
      setFaucetError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setIsFaucetLoading(false);
    }
  };

  const shortfall = (parseFloat(requiredAmount) - parseFloat(currentBalance)).toFixed(2);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <ExclamationTriangleIcon className="w-6 h-6 text-amber-500" />
              Insufficient Balance
            </h2>
            <button
              onClick={onClose}
              disabled={isFaucetLoading}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
            >
              <XMarkIcon className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {!faucetSuccess ? (
            <>
              {/* Balance Info */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-amber-800">Current Balance:</span>
                    <span className="font-medium text-amber-900">{currentBalance} USDT</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-amber-800">Required:</span>
                    <span className="font-medium text-amber-900">{requiredAmount} USDT</span>
                  </div>
                  <div className="border-t border-amber-200 pt-2 flex justify-between">
                    <span className="text-amber-800 font-medium">Need:</span>
                    <span className="font-bold text-amber-900">{shortfall} USDT</span>
                  </div>
                </div>
              </div>

              <p className="text-gray-600">
                You don&apos;t have enough USDT to complete this transaction. Get free test USDT from the faucet to continue.
              </p>

              {/* Faucet Button */}
              <button
                onClick={handleFaucetRequest}
                disabled={isFaucetLoading}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <CurrencyDollarIcon className="w-5 h-5" />
                {isFaucetLoading ? 'Getting USDT...' : 'Get Free USDT'}
              </button>

              <p className="text-xs text-gray-500 text-center">
                This will add 50 USDT to your testnet balance
              </p>
            </>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">USDT Added!</h3>
              <p className="text-gray-600 mb-4">
                Your balance has been updated. You can now complete your transaction.
              </p>
              <div className="text-sm text-gray-500">
                Closing automatically...
              </div>
            </div>
          )}

          {/* Error Display */}
          {faucetError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-red-800">
                <ExclamationTriangleIcon className="w-5 h-5" />
                <span className="font-medium">Error</span>
              </div>
              <p className="text-red-700 text-sm mt-1">{faucetError}</p>
            </div>
          )}

          {/* Alternative Options */}
          {!faucetSuccess && !isFaucetLoading && (
            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500 text-center mb-3">
                Alternative options:
              </p>
              <div className="flex gap-2">
                <button
                  onClick={onClose}
                  className="flex-1 py-2 px-4 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors text-sm font-medium text-gray-700"
                >
                  Cancel Transaction
                </button>
                <button
                  onClick={() => {
                    // Navigate to Portfolio tab to check balance
                    onClose();
                  }}
                  className="flex-1 py-2 px-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium text-blue-700"
                >
                  Check Portfolio
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}