"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthCallback } from '@/contexts/AuthContext';
import LoadingScreen from '@/components/LoadingScreen';

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { handleCallback } = useAuthCallback();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string>('');
  const [processed, setProcessed] = useState<boolean>(false);

  useEffect(() => {
    // Prevent processing the same callback multiple times
    if (processed) {
      return;
    }

    const processCallback = async () => {
      try {
        // Mark as processing immediately
        setProcessed(true);
        
        // Get parameters from URL
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const error = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');

        // Handle error from LINE
        if (error) {
          setError(errorDescription || error);
          setStatus('error');
          return;
        }

        // Validate required parameters
        if (!code || !state) {
          setError('Invalid callback parameters');
          setStatus('error');
          return;
        }

        // Handle the callback
        await handleCallback(code, state);
        
        setStatus('success');
        
        // Redirect to home page after a short delay
        setTimeout(() => {
          router.replace('/home');
        }, 1000);

      } catch (error) {
        setError(error instanceof Error ? error.message : 'Authentication failed');
        setStatus('error');
      }
    };

    processCallback();
  }, [searchParams, handleCallback, router, processed]);

  if (status === 'loading') {
    return <LoadingScreen message="Processing authentication..." />;
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Authentication Successful!</h2>
          <p className="text-gray-500">Redirecting to your dashboard...</p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 5h2v6h-2zm0 8h2v2h-2z"/>
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Authentication Failed</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <button
              onClick={() => router.push('/')}
              className="w-full px-6 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => window.location.reload()}
              className="w-full px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}