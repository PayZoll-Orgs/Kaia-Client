"use client";
import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from '@headlessui/react';
import { LIFFAuth } from '@/lib/line-auth';
import { useAuth } from '@/contexts/AuthContext';

interface LIFFQRScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onScan: (result: string) => void;
}

export default function LIFFQRScanner({ isOpen, onClose, onScan }: LIFFQRScannerProps) {
  const { isInLineApp } = useAuth();
  const [error, setError] = useState<string>("");
  const [isScanning, setIsScanning] = useState<boolean>(false);
  
  // Debug LINE app detection
  useEffect(() => {
    if (isOpen) {
      console.log('🔍 LIFFQRScanner Debug:', {
        isInLineApp,
        userAgent: navigator.userAgent,
        hasLiff: typeof window !== 'undefined' && 'liff' in window,
        currentURL: window.location.href
      });
      
      // Additional debugging for LINE detection
      const isLINEUserAgent = navigator.userAgent.includes('Line');
      const isLIFFUserAgent = navigator.userAgent.includes('LIFF');
      console.log('🔍 UserAgent checks:', {
        isLINEUserAgent,
        isLIFFUserAgent,
        fullUserAgent: navigator.userAgent
      });
    }
  }, [isOpen, isInLineApp]);

  const handleLIFFScan = async () => {
    // For debugging purposes, let's try the scan even if detection fails
    console.log('🔍 Attempting QR scan, isInLineApp:', isInLineApp);
    
    if (!isInLineApp) {
      console.warn('⚠️ LINE app not detected, but attempting scan anyway for debugging');
      // setError("QR scanning is only available in LINE app");
      // return;
    }

    setIsScanning(true);
    setError("");

    try {
      console.log('🚀 Attempting to call LIFFAuth.scanQRCode()...');
      
      // Check if LIFF is available
      if (typeof window !== 'undefined' && 'liff' in window) {
        console.log('✅ LIFF object found in window');
      } else {
        console.warn('⚠️ LIFF object not found in window');
      }
      
      const result = await LIFFAuth.scanQRCode();
      console.log('📱 QR scan completed, result:', result);
      
      if (result) {
        console.log('✅ QR scan successful:', result);
        onScan(result);
        onClose();
      } else {
        console.log('ℹ️ QR scan cancelled or no result');
        onClose();
      }
    } catch (error: unknown) {
      console.error('❌ LIFF QR scan error:', error);
      console.error('🔍 Error details:', {
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : 'No stack trace'
      });
      
      // Handle different error cases
      const err = error as { code?: string; message?: string };
      if (err.code === 'UNAUTHORIZED') {
        setError("Camera permission denied");
      } else if (err.code === 'INTERNAL_ERROR') {
        setError("QR scanning failed. Please try again.");
      } else if (err.message?.includes('not available')) {
        setError("QR scanning not available in this environment");
      } else if (err.message?.includes('not initialized')) {
        setError("LIFF not properly initialized");
      } else {
        setError(`Failed to scan QR code: ${err.message || 'Unknown error'}`);
      }
    } finally {
      setIsScanning(false);
    }
  };

  const handleWebFallback = () => {
    // For web browsers, we could implement a web-based scanner
    // or redirect to open in LINE
    setError("QR scanning requires LINE app. Please open this page in LINE browser.");
  };

  useEffect(() => {
    if (isOpen) {
      setError("");
      setIsScanning(false);
    }
  }, [isOpen]);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 mb-4">
                  QR Code Scanner
                </Dialog.Title>

                <div className="mt-2">
                  <div className="text-center">
                    <div className="w-32 h-32 mx-auto mb-6 bg-gray-100 rounded-2xl flex items-center justify-center">
                      <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                      </svg>
                    </div>
                    
                    {!isInLineApp && (
                      <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-yellow-800 text-sm">
                          LINE app detection: {isInLineApp ? 'Detected' : 'Not detected'}
                        </p>
                        <p className="text-yellow-700 text-xs mt-1">
                          Attempting scan anyway for debugging...
                        </p>
                      </div>
                    )}
                    
                    <p className="text-gray-600 mb-6">
                      {isInLineApp 
                        ? "Tap the button below to open LINE's QR code scanner"
                        : "Attempting to access QR scanner (debug mode)"
                      }
                    </p>

                    <button
                      onClick={handleLIFFScan}
                      disabled={isScanning}
                      className={`w-full ${isInLineApp ? 'bg-green-500 hover:bg-green-600' : 'bg-orange-500 hover:bg-orange-600'} disabled:bg-gray-300 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center space-x-2`}
                    >
                      {isScanning ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Opening Scanner...</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                          </svg>
                          <span>{isInLineApp ? 'Scan QR Code' : 'Try QR Scan (Debug)'}</span>
                        </>
                      )}
                    </button>
                  </div>

                  {error && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-800 text-sm">{error}</p>
                    </div>
                  )}
                </div>

                <div className="mt-6">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-xl border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
