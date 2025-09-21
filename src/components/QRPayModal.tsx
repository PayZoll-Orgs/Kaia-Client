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

interface BackendUser {
  _id: string;
  userId: string;
  displayName: string;
  pictureUrl?: string;
  walletAddress: string;
  lineUserId: string;
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
  
  // User management
  const [allUsers, setAllUsers] = useState<BackendUser[]>([]);
  const [recipientUser, setRecipientUser] = useState<BackendUser | null>(null);
  
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

  // Fetch all users for recipient lookup
  const fetchAllUsers = useCallback(async () => {
    try {
      console.log('🔍 Fetching all users from backend...');
      const response = await fetch(`${CONFIG.BACKEND_URL}${API_ENDPOINTS.AUTH.GET_ALL_USERS}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const users = await response.json();
        console.log('📋 Retrieved users:', users.length);
        setAllUsers(users);
      } else {
        console.error('Failed to fetch users:', response.status);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }, []);

  // Find recipient by wallet address
  const findRecipientByWallet = (walletAddress: string): BackendUser | null => {
    return allUsers.find(user => 
      user.walletAddress?.toLowerCase() === walletAddress.toLowerCase()
    ) || null;
  };

  // Load balance when modal opens
  useEffect(() => {
    if (isOpen) {
      loadBalance();
      fetchAllUsers();
      setMode('scan');
      setScannedData(null);
      setRecipientUser(null);
      setAmount('');
      setMessage('');
      setGenerateAmount('');
      setGenerateMessage('');
      setError(null);
      setShowScanner(false);
    }
  }, [isOpen, loadBalance, fetchAllUsers]);

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
      console.log('🔍 QR data scanned:', data);
      
      let parsedData: QRPayData;
      let foundRecipient: BackendUser | null = null;
      
      // Try to parse as JSON first (generated QR codes)
      try {
        const jsonData = JSON.parse(data);
        
        // Check if it's our generated QR format
        if (jsonData.type === 'kaiapay_payment' && jsonData.recipientAddress) {
          parsedData = jsonData;
          console.log('✅ Parsed as generated QR code:', parsedData);
          
          // Find recipient in our user database
          foundRecipient = findRecipientByWallet(parsedData.recipientAddress);
          console.log('🔍 Found recipient:', foundRecipient);
        } else {
          throw new Error('Invalid QR code format');
        }
      } catch (jsonError) {
        // If not JSON, check if it's just a wallet address
        if (data.startsWith('0x') && data.length === 42) {
          parsedData = {
            type: 'wallet_address',
            recipientAddress: data,
            currency: 'USDT'
          };
          console.log('✅ Parsed as wallet address:', parsedData);
          
          // Find recipient in our user database
          foundRecipient = findRecipientByWallet(data);
          console.log('🔍 Found recipient:', foundRecipient);
        } else {
          throw new Error('Invalid QR code format. Please scan a valid payment QR or wallet address.');
        }
      }
      
      // Validate recipient address
      if (!parsedData.recipientAddress) {
        throw new Error('Invalid QR code: No recipient address found');
      }
      
      // Check if trying to pay yourself
      if (parsedData.recipientAddress.toLowerCase() === wallet.address?.toLowerCase()) {
        throw new Error('Cannot send payment to yourself');
      }
      
      // Set the scanned data and recipient
      setScannedData(parsedData);
      setRecipientUser(foundRecipient);
      setAmount(parsedData.amount || '');
      setMessage(parsedData.message || '');
      setMode('pay');
      setShowScanner(false);
      setError(null);
      
      console.log('✅ QR scan successful, moving to pay mode');
      
    } catch (error) {
      console.error('❌ QR scan error:', error);
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

      // Record transaction in backend (same as PayAnyone)
      console.log('📝 Recording QR payment transaction...');
      
      // Get current user's userId from allUsers (same logic as PayAnyone)
      const currentUser = allUsers.find(u => u.lineUserId === user?.userId);
      const senderUserId = currentUser?.userId || user?.userId; // fallback to LINE userId if not found
      
      console.log('✅ Using backend userId as senderId:', senderUserId);
      
      // If we have a recipient user in our database, use their userId, otherwise use wallet address
      const receiverId = recipientUser?.userId || scannedData.recipientAddress;
      
      console.log('✅ Using receiverId:', receiverId);

      const recordResponse = await fetch(`${CONFIG.BACKEND_URL}${API_ENDPOINTS.P2P.RECORD}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          senderId: senderUserId,
          receiverId: receiverId,
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
        displayName: recipientUser?.displayName || scannedData.recipientName || `Address ${scannedData.recipientAddress.slice(0, 6)}...`,
        walletAddress: scannedData.recipientAddress,
        userId: recipientUser?.userId
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

  // Download QR code as image
  const downloadQRCode = () => {
    try {
      const canvas = document.querySelector('canvas') as HTMLCanvasElement;
      if (canvas) {
        const url = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `kaiapay-qr-${Date.now()}.png`;
        link.href = url;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error('Failed to download QR code:', error);
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
              <QrCodeIconOutline className="w-6 h-6 text-green-600" />
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
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Scan QR
              </button>
              <button
                onClick={() => setMode('generate')}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                  mode === 'generate'
                    ? 'bg-green-600 text-white'
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
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <QrCodeIconOutline className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Scan Payment QR</h3>
                  <p className="text-gray-600 mb-6">
                    Scan a QR code to send USDT payment
                  </p>
                  <button
                    onClick={() => setShowScanner(true)}
                    className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                  >
                    Open Camera
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative">
                    <Scanner
                      onScan={(result) => {
                        console.log('📷 Scanner result:', result);
                        if (result && result.length > 0) {
                          const scannedText = result[0].rawValue;
                          console.log('📋 Scanned text:', scannedText);
                          handleQRScan(scannedText);
                        }
                      }}
                      onError={(error) => {
                        console.error('📷 Scanner error:', error);
                        setError('Camera error. Please try again.');
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
                      scanDelay={100}
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
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={copyQRData}
                    className="flex items-center justify-center gap-1 py-2 px-3 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors text-xs font-medium text-gray-700"
                  >
                    <ClipboardDocumentIcon className="w-4 h-4" />
                    Copy
                  </button>
                  <button
                    onClick={downloadQRCode}
                    className="flex items-center justify-center gap-1 py-2 px-3 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors text-xs font-medium text-green-700"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download
                  </button>
                  <button
                    onClick={shareQRData}
                    className="flex items-center justify-center gap-1 py-2 px-3 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors text-xs font-medium text-green-700"
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
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-3">
                  {recipientUser ? (
                    // Show user avatar if we found them in our database
                    <div className="w-12 h-12 rounded-full bg-gray-100 overflow-hidden">
                      <img
                        src={recipientUser.pictureUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(recipientUser.displayName)}&background=random`}
                        alt={recipientUser.displayName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    // Show QR icon for unknown recipients
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                      <QrCodeIconOutline className="w-6 h-6 text-green-600" />
                    </div>
                  )}
                  <div>
                    <div className="font-medium text-gray-900">
                      {recipientUser?.displayName || scannedData.recipientName || 'Unknown Recipient'}
                    </div>
                    {recipientUser && (
                      <div className="text-sm text-gray-500">@{recipientUser.userId}</div>
                    )}
                    <div className="text-sm text-gray-600 font-mono">
                      {scannedData.recipientAddress.slice(0, 8)}...{scannedData.recipientAddress.slice(-6)}
                    </div>
                    {!recipientUser && (
                      <div className="text-xs text-orange-600 mt-1">
                        ⚠️ External wallet (not in our network)
                      </div>
                    )}
                  </div>
                </div>
                {scannedData.message && (
                  <div className="mt-3 p-2 bg-white rounded border border-blue-200">
                    <p className="text-sm text-gray-700">{scannedData.message}</p>
                  </div>
                )}
                {scannedData.type === 'wallet_address' && (
                  <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded">
                    <p className="text-xs text-yellow-800">
                      💡 Wallet address detected. Enter the amount you want to send.
                    </p>
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