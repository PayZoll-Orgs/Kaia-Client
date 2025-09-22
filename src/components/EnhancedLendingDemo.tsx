'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import enhancedLendingService, { 
  type LenderInfo, 
  type BorrowerDashboard, 
  type DebtBreakdown, 
  type ReferralInfo 
} from '@/lib/enhanced-lending-service';
import { USDT_ADDRESS, KAIA_ADDRESS, USDY_ADDRESS } from '@/lib/contract-addresses';

interface EnhancedLendingDemoProps {
  onClose?: () => void;
}

export default function EnhancedLendingDemo({ onClose }: EnhancedLendingDemoProps) {
  const { userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'lend' | 'borrow' | 'collateral' | 'referral'>('dashboard');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  // State for different operations
  const [lendAmount, setLendAmount] = useState('');
  const [borrowAmount, setBorrowAmount] = useState('');
  const [collateralAmount, setCollateralAmount] = useState('');
  const [repayAmount, setRepayAmount] = useState('');
  const [referralCode, setReferralCode] = useState('');
  
  // Dashboard data
  const [lenderInfo, setLenderInfo] = useState<LenderInfo | null>(null);
  const [borrowerDashboard, setBorrowerDashboard] = useState<BorrowerDashboard | null>(null);
  const [debtBreakdown, setDebtBreakdown] = useState<DebtBreakdown | null>(null);
  const [referralInfo, setReferralInfo] = useState<ReferralInfo | null>(null);

  // Load all dashboard data
  const loadDashboardData = useCallback(async () => {
    if (!userProfile?.walletAddress) return;
    
    setLoading(true);
    try {
      // Load lender info for USDT
      const lenderData = await enhancedLendingService.getLenderInfo(
        userProfile.walletAddress, 
        USDT_ADDRESS()
      );
      setLenderInfo(lenderData);

      // Load borrower dashboard
      const borrowerData = await enhancedLendingService.getBorrowerDashboard(
        userProfile.walletAddress
      );
      setBorrowerDashboard(borrowerData);

      // Load debt breakdown for USDT
      const debtData = await enhancedLendingService.getDebtBreakdown(
        userProfile.walletAddress,
        USDT_ADDRESS()
      );
      setDebtBreakdown(debtData);

      // Load referral info
      const referralData = await enhancedLendingService.getReferralInfo(
        userProfile.walletAddress
      );
      setReferralInfo(referralData);

      setMessage('Dashboard data loaded successfully!');
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      setMessage('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, [userProfile?.walletAddress]);

  // Load dashboard data on component mount
  useEffect(() => {
    if (userProfile?.walletAddress) {
      loadDashboardData();
    }
  }, [userProfile?.walletAddress, loadDashboardData]);

  // Handle lending operations
  const handleLend = async () => {
    if (!lendAmount || parseFloat(lendAmount) <= 0) {
      setMessage('Please enter a valid lending amount');
      return;
    }

    setLoading(true);
    try {
      const txHash = await enhancedLendingService.lend(USDT_ADDRESS(), lendAmount);
      setMessage(`Lending successful! Tx: ${txHash}`);
      setLendAmount('');
      await loadDashboardData(); // Refresh dashboard
    } catch (error) {
      console.error('Lending failed:', error);
      setMessage('Lending failed: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Handle borrowing operations
  const handleBorrow = async () => {
    if (!borrowAmount || parseFloat(borrowAmount) <= 0) {
      setMessage('Please enter a valid borrow amount');
      return;
    }

    setLoading(true);
    try {
      const txHash = await enhancedLendingService.borrow(USDT_ADDRESS(), borrowAmount);
      setMessage(`Borrowing successful! Tx: ${txHash}`);
      setBorrowAmount('');
      await loadDashboardData(); // Refresh dashboard
    } catch (error) {
      console.error('Borrowing failed:', error);
      setMessage('Borrowing failed: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Handle collateral deposit
  const handleDepositCollateral = async () => {
    if (!collateralAmount || parseFloat(collateralAmount) <= 0) {
      setMessage('Please enter a valid collateral amount');
      return;
    }

    setLoading(true);
    try {
      const txHash = await enhancedLendingService.depositCollateral(collateralAmount);
      setMessage(`Collateral deposit successful! Tx: ${txHash}`);
      setCollateralAmount('');
      await loadDashboardData(); // Refresh dashboard
    } catch (error) {
      console.error('Collateral deposit failed:', error);
      setMessage('Collateral deposit failed: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Handle loan repayment
  const handleRepay = async () => {
    if (!repayAmount || parseFloat(repayAmount) <= 0) {
      setMessage('Please enter a valid repayment amount');
      return;
    }

    setLoading(true);
    try {
      const txHash = await enhancedLendingService.repay(USDT_ADDRESS(), repayAmount);
      setMessage(`Repayment successful! Tx: ${txHash}`);
      setRepayAmount('');
      await loadDashboardData(); // Refresh dashboard
    } catch (error) {
      console.error('Repayment failed:', error);
      setMessage('Repayment failed: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Handle referral code registration
  const handleRegisterReferral = async () => {
    if (!referralCode.trim()) {
      setMessage('Please enter a referral code');
      return;
    }

    setLoading(true);
    try {
      const txHash = await enhancedLendingService.registerReferralCode(referralCode);
      setMessage(`Referral code registered! Tx: ${txHash}`);
      setReferralCode('');
      await loadDashboardData(); // Refresh dashboard
    } catch (error) {
      console.error('Referral registration failed:', error);
      setMessage('Referral registration failed: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (value: string | number) => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return num.toFixed(2);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Enhanced Lending Protocol - Live Demo</h2>
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          )}
        </div>

        {/* Status Message */}
        {message && (
          <div className="p-4 bg-blue-50 border-l-4 border-blue-400">
            <p className="text-blue-700">{message}</p>
          </div>
        )}

        {/* Tabs */}
        <div className="border-b">
          <nav className="flex space-x-8 px-6">
            {[
              { key: 'dashboard', label: '📊 Dashboard' },
              { key: 'lend', label: '🏦 Lend' },
              { key: 'borrow', label: '💳 Borrow' },
              { key: 'collateral', label: '🔒 Collateral' },
              { key: 'referral', label: '👥 Referral' }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as 'dashboard' | 'lend' | 'borrow' | 'collateral' | 'referral')}
                className={`py-4 px-2 border-b-2 font-medium text-sm ${
                  activeTab === tab.key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Dashboard Overview</h3>
                <button
                  onClick={loadDashboardData}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? '🔄 Loading...' : '🔄 Refresh'}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Lender Info */}
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">🏦 Lender Info</h4>
                  {lenderInfo ? (
                    <div className="space-y-1 text-sm">
                      <p>Total Supplied: {formatNumber(lenderInfo.totalSupplied)} USDT</p>
                      <p>Earned Interest: {formatNumber(lenderInfo.earnedInterest)} USDT</p>
                      <p>LP Token Balance: {formatNumber(lenderInfo.lpTokenBalance)} kUSDT</p>
                      <p>Projected APY: {formatNumber(lenderInfo.projectedAPY)}%</p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">Loading...</p>
                  )}
                </div>

                {/* Borrower Info */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">💳 Borrower Info</h4>
                  {borrowerDashboard ? (
                    <div className="space-y-1 text-sm">
                      <p>Total Collateral: ${formatNumber(borrowerDashboard.totalCollateralUSD)}</p>
                      <p>Total Debt: ${formatNumber(borrowerDashboard.totalDebtUSD)}</p>
                      <p>Current LTV: {formatNumber(borrowerDashboard.currentLTV)}%</p>
                      <p>Health Factor: {borrowerDashboard.healthFactor}</p>
                      <p>Risk Level: <span className={`capitalize ${
                        borrowerDashboard.liquidationRisk === 'high' ? 'text-red-600' :
                        borrowerDashboard.liquidationRisk === 'medium' ? 'text-yellow-600' : 'text-green-600'
                      }`}>{borrowerDashboard.liquidationRisk}</span></p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">Loading...</p>
                  )}
                </div>

                {/* Debt Breakdown */}
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-yellow-800 mb-2">📋 Debt Breakdown</h4>
                  {debtBreakdown ? (
                    <div className="space-y-1 text-sm">
                      <p>Principal: {formatNumber(debtBreakdown.principal)} USDT</p>
                      <p>Accrued Interest: {formatNumber(debtBreakdown.accrued)} USDT</p>
                      <p>Total Debt: {formatNumber(debtBreakdown.total)} USDT</p>
                      <p>Interest Rate: {formatNumber(debtBreakdown.currentInterestRate)}%</p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">Loading...</p>
                  )}
                </div>

                {/* Referral Info */}
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-purple-800 mb-2">👥 Referral Info</h4>
                  {referralInfo ? (
                    <div className="space-y-1 text-sm">
                      <p>Registered: {referralInfo.isRegistered ? '✅ Yes' : '❌ No'}</p>
                      <p>Total Referrals: {referralInfo.totalReferrals}</p>
                      <p>Total Earned: {formatNumber(referralInfo.totalEarned)} USDT</p>
                      <p>Claimable Rewards: {formatNumber(referralInfo.claimableRewards)} USDT</p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">Loading...</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Lend Tab */}
          {activeTab === 'lend' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">🏦 Lend USDT and Earn Interest</h3>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Amount to Lend (USDT)
                    </label>
                    <input
                      type="number"
                      value={lendAmount}
                      onChange={(e) => setLendAmount(e.target.value)}
                      placeholder="Enter amount..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button
                    onClick={handleLend}
                    disabled={loading}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                  >
                    {loading ? 'Processing...' : '🏦 Lend USDT'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Borrow Tab */}
          {activeTab === 'borrow' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">💳 Borrow Against USDY Collateral</h3>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Amount to Borrow (USDT)
                    </label>
                    <input
                      type="number"
                      value={borrowAmount}
                      onChange={(e) => setBorrowAmount(e.target.value)}
                      placeholder="Enter amount..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button
                    onClick={handleBorrow}
                    disabled={loading}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading ? 'Processing...' : '💳 Borrow USDT'}
                  </button>
                </div>
              </div>

              {/* Repayment Section */}
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-semibold text-yellow-800 mb-4">💸 Repay Loan</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Repayment Amount (USDT)
                    </label>
                    <input
                      type="number"
                      value={repayAmount}
                      onChange={(e) => setRepayAmount(e.target.value)}
                      placeholder="Enter amount..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button
                    onClick={handleRepay}
                    disabled={loading}
                    className="w-full px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50"
                  >
                    {loading ? 'Processing...' : '💸 Repay Loan'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Collateral Tab */}
          {activeTab === 'collateral' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">🔒 Manage USDY Collateral</h3>
              <div className="bg-indigo-50 p-4 rounded-lg">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      USDY Collateral Amount
                    </label>
                    <input
                      type="number"
                      value={collateralAmount}
                      onChange={(e) => setCollateralAmount(e.target.value)}
                      placeholder="Enter USDY amount..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button
                    onClick={handleDepositCollateral}
                    disabled={loading}
                    className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {loading ? 'Processing...' : '🔒 Deposit USDY Collateral'}
                  </button>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">
                  💡 <strong>Note:</strong> USDY represents real-world assets and is used as collateral for borrowing. 
                  You can use the faucet to get USDY tokens for testing.
                </p>
              </div>
            </div>
          )}

          {/* Referral Tab */}
          {activeTab === 'referral' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">👥 Referral System</h3>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Referral Code
                    </label>
                    <input
                      type="text"
                      value={referralCode}
                      onChange={(e) => setReferralCode(e.target.value)}
                      placeholder="Enter your referral code..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button
                    onClick={handleRegisterReferral}
                    disabled={loading}
                    className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                  >
                    {loading ? 'Processing...' : '👥 Register Referral Code'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-4 border-t text-center">
          <p className="text-sm text-gray-600">
            🌐 <strong>Live on Kaia Testnet</strong> | All transactions are real and recorded on blockchain
          </p>
        </div>
      </div>
    </div>
  );
}