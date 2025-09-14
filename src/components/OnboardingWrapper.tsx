'use client';

import { useAuth } from '@/contexts/AuthContext';
import Onboarding from '@/components/Onboarding';

interface OnboardingWrapperProps {
  children: React.ReactNode;
}

export default function OnboardingWrapper({ children }: OnboardingWrapperProps) {
  const { isAuthenticated, needsOnboarding, completeOnboarding, isLoading } = useAuth();

  // Debug logging
  console.log('🎯 OnboardingWrapper state:', {
    isAuthenticated,
    needsOnboarding,
    isLoading,
    shouldShowOnboarding: isAuthenticated && needsOnboarding
  });

  // Show loading while auth is initializing
  if (isLoading) {
    console.log('⏳ Auth still loading, showing spinner');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show onboarding if user is authenticated but needs onboarding
  if (isAuthenticated && needsOnboarding) {
    console.log('🚀 Showing onboarding UI');
    return <Onboarding onComplete={completeOnboarding} />;
  }

  // Otherwise, show the regular app content
  console.log('📱 Showing regular app content');
  return <>{children}</>;
}
