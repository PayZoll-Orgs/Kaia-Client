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
  ClockIcon,
  ShareIcon
} from '@heroicons/react/24/outline';
import InsufficientBalanceModal from '@/components/InsufficientBalanceModal';

interface Participant {
  userId: string;
  amount: number;
  paid: boolean;
  name?: string;
}

interface SplitBill {
  _id: string;
  billId: string;
  creatorId: string;
  participants: Participant[];
  totalAmount: number;
  description: string;
  currency: string;
  status: 'active' | 'completed' | 'cancelled';
  createdAt: string;
}

interface SplitBillViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: (txHash: string, amount: string) => void;
}

export default function SplitBillViewModal({ isOpen, onClose, onPaymentSuccess }: SplitBillViewModalProps) {
  const { user, wallet } = useAuth();
  
  // UI State
  const [splitBills, setSplitBills] = useState<SplitBill[]>([]);
  const [selectedBill, setSelectedBill] = useState<SplitBill | null>(null);
  const [currentView, setCurrentView] = useState<'list' | 'details' | 'pay'>('list');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  
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

  // Load split bills from backend
  const loadSplitBills = useCallback(async () => {
    if (!user?.userId) return;

    setIsLoading(true);
    try {
      // Get split bills where user is participant or creator
      const response = await fetch(`${CONFIG.BACKEND_URL}${API_ENDPOINTS.SPLIT.GET_TRANSACTIONS}/${user.userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const bills = await response.json();
        setSplitBills(bills || []);
      } else {
        console.error('Failed to load split bills:', response.status);
        setSplitBills([]);
      }
    } catch (error) {
      console.error('Error loading split bills:', error);
      setSplitBills([]);
    } finally {
      setIsLoading(false);
    }
  }, [user?.userId]);

  // Load data when modal opens
  useEffect(() => {
    if (isOpen) {
      loadBalance();
      loadSplitBills();
      setCurrentView('list');
      setSelectedBill(null);
      setError(null);
    }
  }, [isOpen, loadBalance, loadSplitBills]);

  // Handle bill selection
  const handleBillSelect = (bill: SplitBill) => {
    setSelectedBill(bill);
    setCurrentView('details');
    setError(null);
  };

  // Handle payment initiation
  const handlePayShare = (bill: SplitBill) => {
    const myParticipation = bill.participants.find(p => 
      p.userId === user?.userId || p.userId === wallet.address
    );
    
    if (!myParticipation) {
      setError('You are not a participant in this bill');
      return;
    }

    if (myParticipation.paid) {
      setError('You have already paid your share');
      return;
    }

    setSelectedBill(bill);
    setPaymentAmount(myParticipation.amount.toString());
    setCurrentView('pay');
    setError(null);
  };

  // Execute payment
  const handleExecutePayment = async () => {
    if (!selectedBill || !paymentAmount || !wallet.address || !user?.userId) {
      setError('Missing payment information');
      return;
    }

    // Validate amount
    if (parseFloat(paymentAmount) > parseFloat(userBalance)) {
      setShowInsufficientBalance(true);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // For demo purposes, we'll simulate payment to the bill creator
      // In a real implementation, this would call the SplitBilling contract
      
      console.log('💸 Paying split bill share...', {
        billId: selectedBill.billId,
        amount: paymentAmount,
        from: wallet.address
      });

      // Simulate contract call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      const mockTxHash = '0xfd' + Math.random().toString(16).substring(2, 64);

      // Update split bill status in backend
      const updateResponse = await fetch(`${CONFIG.BACKEND_URL}${API_ENDPOINTS.SPLIT.UPDATE_STATUS}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          billId: selectedBill.billId,
          participantId: user.userId,
          transactionHash: mockTxHash,
          status: 'paid'
        }),
      });

      if (!updateResponse.ok) {
        console.warn('Failed to update split bill status:', updateResponse.status);
      }

      console.log('✅ Split bill payment successful!');
      onPaymentSuccess(mockTxHash, paymentAmount);
      
      // Refresh the bills list
      loadSplitBills();
      setCurrentView('list');

    } catch (error) {
      console.error('❌ Split bill payment failed:', error);
      setError(error instanceof Error ? error.message : 'Payment failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Go back to previous view
  const handleBack = () => {
    if (currentView === 'details') {
      setCurrentView('list');
      setSelectedBill(null);
    } else if (currentView === 'pay') {
      setCurrentView('details');
    }
    setError(null);
  };

  // Calculate bill statistics
  const getBillStats = (bill: SplitBill) => {
    const totalPaid = bill.participants.filter(p => p.paid).length;
    const totalParticipants = bill.participants.length;
    const amountPaid = bill.participants
      .filter(p => p.paid)
      .reduce((sum, p) => sum + p.amount, 0);
    
    return {
      totalPaid,
      totalParticipants,
      amountPaid,
      remainingAmount: bill.totalAmount - amountPaid,
      isComplete: totalPaid === totalParticipants
    };
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {currentView !== 'list' && (
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
                {currentView === 'list' && 'Split Bills'}
                {currentView === 'details' && 'Bill Details'}
                {currentView === 'pay' && 'Pay Share'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <XMarkIcon className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-96 overflow-y-auto">
          {/* List View */}
          {currentView === 'list' && (
            <div className="space-y-4">
              {isLoading && (
                <div className="text-center py-8">
                  <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  <p className="text-gray-500">Loading split bills...</p>
                </div>
              )}

              {!isLoading && splitBills.length === 0 && (
                <div className="text-center py-8">
                  <ShareIcon className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500">No split bills found</p>
                  <p className="text-gray-400 text-sm">Create a split bill to get started</p>
                </div>
              )}

              {splitBills.map((bill) => {
                const stats = getBillStats(bill);
                const myParticipation = bill.participants.find(p => 
                  p.userId === user?.userId || p.userId === wallet.address
                );

                return (
                  <button
                    key={bill._id}
                    onClick={() => handleBillSelect(bill)}
                    className="w-full p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{bill.description || 'Split Bill'}</h3>
                        <p className="text-sm text-gray-600">
                          {stats.totalPaid}/{stats.totalParticipants} paid • {bill.totalAmount} {bill.currency}
                        </p>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          stats.isComplete 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {stats.isComplete ? 'Complete' : 'Pending'}
                        </span>
                        {myParticipation && (
                          <span className={`mt-1 text-xs ${
                            myParticipation.paid ? 'text-green-600' : 'text-orange-600'
                          }`}>
                            {myParticipation.paid ? 'Paid' : `You owe ${myParticipation.amount} ${bill.currency}`}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <UserIcon className="w-3 h-3" />
                        {bill.participants.length} people
                      </span>
                      <span className="flex items-center gap-1">
                        <ClockIcon className="w-3 h-3" />
                        {new Date(bill.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Details View */}
          {currentView === 'details' && selectedBill && (
            <div className="space-y-6">
              {/* Bill Info */}
              <div className="p-4 bg-gray-50 rounded-lg border">
                <h3 className="font-medium text-gray-900 mb-3">Bill Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Description:</span>
                    <span className="font-medium">{selectedBill.description}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Amount:</span>
                    <span className="font-bold">{selectedBill.totalAmount} {selectedBill.currency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className={`font-medium ${
                      selectedBill.status === 'completed' ? 'text-green-600' : 'text-yellow-600'
                    }`}>
                      {selectedBill.status.charAt(0).toUpperCase() + selectedBill.status.slice(1)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Created:</span>
                    <span className="font-medium">{new Date(selectedBill.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Participants */}
              <div className="space-y-2">
                <h3 className="font-medium text-gray-900">Participants</h3>
                {selectedBill.participants.map((participant, index) => (
                  <div key={index} className="flex justify-between items-center p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        participant.paid ? 'bg-green-100' : 'bg-gray-100'
                      }`}>
                        {participant.paid ? (
                          <CheckCircleIcon className="w-5 h-5 text-green-600" />
                        ) : (
                          <UserIcon className="w-4 h-4 text-gray-600" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-sm">
                          {participant.name || `User ${participant.userId.slice(0, 8)}...`}
                        </div>
                        <div className="text-xs text-gray-500 font-mono">
                          {participant.userId.slice(0, 8)}...{participant.userId.slice(-6)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{participant.amount} {selectedBill.currency}</div>
                      <div className={`text-xs ${participant.paid ? 'text-green-600' : 'text-orange-600'}`}>
                        {participant.paid ? 'Paid' : 'Pending'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Button */}
              {(() => {
                const myParticipation = selectedBill.participants.find(p => 
                  p.userId === user?.userId || p.userId === wallet.address
                );
                
                if (myParticipation && !myParticipation.paid) {
                  return (
                    <button
                      onClick={() => handlePayShare(selectedBill)}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <CurrencyDollarIcon className="w-5 h-5" />
                      Pay My Share ({myParticipation.amount} {selectedBill.currency})
                    </button>
                  );
                }
                
                return null;
              })()}
            </div>
          )}

          {/* Pay View */}
          {currentView === 'pay' && selectedBill && (
            <div className="space-y-6">
              {/* Payment Summary */}
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-medium text-blue-900 mb-3">Payment Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-blue-800">Bill:</span>
                    <span className="font-medium text-blue-900">{selectedBill.description}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-800">Your Share:</span>
                    <span className="font-bold text-blue-900">{paymentAmount} {selectedBill.currency}</span>
                  </div>
                </div>
              </div>

              {/* Balance Check */}
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center justify-between">
                  <span className="text-green-800 font-medium">Your USDT Balance:</span>
                  <span className="text-green-800 font-bold">
                    {loadingBalance ? 'Loading...' : `${userBalance} USDT`}
                  </span>
                </div>
              </div>

              {/* Pay Button */}
              <button
                onClick={handleExecutePayment}
                disabled={isLoading || parseFloat(paymentAmount) > parseFloat(userBalance)}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <CheckCircleIcon className="w-5 h-5" />
                {isLoading ? 'Processing...' : `Pay ${paymentAmount} ${selectedBill.currency}`}
              </button>
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
        requiredAmount={paymentAmount}
        onBalanceUpdated={loadBalance}
      />
    </div>
  );
}