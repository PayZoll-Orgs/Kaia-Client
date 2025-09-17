'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { transferUSDT, getUSDTBalance, TransferResult } from '@/lib/token-service';
import { CONFIG, API_ENDPOINTS } from '@/lib/config';
import { QRCodeCanvas } from 'qrcode.react';
import { Scanner } from '@yudiel/react-qr-scanner';
import { 
  XMarkIcon, 
  QrCodeIcon as QrCodeIconOutline,
  CurrencyDollarIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClipboardDocumentIcon,
  ShareIcon
} from '@heroicons/react/24/outline';
import InsufficientBalanceModal from '@/components/InsufficientBalanceModal';

interface QRPayData {
  type?: string;
  recipientAddress: string;
  recipientName?: string;
  amount?: string;
  currency: 'USDT';
  message?: string;
}

interface User {
  _id?: string;
  userId?: string;
  displayName: string;
  pictureUrl?: string;
  walletAddress: string;
}

interface QRPayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (txHash: string, recipient: User, amount: string) => void;
}

export default function QRPayModal({ isOpen, onClose, onSuccess }: QRPayModalProps) {
  const { user, wallet } = useAuth();
  
  // UI State
  const [mode, setMode] = useState<'scan' | 'generate' | 'pay' | 'processing'>('scan');
  const [scannedData, setScannedData] = useState<QRPayData | null>(null);
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [generateAmount, setGenerateAmount] = useState('');
  const [generateMessage, setGenerateMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Balance checking
  const [userBalance, setUserBalance] = useState<string>('0');
  const [loadingBalance, setLoadingBalance] = useState(false);
  
  // Insufficient balance modal
  const [showInsufficientBalance, setShowInsufficientBalance] = useState(false);
  
  // QR Scanner state
  const [showScanner, setShowScanner] = useState(false);

  // Load user's USDT balance
  const loadBalance = useCallback(async () => {
    if (!wallet.address) return;
    
    setLoadingBalance(true);
    try {
      const balance = await getUSDTBalance(wallet.address);
      setUserBalance(balance.balance);
    } catch (error) {
      console.error('Failed to load balance:', error);
    } finally {
      setLoadingBalance(false);
    }
  }, [wallet.address]);

  // Load balance when modal opens
  useEffect(() => {
    if (isOpen) {
      loadBalance();
      setMode('scan');
      setScannedData(null);
      setAmount('');
      setMessage('');
      setGenerateAmount('');
      setGenerateMessage('');
      setError(null);
      setShowScanner(false);
    }
  }, [isOpen, loadBalance]);

  // Generate QR code data
  const generateQRData = (): QRPayData => {
    return {
      type: 'kaiapay_payment',
      recipientAddress: wallet.address || '',
      recipientName: user?.displayName || 'KaiaPay User',
      amount: generateAmount || '',
      currency: 'USDT',
      message: generateMessage || ''
    };
  };

  // Handle QR code scan
  const handleQRScan = (data: string) => {
    try {
      console.log('QR data scanned:', data);
      
      // Try to parse as JSON
      let parsedData: QRPayData;
      try {
        parsedData = JSON.parse(data);
      } catch {
        // If not JSON, check if it's a wallet address
        if (data.startsWith('0x') && data.length === 42) {
          parsedData = {
            type: 'kaiapay_payment',
            recipientAddress: data,
            currency: 'USDT'
          };
        } else {
          throw new Error('Invalid QR code format');
        }
      }
      
      // Validate data structure
      if (parsedData.type !== 'kaiapay_payment' || !parsedData.recipientAddress) {
        throw new Error('Invalid payment QR code');
      }
      
      // Check if trying to pay yourself
      if (parsedData.recipientAddress.toLowerCase() === wallet.address?.toLowerCase()) {
        throw new Error('Cannot send payment to yourself');
      }
      
      setScannedData(parsedData);
      setAmount(parsedData.amount || '');
      setMessage(parsedData.message || '');
      setMode('pay');
      setShowScanner(false);
      setError(null);
      
    } catch (error) {
      console.error('QR scan error:', error);
      setError(error instanceof Error ? error.message : 'Failed to process QR code');
    }
  };

  // Handle payment amount change
  const handleAmountChange = (value: string) => {
    if (!/^\d*\.?\d*$/.test(value)) return;
    setAmount(value);
    setError(null);
  };

  // Validate payment amount
  const validatePayment = (): boolean => {
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return false;
    }

    if (parseFloat(amount) > parseFloat(userBalance)) {
      setShowInsufficientBalance(true);
      return false;
    }

    return true;
  };

  // Execute QR payment
  const handleQRPayment = async () => {
    if (!scannedData || !amount || !wallet.address || !user?.userId) {
      setError('Missing payment information');
      return;
    }

    if (!validatePayment()) return;

    setMode('processing');
    setError(null);

    try {
      console.log('💸 Executing QR payment...', {
        from: wallet.address,
        to: scannedData.recipientAddress,
        amount: amount
      });

      // Execute the USDT transfer
      const transferResult: TransferResult = await transferUSDT(
        wallet.address,
        scannedData.recipientAddress,
        amount
      );

      if (!transferResult.success) {
        throw new Error(transferResult.error || 'Transfer failed');
      }

      // Record transaction in backend (using P2P endpoint since it's same structure)
      console.log('📝 Recording QR payment transaction...');
      const recordResponse = await fetch(`${CONFIG.BACKEND_URL}${API_ENDPOINTS.P2P.RECORD}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          senderId: user.userId,
          receiverId: scannedData.recipientAddress, // Use address as ID for QR payments
          amount: parseFloat(amount),
          transactionHash: transferResult.transactionHash,
          status: 'completed'
        }),
      });

      if (!recordResponse.ok) {
        console.warn('Failed to record QR payment in backend:', recordResponse.status);
        // Continue anyway since the blockchain transaction succeeded
      }

      console.log('✅ QR payment completed successfully!');
      
      // Create a recipient object for the success callback
      const recipient = {
        displayName: scannedData.recipientName || `Address ${scannedData.recipientAddress.slice(0, 6)}...`,
        walletAddress: scannedData.recipientAddress
      };
      
      onSuccess(transferResult.transactionHash!, recipient, amount);
      onClose();

    } catch (error) {
      console.error('❌ QR payment failed:', error);
      setError(error instanceof Error ? error.message : 'Payment failed');
      setMode('pay'); // Go back to payment step
    }
  };

  // Copy QR data to clipboard
  const copyQRData = async () => {
    try {
      const qrData = JSON.stringify(generateQRData(), null, 2);
      await navigator.clipboard.writeText(qrData);
      // Show temporary success feedback
    } catch (error) {
      console.error('Failed to copy QR data:', error);
    }
  };

  // Share QR data
  const shareQRData = async () => {
    try {
      const qrData = generateQRData();
      const shareText = `Pay me ${qrData.amount ? qrData.amount + ' USDT' : 'with USDT'} on KaiaPay: ${JSON.stringify(qrData)}`;
      
      if (navigator.share) {
        await navigator.share({
          title: 'KaiaPay Payment Request',
          text: shareText
        });
      } else {
        await navigator.clipboard.writeText(shareText);
      }
    } catch (error) {
      console.error('Failed to share QR data:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <QrCodeIconOutline className="w-6 h-6 text-blue-600" />
              QR Pay
            </h2>
            <button
              onClick={onClose}
              disabled={mode === 'processing'}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
            >
              <XMarkIcon className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Mode Selector */}
        {(mode === 'scan' || mode === 'generate') && (
          <div className="p-4 border-b border-gray-200">
            <div className="flex gap-2">
              <button
                onClick={() => setMode('scan')}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                  mode === 'scan'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Scan QR
              </button>
              <button
                onClick={() => setMode('generate')}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                  mode === 'generate'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Generate QR
              </button>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          {/* Scan Mode */}
          {mode === 'scan' && (
            <div className="space-y-4">
              {!showScanner ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <QrCodeIconOutline className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Scan Payment QR</h3>
                  <p className="text-gray-600 mb-6">
                    Scan a QR code to send USDT payment
                  </p>
                  <button
                    onClick={() => setShowScanner(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                  >
                    Open Camera
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative">
                    <Scanner
                      onScan={(result) => {
                        if (result && result.length > 0) {
                          handleQRScan(result[0].rawValue);
                        }
                      }}
                      components={{
                        finder: true
                      }}
                      styles={{
                        container: { 
                          width: '100%',
                          maxWidth: '300px',
                          margin: '0 auto'
                        }
                      }}
                    />
                  </div>
                  <button
                    onClick={() => setShowScanner(false)}
                    className="w-full py-2 px-4 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors text-sm font-medium text-gray-700"
                  >
                    Close Scanner
                  </button>
                  <p className="text-xs text-gray-500 text-center">
                    Position the QR code within the frame to scan
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Generate Mode */}
          {mode === 'generate' && (
            <div className="space-y-4">
              {/* QR Code Display */}
              <div className="text-center">
                <div className="bg-white p-4 rounded-lg border border-gray-200 inline-block">
                  <QRCodeCanvas 
                    value={JSON.stringify(generateQRData())} 
                    size={200}
                    level="M"
                    includeMargin={true}
                  />
                </div>
              </div>

              {/* Generate Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Request Amount (Optional)
                  </label>
                  <div className="relative">
                    <CurrencyDollarIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="0.00"
                      value={generateAmount}
                      onChange={(e) => {
                        if (!/^\d*\.?\d*$/.test(e.target.value)) return;
                        setGenerateAmount(e.target.value);
                      }}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Payment for..."
                    value={generateMessage}
                    onChange={(e) => setGenerateMessage(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={copyQRData}
                    className="flex-1 flex items-center justify-center gap-2 py-2 px-4 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors text-sm font-medium text-gray-700"
                  >
                    <ClipboardDocumentIcon className="w-4 h-4" />
                    Copy
                  </button>
                  <button
                    onClick={shareQRData}
                    className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium text-blue-700"
                  >
                    <ShareIcon className="w-4 h-4" />
                    Share
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Pay Mode */}
          {mode === 'pay' && scannedData && (
            <div className="space-y-6">
              {/* Recipient Info */}
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <QrCodeIconOutline className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {scannedData.recipientName || 'Unknown Recipient'}
                    </div>
                    <div className="text-sm text-gray-600 font-mono">
                      {scannedData.recipientAddress.slice(0, 8)}...{scannedData.recipientAddress.slice(-6)}
                    </div>
                  </div>
                </div>
                {scannedData.message && (
                  <div className="mt-3 p-2 bg-white rounded border border-blue-200">
                    <p className="text-sm text-gray-700">{scannedData.message}</p>
                  </div>
                )}
              </div>

              {/* Balance Display */}
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center justify-between">
                  <span className="text-green-800 font-medium">Your USDT Balance:</span>
                  <span className="text-green-800 font-bold">
                    {loadingBalance ? 'Loading...' : `${userBalance} USDT`}
                  </span>
                </div>
              </div>

              {/* Amount Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount to Pay (USDT)
                </label>
                <div className="relative">
                  <CurrencyDollarIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => handleAmountChange(e.target.value)}
                    disabled={!!scannedData.amount} // Disable if amount is preset
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg disabled:bg-gray-100"
                  />
                </div>
                {scannedData.amount && (
                  <p className="text-xs text-gray-500 mt-1">Amount preset by QR code</p>
                )}
              </div>

              {/* Pay Button */}
              <button
                onClick={handleQRPayment}
                disabled={!amount || parseFloat(amount) <= 0}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <CheckCircleIcon className="w-5 h-5" />
                Pay {amount} USDT
              </button>
            </div>
          )}

          {/* Processing Mode */}
          {mode === 'processing' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Processing Payment...</h3>
              <p className="text-gray-500">
                Please wait while we process your QR payment
              </p>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 text-red-800">
                <ExclamationTriangleIcon className="w-5 h-5" />
                <span className="font-medium">Error</span>
              </div>
              <p className="text-red-700 text-sm mt-1">{error}</p>
            </div>
          )}
        </div>
      </div>

      {/* Insufficient Balance Modal */}
      <InsufficientBalanceModal
        isOpen={showInsufficientBalance}
        onClose={() => setShowInsufficientBalance(false)}
        currentBalance={userBalance}
        requiredAmount={amount}
        onBalanceUpdated={loadBalance}
      />
    </div>
  );
}