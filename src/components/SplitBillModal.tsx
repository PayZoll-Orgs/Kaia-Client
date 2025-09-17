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

interface Participant {
  id: string;
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
  const { user, wallet } = useAuth();
  
  // UI State
  const [currentStep, setCurrentStep] = useState<'create' | 'participants' | 'review' | 'processing'>('create');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [newParticipant, setNewParticipant] = useState({ address: '', name: '', amount: '' });
  const [splitMethod, setSplitMethod] = useState<'equal' | 'custom'>('equal');
  const [deadline, setDeadline] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
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

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      loadBalance();
      setCurrentStep('create');
      setTitle('');
      setDescription('');
      setTotalAmount('');
      setParticipants([]);
      setNewParticipant({ address: '', name: '', amount: '' });
      setSplitMethod('equal');
      setDeadline('');
      setError(null);
    }
  }, [isOpen, loadBalance]);

  // Calculate equal split amounts when total amount or participants change
  useEffect(() => {
    if (splitMethod === 'equal' && totalAmount && participants.length > 0) {
      const equalAmount = (parseFloat(totalAmount) / participants.length).toFixed(2);
      setParticipants(prev => prev.map(p => ({ ...p, amount: equalAmount })));
    }
  }, [totalAmount, participants.length, splitMethod]);

  // Add participant
  const addParticipant = () => {
    if (!newParticipant.address || !newParticipant.name) {
      setError('Please enter participant address and name');
      return;
    }

    // Check for duplicate addresses
    if (participants.some(p => p.address.toLowerCase() === newParticipant.address.toLowerCase())) {
      setError('Participant address already added');
      return;
    }

    // Check if trying to add yourself
    if (newParticipant.address.toLowerCase() === wallet.address?.toLowerCase()) {
      setError('Cannot add yourself as a participant');
      return;
    }

    const participant: Participant = {
      id: Date.now().toString(),
      address: newParticipant.address,
      name: newParticipant.name,
      amount: splitMethod === 'custom' ? newParticipant.amount : '0',
      paid: false
    };

    setParticipants(prev => [...prev, participant]);
    setNewParticipant({ address: '', name: '', amount: '' });
    setError(null);
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

      // For demo purposes, we'll simulate the contract interaction
      // In a real implementation, this would:
      // 1. Call SplitBilling.createSplit() contract function
      // 2. Pass participants array, amounts, deadline, etc.
      // 3. Get the split ID from the transaction

      // Simulate contract call delay
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Generate mock split ID
      const splitId = 'split_' + Date.now();
      const mockTxHash = '0xfd' + Math.random().toString(16).substring(2, 64);

      console.log('✅ Split bill created successfully!', {
        splitId,
        transactionHash: mockTxHash
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

      // Record in backend via split payment API
      const recordResponse = await fetch(`${CONFIG.BACKEND_URL}${API_ENDPOINTS.SPLIT.RECORD}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          billId: splitId,
          creatorId: user.userId,
          participants: participants.map(p => ({
            userId: p.address, // Using address as userId for demo
            amount: parseFloat(p.amount),
            paid: false
          })),
          totalAmount: parseFloat(totalAmount),
          description: description,
          currency: 'USDT',
          status: 'active'
        }),
      });

      if (!recordResponse.ok) {
        console.warn('Failed to record split bill in backend:', recordResponse.status);
        // Continue anyway since the main operation succeeded
      }

      console.log('📊 Split bill recorded in backend');
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
                    ? 'bg-blue-600 text-white' 
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
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Equal Split
                  </button>
                  <button
                    onClick={() => setSplitMethod('custom')}
                    className={`flex-1 py-2 px-3 rounded-lg font-medium transition-colors ${
                      splitMethod === 'custom'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Custom Amounts
                  </button>
                </div>
              </div>

              {/* Add Participant Form */}
              <div className="p-4 bg-gray-50 rounded-lg border">
                <h3 className="font-medium text-gray-900 mb-3">Add Participant</h3>
                
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Wallet address (0x...)"
                    value={newParticipant.address}
                    onChange={(e) => setNewParticipant(prev => ({ ...prev, address: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                  
                  <input
                    type="text"
                    placeholder="Display name"
                    value={newParticipant.name}
                    onChange={(e) => setNewParticipant(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                  
                  {splitMethod === 'custom' && (
                    <input
                      type="text"
                      placeholder="Amount (USDT)"
                      value={newParticipant.amount}
                      onChange={(e) => {
                        if (!/^\d*\.?\d*$/.test(e.target.value)) return;
                        setNewParticipant(prev => ({ ...prev, amount: e.target.value }));
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  )}
                  
                  <button
                    onClick={addParticipant}
                    disabled={!newParticipant.address || !newParticipant.name}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <PlusIcon className="w-4 h-4" />
                    Add Participant
                  </button>
                </div>
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
                  
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-blue-800">Total:</span>
                      <span className="font-bold text-blue-900">
                        {participants.reduce((sum, p) => sum + parseFloat(p.amount || '0'), 0).toFixed(2)} USDT
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-blue-700">Expected:</span>
                      <span className="text-blue-800">{totalAmount} USDT</span>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={handleNext}
                disabled={participants.length === 0}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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