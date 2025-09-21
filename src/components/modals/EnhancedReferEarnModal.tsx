'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import enhancedLendingService, { type ReferralInfo } from '@/lib/enhanced-lending-service';
import { DocumentDuplicateIcon, ShareIcon } from '@heroicons/react/24/outline';

interface EnhancedReferEarnModalProps {
  onClose: () => void;
}

export default function EnhancedReferEarnModal({ onClose }: EnhancedReferEarnModalProps) {
  const { userProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [referralInfo, setReferralInfo] = useState<ReferralInfo | null>(null);
  const [referralCode, setReferralCode] = useState('');
  const [referrerAddress, setReferrerAddress] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  // Generate user's referral code based on their profile
  const generateReferralCode = () => {
    if (userProfile?.displayName) {
      const name = userProfile.displayName.replace(/\s+/g, '').toUpperCase();
      const timestamp = Date.now().toString().slice(-4);
      return `${name}_${timestamp}`;
    }
    return `USER_${Date.now().toString().slice(-6)}`;
  };

  const referralLink = `https://kaiapay.app/join?ref=${referralCode}&referrer=${userProfile?.walletAddress}`;

  // Load referral information
  useEffect(() => {
    if (userProfile?.walletAddress) {
      loadReferralInfo();
    }
  }, [userProfile?.walletAddress]);

  const loadReferralInfo = async () => {
    try {
      if (!userProfile?.walletAddress) return;
      
      const info = await enhancedLendingService.getReferralInfo(userProfile.walletAddress);
      setReferralInfo(info);
      
      // If user hasn't registered a code yet, generate one
      if (!info.isRegistered) {
        setReferralCode(generateReferralCode());
      }
    } catch (error) {
      console.error('Failed to load referral info:', error);
    }
  };

  const handleRegisterReferralCode = async () => {
    try {
      if (!referralCode.trim()) {
        alert('Please enter a referral code');
        return;
      }

      setLoading(true);
      
      const txHash = await enhancedLendingService.registerReferralCode(referralCode.trim());
      
      console.log('✅ Referral code registered:', txHash);
      alert(`Successfully registered referral code! Transaction: ${txHash.slice(0, 10)}...`);
      
      await loadReferralInfo(); // Refresh data
      
    } catch (error) {
      console.error('❌ Referral code registration failed:', error);
      alert('Failed to register referral code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinWithReferral = async () => {
    try {
      if (!referralCode.trim() || !referrerAddress.trim()) {
        alert('Please enter both referral code and referrer address');
        return;
      }

      setLoading(true);
      
      const txHash = await enhancedLendingService.joinWithReferral(referralCode.trim(), referrerAddress.trim());
      
      console.log('✅ Joined with referral:', txHash);
      alert(`Successfully joined with referral! Transaction: ${txHash.slice(0, 10)}...`);
      
      await loadReferralInfo(); // Refresh data
      
    } catch (error) {
      console.error('❌ Join with referral failed:', error);
      alert('Failed to join with referral. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClaimRewards = async () => {
    try {
      setLoading(true);
      
      const txHash = await enhancedLendingService.claimReferralRewards();
      
      console.log('✅ Rewards claimed:', txHash);
      alert(`Successfully claimed referral rewards! Transaction: ${txHash.slice(0, 10)}...`);
      
      await loadReferralInfo(); // Refresh data
      
    } catch (error) {
      console.error('❌ Claim rewards failed:', error);
      alert('Failed to claim rewards. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(referralCode);
      alert('Referral code copied to clipboard!');
    } catch (err) {
      console.error("Failed to copy referral code:", err);
      alert('Failed to copy referral code');
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      alert('Referral link copied to clipboard!');
    } catch (err) {
      console.error("Failed to copy referral link:", err);
      alert('Failed to copy referral link');
    }
  };

  const handleShareLink = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Join KaiaPay and Earn Rewards!',
          text: `Join KaiaPay using my referral code "${referralCode}" and get a 2 USDT bonus!`,
          url: referralLink
        });
      } else {
        // Fallback to copying
        await handleCopyLink();
      }
    } catch (err) {
      console.error("Failed to share referral link:", err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md mx-4 bg-white rounded-2xl shadow-xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-xl font-bold text-gray-900">Refer & Earn</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 overflow-y-auto hide-scrollbar">
          <div className="space-y-6">
            
            {/* Earnings Summary */}
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h3 className="font-medium text-green-900 mb-3">Your Referral Earnings</h3>
              {referralInfo ? (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-green-700">Total Referrals:</span>
                    <span className="font-medium">{referralInfo.totalReferrals}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-700">Total Earned:</span>
                    <span className="font-bold text-lg">{parseFloat(referralInfo.totalRewardsEarned).toFixed(2)} USDT</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-700">Available to Claim:</span>
                    <span className="font-medium text-green-800">{parseFloat(referralInfo.claimableRewards).toFixed(2)} USDT</span>
                  </div>
                  {referralInfo.hasReferrer && (
                    <div className="text-xs text-green-600 mt-2">
                      ✅ You joined with a referral and received your signup bonus!
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-4">
                  <div className="w-6 h-6 border-2 border-green-300 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  <p className="text-green-700 text-sm">Loading earnings...</p>
                </div>
              )}
            </div>

            {/* Registration Section */}
            {referralInfo && !referralInfo.isRegistered && (
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-900 mb-3">Register Your Referral Code</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-blue-700 mb-1">Your Referral Code</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={referralCode}
                        onChange={(e) => setReferralCode(e.target.value)}
                        className="flex-1 p-2 border border-blue-300 rounded text-sm font-mono"
                        placeholder="Enter your referral code"
                        disabled={loading}
                      />
                      <button
                        onClick={handleRegisterReferralCode}
                        disabled={loading || !referralCode.trim()}
                        className="px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          'Register'
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Join with Referral Section */}
            {referralInfo && !referralInfo.hasReferrer && (
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <h4 className="font-medium text-orange-900 mb-3">Join with a Referral Code</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-orange-700 mb-1">Referral Code</label>
                    <input
                      type="text"
                      value={referralCode}
                      onChange={(e) => setReferralCode(e.target.value)}
                      className="w-full p-2 border border-orange-300 rounded text-sm"
                      placeholder="Enter friend's referral code"
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-orange-700 mb-1">Referrer Address</label>
                    <input
                      type="text"
                      value={referrerAddress}
                      onChange={(e) => setReferrerAddress(e.target.value)}
                      className="w-full p-2 border border-orange-300 rounded text-sm font-mono"
                      placeholder="0x..."
                      disabled={loading}
                    />
                  </div>
                  <button
                    onClick={handleJoinWithReferral}
                    disabled={loading || !referralCode.trim() || !referrerAddress.trim()}
                    className="w-full bg-orange-600 text-white py-2 rounded text-sm font-medium hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
                    ) : (
                      'Join with Referral (Get 2 USDT Bonus!)'
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Referral Code Sharing (only if registered) */}
            {referralInfo && referralInfo.isRegistered && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Your Referral Code</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={referralCode}
                      readOnly
                      className="flex-1 p-3 border border-gray-300 rounded-lg bg-gray-50 font-mono"
                    />
                    <button
                      onClick={handleCopyCode}
                      className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      <DocumentDuplicateIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Referral Link</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={referralLink}
                      readOnly
                      className="flex-1 p-3 border border-gray-300 rounded-lg bg-gray-50 text-xs"
                    />
                    <button
                      onClick={handleCopyLink}
                      className="p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      <ShareIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Referral Program Info */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-900 mb-2">How it works:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Earn 5 USDT for each successful referral</li>
                <li>• Your friend gets 2 USDT signup bonus</li>
                <li>• Earn 0.1% of their transaction volume</li>
                <li>• No limit on number of referrals</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button 
                onClick={handleClaimRewards}
                disabled={loading || !referralInfo || parseFloat(referralInfo.claimableRewards) <= 0}
                className="w-full bg-green-500 text-white py-3 rounded-lg font-medium hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
                ) : (
                  `Claim Earnings (${referralInfo ? parseFloat(referralInfo.claimableRewards).toFixed(2) : '0'} USDT)`
                )}
              </button>
              
              {referralInfo && referralInfo.isRegistered && (
                <button 
                  onClick={handleShareLink}
                  className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors"
                >
                  Share on Social Media
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}