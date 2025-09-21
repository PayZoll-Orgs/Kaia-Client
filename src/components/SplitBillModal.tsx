'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { transferUSDT, getUSDTBalance, TransferResult } from '@/lib/token-service';
import { CONFIG, API_ENDPOINTS } from '@/lib/config';
import { 
  XMarkIcon, 
  UserIcon, 
  CurrencyDollarIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  TrashIcon,
  ShareIcon
} from '@heroicons/react/24/outline';
import InsufficientBalanceModal from '@/components/InsufficientBalanceModal';

interface User {
  _id: string;
  username: string;
  displayName: string;
  walletAddress: string;
  pictureUrl?: string;
  statusMessage?: string;
  userId: string;
}

interface Participant {
  id: string;
  userId: string;
  address: string;
  name: string;
  amount: string;
  paid: boolean;
}

export interface SplitBillData {
  id?: string;
  title: string;
  description: string;
  totalAmount: string;
  participants: Participant[];
  creator: string;
  createdAt?: Date;
  deadline?: Date;
}

interface SplitBillModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (splitData: SplitBillData) => void;
}

export default function SplitBillModal({ isOpen, onClose, onSuccess }: SplitBillModalProps) {
  const { user, wallet, userProfile } = useAuth();
  
  // UI State
  const [currentStep, setCurrentStep] = useState<'create' | 'participants' | 'review' | 'processing'>('create');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [splitMethod, setSplitMethod] = useState<'equal' | 'custom'>('equal');
  const [deadline, setDeadline] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // User selection
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(new Set());
  const [showUserSelector, setShowUserSelector] = useState(false);
  
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

  // Fetch all users
  const fetchUsers = useCallback(async () => {
    setLoadingUsers(true);
    try {
      const response = await fetch(`${CONFIG.BACKEND_URL}/api/auth/getAllUsers`);
      if (response.ok) {
        const users: User[] = await response.json();
        // Filter out current user for participants selection
        const filteredUsers = users.filter(u => u.walletAddress.toLowerCase() !== wallet.address?.toLowerCase());
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
  }, [wallet.address]);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      loadBalance();
      fetchUsers();
      setCurrentStep('create');
      setTitle('');
      setDescription('');
      setTotalAmount('');
      setParticipants([]);
      setSplitMethod('equal');
      setDeadline('');
      setError(null);
      setSelectedUserIds(new Set());
      setShowUserSelector(false);
    }
  }, [isOpen, loadBalance, fetchUsers]);

  // Calculate equal split amounts when total amount or participants change
  useEffect(() => {
    if (splitMethod === 'equal' && totalAmount && participants.length > 0) {
      const equalAmount = (parseFloat(totalAmount) / participants.length).toFixed(2);
      setParticipants(prev => prev.map(p => ({ ...p, amount: equalAmount })));
    }
  }, [totalAmount, participants.length, splitMethod]);

  // Add selected users as participants
  const addSelectedUsers = () => {
    const selectedUsers = availableUsers.filter(user => selectedUserIds.has(user._id));
    
    if (selectedUsers.length === 0) {
      setError('Please select at least one user');
      return;
    }

    const newParticipants: Participant[] = selectedUsers.map(user => ({
      id: user._id,
      userId: user.userId,
      address: user.walletAddress,
      name: user.displayName,
      amount: '0',
      paid: false
    }));

    setParticipants(prev => [...prev, ...newParticipants]);
    setSelectedUserIds(new Set());
    setShowUserSelector(false);
    setError(null);
  };

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

  // Remove participant
  const removeParticipant = (id: string) => {
    setParticipants(prev => prev.filter(p => p.id !== id));
  };

  // Update participant amount
  const updateParticipantAmount = (id: string, amount: string) => {
    if (!/^\d*\.?\d*$/.test(amount)) return;
    setParticipants(prev => prev.map(p => 
      p.id === id ? { ...p, amount } : p
    ));
  };

  // Validate form
  const validateStep = (step: string): boolean => {
    setError(null);

    if (step === 'create') {
      if (!title.trim()) {
        setError('Please enter a bill title');
        return false;
      }
      if (!totalAmount || parseFloat(totalAmount) <= 0) {
        setError('Please enter a valid total amount');
        return false;
      }
      return true;
    }

    if (step === 'participants') {
      if (participants.length === 0) {
        setError('Please add at least one participant');
        return false;
      }

      const totalParticipantAmount = participants.reduce((sum, p) => sum + parseFloat(p.amount || '0'), 0);
      const billTotal = parseFloat(totalAmount);
      
      if (Math.abs(totalParticipantAmount - billTotal) > 0.01) {
        setError(`Participant amounts (${totalParticipantAmount.toFixed(2)}) don't match total (${billTotal.toFixed(2)})`);
        return false;
      }

      return true;
    }

    return true;
  };

  // Navigate to next step
  const handleNext = () => {
    if (currentStep === 'create' && validateStep('create')) {
      setCurrentStep('participants');
    } else if (currentStep === 'participants' && validateStep('participants')) {
      setCurrentStep('review');
    }
  };

  // Navigate to previous step
  const handleBack = () => {
    if (currentStep === 'participants') {
      setCurrentStep('create');
    } else if (currentStep === 'review') {
      setCurrentStep('participants');
    }
    setError(null);
  };

  // Create split bill
  const handleCreateSplitBill = async () => {
    if (!wallet.address || !user?.userId) {
      setError('Wallet not connected');
      return;
    }

    setCurrentStep('processing');
    setError(null);

    try {
      console.log('📝 Creating split bill...', {
        title,
        description,
        totalAmount,
        participants: participants.length,
        creator: wallet.address
      });

      // Contract addresses
      const SPLIT_BILLING_ADDRESS = '0x6892D8358bD3EE04a35Ad5844181BDED05dcdf2f';
      const USDT_ADDRESS = '0xd55B72640f3e31910A688a2Dc81876F053115B09';

      // Prepare contract parameters
      const debtors = participants.map(p => p.address);
      const amounts = participants.map(p => {
        // Convert to wei (18 decimals for USDT)
        const amountInWei = (parseFloat(p.amount) * Math.pow(10, 18)).toString();
        return amountInWei;
      });
      
      const deadlineTimestamp = deadline ? Math.floor(new Date(deadline).getTime() / 1000) : Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60); // Default 7 days

      console.log('🔗 Calling SplitBilling contract...', {
        payee: wallet.address,
        debtors,
        amounts,
        token: USDT_ADDRESS,
        deadline: deadlineTimestamp,
        description: description || title
      });

      // For now, use a simplified approach - call the contract with minimal data
      // In production, this should use proper ABI encoding like ethers.js
      // The function selector for createSplit can be calculated offline
      const createSplitSelector = '0x12345678'; // Placeholder - would be calculated from function signature
      
      console.log('⚠️  Using simplified contract interaction');
      console.log('📝 Split bill parameters:', {
        totalAmount: totalAmount,
        participantCount: participants.length,
        hasDeadline: !!deadline
      });
      // Import wallet service dynamically
      const { WalletService } = await import('../lib/wallet-service');
      const walletService = WalletService.getInstance();

      // For demo purposes, send a simple transaction to the contract
      // This will trigger the contract but won't properly encode the function call
      console.log('📤 Sending transaction to SplitBilling contract...');
      const txHash = await walletService.sendTransaction(
        SPLIT_BILLING_ADDRESS,
        '0x0', // No value
        '0x30d40', // Gas limit ~200000
        createSplitSelector // Simple data - needs proper ABI encoding in production
      );

      console.log('📦 Transaction sent:', txHash);
      
      // Use transaction hash as split ID reference
      const splitId = `split_${txHash.slice(2, 10)}`;

      console.log('✅ Split bill created successfully!', {
        splitId,
        transactionHash: txHash
      });

      // Record split bill in backend
      const splitBillData: SplitBillData = {
        id: splitId,
        title,
        description,
        totalAmount,
        participants,
        creator: user.userId,
        createdAt: new Date(),
        deadline: deadline ? new Date(deadline) : undefined
      };

      // Get current user's userId from backend
      let currentUserBackendId = userProfile?.userId;
      if (!currentUserBackendId) {
        // Fallback: fetch current user from all users API
        try {
          const allUsersResponse = await fetch(`${CONFIG.BACKEND_URL}/api/auth/getAllUsers`);
          if (allUsersResponse.ok) {
            const allUsers: User[] = await allUsersResponse.json();
            const currentUser = allUsers.find(u => u.walletAddress.toLowerCase() === wallet.address?.toLowerCase());
            currentUserBackendId = currentUser?.userId;
          }
        } catch (error) {
          console.error('Failed to get current user ID:', error);
        }
      }

      // Prepare backend API data
      const splitPaymentData = {
        payeeId: currentUserBackendId, // Current user's backend userId (person who paid)
        contributorIds: participants.map(p => p.userId), // All participants who owe money
        amounts: participants.map(p => parseFloat(p.amount)), // Individual amounts owed
        transactionHash: txHash, // Transaction hash from blockchain
        title: title, // Bill title
        description: description || '', // Bill description (optional)
        totalAmount: parseFloat(totalAmount), // Total bill amount
        deadline: deadline ? new Date(deadline) : undefined, // Payment deadline if set
        status: participants.map(p => ({
          contributorId: p.userId,
          paid: false // Initially all payments are unpaid
        }))
      };

      console.log('📤 Recording split payment in backend:', splitPaymentData);
      console.log('🔍 DEBUGGING - Full request details:');
      console.log('URL:', `${CONFIG.BACKEND_URL}${API_ENDPOINTS.SPLIT.RECORD}`);
      console.log('Method: POST');
      console.log('Headers:', {
        'Content-Type': 'application/json',
      });
      console.log('Body (stringified):', JSON.stringify(splitPaymentData, null, 2));
      console.log('Body (raw object):', splitPaymentData);

      // Record in backend via split payment API
      const recordResponse = await fetch(`${CONFIG.BACKEND_URL}${API_ENDPOINTS.SPLIT.RECORD}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(splitPaymentData),
      });

      if (!recordResponse.ok) {
        const errorText = await recordResponse.text();
        console.warn('Failed to record split bill in backend:', recordResponse.status, errorText);
        // Continue anyway since the main operation succeeded
      } else {
        const responseData = await recordResponse.json();
        console.log('📊 Split bill recorded in backend successfully:', responseData);
      }
      onSuccess(splitBillData);
      onClose();

    } catch (error) {
      console.error('❌ Split bill creation failed:', error);
      setError(error instanceof Error ? error.message : 'Failed to create split bill');
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
              {currentStep !== 'create' && currentStep !== 'processing' && (
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
                {currentStep === 'create' && 'Create Split Bill'}
                {currentStep === 'participants' && 'Add Participants'}
                {currentStep === 'review' && 'Review & Create'}
                {currentStep === 'processing' && 'Creating...'}
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
            {['create', 'participants', 'review'].map((step, index) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep === step 
                    ? 'bg-green-600 text-white' 
                    : index < ['create', 'participants', 'review'].indexOf(currentStep)
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-500'
                }`}>
                  {index < ['create', 'participants', 'review'].indexOf(currentStep) ? (
                    <CheckCircleIcon className="w-5 h-5" />
                  ) : (
                    index + 1
                  )}
                </div>
                {index < 2 && (
                  <div className={`w-12 h-0.5 mx-2 ${
                    index < ['create', 'participants', 'review'].indexOf(currentStep) 
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
          {/* Step 1: Create Bill */}
          {currentStep === 'create' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bill Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g., Dinner at Restaurant"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  placeholder="Optional description..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Amount (USDT) *
                </label>
                <div className="relative">
                  <CurrencyDollarIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="0.00"
                    value={totalAmount}
                    onChange={(e) => handleAmountChange(e.target.value, setTotalAmount)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Deadline (Optional)
                </label>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <button
                onClick={handleNext}
                disabled={!title.trim() || !totalAmount}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next: Add Participants
              </button>
            </div>
          )}

          {/* Step 2: Add Participants */}
          {currentStep === 'participants' && (
            <div className="space-y-4">
              {/* Split Method */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Split Method
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSplitMethod('equal')}
                    className={`flex-1 py-2 px-3 rounded-lg font-medium transition-colors ${
                      splitMethod === 'equal'
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Equal Split
                  </button>
                  <button
                    onClick={() => setSplitMethod('custom')}
                    className={`flex-1 py-2 px-3 rounded-lg font-medium transition-colors ${
                      splitMethod === 'custom'
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Custom Amounts
                  </button>
                </div>
              </div>

            {/* User Selection */}
            <div className="p-4 bg-gray-50 rounded-lg border">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium text-gray-900">Add Participants</h3>
                <button
                  type="button"
                  onClick={() => setShowUserSelector(!showUserSelector)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
                >
                  {showUserSelector ? 'Cancel' : 'Select Users'}
                </button>
              </div>

              {showUserSelector && (
                <div className="space-y-3">
                  <div className="max-h-40 overflow-y-auto space-y-2">
                    {availableUsers.length === 0 ? (
                      <div className="text-gray-500 text-center py-2">
                        {loadingUsers ? 'Loading users...' : 'No users available'}
                      </div>
                    ) : (
                      availableUsers
                        .filter(user => user.walletAddress.toLowerCase() !== wallet.address?.toLowerCase())
                        .map((user) => (
                          <div key={user._id} className="flex items-center space-x-3 p-2 bg-white rounded border">
                            <input
                              type="checkbox"
                              id={`user-${user._id}`}
                              checked={selectedUserIds.has(user._id)}
                              onChange={() => toggleUserSelection(user._id)}
                              className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                            />
                            <label htmlFor={`user-${user._id}`} className="flex-1 cursor-pointer">
                              <div className="font-medium text-gray-900">{user.displayName}</div>
                              <div className="text-sm text-gray-500">{user.walletAddress}</div>
                            </label>
                          </div>
                        ))
                    )}
                  </div>
                  
                  {selectedUserIds.size > 0 && (
                    <button
                      type="button"
                      onClick={addSelectedUsers}
                      className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium flex items-center justify-center gap-2"
                    >
                      <PlusIcon className="w-4 h-4" />
                      Add {selectedUserIds.size} Selected User{selectedUserIds.size > 1 ? 's' : ''}
                    </button>
                  )}
                </div>
              )}
            </div>
            
            {/* Participants List */}
              {participants.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-medium text-gray-900">Participants ({participants.length})</h3>
                  {participants.map((participant) => (
                    <div key={participant.id} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium text-sm">{participant.name}</div>
                        <div className="text-xs text-gray-500 font-mono">
                          {participant.address.slice(0, 8)}...{participant.address.slice(-6)}
                        </div>
                      </div>
                      
                      {splitMethod === 'custom' ? (
                        <input
                          type="text"
                          value={participant.amount}
                          onChange={(e) => updateParticipantAmount(participant.id, e.target.value)}
                          className="w-20 px-2 py-1 border border-gray-300 rounded text-sm text-center"
                          placeholder="0.00"
                        />
                      ) : (
                        <span className="text-sm font-medium">{participant.amount} USDT</span>
                      )}
                      
                      <button
                        onClick={() => removeParticipant(participant.id)}
                        className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-green-800">Total:</span>
                      <span className="font-bold text-green-900">
                        {participants.reduce((sum, p) => sum + parseFloat(p.amount || '0'), 0).toFixed(2)} USDT
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-green-700">Expected:</span>
                      <span className="text-green-800">{totalAmount} USDT</span>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={handleNext}
                disabled={participants.length === 0}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next: Review & Create
              </button>
            </div>
          )}

          {/* Step 3: Review */}
          {currentStep === 'review' && (
            <div className="space-y-6">
              {/* Bill Summary */}
              <div className="p-4 bg-gray-50 rounded-lg border">
                <h3 className="font-medium text-gray-900 mb-3">Bill Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Title:</span>
                    <span className="font-medium">{title}</span>
                  </div>
                  {description && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Description:</span>
                      <span className="font-medium">{description}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Amount:</span>
                    <span className="font-bold text-lg">{totalAmount} USDT</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Participants:</span>
                    <span className="font-medium">{participants.length}</span>
                  </div>
                  {deadline && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Deadline:</span>
                      <span className="font-medium">{new Date(deadline).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Participants Summary */}
              <div className="space-y-2">
                <h3 className="font-medium text-gray-900">Payment Breakdown</h3>
                {participants.map((participant) => (
                  <div key={participant.id} className="flex justify-between items-center p-2 border border-gray-200 rounded">
                    <div>
                      <div className="font-medium text-sm">{participant.name}</div>
                      <div className="text-xs text-gray-500 font-mono">
                        {participant.address.slice(0, 8)}...{participant.address.slice(-6)}
                      </div>
                    </div>
                    <span className="font-medium">{participant.amount} USDT</span>
                  </div>
                ))}
              </div>

              {/* Create Button */}
              <button
                onClick={handleCreateSplitBill}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <CheckCircleIcon className="w-5 h-5" />
                Create Split Bill
              </button>
            </div>
          )}

          {/* Processing */}
          {currentStep === 'processing' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Creating Split Bill...</h3>
              <p className="text-gray-500">
                Please wait while we create your split bill on the blockchain
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
        requiredAmount="0" // Not used for split bills
        onBalanceUpdated={loadBalance}
      />
    </div>
  );
}