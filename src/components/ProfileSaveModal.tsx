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
  const [userIdAvailability, setUserIdAvailability] = useState<'unchecked' | 'checking' | 'available' | 'taken'>('unchecked');
  const [userIdCheckTimeout, setUserIdCheckTimeout] = useState<NodeJS.Timeout | null>(null);
  
  // Form state matching backend UserSchema exactly
  const [profileData, setProfileData] = useState<UserSchema>({
    username: '', // Empty initially, user will enter custom username
    displayName: user?.displayName || '',
    pictureUrl: user?.pictureUrl || '',
    statusMessage: '',
    walletAddress: wallet.address || '',
    userId: user?.userId || '' // LINE user ID from SDK
  });

  // Update form when user/wallet data changes
  useEffect(() => {
    setProfileData(prev => ({
      ...prev,
      userId: user?.userId || prev.userId, // LINE user ID from SDK
      displayName: user?.displayName || prev.displayName,
      pictureUrl: user?.pictureUrl || prev.pictureUrl,
      walletAddress: wallet.address || prev.walletAddress
    }));
  }, [user?.userId, user?.displayName, user?.pictureUrl, wallet.address]);

  // Check if user exists when modal opens
  useEffect(() => {
    const checkExistingUser = async () => {
      if (!isOpen || !user?.userId) return;

      try {
        const lineUserId = user.userId; // LINE user ID from SDK
        console.log('🔍 Checking if lineUserId exists in database:', lineUserId);

        // Use direct getUser API endpoint with LINE user ID
        const response = await fetch(`${CONFIG.BACKEND_URL}${API_ENDPOINTS.AUTH.GET_USER}/${lineUserId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          // User exists with this LINE user ID
          const existingUser = await response.json();
          console.log('✅ Found existing user with this lineUserId, auto-login:', existingUser);
          console.log('🔄 Calling onSave and onClose for existing user');
          
          // User exists, pre-fill and auto-complete
          setProfileData({
            username: existingUser.username, // Their custom username
            displayName: existingUser.displayName || '',
            pictureUrl: existingUser.pictureUrl || '',
            statusMessage: existingUser.statusMessage || '',
            walletAddress: existingUser.walletAddress || wallet.address || '',
            userId: existingUser.userId || lineUserId // LINE user ID
          });

          // Auto-login existing user
          console.log('📤 Triggering onSave callback with existing user data');
          onSave(existingUser);
          console.log('📤 Triggering onClose to close modal');
          onClose();
          return;
        } else if (response.status === 404) {
          console.log('ℹ️ LineUserId not found in database (404), user needs to register');
          console.log('📋 Modal should stay open for new user registration');
          // Reset form for new user registration
          setProfileData(prev => ({
            ...prev,
            username: '', // Empty so user can enter custom username
            userId: lineUserId, // Set the LINE user ID from SDK
            displayName: user?.displayName || '',
            pictureUrl: user?.pictureUrl || '',
            walletAddress: wallet.address || ''
          }));
          console.log('✅ Profile form ready for new user input');
        } else {
          console.error('❌ Failed to fetch user from backend:', response.status);
          // Fallback: assume new user
          setProfileData(prev => ({
            ...prev,
            username: '', // Empty so user can enter custom username
            userId: lineUserId, // LINE user ID from SDK
            displayName: user?.displayName || '',
            pictureUrl: user?.pictureUrl || '',
            walletAddress: wallet.address || ''
          }));
        }
      } catch (error) {
        console.error('❌ Error checking existing user:', error);
        // Fallback: assume new user
        const lineUserId = user?.userId || '';
        setProfileData(prev => ({
          ...prev,
          username: '', // Empty for new user to enter custom username
          userId: lineUserId, // LINE user ID from SDK
          displayName: user?.displayName || '',
          pictureUrl: user?.pictureUrl || '',
          walletAddress: wallet.address || ''
        }));
      }
    };

    checkExistingUser();
  }, [isOpen, user?.userId, wallet.address, onSave, onClose]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (userIdCheckTimeout) {
        clearTimeout(userIdCheckTimeout);
      }
    };
  }, [userIdCheckTimeout]);

  // Check username availability with debouncing
  const checkUsernameAvailability = async (username: string) => {
    if (!username || username.length < 3) {
      setUserIdAvailability('unchecked');
      return;
    }

    setUserIdAvailability('checking');

    try {
      const response = await fetch(`${CONFIG.BACKEND_URL}${API_ENDPOINTS.AUTH.GET_USER}/${username}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // User exists, username is taken
        setUserIdAvailability('taken');
      } else if (response.status === 404) {
        // User not found, username is available
        setUserIdAvailability('available');
      } 
    } catch (error) {
      console.error('Error checking username availability:', error);
      setUserIdAvailability('available');
    }
  };

  const handleInputChange = (field: keyof UserSchema, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));

    // Special handling for username - check availability with debouncing
    if (field === 'username') {
      // Clear existing timeout
      if (userIdCheckTimeout) {
        clearTimeout(userIdCheckTimeout);
      }

      // Set new timeout for debounced checking
      const timeout = setTimeout(() => {
        checkUsernameAvailability(value);
      }, 500); // 500ms debounce

      setUserIdCheckTimeout(timeout);
    }
  };

  const handleSave = async () => {
    if (!user?.userId) {
      setError('LINE user ID is required. Please make sure you are logged in through LINE.');
      return;
    }

    if (!profileData.username || profileData.username.trim().length < 3) {
      setError('Please enter a valid Username (minimum 3 characters)');
      return;
    }

    if (userIdAvailability !== 'available') {
      setError('Please choose an available Username');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('🔄 Creating new user profile:', profileData);

      const profileToSave = {
        username: profileData.username.trim(), // Custom username chosen by user
        displayName: profileData.displayName || user?.displayName || 'Anonymous User',
        pictureUrl: profileData.pictureUrl || user?.pictureUrl || '',
        statusMessage: profileData.statusMessage || '',
        walletAddress: wallet.address || '',
        userId: user.userId // LINE user ID for notifications
      };

      console.log('📤 Sending profile to backend:', profileToSave);

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

  if (!isOpen) {
    console.log('❌ ProfileSaveModal not open, returning null');
    return null;
  }

  console.log('✅ ProfileSaveModal is open, rendering modal');

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
                Your unique LINE identifier (used internally)
              </p>
            </div>
          )}

          {/* Custom Username */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <UserIcon className="w-4 h-4" />
              Choose Your Username *
            </label>
            <div className="relative">
              <input
                type="text"
                value={profileData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  userIdAvailability === 'available' ? 'border-green-500 bg-green-50' :
                  userIdAvailability === 'taken' ? 'border-red-500 bg-red-50' :
                  'border-gray-300'
                }`}
                placeholder="e.g., johndoe123"
                disabled={isLoading}
                minLength={3}
                maxLength={30}
                required
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                {userIdAvailability === 'checking' && (
                  <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                )}
                {userIdAvailability === 'available' && (
                  <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
                {userIdAvailability === 'taken' && (
                  <svg className="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </div>
            </div>
            <div className="mt-1">
              {userIdAvailability === 'available' && (
                <p className="text-xs text-green-600">✅ This Username is available!</p>
              )}
              {userIdAvailability === 'taken' && (
                <p className="text-xs text-red-600">❌ This Username is already taken</p>
              )}
              {userIdAvailability === 'checking' && (
                <p className="text-xs text-blue-600">🔍 Checking availability...</p>
              )}
              {userIdAvailability === 'unchecked' && (
                <p className="text-xs text-gray-500">Your unique username for KaiaPay (minimum 3 characters)</p>
              )}
            </div>
          </div>

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

          {/* LINE User ID (Hidden Debug Info) */}
          {user?.userId && (
            <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
              <strong>Debug:</strong> LINE ID: {user.userId}
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