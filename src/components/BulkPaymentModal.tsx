'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getUSDTBalance } from '@/lib/token-service';
import { CONFIG, API_ENDPOINTS } from '@/lib/config';
import { 
  XMarkIcon, 
  UserIcon, 
  CurrencyDollarIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  TrashIcon,
  DocumentDuplicateIcon
} from '@heroicons/react/24/outline';
import InsufficientBalanceModal from '@/components/InsufficientBalanceModal';

interface User {
  _id: string;
  userId: string; // This is the username in the backend schema
  displayName: string;
  walletAddress: string;
  pictureUrl?: string;
  statusMessage?: string;
  lineUserId: string;
}

interface BulkRecipient {
  id: string;
  userId: string; // This is the username (userId from backend)
  address: string;
  name: string;
  amount: string;
}

export interface BulkPaymentData {
  id?: string;
  recipients: BulkRecipient[];
  totalAmount: string;
  transactionHash?: string;
  createdAt?: Date;
}

interface BulkPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (paymentData: BulkPaymentData) => void;
}

// Now using ethers.js for proper ABI encoding of bulkTransfer(address[], uint256[])

export default function BulkPaymentModal({ isOpen, onClose, onSuccess }: BulkPaymentModalProps) {
  const { user, wallet } = useAuth();
  
  // UI State
  const [currentStep, setCurrentStep] = useState<'select' | 'amounts' | 'review' | 'processing'>('select');
  const [recipients, setRecipients] = useState<BulkRecipient[]>([]);
  const [totalAmount, setTotalAmount] = useState('0');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // User selection
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(new Set());
  
  // Balance checking
  const [userBalance, setUserBalance] = useState<string>('0');
  const [loadingBalance, setLoadingBalance] = useState(false);
  
  // Insufficient balance modal
  const [showInsufficientBalance, setShowInsufficientBalance] = useState(false);

  // Contract addresses
  const BULK_PAYROLL_ADDRESS = '0xE9bD986514a6d35B1B73BeA6F19804D3c7aed284';
  const USDT_ADDRESS = '0xd55B72640f3e31910A688a2Dc81876F053115B09';

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

  // Fetch all users from backend
  const fetchUsers = useCallback(async () => {
    setLoadingUsers(true);
    try {
      const response = await fetch(`${CONFIG.BACKEND_URL}${API_ENDPOINTS.AUTH.GET_ALL_USERS}`);
      if (response.ok) {
        const users: User[] = await response.json();
        // Filter out current user using lineUserId
        const filteredUsers = users.filter(u => 
          u.lineUserId !== user?.userId
        );
        setAvailableUsers(filteredUsers);
      } else {
        console.error('Failed to fetch users:', response.status);
        setError('Failed to load users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to load users');
    } finally {
      setLoadingUsers(false);
    }
  }, [user?.userId]);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      loadBalance();
      fetchUsers();
      setCurrentStep('select');
      setRecipients([]);
      setTotalAmount('0');
      setError(null);
      setSelectedUserIds(new Set());
    }
  }, [isOpen, loadBalance, fetchUsers]);

  // Calculate total amount when recipients change
  useEffect(() => {
    const total = recipients.reduce((sum, recipient) => sum + parseFloat(recipient.amount || '0'), 0);
    setTotalAmount(total.toFixed(6));
  }, [recipients]);

  // Toggle user selection
  const toggleUserSelection = (userId: string) => {
    const newSelection = new Set(selectedUserIds);
    if (newSelection.has(userId)) {
      newSelection.delete(userId);
    } else {
      newSelection.add(userId);
    }
    setSelectedUserIds(newSelection);
  };

  // Add selected users as recipients
  const addSelectedUsers = () => {
    const selectedUsers = availableUsers.filter(user => selectedUserIds.has(user._id));
    
    if (selectedUsers.length === 0) {
      setError('Please select at least one user');
      return;
    }

    const newRecipients: BulkRecipient[] = selectedUsers.map(user => ({
      id: user._id,
      userId: user.userId, // userId is the username in backend schema
      address: user.walletAddress,
      name: user.displayName,
      amount: '0'
    }));

    setRecipients(prev => [...prev, ...newRecipients]);
    setSelectedUserIds(new Set());
    setError(null);
  };

  // Remove recipient
  const removeRecipient = (id: string) => {
    setRecipients(prev => prev.filter(r => r.id !== id));
  };

  // Update recipient amount
  const updateRecipientAmount = (id: string, amount: string) => {
    if (!/^\d*\.?\d*$/.test(amount)) return;
    setRecipients(prev => prev.map(r => 
      r.id === id ? { ...r, amount } : r
    ));
  };

  // Validate steps
  const validateStep = (step: string): boolean => {
    setError(null);

    if (step === 'select') {
      if (recipients.length === 0) {
        setError('Please add at least one recipient');
        return false;
      }
      return true;
    }

    if (step === 'amounts') {
      if (recipients.some(r => !r.amount || parseFloat(r.amount) <= 0)) {
        setError('Please enter valid amounts for all recipients');
        return false;
      }

      const total = parseFloat(totalAmount);
      if (total > parseFloat(userBalance)) {
        setShowInsufficientBalance(true);
        return false;
      }

      return true;
    }

    return true;
  };

  // Navigate to next step
  const handleNext = () => {
    if (currentStep === 'select' && validateStep('select')) {
      setCurrentStep('amounts');
    } else if (currentStep === 'amounts' && validateStep('amounts')) {
      setCurrentStep('review');
    }
  };

  // Navigate to previous step
  const handleBack = () => {
    if (currentStep === 'amounts') {
      setCurrentStep('select');
    } else if (currentStep === 'review') {
      setCurrentStep('amounts');
    }
    setError(null);
  };

  // Execute bulk payment
  const handleExecuteBulkPayment = async () => {
    if (!wallet.address || !user?.userId) {
      setError('Wallet not connected');
      return;
    }

    setCurrentStep('processing');
    setError(null);

    try {
      console.log('💰 Executing bulk payment...', {
        recipientCount: recipients.length,
        totalAmount,
        from: wallet.address
      });

      // Contract parameters for BulkPayroll.bulkTransfer
      const recipientAddresses = recipients.map(r => r.address);
      const amounts = recipients.map(r => {
        // Convert to wei (18 decimals for USDT)
        const amountInWei = Math.round(parseFloat(r.amount) * Math.pow(10, 18));
        return amountInWei.toString();
      });

      console.log('📊 Contract call parameters:', {
        contract: BULK_PAYROLL_ADDRESS,
        usdtToken: USDT_ADDRESS,
        recipients: recipientAddresses,
        amounts: amounts,
        totalAmountWei: amounts.reduce((sum, amount) => sum + BigInt(amount), BigInt(0)).toString()
      });

      // Import wallet service dynamically
      const { WalletService } = await import('../lib/wallet-service');
      const walletService = WalletService.getInstance();

      // Step 1: Approve USDT spending for BulkPayroll contract
      console.log('🔓 Approving USDT spending for BulkPayroll contract...');
      const totalAmountWei = amounts.reduce((sum, amount) => sum + BigInt(amount), BigInt(0));
      
      // ERC20 approve function selector: 0x095ea7b3
      const approveSelector = '095ea7b3';
      const paddedSpenderAddress = BULK_PAYROLL_ADDRESS.slice(2).padStart(64, '0');
      const paddedAmount = totalAmountWei.toString(16).padStart(64, '0');
      const approveData = '0x' + approveSelector + paddedSpenderAddress + paddedAmount;

      console.log('📝 Approve transaction data:', {
        selector: approveSelector,
        spender: BULK_PAYROLL_ADDRESS,
        amount: totalAmountWei.toString(),
        data: approveData
      });

      const approveTx = await walletService.sendTransaction(
        USDT_ADDRESS,
        '0x0',
        '0x15f90', // Gas limit for approval
        approveData
      );

      console.log('✅ USDT approval successful:', approveTx);

      // Step 2: Execute bulk transfer using proper contract call (matches working script)
      console.log('📦 Executing bulk transfer...');
      
      // Prepare recipients and amounts arrays (exactly like the working script)
      const contractRecipients = recipients.map(r => r.address);
      const contractAmounts = recipients.map(r => {
        // Convert amount to wei (18 decimals for USDT)
        const amountInWei = BigInt(Math.floor(parseFloat(r.amount) * 1e18));
        return amountInWei.toString();
      });
      
      console.log('📊 Transaction summary:', {
        recipientCount: recipients.length,
        totalAmount: totalAmount,
        recipients: contractRecipients,
        amounts: contractAmounts.map(a => (BigInt(a) / BigInt(10**18)).toString() + ' USDT')
      });

      // Use ethers.js contract interface to call bulkTransfer (matches script approach)
      const { ethers } = await import('ethers');
      const provider = new ethers.JsonRpcProvider(CONFIG.RPC_URL);
      
      // BulkPayroll contract ABI for bulkTransfer function
      const bulkPayrollABI = [
        {
          "inputs": [
            { "internalType": "address[]", "name": "recipients", "type": "address[]" },
            { "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }
          ],
          "name": "bulkTransfer",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        }
      ];
      
      const bulkPayrollContract = new ethers.Contract(BULK_PAYROLL_ADDRESS, bulkPayrollABI, provider);
      
      // Encode the function call data using ethers (this will be correct)
      const callData = bulkPayrollContract.interface.encodeFunctionData('bulkTransfer', [
        contractRecipients,
        contractAmounts
      ]);
      
      console.log('📦 Using proper ethers.js encoding for bulkTransfer(address[], uint256[])');
      console.log('Method signature matches working script exactly');

      const bulkTx = await walletService.sendTransaction(
        BULK_PAYROLL_ADDRESS,
        '0x0',
        '0x30d40', // Gas limit for bulk transfer (~200000)
        callData // Properly encoded function call
      );

      console.log('✅ Bulk payment transaction sent:', bulkTx);

      // Record bulk payment in backend
      console.log('📝 Recording bulk payment in backend...');
      
      // Get current user's username from backend by finding user with matching lineUserId
      let senderUsername = user?.userId; // fallback to LINE userId
      
      try {
        console.log('🔍 Fetching all users to find sender username...');
        const usersResponse = await fetch(`${CONFIG.BACKEND_URL}${API_ENDPOINTS.AUTH.GET_ALL_USERS}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (usersResponse.ok) {
          const allUsers = await usersResponse.json();
          const currentUser = allUsers.find((u: User) => u.lineUserId === user?.userId);
          if (currentUser) {
            senderUsername = currentUser.userId; // Use userId field (which is the username in backend)
            console.log('✅ Found sender username:', senderUsername);
          } else {
            console.warn('⚠️ Current user not found in backend, using fallback');
          }
        } else {
          console.warn('⚠️ Failed to fetch users, using fallback username');
        }
      } catch (error) {
        console.error('❌ Error fetching users:', error);
        console.log('⚠️ Using fallback username');
      }
      
      const bulkPaymentData: BulkPaymentData = {
        id: `bulk_${bulkTx.slice(2, 10)}`,
        recipients,
        totalAmount,
        transactionHash: bulkTx,
        createdAt: new Date()
      };

      // Prepare the request body
      const requestBody = {
        senderId: senderUsername, // Use the found username
        receiverIds: recipients.map(r => r.userId), // Array of usernames (userId field from backend)
        amounts: recipients.map(r => parseFloat(r.amount)), // Array of amounts
        transactionHash: bulkTx,
        status: 'completed'
      };

      // 🐛 DEBUG: Log the exact body being sent
      console.log('📤 BULK PAYMENT REQUEST BODY:', JSON.stringify(requestBody, null, 2));
      console.log('📤 Request details:', {
        senderUsername,
        recipientUsernames: recipients.map(r => r.userId),
        amounts: recipients.map(r => parseFloat(r.amount)),
        bulkTx,
        recipientsData: recipients
      });

      const recordResponse = await fetch(`${CONFIG.BACKEND_URL}${API_ENDPOINTS.BULK.RECORD}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!recordResponse.ok) {
        console.warn('Failed to record bulk payment in backend:', recordResponse.status);
        // Continue anyway since the blockchain transaction succeeded
      }

      console.log('🎉 Bulk payment completed successfully!');
      onSuccess(bulkPaymentData);
      onClose();

    } catch (error) {
      console.error('❌ Bulk payment failed:', error);
      setError(error instanceof Error ? error.message : 'Bulk payment failed');
      setCurrentStep('review'); // Go back to review step
    }
  };

  // Handle amount input
  const handleAmountChange = (value: string, setter: (value: string) => void) => {
    if (!/^\d*\.?\d*$/.test(value)) return;
    setter(value);
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
              {currentStep !== 'select' && currentStep !== 'processing' && (
                <button
                  onClick={handleBack}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <DocumentDuplicateIcon className="w-6 h-6 text-green-600" />
                {currentStep === 'select' && 'Select Recipients'}
                {currentStep === 'amounts' && 'Set Amounts'}
                {currentStep === 'review' && 'Review Payment'}
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

        {/* Progress Indicator */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            {['select', 'amounts', 'review'].map((step, index) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep === step 
                    ? 'bg-green-600 text-white' 
                    : index < ['select', 'amounts', 'review'].indexOf(currentStep)
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-500'
                }`}>
                  {index < ['select', 'amounts', 'review'].indexOf(currentStep) ? (
                    <CheckCircleIcon className="w-5 h-5" />
                  ) : (
                    index + 1
                  )}
                </div>
                {index < 2 && (
                  <div className={`w-12 h-0.5 mx-2 ${
                    index < ['select', 'amounts', 'review'].indexOf(currentStep) 
                      ? 'bg-green-600' 
                      : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-96 overflow-y-auto">
          {/* Step 1: Select Recipients */}
          {currentStep === 'select' && (
            <div className="space-y-4">
              {/* User Selection */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium text-gray-900">Available Users</h3>
                  <span className="text-sm text-gray-500">
                    {selectedUserIds.size} selected
                  </span>
                </div>

                <div className="max-h-64 overflow-y-auto space-y-2 border border-gray-200 rounded-lg p-3">
                  {loadingUsers ? (
                    <div className="text-center py-4">
                      <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                      <p className="text-gray-500 text-sm">Loading users...</p>
                    </div>
                  ) : availableUsers.length === 0 ? (
                    <div className="text-center py-4">
                      <UserIcon className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                      <p className="text-gray-500 text-sm">No users available</p>
                    </div>
                  ) : (
                    availableUsers.map((user) => (
                      <div key={user._id} className="flex items-center space-x-3 p-2 bg-gray-50 rounded border">
                        <input
                          type="checkbox"
                          id={`user-${user._id}`}
                          checked={selectedUserIds.has(user._id)}
                          onChange={() => toggleUserSelection(user._id)}
                          className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                        <label htmlFor={`user-${user._id}`} className="flex-1 cursor-pointer">
                          <div className="font-medium text-gray-900">{user.displayName}</div>
                          <div className="text-sm text-gray-500 font-mono">
                            {user.walletAddress.slice(0, 8)}...{user.walletAddress.slice(-6)}
                          </div>
                        </label>
                      </div>
                    ))
                  )}
                </div>

                {selectedUserIds.size > 0 && (
                  <button
                    onClick={addSelectedUsers}
                    className="w-full mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium flex items-center justify-center gap-2"
                  >
                    <PlusIcon className="w-4 h-4" />
                    Add {selectedUserIds.size} Selected User{selectedUserIds.size > 1 ? 's' : ''}
                  </button>
                )}
              </div>

              {/* Selected Recipients */}
              {recipients.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-medium text-gray-900">Recipients ({recipients.length})</h3>
                  {recipients.map((recipient) => (
                    <div key={recipient.id} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium text-sm">{recipient.name}</div>
                        <div className="text-xs text-gray-500 font-mono">
                          {recipient.address.slice(0, 8)}...{recipient.address.slice(-6)}
                        </div>
                      </div>
                      <button
                        onClick={() => removeRecipient(recipient.id)}
                        className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <button
                onClick={handleNext}
                disabled={recipients.length === 0}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next: Set Amounts
              </button>
            </div>
          )}

          {/* Step 2: Set Amounts */}
          {currentStep === 'amounts' && (
            <div className="space-y-4">
              {/* Balance Display */}
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center justify-between">
                  <span className="text-green-800 font-medium">Your USDT Balance:</span>
                  <span className="text-green-800 font-bold">
                    {loadingBalance ? 'Loading...' : `${userBalance} USDT`}
                  </span>
                </div>
              </div>

              {/* Amount Inputs */}
              <div className="space-y-3">
                <h3 className="font-medium text-gray-900">Set Payment Amounts</h3>
                {recipients.map((recipient) => (
                  <div key={recipient.id} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium text-sm">{recipient.name}</div>
                      <div className="text-xs text-gray-500 font-mono">
                        {recipient.address.slice(0, 8)}...{recipient.address.slice(-6)}
                      </div>
                    </div>
                    <div className="w-24">
                      <input
                        type="text"
                        value={recipient.amount}
                        onChange={(e) => updateRecipientAmount(recipient.id, e.target.value)}
                        placeholder="0.00"
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Total Amount */}
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-green-800">Total Amount:</span>
                  <span className="font-bold text-green-900">{totalAmount} USDT</span>
                </div>
              </div>

              <button
                onClick={handleNext}
                disabled={recipients.some(r => !r.amount || parseFloat(r.amount) <= 0)}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next: Review Payment
              </button>
            </div>
          )}

          {/* Step 3: Review */}
          {currentStep === 'review' && (
            <div className="space-y-6">
              {/* Payment Summary */}
              <div className="p-4 bg-gray-50 rounded-lg border">
                <h3 className="font-medium text-gray-900 mb-3">Payment Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Recipients:</span>
                    <span className="font-medium">{recipients.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Amount:</span>
                    <span className="font-bold text-lg">{totalAmount} USDT</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Network:</span>
                    <span className="font-medium">Kaia Testnet</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Contract:</span>
                    <span className="text-xs font-mono">BulkPayroll</span>
                  </div>
                </div>
              </div>

              {/* Recipients Summary */}
              <div className="space-y-2">
                <h3 className="font-medium text-gray-900">Payment Breakdown</h3>
                <div className="max-h-32 overflow-y-auto space-y-1">
                  {recipients.map((recipient) => (
                    <div key={recipient.id} className="flex justify-between items-center p-2 border border-gray-200 rounded text-sm">
                      <div>
                        <div className="font-medium">{recipient.name}</div>
                        <div className="text-xs text-gray-500 font-mono">
                          {recipient.address.slice(0, 8)}...{recipient.address.slice(-6)}
                        </div>
                      </div>
                      <span className="font-medium">{recipient.amount} USDT</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Execute Button */}
              <button
                onClick={handleExecuteBulkPayment}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <CheckCircleIcon className="w-5 h-5" />
                Execute Bulk Payment
              </button>
            </div>
          )}

          {/* Processing */}
          {currentStep === 'processing' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Processing Bulk Payment...</h3>
              <p className="text-gray-500">
                Approving USDT spending and executing bulk transfer...
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
        requiredAmount={totalAmount}
        onBalanceUpdated={loadBalance}
      />
    </div>
  );
}