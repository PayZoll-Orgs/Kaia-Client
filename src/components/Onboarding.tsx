'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { WalletIcon, CheckCircleIcon, ArrowRightIcon, SparklesIcon, UserIcon } from '@heroicons/react/24/outline';
import ProfileSaveModal from '@/components/ProfileSaveModal';
import { UserSchema } from '@/lib/config';

interface OnboardingProps {
  onComplete: () => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const { user, wallet, connectWallet } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isConnecting, setIsConnecting] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  console.log('🎯 Onboarding component rendered!', {
    currentStep,
    isConnecting,
    walletConnected: wallet.isConnected,
    walletAddress: wallet.address
  });

  // Check if user already has a wallet
  useEffect(() => {
    if (wallet.isConnected && wallet.address) {
      console.log('✅ User already has wallet, moving to profile setup');
      // User already has a wallet, move to profile setup
      setCurrentStep(3);
    }
  }, [wallet.isConnected, wallet.address]);

  const handleWalletSetup = async () => {
    setIsConnecting(true);
    try {
      console.log('🚀 Starting wallet onboarding...');
      console.log('💡 DappPortal will show wallet creation UI');
      
      const address = await connectWallet();
      
      if (address) {
        console.log('✅ Wallet setup completed during onboarding:', address);
        setCurrentStep(3); // Move to profile setup step
      }
    } catch (error) {
      console.error('❌ Wallet setup failed during onboarding:', error);
      setIsConnecting(false);
      
      // Check for specific error types
      if (error && typeof error === 'object' && 'code' in error) {
        const rpcError = error as { code: number; message: string };
        if (rpcError.code === -32603) {
          alert('⚠️ Wallet service not available. Please contact support.\n\nError: CLIENT_ID not authorized for wallet operations.');
        }
      }
    }
  };

  const handleProfileSave = (profileData: UserSchema) => {
    console.log('✅ Profile saved successfully:', profileData);
    setCurrentStep(4); // Move to completion step
    
    // Auto-complete onboarding after a short delay
    setTimeout(() => {
      onComplete();
    }, 2000);
  };

  const steps = [
    {
      title: "Welcome to KaiaPay!",
      description: "Let's get you set up with a secure wallet on the Kaia network.",
      icon: SparklesIcon,
    },
    {
      title: "Create Your Wallet",
      description: "We'll help you create a secure wallet to manage your digital assets.",
      icon: WalletIcon,
    },
    {
      title: "Set Up Your Profile",
      description: "Complete your profile to personalize your KaiaPay experience.",
      icon: UserIcon,
    },
    {
      title: "You're All Set!",
      description: "Welcome to KaiaPay! You&apos;re ready to start sending and receiving payments.",
      icon: CheckCircleIcon,
    }
  ];

  const currentStepData = steps[currentStep - 1];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            {steps.map((_, index) => (
              <div key={index} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  index + 1 <= currentStep 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {index + 1 <= currentStep ? (
                    index + 1 < currentStep ? (
                      <CheckCircleIcon className="w-5 h-5" />
                    ) : (
                      index + 1
                    )
                  ) : (
                    index + 1
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-12 h-0.5 mx-2 ${
                    index + 1 < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-600 text-center">
            Step {currentStep} of {steps.length}
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Icon */}
          <div className="mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
              <currentStepData.icon className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          {/* Title & Description */}
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {currentStepData.title}
          </h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            {currentStepData.description}
          </p>

          {/* User Info */}
          {user && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600">Logged in as:</p>
              <p className="font-medium text-gray-900">{user.displayName}</p>
            </div>
          )}

          {/* Action Buttons */}
          {currentStep === 1 && (
            <button
              onClick={() => setCurrentStep(2)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              Get Started
              <ArrowRightIcon className="w-5 h-5" />
            </button>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <button
                onClick={handleWalletSetup}
                disabled={isConnecting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isConnecting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creating Wallet...
                  </>
                ) : (
                  <>
                    <WalletIcon className="w-5 h-5" />
                    Create My Wallet
                  </>
                )}
              </button>
              
              <p className="text-xs text-gray-500">
                This will open a secure interface to create your wallet
              </p>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              {wallet.address && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-2 text-green-800">
                    <CheckCircleIcon className="w-5 h-5" />
                    <span className="font-medium">Wallet Ready!</span>
                  </div>
                  <p className="text-sm text-green-700 mt-2 font-mono">
                    {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
                  </p>
                </div>
              )}
              
              <button
                onClick={() => setShowProfileModal(true)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <UserIcon className="w-5 h-5" />
                Set Up Profile
              </button>
              
              <button
                onClick={() => setCurrentStep(4)}
                className="w-full text-gray-600 hover:text-gray-800 font-medium py-2 px-4 rounded-xl transition-colors"
              >
                Skip Profile Setup
              </button>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-green-800">
                  <CheckCircleIcon className="w-5 h-5" />
                  <span className="font-medium">Setup Complete!</span>
                </div>
                <p className="text-sm text-green-700 mt-2">
                  You&apos;re ready to start using KaiaPay
                </p>
              </div>
              
              <button
                onClick={onComplete}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                Continue to App
                <ArrowRightIcon className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Skip Option (only on first step) */}
        {currentStep === 1 && (
          <div className="mt-6 text-center">
            <button
              onClick={onComplete}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Skip for now
            </button>
          </div>
        )}
      </div>

      {/* Profile Save Modal */}
      <ProfileSaveModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        onSave={handleProfileSave}
      />
    </div>
  );
}
