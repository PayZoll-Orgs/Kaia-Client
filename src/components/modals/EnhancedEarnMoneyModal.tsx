'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import enhancedLendingService, { type LenderInfo } from '@/lib/enhanced-lending-service';
import { USDT_ADDRESS, KAIA_ADDRESS } from '@/lib/contract-addresses';

interface EnhancedEarnMoneyModalProps {
  onClose: () => void;
}

export default function EnhancedEarnMoneyModal({ onClose }: EnhancedEarnMoneyModalProps) {
  const { userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'lend' | 'claim' | 'withdraw'>('lend');
  const [selectedAsset, setSelectedAsset] = useState('USDT');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [lenderInfo, setLenderInfo] = useState<LenderInfo | null>(null);

  // Asset configuration
  const assets = useMemo(() => ({
    'USDT': { icon: '💲', address: USDT_ADDRESS(), name: 'USDT' },
    'KAIA': { icon: '🔸', address: KAIA_ADDRESS(), name: 'KAIA' }
  }), []);

  const loadLenderInfo = useCallback(async () => {
    try {
      if (!userProfile?.walletAddress) return;
      
      const tokenAddress = assets[selectedAsset as keyof typeof assets].address;
      const info = await enhancedLendingService.getLenderInfo(userProfile.walletAddress, tokenAddress);
      setLenderInfo(info);
    } catch (error) {
      console.error('Failed to load lender info:', error);
    }
  }, [userProfile?.walletAddress, selectedAsset, assets]);

  // Load lender information
  useEffect(() => {
    if (userProfile?.walletAddress) {
      loadLenderInfo();
    }
  }, [userProfile?.walletAddress, loadLenderInfo]);

  const handleLend = async () => {
    try {
      if (!amount || parseFloat(amount) <= 0) {
        alert('Please enter a valid amount');
        return;
      }

      setLoading(true);
      
      const tokenAddress = assets[selectedAsset as keyof typeof assets].address;
      const txHash = await enhancedLendingService.deposit(tokenAddress, amount);
      
      console.log('✅ Lending successful:', txHash);
      alert(`Successfully lent ${amount} ${selectedAsset}! Transaction: ${txHash.slice(0, 10)}...`);
      
      setAmount('');
      await loadLenderInfo(); // Refresh data
      
    } catch (error) {
      console.error('❌ Lending failed:', error);
      alert('Lending failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClaimEarnings = async () => {
    try {
      setLoading(true);
      
      const tokenAddress = assets[selectedAsset as keyof typeof assets].address;
      const txHash = await enhancedLendingService.claimLendingEarnings(tokenAddress);
      
      console.log('✅ Claim successful:', txHash);
      alert(`Successfully claimed earnings! Transaction: ${txHash.slice(0, 10)}...`);
      
      await loadLenderInfo(); // Refresh data
      
    } catch (error) {
      console.error('❌ Claim failed:', error);
      alert('Claim failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Asset Icon Component
  const AssetIcon = ({ asset }: { asset: string }) => {
    return <span className="text-lg">{assets[asset as keyof typeof assets]?.icon || '💰'}</span>;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md mx-4 bg-white rounded-2xl shadow-xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-xl font-bold text-gray-900">Earn Money</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 flex-shrink-0">
          {(['lend', 'claim', 'withdraw'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 text-sm font-medium capitalize ${
                activeTab === tab 
                  ? 'text-green-600 border-b-2 border-green-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 flex-1 overflow-y-auto hide-scrollbar">
          {activeTab === 'lend' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Asset</label>
                <select 
                  value={selectedAsset}
                  onChange={(e) => setSelectedAsset(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  disabled={loading}
                >
                  <option value="USDT">💲 USDT</option>
                  <option value="KAIA">🔸 KAIA</option>
                </select>
              </div>

              {/* Current Position */}
              {lenderInfo && (
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-900 mb-2">Current Position</h4>
                  <div className="text-sm text-blue-800 space-y-1">
                    <div className="flex justify-between">
                      <span>Total Deposited:</span>
                      <span className="font-medium">{parseFloat(lenderInfo.totalDeposited).toFixed(2)} {selectedAsset}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Current Earnings:</span>
                      <span className="font-medium text-green-600">{parseFloat(lenderInfo.currentEarnings).toFixed(4)} {selectedAsset}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>APY:</span>
                      <span className="font-medium">{(lenderInfo.projectedAPY / 100).toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount to Lend</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  disabled={loading}
                />
              </div>

              <div className="bg-green-50 p-3 rounded-lg">
                <p className="text-sm text-green-800">Expected APY: 8.5%</p>
                <p className="text-xs text-green-600 mt-1">Earn rewards by lending your assets</p>
              </div>

              <button 
                onClick={handleLend}
                disabled={loading || !amount || parseFloat(amount) <= 0}
                className="w-full bg-green-500 text-white py-3 rounded-lg font-medium hover:bg-green-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <AssetIcon asset={selectedAsset} />
                    Lend {selectedAsset}
                  </>
                )}
              </button>
            </div>
          )}

          {activeTab === 'claim' && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Your Earnings</h3>
                
                {/* Asset Selection for Claim */}
                <div className="mb-3">
                  <select 
                    value={selectedAsset}
                    onChange={(e) => setSelectedAsset(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                    disabled={loading}
                  >
                    <option value="USDT">💲 USDT</option>
                    <option value="KAIA">🔸 KAIA</option>
                  </select>
                </div>

                <div className="space-y-2">
                  {lenderInfo ? (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 flex items-center gap-2">
                          <AssetIcon asset={selectedAsset} />
                          Total Deposited:
                        </span>
                        <span className="font-medium">{parseFloat(lenderInfo.totalDeposited).toFixed(2)} {selectedAsset}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 flex items-center gap-2">
                          <span>🎯</span>
                          Current Earnings:
                        </span>
                        <span className="font-medium text-green-600">{parseFloat(lenderInfo.currentEarnings).toFixed(4)} {selectedAsset}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 flex items-center gap-2">
                          <span>💰</span>
                          Claimable:
                        </span>
                        <span className="font-bold text-green-700">{parseFloat(lenderInfo.claimableEarnings).toFixed(4)} {selectedAsset}</span>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-4">
                      <div className="w-6 h-6 border-2 border-gray-300 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                      <p className="text-gray-500 text-sm">Loading earnings...</p>
                    </div>
                  )}
                </div>
              </div>

              <button 
                onClick={handleClaimEarnings}
                disabled={loading || !lenderInfo || parseFloat(lenderInfo.claimableEarnings) <= 0}
                className="w-full bg-green-500 text-white py-3 rounded-lg font-medium hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
                ) : (
                  `Claim ${lenderInfo ? parseFloat(lenderInfo.claimableEarnings).toFixed(4) : '0'} ${selectedAsset}`
                )}
              </button>
            </div>
          )}

          {activeTab === 'withdraw' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Asset to Withdraw</label>
                <select 
                  value={selectedAsset}
                  onChange={(e) => setSelectedAsset(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  disabled={loading}
                >
                  <option value="USDT">
                    💲 USDT (Available: {lenderInfo ? parseFloat(lenderInfo.lpTokenBalance).toFixed(2) : '0'})
                  </option>
                  <option value="KAIA">
                    🔸 KAIA (Available: {lenderInfo ? parseFloat(lenderInfo.lpTokenBalance).toFixed(2) : '0'})
                  </option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount to Withdraw</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  max={lenderInfo ? parseFloat(lenderInfo.lpTokenBalance) : 0}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  disabled={loading}
                />
              </div>
              <button 
                disabled={loading || !amount || parseFloat(amount) <= 0}
                className="w-full bg-red-500 text-white py-3 rounded-lg font-medium hover:bg-red-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <AssetIcon asset={selectedAsset} />
                    Withdraw Funds
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}