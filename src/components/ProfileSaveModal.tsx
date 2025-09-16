'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { CONFIG, API_ENDPOINTS, UserSchema } from '@/lib/config';
import { UserIcon, PhotoIcon, ChatBubbleBottomCenterTextIcon, WalletIcon } from '@heroicons/react/24/outline';

interface ProfileSaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (profileData: UserSchema) => void;
}

export default function ProfileSaveModal({ isOpen, onClose, onSave }: ProfileSaveModalProps) {
  const { user, wallet } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form state matching backend UserSchema exactly
  const [profileData, setProfileData] = useState<UserSchema>({
    userId: user?.userId || '', // Use lineUserId as userId for backend
    displayName: user?.displayName || '',
    pictureUrl: user?.pictureUrl || '',
    statusMessage: '',
    walletAddress: wallet.address || '',
    lineUserId: user?.userId || ''
  });

  // Update form when user/wallet data changes
  useEffect(() => {
    setProfileData(prev => ({
      ...prev,
      userId: user?.userId || prev.userId, // Use lineUserId as userId
      displayName: user?.displayName || prev.displayName,
      pictureUrl: user?.pictureUrl || prev.pictureUrl,
      walletAddress: wallet.address || prev.walletAddress,
      lineUserId: user?.userId || prev.lineUserId
    }));
  }, [user, wallet.address]);

  // Check if user exists when modal opens
  useEffect(() => {
    const checkExistingUser = async () => {
      if (!isOpen || !user?.userId) return;

      try {
        const lineUserId = user.userId; // This is actually the LINE user ID
        console.log('🔍 Checking if user exists with lineUserId:', lineUserId);

        // Use lineUserId as userId for backend search
        const response = await fetch(`${CONFIG.BACKEND_URL}${API_ENDPOINTS.AUTH.GET_USER}/${lineUserId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const existingUser = await response.json();
          console.log('✅ Found existing user, pre-filling form:', existingUser);
          
          setProfileData({
            userId: existingUser.userId,
            displayName: existingUser.displayName || '',
            pictureUrl: existingUser.pictureUrl || '',
            statusMessage: existingUser.statusMessage || '',
            walletAddress: existingUser.walletAddress || wallet.address || '',
            lineUserId: existingUser.lineUserId || ''
          });

          // User exists, auto-complete the flow
          onSave(existingUser);
          onClose();
        } else {
          console.log('ℹ️ User not found, showing profile form for new user');
        }
      } catch (error) {
        console.log('ℹ️ Could not check existing user (this is normal for new users):', error);
      }
    };

    checkExistingUser();
  }, [isOpen, user?.userId, wallet.address, onSave, onClose]);

  const handleInputChange = (field: keyof UserSchema, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    if (!user?.userId) {
      setError('LINE user ID is required. Please make sure you are logged in through LINE.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('🔄 Creating new user profile with lineUserId as userId:', profileData);

      const profileToSave = {
        ...profileData,
        userId: user.userId, // Use lineUserId as userId for backend
        displayName: profileData.displayName || user?.displayName || 'Anonymous User',
        walletAddress: wallet.address || '',
        lineUserId: user.userId // Same as userId
      };

      // Create new user
      const response = await fetch(`${CONFIG.BACKEND_URL}${API_ENDPOINTS.AUTH.ADD_USER}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileToSave),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to save profile' }));
        throw new Error(errorData.error || `HTTP ${response.status}: Failed to save profile`);
      }

      const savedProfile = await response.json();
      console.log('✅ Profile created successfully:', savedProfile);

      // Call parent callback with saved data
      onSave(savedProfile);
      onClose();

    } catch (error) {
      console.error('❌ Failed to save profile:', error);
      setError(error instanceof Error ? error.message : 'Failed to save profile');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 text-center">Complete Your Profile</h2>
          <p className="text-gray-600 text-center mt-2">
            Set up your profile to get started with KaiaPay
          </p>
        </div>

        {/* Form */}
        <div className="p-6 space-y-6">
          {/* LINE User ID (Read-only) */}
          {user?.userId && (
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <UserIcon className="w-4 h-4" />
                LINE User ID
              </label>
              <div className="w-full px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg font-mono text-sm text-blue-800">
                {user.userId}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Your unique LINE identifier used for your KaiaPay account
              </p>
            </div>
          )}

          {/* Display Name */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <UserIcon className="w-4 h-4" />
              Display Name
            </label>
            <input
              type="text"
              value={profileData.displayName || ''}
              onChange={(e) => handleInputChange('displayName', e.target.value)}
              placeholder="Enter your display name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Profile Picture URL */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <PhotoIcon className="w-4 h-4" />
              Profile Picture URL (Optional)
            </label>
            <input
              type="url"
              value={profileData.pictureUrl || ''}
              onChange={(e) => handleInputChange('pictureUrl', e.target.value)}
              placeholder="https://example.com/your-photo.jpg"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {profileData.pictureUrl && (
              <div className="mt-2">
                <img
                  src={profileData.pictureUrl}
                  alt="Profile preview"
                  className="w-16 h-16 rounded-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          {/* Status Message */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <ChatBubbleBottomCenterTextIcon className="w-4 h-4" />
              Status Message (Optional)
            </label>
            <textarea
              value={profileData.statusMessage || ''}
              onChange={(e) => handleInputChange('statusMessage', e.target.value)}
              placeholder="What's on your mind?"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Wallet Address (Read-only) */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <WalletIcon className="w-4 h-4" />
              Wallet Address
            </label>
            <div className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg font-mono text-sm text-gray-600">
              {profileData.walletAddress || 'No wallet connected'}
            </div>
          </div>

          {/* LINE User ID (Hidden/Read-only) */}
          {profileData.lineUserId && (
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                LINE User ID
              </label>
              <div className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg font-mono text-sm text-gray-600">
                {profileData.lineUserId}
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            Skip for now
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading || !profileData.displayName?.trim() || !profileData.userId}
            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              'Save Profile'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}