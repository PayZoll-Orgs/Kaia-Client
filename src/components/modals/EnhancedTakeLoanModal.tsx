'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import enhancedLendingService, { type BorrowerDashboard, type DebtBreakdown } from '@/lib/enhanced-lending-service';
import { USDT_ADDRESS, KAIA_ADDRESS, USDY_ADDRESS } from '@/lib/contract-addresses';

interface EnhancedTakeLoanModalProps {
  onClose: () => void;
}

export default function EnhancedTakeLoanModal({ onClose }: EnhancedTakeLoanModalProps) {
  const { userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'getLoan' | 'repayLoan'>('getLoan');
  const [collateralAsset, setCollateralAsset] = useState('USDY');
  const [borrowAmount, setBorrowAmount] = useState('');
  const [collateralAmount, setCollateralAmount] = useState('');
  const [repayAmount, setRepayAmount] = useState('');
  const [selectedToken, setSelectedToken] = useState('USDT');
  const [loading, setLoading] = useState(false);
  const [borrowerDashboard, setBorrowerDashboard] = useState<BorrowerDashboard | null>(null);
  const [debtBreakdown, setDebtBreakdown] = useState<DebtBreakdown | null>(null);

  // Token configuration
  const tokens = {
    'USDT': { icon: '💲', address: USDT_ADDRESS(), name: 'USDT' },
    'KAIA': { icon: '🔸', address: KAIA_ADDRESS(), name: 'KAIA' },
    'USDY': { icon: '💎', address: USDY_ADDRESS(), name: 'USDY' }
  };

  // Load borrower information
  useEffect(() => {
    if (userProfile?.walletAddress) {
      loadBorrowerInfo();
    }
  }, [userProfile?.walletAddress]);

  // Load debt breakdown when selected token changes
  useEffect(() => {
    if (userProfile?.walletAddress && activeTab === 'repayLoan') {
      loadDebtBreakdown();
    }
  }, [userProfile?.walletAddress, selectedToken, activeTab]);

  const loadBorrowerInfo = async () => {
    try {
      if (!userProfile?.walletAddress) return;
      
      const dashboard = await enhancedLendingService.getBorrowerDashboard(userProfile.walletAddress);
      setBorrowerDashboard(dashboard);
    } catch (error) {
      console.error('Failed to load borrower info:', error);
    }
  };

  const loadDebtBreakdown = async () => {
    try {
      if (!userProfile?.walletAddress) return;
      
      const tokenAddress = tokens[selectedToken as keyof typeof tokens].address;
      const breakdown = await enhancedLendingService.getDebtBreakdown(userProfile.walletAddress, tokenAddress);
      setDebtBreakdown(breakdown);
    } catch (error) {
      console.error('Failed to load debt breakdown:', error);
    }
  };

  const calculateCollateral = (borrowAmt: string) => {
    const amount = parseFloat(borrowAmt) || 0;
    const collateral = amount / 0.8; // 80% LTV ratio
    setCollateralAmount(collateral.toFixed(2));
  };

  const handleDepositCollateral = async () => {
    try {
      if (!collateralAmount || parseFloat(collateralAmount) <= 0) {
        alert('Please enter a valid collateral amount');
        return;
      }

      setLoading(true);
      
      const txHash = await enhancedLendingService.depositCollateral(collateralAmount);
      
      console.log('✅ Collateral deposit successful:', txHash);
      alert(`Successfully deposited ${collateralAmount} USDY as collateral! Transaction: ${txHash.slice(0, 10)}...`);
      
      await loadBorrowerInfo(); // Refresh data
      
    } catch (error) {
      console.error('❌ Collateral deposit failed:', error);
      alert('Collateral deposit failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBorrow = async () => {
    try {
      if (!borrowAmount || parseFloat(borrowAmount) <= 0) {
        alert('Please enter a valid borrow amount');
        return;
      }

      setLoading(true);
      
      const tokenAddress = tokens[selectedToken as keyof typeof tokens].address;
      const txHash = await enhancedLendingService.borrow(tokenAddress, borrowAmount);
      
      console.log('✅ Borrow successful:', txHash);
      alert(`Successfully borrowed ${borrowAmount} ${selectedToken}! Transaction: ${txHash.slice(0, 10)}...`);
      
      setBorrowAmount('');
      setCollateralAmount('');
      await loadBorrowerInfo(); // Refresh data
      
    } catch (error) {
      console.error('❌ Borrow failed:', error);
      alert('Borrow failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRepay = async () => {
    try {
      if (!repayAmount || parseFloat(repayAmount) <= 0) {
        alert('Please enter a valid repay amount');
        return;
      }

      setLoading(true);
      
      const tokenAddress = tokens[selectedToken as keyof typeof tokens].address;
      const txHash = await enhancedLendingService.repay(tokenAddress, repayAmount);
      
      console.log('✅ Repay successful:', txHash);
      alert(`Successfully repaid ${repayAmount} ${selectedToken}! Transaction: ${txHash.slice(0, 10)}...`);
      
      setRepayAmount('');
      await loadBorrowerInfo(); // Refresh data
      await loadDebtBreakdown(); // Refresh debt data
      
    } catch (error) {
      console.error('❌ Repay failed:', error);
      alert('Repay failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRepayInterest = async () => {
    try {
      setLoading(true);
      
      const tokenAddress = tokens[selectedToken as keyof typeof tokens].address;
      const txHash = await enhancedLendingService.repayInterest(tokenAddress, '0'); // 0 means pay all interest
      
      console.log('✅ Interest repay successful:', txHash);
      alert(`Successfully repaid all interest for ${selectedToken}! Transaction: ${txHash.slice(0, 10)}...`);
      
      await loadBorrowerInfo(); // Refresh data
      await loadDebtBreakdown(); // Refresh debt data
      
    } catch (error) {
      console.error('❌ Interest repay failed:', error);
      alert('Interest repay failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Asset Icon Component
  const AssetIcon = ({ asset }: { asset: string }) => {
    return <span className="text-lg">{tokens[asset as keyof typeof tokens]?.icon || '💰'}</span>;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md mx-4 bg-white rounded-2xl shadow-xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-xl font-bold text-gray-900">Take Loan</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 flex-shrink-0">
          {(['getLoan', 'repayLoan'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 text-sm font-medium ${
                activeTab === tab 
                  ? 'text-green-600 border-b-2 border-green-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab === 'getLoan' ? 'Get Loan' : 'Repay Loan'}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 flex-1 overflow-y-auto hide-scrollbar">
          {activeTab === 'getLoan' && (
            <div className="space-y-4">
              {/* Borrower Dashboard */}
              {borrowerDashboard && (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-900 mb-3">Your Position</h4>
                  <div className="text-sm text-blue-800 space-y-2">
                    <div className="flex justify-between">
                      <span>Total Collateral:</span>
                      <span className="font-medium">${parseFloat(borrowerDashboard.totalCollateralUSD).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Debt:</span>
                      <span className="font-medium">${parseFloat(borrowerDashboard.totalDebtUSD).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Current LTV:</span>
                      <span className={`font-medium ${parseFloat(borrowerDashboard.currentLTV) > 75 ? 'text-red-600' : 'text-green-600'}`}>
                        {parseFloat(borrowerDashboard.currentLTV).toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Max LTV:</span>
                      <span className="font-medium">80%</span>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Collateral Asset</label>
                <select 
                  value={collateralAsset}
                  onChange={(e) => setCollateralAsset(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  disabled={loading}
                >
                  <option value="USDY">💎 USDY</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Borrow Token</label>
                <select 
                  value={selectedToken}
                  onChange={(e) => setSelectedToken(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  disabled={loading}
                >
                  <option value="USDT">💲 USDT</option>
                  <option value="KAIA">🔸 KAIA</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount to Borrow ({selectedToken})</label>
                <input
                  type="number"
                  value={borrowAmount}
                  onChange={(e) => {
                    setBorrowAmount(e.target.value);
                    calculateCollateral(e.target.value);
                  }}
                  placeholder="Enter borrow amount"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Required Collateral</label>
                <input
                  type="number"
                  value={collateralAmount}
                  onChange={(e) => setCollateralAmount(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50"
                  placeholder="Collateral will be calculated"
                  disabled={loading}
                />
                <p className="text-xs text-gray-500 mt-1">LTV Ratio: 80% (You can borrow up to 80% of collateral value)</p>
              </div>

              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-blue-800">Interest Rate: 5% APR</p>
                <p className="text-xs text-blue-600 mt-1">Competitive rates for your loan</p>
              </div>

              <div className="space-y-2">
                <button 
                  onClick={handleDepositCollateral}
                  disabled={loading || !collateralAmount || parseFloat(collateralAmount) <= 0}
                  className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
                  ) : (
                    `Deposit ${collateralAmount || '0'} USDY Collateral`
                  )}
                </button>

                <button 
                  onClick={handleBorrow}
                  disabled={loading || !borrowAmount || parseFloat(borrowAmount) <= 0}
                  className="w-full bg-green-500 text-white py-3 rounded-lg font-medium hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
                  ) : (
                    `Borrow ${borrowAmount || '0'} ${selectedToken}`
                  )}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'repayLoan' && (
            <div className="space-y-4">
              {/* Token Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Token to Repay</label>
                <select 
                  value={selectedToken}
                  onChange={(e) => setSelectedToken(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  disabled={loading}
                >
                  <option value="USDT">💲 USDT</option>
                  <option value="KAIA">🔸 KAIA</option>
                </select>
              </div>

              {/* Debt Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Current Debt - {selectedToken}</h3>
                {debtBreakdown ? (
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Principal:</span>
                      <span className="font-medium">{parseFloat(debtBreakdown.principal).toFixed(2)} {selectedToken}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Interest Accrued:</span>
                      <span className="font-medium text-red-600">{parseFloat(debtBreakdown.accrued).toFixed(4)} {selectedToken}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="text-gray-600 font-semibold">Total to Repay:</span>
                      <span className="font-bold text-lg">{parseFloat(debtBreakdown.total).toFixed(2)} {selectedToken}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Interest Rate:</span>
                      <span className="font-medium">{debtBreakdown.currentInterestRate}% APR</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <div className="w-6 h-6 border-2 border-gray-300 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    <p className="text-gray-500 text-sm">Loading debt info...</p>
                  </div>
                )}
              </div>

              {/* Repay Amount Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount to Repay</label>
                <input
                  type="number"
                  value={repayAmount}
                  onChange={(e) => setRepayAmount(e.target.value)}
                  placeholder="Enter repay amount"
                  max={debtBreakdown ? parseFloat(debtBreakdown.total) : 0}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  disabled={loading}
                />
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <button 
                  onClick={handleRepayInterest}
                  disabled={loading || !debtBreakdown || parseFloat(debtBreakdown.accrued) <= 0}
                  className="w-full bg-yellow-500 text-white py-3 rounded-lg font-medium hover:bg-yellow-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
                  ) : (
                    `Pay Interest Only (${debtBreakdown ? parseFloat(debtBreakdown.accrued).toFixed(4) : '0'} ${selectedToken})`
                  )}
                </button>

                <button 
                  onClick={handleRepay}
                  disabled={loading || !repayAmount || parseFloat(repayAmount) <= 0}
                  className="w-full bg-green-500 text-white py-3 rounded-lg font-medium hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
                  ) : (
                    `Repay ${repayAmount || '0'} ${selectedToken}`
                  )}
                </button>

                {debtBreakdown && parseFloat(debtBreakdown.total) > 0 && (
                  <button 
                    onClick={() => {
                      setRepayAmount(debtBreakdown.total);
                      handleRepay();
                    }}
                    disabled={loading}
                    className="w-full bg-red-500 text-white py-3 rounded-lg font-medium hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
                    ) : (
                      `Repay Full Debt (${parseFloat(debtBreakdown.total).toFixed(2)} ${selectedToken})`
                    )}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}