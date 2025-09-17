'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { transferUSDT, getUSDTBalance, TransferResult } from '@/lib/token-service';
import { CONFIG, API_ENDPOINTS } from '@/lib/config';
import { 
  XMarkIcon, 
  MagnifyingGlassIcon, 
  UserIcon, 
  CurrencyDollarIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon 
} from '@heroicons/react/24/outline';
import InsufficientBalanceModal from '@/components/InsufficientBalanceModal';

interface User {
  _id: string;
  userId: string;
  displayName: string;
  pictureUrl?: string;
  walletAddress: string;
}

interface PayAnyoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (txHash: string, recipient: User, amount: string) => void;
}

export default function PayAnyoneModal({ isOpen, onClose, onSuccess }: PayAnyoneModalProps) {
  const { user, wallet } = useAuth();
  
  // UI State
  const [currentStep, setCurrentStep] = useState<'search' | 'amount' | 'confirm' | 'processing'>('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Balance checking
  const [userBalance, setUserBalance] = useState<string>('0');
  const [loadingBalance, setLoadingBalance] = useState(false);
  
  // Insufficient balance modal
  const [showInsufficientBalance, setShowInsufficientBalance] = useState(false);

  // Load user's USDT balance
  const loadBalance = useCallback(async () => {
    if (!wallet.address) return;
    
    setLoadingBalance(true);
    try {
      const balance = await getUSDTBalance(wallet.address);
      setUserBalance(balance.balance);
    } catch (error) {
      console.error('Failed to load balance:', error);
    } finally {
      setLoadingBalance(false);
    }
  }, [wallet.address]);

  // Search users using getAllUsers endpoint and client-side filtering
  const searchUsers = useCallback(async (query: string) => {
    setIsLoading(true);
    try {
      console.log('🔍 Fetching all users from backend...');
      const response = await fetch(`${CONFIG.BACKEND_URL}${API_ENDPOINTS.AUTH.GET_ALL_USERS}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const users = await response.json();
        console.log('📋 Retrieved users:', users.length);
        
        // Filter out current user
        let filteredUsers = users.filter((u: User) => u.userId !== user?.userId);
        
        // Client-side search filtering if query provided
        if (query && query.length >= 2) {
          const searchTerm = query.toLowerCase();
          filteredUsers = filteredUsers.filter((u: User) => 
            u.displayName?.toLowerCase().includes(searchTerm) ||
            u.userId?.toLowerCase().includes(searchTerm)
          );
        }
        
        setSearchResults(filteredUsers);
        console.log('✅ Filtered results:', filteredUsers.length);
      } else {
        console.error('Failed to fetch users:', response.status);
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [user?.userId]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      searchUsers(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, searchUsers]);

  // Load balance and initial users when modal opens
  useEffect(() => {
    if (isOpen) {
      loadBalance();
      setCurrentStep('search');
      setSearchQuery('');
      setSelectedUser(null);
      setAmount('');
      setError(null);
      // Load all users initially
      searchUsers('');
    }
  }, [isOpen, loadBalance, searchUsers]);

  // Handle user selection
  const handleSelectUser = (user: User) => {
    setSelectedUser(user);
    setCurrentStep('amount');
    setError(null);
  };

  // Handle amount input
  const handleAmountChange = (value: string) => {
    // Only allow numbers and decimal point
    if (!/^\d*\.?\d*$/.test(value)) return;
    
    setAmount(value);
    setError(null);
  };

  // Validate amount
  const validateAmount = (): boolean => {
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return false;
    }

    if (parseFloat(amount) > parseFloat(userBalance)) {
      // Show insufficient balance modal instead of just error
      setShowInsufficientBalance(true);
      return false;
    }

    return true;
  };

  // Handle payment confirmation
  const handleConfirmPayment = () => {
    if (!validateAmount()) return;
    setCurrentStep('confirm');
  };

  // Execute payment
  const handleExecutePayment = async () => {
    if (!selectedUser || !amount || !wallet.address || !user?.userId) {
      setError('Missing payment information');
      return;
    }

    setCurrentStep('processing');
    setError(null);

    try {
      console.log('💸 Executing USDT transfer...', {
        from: wallet.address,
        to: selectedUser.walletAddress,
        amount: amount
      });

      // Execute the USDT transfer
      const transferResult: TransferResult = await transferUSDT(
        wallet.address,
        selectedUser.walletAddress,
        amount
      );

      if (!transferResult.success) {
        throw new Error(transferResult.error || 'Transfer failed');
      }

      // Record transaction in backend
      console.log('📝 Recording P2P transaction...');
      const recordResponse = await fetch(`${CONFIG.BACKEND_URL}${API_ENDPOINTS.P2P.RECORD}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          senderId: user.userId,
          receiverId: selectedUser.userId,
          amount: parseFloat(amount),
          transactionHash: transferResult.transactionHash,
          status: 'completed'
        }),
      });

      if (!recordResponse.ok) {
        console.warn('Failed to record transaction in backend:', recordResponse.status);
        // Continue anyway since the blockchain transaction succeeded
      }

      console.log('✅ Payment completed successfully!');
      onSuccess(transferResult.transactionHash!, selectedUser, amount);
      onClose();

    } catch (error) {
      console.error('❌ Payment failed:', error);
      setError(error instanceof Error ? error.message : 'Payment failed');
      setCurrentStep('confirm'); // Go back to confirm step
    }
  };

  // Handle back navigation
  const handleBack = () => {
    if (currentStep === 'amount') {
      setCurrentStep('search');
      setSelectedUser(null);
    } else if (currentStep === 'confirm') {
      setCurrentStep('amount');
    }
    setError(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {currentStep !== 'search' && currentStep !== 'processing' && (
                <button
                  onClick={handleBack}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}
              <h2 className="text-xl font-bold text-gray-900">
                {currentStep === 'search' && 'Pay Anyone'}
                {currentStep === 'amount' && 'Enter Amount'}
                {currentStep === 'confirm' && 'Confirm Payment'}
                {currentStep === 'processing' && 'Processing...'}
              </h2>
            </div>
            <button
              onClick={onClose}
              disabled={currentStep === 'processing'}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
            >
              <XMarkIcon className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Step 1: Search Users */}
          {currentStep === 'search' && (
            <div className="space-y-4">
              {/* Search Input */}
              <div className="relative">
                <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by username or display name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Search Results */}
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {isLoading && (
                  <div className="text-center py-8">
                    <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    <p className="text-gray-500">Searching...</p>
                  </div>
                )}

                {!isLoading && searchQuery && searchResults.length === 0 && (
                  <div className="text-center py-8">
                    <UserIcon className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500">No users found</p>
                  </div>
                )}

                {searchResults.map((user) => (
                  <button
                    key={user._id}
                    onClick={() => handleSelectUser(user)}
                    className="w-full p-3 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden">
                        <img
                          src={user.pictureUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName)}&background=random`}
                          alt={user.displayName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{user.displayName}</div>
                        <div className="text-sm text-gray-500">@{user.userId}</div>
                      </div>
                    </div>
                  </button>
                ))}

                {!searchQuery && (
                  <div className="text-center py-8">
                    <MagnifyingGlassIcon className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500">Search for users to send USDT</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Enter Amount */}
          {currentStep === 'amount' && selectedUser && (
            <div className="space-y-6">
              {/* Selected User */}
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gray-100 overflow-hidden">
                    <img
                      src={selectedUser.pictureUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedUser.displayName)}&background=random`}
                      alt={selectedUser.displayName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{selectedUser.displayName}</div>
                    <div className="text-sm text-gray-600">@{selectedUser.userId}</div>
                  </div>
                </div>
              </div>

              {/* Balance Display */}
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center justify-between">
                  <span className="text-green-800 font-medium">Your USDT Balance:</span>
                  <span className="text-green-800 font-bold">
                    {loadingBalance ? 'Loading...' : `${userBalance} USDT`}
                  </span>
                </div>
              </div>

              {/* Amount Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount to Send (USDT)
                </label>
                <div className="relative">
                  <CurrencyDollarIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => handleAmountChange(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                  />
                </div>
              </div>

              {/* Quick Amount Buttons */}
              <div className="flex gap-2">
                {['1', '5', '10', '25'].map((quickAmount) => (
                  <button
                    key={quickAmount}
                    onClick={() => setAmount(quickAmount)}
                    className="flex-1 py-2 px-3 border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-sm font-medium"
                  >
                    {quickAmount} USDT
                  </button>
                ))}
              </div>

              {/* Continue Button */}
              <button
                onClick={handleConfirmPayment}
                disabled={!amount || parseFloat(amount) <= 0}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue to Confirmation
              </button>
            </div>
          )}

          {/* Step 3: Confirm Payment */}
          {currentStep === 'confirm' && selectedUser && (
            <div className="space-y-6">
              {/* Payment Summary */}
              <div className="p-4 bg-gray-50 rounded-lg border">
                <h3 className="font-medium text-gray-900 mb-3">Payment Summary</h3>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">To:</span>
                    <div className="text-right">
                      <div className="font-medium">{selectedUser.displayName}</div>
                      <div className="text-sm text-gray-500">@{selectedUser.userId}</div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-bold text-lg">{amount} USDT</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Network:</span>
                    <span className="text-gray-900">Kaia Testnet</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Gas Fee:</span>
                    <span className="text-green-600">Free (Fee Delegated)</span>
                  </div>
                </div>
              </div>

              {/* Confirm Button */}
              <button
                onClick={handleExecutePayment}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <CheckCircleIcon className="w-5 h-5" />
                Confirm Payment
              </button>
            </div>
          )}

          {/* Step 4: Processing */}
          {currentStep === 'processing' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Processing Payment...</h3>
              <p className="text-gray-500">
                Please wait while we process your USDT transfer to {selectedUser?.displayName}
              </p>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 text-red-800">
                <ExclamationTriangleIcon className="w-5 h-5" />
                <span className="font-medium">Error</span>
              </div>
              <p className="text-red-700 text-sm mt-1">{error}</p>
            </div>
          )}
        </div>
      </div>

      {/* Insufficient Balance Modal */}
      <InsufficientBalanceModal
        isOpen={showInsufficientBalance}
        onClose={() => setShowInsufficientBalance(false)}
        currentBalance={userBalance}
        requiredAmount={amount}
        onBalanceUpdated={loadBalance}
      />
    </div>
  );
}