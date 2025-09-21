"use client";
import { useState, useEffect, useCallback } from "react";
import { QrCodeIcon, UserIcon, ShareIcon, DocumentDuplicateIcon } from "@heroicons/react/24/outline";
import { useAuth, BackendUser } from "@/contexts/AuthContext";
import { LineFriend } from "@/lib/line-auth";
import LIFFQRScanner from "@/components/LIFFQRScanner";
import PayAnyoneModal from "@/components/PayAnyoneModal";
import QRPayModal from "@/components/QRPayModal";
import SplitBillModal, { SplitBillData } from "@/components/SplitBillModal";
import BulkPaymentModal, { BulkPaymentData } from "@/components/BulkPaymentModal";
import PayAnyonePopup from "@/components/PayAnyonePopup";
import PastInteractionPopup from "@/components/PastInteractionPopup";
import SplitBillPopup from "@/components/SplitBillPopup";
import FriendsPopup from "@/components/FriendsPopup";
import EnhancedEarnMoneyModal from "@/components/modals/EnhancedEarnMoneyModal";
import EnhancedTakeLoanModal from "@/components/modals/EnhancedTakeLoanModal";
import EnhancedReferEarnModal from "@/components/modals/EnhancedReferEarnModal";
import { CONFIG } from "@/lib/config";

interface TransactionDetail {
  _id: string;
  transactionType: 'P2P' | 'Bulk Transfer' | 'Split Payment';
  userRole: 'sender' | 'receiver' | 'payee' | 'contributor';
  amount?: number;
  totalAmount?: number;
  userAmount?: number;
  description?: string;
  title?: string;
  transactionHash: string;
  createdAt: string;
  userPaymentStatus?: boolean;
  deadline?: string;
  // Original transaction data
  senderId?: string;
  receiverId?: string;
  receiverIds?: string[];
  amounts?: number[];
  payeeId?: string;
  contributorIds?: string[];
  status?: Array<{ contributorId: string; paid: boolean }> | string;
}

interface Contact {
  id: string;
  name: string;
  walletAddress: string;
  profilePhoto: string;
  phoneNumber: string;
}

interface TransactionDetail {
  _id: string;
  transactionType: 'P2P' | 'Bulk Transfer' | 'Split Payment';
  userRole: 'sender' | 'receiver' | 'payee' | 'contributor';
  amount?: number;
  totalAmount?: number;
  userAmount?: number;
  description?: string;
  title?: string;
  transactionHash: string;
  createdAt: string;
  userPaymentStatus?: boolean;
  deadline?: string;
  senderId?: string;
  receiverId?: string;
  receiverIds?: string[];
  amounts?: number[];
  payeeId?: string;
  contributorIds?: string[];
  status?: Array<{ contributorId: string; paid: boolean }> | string;
}

interface RecentPerson {
  userId: string;
  displayName: string;
  pictureUrl?: string;
  lastTransactionDate: string;
  transactionCount: number;
}

interface HomePageProps {
  onTabChange?: (tab: 'home' | 'history' | 'portfolio') => void;
}

export default function HomePage({ onTabChange }: HomePageProps = {}) {
  const { user, userProfile, friends, logout } = useAuth();
  const [showQRScanner, setShowQRScanner] = useState(false);

  // User and transaction state
  const [allUsers, setAllUsers] = useState<BackendUser[]>([]);
  const [currentUserProfile, setCurrentUserProfile] = useState<BackendUser | null>(null);
  const [transactions, setTransactions] = useState<TransactionDetail[]>([]);
  const [recentPeople, setRecentPeople] = useState<RecentPerson[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPersonTransactions, setSelectedPersonTransactions] = useState<TransactionDetail[]>([]);
  const [selectedPerson, setSelectedPerson] = useState<RecentPerson | null>(null);
  const [showPersonTransactions, setShowPersonTransactions] = useState(false);

  // Debug: Log when userProfile changes
  console.log('🏠 HomePage - User Profile:', userProfile);
  const [showQRPay, setShowQRPay] = useState(false);
  const [showPayAnyone, setShowPayAnyone] = useState(false);
  const [showPayAnyoneModal, setShowPayAnyoneModal] = useState(false);
  const [showPastInteraction, setShowPastInteraction] = useState(false);
  const [showSplitBill, setShowSplitBill] = useState(false);
  const [showSplitBillModal, setShowSplitBillModal] = useState(false);
  const [showBulkPaymentModal, setShowBulkPaymentModal] = useState(false);
  const [showFriends, setShowFriends] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState<string | null>(null);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [notifications] = useState(3); // Mock notification count
  const [showNotifications, setShowNotifications] = useState(false);

  // Financial services modal states
  const [showEarnMoneyModal, setShowEarnMoneyModal] = useState(false);
  const [showTakeLoanModal, setShowTakeLoanModal] = useState(false);
  const [showLoanInterestModal, setShowLoanInterestModal] = useState(false);
  const [showReferEarnModal, setShowReferEarnModal] = useState(false);

  // Convert LineFriend to Contact
  const convertLineFriendToContact = (friend: LineFriend): Contact => ({
    id: friend.userId,
    name: friend.displayName,
    walletAddress: '', // This would need to be fetched from the backend
    profilePhoto: friend.pictureUrl || '',
    phoneNumber: '', // Not available from LINE friend data
  });

  // Fetch all users and get current user profile
  const fetchAllUsersAndCurrentProfile = useCallback(async () => {
    if (!user?.userId) return;

    try {
      console.log('🔍 Fetching all users and current user profile...');
      
      // Fetch all users
      const allUsersResponse = await fetch(`${CONFIG.BACKEND_URL}/api/auth/getAllUsers`);
      if (!allUsersResponse.ok) {
        throw new Error('Failed to fetch all users');
      }
      const allUsersData = await allUsersResponse.json();
      console.log('✅ All users fetched:', allUsersData);
      setAllUsers(allUsersData);

      // Find current user profile
      const currentUser = allUsersData.find((u: BackendUser) => u.lineUserId === user.userId);
      console.log('✅ Current user profile found:', currentUser);
      setCurrentUserProfile(currentUser);

      return currentUser;
    } catch (error) {
      console.error('❌ Error fetching users:', error);
      return null;
    }
  }, [user?.userId]);

  // Fetch transaction history and process recent people
  const fetchTransactionHistory = useCallback(async () => {
    const currentUser = currentUserProfile || await fetchAllUsersAndCurrentProfile();
    if (!currentUser?.userId) return;

    try {
      setLoading(true);
      console.log('🔍 Fetching transaction history for user:', currentUser.userId);
      
      const response = await fetch(`${CONFIG.BACKEND_URL}/api/history/getUserTxnHistory/${currentUser.userId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch transaction history');
      }
      
      const data = await response.json();
      const userTransactions = data.transactions;
      console.log('✅ Transactions fetched:', userTransactions);
      
      // Filter out current user's transactions and get recent people
      const peopleMap = new Map<string, RecentPerson>();
      
      userTransactions.forEach((txn: TransactionDetail) => {
        let otherUserId: string | null = null;
        
        // Determine the other user in the transaction
        if (txn.transactionType === 'P2P') {
          if (txn.senderId === currentUser.userId) {
            otherUserId = txn.receiverId || null;
          } else if (txn.receiverId === currentUser.userId) {
            otherUserId = txn.senderId || null;
          }
        } else if (txn.transactionType === 'Bulk Transfer') {
          if (txn.senderId === currentUser.userId) {
            // Current user is sender, get receivers
            txn.receiverIds?.forEach(receiverId => {
              if (receiverId !== currentUser.userId) {
                otherUserId = receiverId;
              }
            });
          }
        } else if (txn.transactionType === 'Split Payment') {
          if (txn.payeeId === currentUser.userId) {
            // Current user is payee, get contributors
            txn.contributorIds?.forEach(contributorId => {
              if (contributorId !== currentUser.userId) {
                otherUserId = contributorId;
              }
            });
          } else if (txn.contributorIds?.includes(currentUser.userId)) {
            // Current user is contributor, get payee
            otherUserId = txn.payeeId || null;
          }
        }
        
        if (otherUserId) {
          const existing = peopleMap.get(otherUserId);
          
          // Find user details from allUsers array
          let displayName = `User ${otherUserId.slice(-4)}`;
          let pictureUrl = '';
          
          const otherUser = allUsers.find((u: BackendUser) => u.userId === otherUserId);
          if (otherUser) {
            displayName = otherUser.displayName || displayName;
            // Try different possible picture field names
            pictureUrl = otherUser.pictureUrl || '';
            console.log('👤 Found user details:', { userId: otherUserId, displayName, pictureUrl: pictureUrl || 'No picture URL' });
          } else {
            console.log('❌ User not found in allUsers:', otherUserId);
          }
          
          if (!existing) {
            peopleMap.set(otherUserId, {
              userId: otherUserId,
              displayName,
              pictureUrl,
              lastTransactionDate: txn.createdAt,
              transactionCount: 1
            });
            console.log('🆕 Added new person:', otherUserId);
          } else {
            // Update transaction count and latest date if this transaction is more recent
            if (new Date(txn.createdAt) > new Date(existing.lastTransactionDate)) {
              existing.lastTransactionDate = txn.createdAt;
            }
            existing.transactionCount += 1;
            console.log('📈 Updated existing person:', otherUserId, 'count:', existing.transactionCount);
          }
        }
      });
      
      // Sort by most recent transaction date
      const sortedPeople = Array.from(peopleMap.values())
        .sort((a, b) => new Date(b.lastTransactionDate).getTime() - new Date(a.lastTransactionDate).getTime())
        .slice(0, 10); // Show top 10 recent people
      
      console.log('✅ Recent people processed:', sortedPeople);
      setTransactions(userTransactions);
      setRecentPeople(sortedPeople);
    } catch (error) {
      console.error('❌ Error fetching transaction history:', error);
    } finally {
      setLoading(false);
    }
  }, [currentUserProfile, allUsers, fetchAllUsersAndCurrentProfile]);

  // Fetch transactions for specific person
  const fetchPersonTransactions = useCallback((person: RecentPerson) => {
    const personTransactions = transactions.filter(txn => {
      if (txn.transactionType === 'P2P') {
        return (txn.senderId === person.userId && txn.receiverId === currentUserProfile?.userId) ||
               (txn.receiverId === person.userId && txn.senderId === currentUserProfile?.userId);
      } else if (txn.transactionType === 'Bulk Transfer') {
        return (txn.senderId === person.userId) || 
               (txn.senderId === currentUserProfile?.userId && txn.receiverIds?.includes(person.userId));
      } else if (txn.transactionType === 'Split Payment') {
        return (txn.payeeId === person.userId && txn.contributorIds?.includes(currentUserProfile?.userId || '')) ||
               (txn.payeeId === currentUserProfile?.userId && txn.contributorIds?.includes(person.userId));
      }
      return false;
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    setSelectedPersonTransactions(personTransactions);
    setSelectedPerson(person);
    setShowPersonTransactions(true);
  }, [transactions, currentUserProfile?.userId]);

  // Load data when component mounts or user changes
  useEffect(() => {
    if (user?.userId) {
      fetchAllUsersAndCurrentProfile().then(() => {
        fetchTransactionHistory();
      });
    }
  }, [user?.userId, fetchAllUsersAndCurrentProfile, fetchTransactionHistory]); // Only run when user changes

  const handleQRScan = (result: string) => {
    console.log("QR Code scanned:", result);
    // Handle the scanned QR code (blockchain address)
  };

  const handlePaymentSuccess = (txHash: string, recipient: { displayName: string }, amount: string) => {
    console.log('Payment successful:', { txHash, recipient, amount });
    setPaymentSuccess(`Successfully sent ${amount} USDT to ${recipient.displayName}!`);
    
    // Clear success message after 5 seconds
    setTimeout(() => {
      setPaymentSuccess(null);
    }, 5000);
  };

  const handleSplitBillSuccess = (splitData: SplitBillData) => {
    console.log('Split bill created:', splitData);
    setPaymentSuccess(`Split bill "${splitData.title}" created successfully!`);
    
    // Clear success message after 5 seconds
    setTimeout(() => {
      setPaymentSuccess(null);
    }, 5000);
  };

  const handleBulkPaymentSuccess = (paymentData: BulkPaymentData) => {
    console.log('Bulk payment successful:', paymentData);
    setPaymentSuccess(`Successfully sent ${paymentData.totalAmount} USDT to ${paymentData.recipients.length} recipients!`);
    
    // Clear success message after 5 seconds
    setTimeout(() => {
      setPaymentSuccess(null);
    }, 5000);
  };

  const handleContactSelect = (contact: Contact) => {
    setSelectedContact(contact);
    setShowPayAnyone(false);
    setShowPastInteraction(true);
  };

  const handleFriendSelect = (friend: LineFriend) => {
    const contact = convertLineFriendToContact(friend);
    setSelectedContact(contact);
    setShowFriends(false);
    setShowPastInteraction(true);
  };

  const handlePay = (contact: Contact) => {
    console.log("Pay to:", contact);
    // Handle payment logic
  };

  const handleRequest = (contact: Contact) => {
    console.log("Request from:", contact);
    // Handle request logic
  };

  const handleSplitBill = (contacts: Contact[], totalAmount: number) => {
    console.log("Split bill:", contacts, totalAmount);
    // Handle split bill logic
  };

  const userWalletAddress = "0x1234567890abcdef1234567890abcdef12345678";

  const handleCopyWalletAddress = async () => {
    try {
      await navigator.clipboard.writeText(userWalletAddress);
      // You could add a toast notification here
      console.log("Wallet address copied to clipboard");
    } catch (err) {
      console.error("Failed to copy wallet address:", err);
    }
  };

  const handleDownloadQR = () => {
    // Generate QR code and download
    // const qrCodeData = `ethereum:${userWalletAddress}`; // TODO: Use this when implementing real QR generation
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Simple QR code generation (you might want to use a proper QR library)
    canvas.width = 200;
    canvas.height = 200;
    
    // For now, we'll create a simple placeholder
    if (ctx) {
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, 200, 200);
      ctx.fillStyle = '#fff';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('QR Code', 100, 100);
      ctx.fillText('Placeholder', 100, 120);
    }
    
    const link = document.createElement('a');
    link.download = 'wallet-qr-code.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  const handleShareQR = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'My Wallet Address',
          text: `My wallet address: ${userWalletAddress}`,
          url: `ethereum:${userWalletAddress}`
        });
      } else {
        // Fallback to copying to clipboard
        await navigator.clipboard.writeText(`My wallet address: ${userWalletAddress}`);
        console.log("Wallet address copied to clipboard for sharing");
      }
    } catch (err) {
      console.error("Failed to share wallet address:", err);
    }
  };

  return (
    <main className="mx-auto max-w-md">
      {/* Success Notification */}
      {paymentSuccess && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 max-w-sm">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm font-medium">{paymentSuccess}</span>
          </div>
        </div>
      )}

      <header className="pt-8 pb-8">
        {/* Top Icons */}
        <div className="flex items-center justify-between px-6 mb-8">
          <button 
            onClick={() => setShowProfile(true)}
            className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden hover:ring-2 hover:ring-green-500 transition-all"
          >
            <img
              src={currentUserProfile?.pictureUrl || userProfile?.pictureUrl || user?.pictureUrl || "https://randomuser.me/api/portraits/men/0.jpg"}
              alt="Profile"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "https://randomuser.me/api/portraits/women/0.jpg";
              }}
            />
          </button>
          <button 
            onClick={() => setShowNotifications(true)}
            className="relative w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"/>
            </svg>
            {notifications > 0 && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                {notifications > 9 ? '9+' : notifications}
          </div>
            )}
          </button>
        </div>

        {/* Greeting */}
        <div className="px-6 mb-4">
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">Hello {currentUserProfile?.displayName || userProfile?.displayName || user?.displayName || 'User'}!</h1>
          <p className="text-gray-500">Let&apos;s manage your money.</p>
          {(currentUserProfile || userProfile) && (
            <p className="text-xs text-gray-400 mt-1">
              Wallet: {(currentUserProfile?.walletAddress || userProfile?.walletAddress)?.slice(0, 6)}...{(currentUserProfile?.walletAddress || userProfile?.walletAddress)?.slice(-4)}
            </p>
          )}
        </div>
      </header>

      {/* Notification Popup */}
      {showNotifications && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-80 max-w-sm mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
              <button
                onClick={() => setShowNotifications(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="text-center py-8">
              <div className="text-gray-400 mb-2">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-5 5-5-5h5v-13" />
                </svg>
              </div>
              <p className="text-gray-500 text-sm">No notifications</p>
            </div>
          </div>
        </div>
      )}

      {/* Money Transfer Section */}
      <section className="px-6 mb-6">
        <h2 className="text-lg font-bold text-black mb-4">Money Transfer</h2>
        <div className="bg-white rounded-2xl p-4 shadow-lg grid grid-cols-4 gap-3">
          <ActionButton onClick={() => setShowQRPay(true)} icon={<QrCodeIcon className="w-5 h-5" />} label="QR Pay" />
          <ActionButton onClick={() => setShowPayAnyoneModal(true)} icon={<UserIcon className="w-5 h-5" />} label="Pay anyone" />
          <ActionButton onClick={() => setShowSplitBillModal(true)} icon={<ShareIcon className="w-5 h-5" />} label="Split bills" />
          <ActionButton onClick={() => setShowBulkPaymentModal(true)} icon={<DocumentDuplicateIcon className="w-5 h-5" />} label="Bulk payment" />
        </div>
      </section>

      {/* Get Loan, Invest Money Section */}
      <section className="px-6 mb-6">
        <h2 className="text-lg font-bold text-black mb-4">Get Loan, Invest Money</h2>
        <div className="bg-white rounded-2xl p-4 shadow-lg grid grid-cols-4 gap-3">
          <ActionButton 
            onClick={() => setShowEarnMoneyModal(true)} 
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            } 
            label="Earn Money" 
          />
          <ActionButton 
            onClick={() => setShowTakeLoanModal(true)} 
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            } 
            label="Take Loan" 
          />
          <ActionButton 
            onClick={() => setShowLoanInterestModal(true)} 
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            } 
            label="Loan Interest" 
          />
          <ActionButton 
            onClick={() => setShowReferEarnModal(true)} 
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            } 
            label="Refer & Earn" 
          />
        </div>
      </section>

      {/* Recent Transactions */}
      <section className="px-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Activity</h2>
          <button 
            onClick={() => onTabChange?.('history')}
            className="text-green-600 text-sm font-medium hover:text-green-700 transition-colors"
          >
            View All
          </button>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2 pt-2 px-2">
          {loading ? (
            // Loading skeleton
            [...Array(5)].map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-2 min-w-[60px]">
                <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse"></div>
                <div className="w-8 h-3 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))
          ) : recentPeople.length > 0 ? (
            recentPeople.map((person) => (
              <button
                key={person.userId}
                onClick={() => fetchPersonTransactions(person)}
                className="flex flex-col items-center gap-2 min-w-[60px] hover:opacity-75 transition-opacity"
              >
                <div className="relative w-12 h-12">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-green-100">
                    <img 
                      src={person.pictureUrl || `https://ui-avatars.com/api/?name=${person.userId}&background=random&color=fff&size=48`}
                      alt={person.userId}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = `https://ui-avatars.com/api/?name=${person.userId}&background=random&color=fff&size=48`;
                      }}
                    />
                  </div>
                  {person.transactionCount > 1 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                      {person.transactionCount > 9 ? '9+' : person.transactionCount}
                    </div>
                  )}
                </div>
                <span className="text-xs text-gray-600 truncate max-w-[60px]">
                  {person.userId.length > 8 ? person.userId.slice(0, 8) + '...' : person.userId}
                </span>
              </button>
            ))
          ) : (
            <div className="w-full text-center py-8 text-gray-500">
              <p className="text-sm">No recent transactions</p>
              <p className="text-xs text-gray-400 mt-1">Start transacting to see recent people here</p>
            </div>
          )}
        </div>
      </section>

      {/* Recent Transactions */}
      <section className="px-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Recent Transactions</h2>
          <button 
            onClick={() => onTabChange?.('history')}
            className="text-green-600 text-sm font-medium hover:text-green-700 transition-colors"
          >
            View All
          </button>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-lg">
          {loading ? (
            // Loading skeleton
            [...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-0">
                <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
                <div className="flex-1">
                  <div className="w-24 h-4 bg-gray-200 rounded animate-pulse mb-1"></div>
                  <div className="w-16 h-3 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))
          ) : transactions.length > 0 ? (
            transactions.slice(0, 5).map((txn) => {
              const otherUserId = txn.transactionType === 'P2P' 
                ? (txn.senderId === currentUserProfile?.userId ? txn.receiverId : txn.senderId)
                : txn.transactionType === 'Bulk Transfer' 
                  ? (txn.senderId === currentUserProfile?.userId ? txn.receiverIds?.[0] : txn.senderId)
                  : txn.transactionType === 'Split Payment'
                    ? (txn.payeeId === currentUserProfile?.userId ? txn.contributorIds?.[0] : txn.payeeId)
                    : null;

              const otherUser = allUsers.find((u: BackendUser) => u.userId === otherUserId);
              const isReceived = txn.receiverId === currentUserProfile?.userId || 
                                 txn.receiverIds?.includes(currentUserProfile?.userId || '') ||
                                 (txn.transactionType === 'Split Payment' && txn.payeeId === currentUserProfile?.userId);

              return (
                <div key={txn._id} className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-0">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100">
                    <img 
                      src={otherUser?.pictureUrl || `https://ui-avatars.com/api/?name=${otherUserId}&background=random&color=fff&size=40`}
                      alt={otherUserId || 'User'}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = `https://ui-avatars.com/api/?name=${otherUserId}&background=random&color=fff&size=40`;
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {otherUserId || 'Unknown User'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {txn.transactionType} • {new Date(txn.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-semibold ${isReceived ? 'text-green-600' : 'text-red-600'}`}>
                      {isReceived ? '+' : '-'}{txn.amount} USDT
                    </p>
                    <p className="text-xs text-gray-400">
                      {Array.isArray(txn.status) ? 'Split Payment' : txn.status}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p className="text-sm">No transactions yet</p>
              <p className="text-xs text-gray-400 mt-1">Start making payments to see transactions here</p>
            </div>
          )}
        </div>
      </section>

      {/* Friends Section */}
      <section className="px-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Friends</h2>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-lg">
          {friends.length > 0 ? (
             <div className="grid grid-cols-2 gap-4">
               {friends.slice(0, 4).map((friend, i) => (
                 <div key={friend.userId} className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                   <div className="relative w-12 h-12">
                     <div className="w-12 h-12 rounded-full overflow-hidden">
                       <img
                         src={friend.pictureUrl || `https://randomuser.me/api/portraits/men/${i + 1}.jpg`}
                         alt={friend.displayName}
                         className="w-full h-full object-cover"
                         onError={(e) => {
                           e.currentTarget.src = `https://randomuser.me/api/portraits/women/${i + 1}.jpg`;
                         }}
                       />
                     </div>
                     {/* Random notification count for demo */}
                     {Math.random() > 0.6 && (
                       <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                         {Math.floor(Math.random() * 3) + 1}
                       </div>
                     )}
                   </div>
                   <p className="text-xs font-medium text-gray-900 text-center truncate">{friend.displayName}</p>
                 </div>
               ))}
             </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <p className="text-gray-500 text-sm">No friends found</p>
              <p className="text-gray-400 text-xs mt-1">Add friends on LINE to see them here</p>
            </div>
          )}
          <button 
            onClick={() => setShowFriends(true)}
            className="w-full mt-4 py-3 text-green-600 text-sm font-medium border border-green-200 rounded-xl hover:bg-green-50 transition-colors"
          >
            View All
          </button>
        </div>
      </section>

      {/* Bottom spacing */}
      <div className="pb-24"></div>

      {/* Popups */}
      <LIFFQRScanner
        isOpen={showQRScanner}
        onClose={() => setShowQRScanner(false)}
        onScan={handleQRScan}
      />
      
      <PayAnyonePopup
        isOpen={showPayAnyone}
        onClose={() => setShowPayAnyone(false)}
        onSelectContact={handleContactSelect}
      />

      <PayAnyoneModal
        isOpen={showPayAnyoneModal}
        onClose={() => setShowPayAnyoneModal(false)}
        onSuccess={handlePaymentSuccess}
      />

      <QRPayModal
        isOpen={showQRPay}
        onClose={() => setShowQRPay(false)}
        onSuccess={handlePaymentSuccess}
      />

      <SplitBillModal
        isOpen={showSplitBillModal}
        onClose={() => setShowSplitBillModal(false)}
        onSuccess={handleSplitBillSuccess}
      />

      <BulkPaymentModal
        isOpen={showBulkPaymentModal}
        onClose={() => setShowBulkPaymentModal(false)}
        onSuccess={handleBulkPaymentSuccess}
      />

      {/* Enhanced Earn Money Modal */}
      {showEarnMoneyModal && (
        <EnhancedEarnMoneyModal onClose={() => setShowEarnMoneyModal(false)} />
      )}

      {/* Enhanced Take Loan Modal */}
      {showTakeLoanModal && (
        <EnhancedTakeLoanModal onClose={() => setShowTakeLoanModal(false)} />
      )}

      {/* Loan Interest Modal */}
      {showLoanInterestModal && (
        <LoanInterestModal onClose={() => setShowLoanInterestModal(false)} />
      )}

      {/* Enhanced Refer and Earn Modal */}
      {showReferEarnModal && (
        <EnhancedReferEarnModal onClose={() => setShowReferEarnModal(false)} />
      )}
      
      <PastInteractionPopup
        isOpen={showPastInteraction}
        onClose={() => setShowPastInteraction(false)}
        contact={selectedContact}
        onPay={handlePay}
        onRequest={handleRequest}
      />
      
      <SplitBillPopup
        isOpen={showSplitBill}
        onClose={() => setShowSplitBill(false)}
        onConfirmSplit={handleSplitBill}
      />
      
      
      <FriendsPopup
        isOpen={showFriends}
        onClose={() => setShowFriends(false)}
        onSelectContact={handleFriendSelect}
        friends={friends}
      />

      {/* Profile Modal */}
      {showProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md mx-4 bg-white rounded-2xl shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Profile</h2>
              <button
                onClick={() => setShowProfile(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Profile Content */}
            <div className="p-6">
              {/* Profile Avatar and Name */}
              <div className="flex flex-col items-center mb-6">
                <div className="w-20 h-20 rounded-full bg-gray-100 overflow-hidden mb-3">
                  <img
                    src={user?.pictureUrl || "https://randomuser.me/api/portraits/men/0.jpg"}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "https://randomuser.me/api/portraits/women/0.jpg";
                    }}
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{user?.displayName || 'LINE User'}</h3>
                <p className="text-sm text-gray-500">{user?.statusMessage || 'LINE DApp User'}</p>
              </div>

              {/* Wallet Address */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Wallet Address</label>
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <code className="flex-1 text-xs text-gray-600 font-mono break-all">
                    {userWalletAddress}
                  </code>
                  <button
                    onClick={handleCopyWalletAddress}
                    className="p-2 text-gray-500 hover:text-green-600 transition-colors"
                    title="Copy wallet address"
                  >
                    <DocumentDuplicateIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* QR Code Actions */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-700">QR Code Actions</h4>
                
                <button
                  onClick={handleDownloadQR}
                  className="w-full flex items-center justify-center gap-3 p-3 bg-green-50 text-green-700 rounded-lg border border-green-200 hover:bg-green-100 transition-colors"
                >
                  <QrCodeIcon className="w-5 h-5" />
                  <span className="font-medium">Download QR Code</span>
                </button>

                  <button
                    onClick={handleShareQR}
                    className="w-full flex items-center justify-center gap-3 p-3 bg-blue-50 text-blue-700 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors"
                  >
                    <ShareIcon className="w-5 h-5" />
                    <span className="font-medium">Share QR Code</span>
                  </button>
                </div>

                {/* Logout Button */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <button
                    onClick={logout}
                    className="w-full flex items-center justify-center gap-3 p-3 bg-red-50 text-red-700 rounded-lg border border-red-200 hover:bg-red-100 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span className="font-medium">Logout</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      {/* Person Transactions Modal */}
      {showPersonTransactions && selectedPerson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md mx-4 bg-white rounded-2xl shadow-xl max-h-[80vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <img
                    src={selectedPerson.pictureUrl || `https://randomuser.me/api/portraits/men/${Math.floor(Math.random() * 30)}.jpg`}
                    alt={selectedPerson.displayName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = `https://randomuser.me/api/portraits/women/${Math.floor(Math.random() * 30)}.jpg`;
                    }}
                  />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">{selectedPerson.displayName}</h2>
                  <p className="text-sm text-gray-500">{selectedPersonTransactions.length} transactions</p>
                </div>
              </div>
              <button
                onClick={() => setShowPersonTransactions(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Transactions List */}
            <div className="p-4 max-h-96 overflow-y-auto">
              {selectedPersonTransactions.length > 0 ? (
                <div className="space-y-3">
                  {selectedPersonTransactions.map((txn) => {
                    const isUserSender = txn.senderId === userProfile?.userId;
                    const isUserReceiver = txn.receiverId === userProfile?.userId;
                    const isUserPayee = txn.payeeId === userProfile?.userId;
                    const isUserContributor = txn.contributorIds?.includes(userProfile?.userId || '');
                    
                    let roleDisplay = '';
                    let amountDisplay = '';
                    let colorClass = '';
                    
                    if (txn.transactionType === 'P2P') {
                      if (isUserSender) {
                        roleDisplay = 'Sent';
                        amountDisplay = `-${txn.amount} USDT`;
                        colorClass = 'text-red-600';
                      } else if (isUserReceiver) {
                        roleDisplay = 'Received';
                        amountDisplay = `+${txn.amount} USDT`;
                        colorClass = 'text-green-600';
                      }
                    } else if (txn.transactionType === 'Bulk Transfer') {
                      if (isUserSender) {
                        roleDisplay = 'Bulk Sent';
                        amountDisplay = `-${txn.totalAmount} USDT`;
                        colorClass = 'text-red-600';
                      } else {
                        roleDisplay = 'Bulk Received';
                        amountDisplay = `+${txn.userAmount || txn.amount} USDT`;
                        colorClass = 'text-green-600';
                      }
                    } else if (txn.transactionType === 'Split Payment') {
                      if (isUserPayee) {
                        roleDisplay = 'Split Received';
                        amountDisplay = `+${txn.totalAmount} USDT`;
                        colorClass = 'text-green-600';
                      } else if (isUserContributor) {
                        roleDisplay = 'Split Paid';
                        amountDisplay = `-${txn.userAmount || txn.amount} USDT`;
                        colorClass = 'text-red-600';
                      }
                    }
                    
                    return (
                      <div key={txn._id} className="bg-gray-50 rounded-xl p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${isUserSender || isUserContributor ? 'bg-red-500' : 'bg-green-500'}`}></div>
                            <span className="text-sm font-medium text-gray-900">{roleDisplay}</span>
                            <span className="text-xs text-gray-500">{txn.transactionType}</span>
                          </div>
                          <span className={`text-sm font-semibold ${colorClass}`}>
                            {amountDisplay}
                          </span>
                        </div>
                        {(txn.description || txn.title) && (
                          <p className="text-xs text-gray-600 mb-2">{txn.description || txn.title}</p>
                        )}
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{new Date(txn.createdAt).toLocaleDateString()}</span>
                          <span className="font-mono text-xs">
                            {txn.transactionHash.slice(0, 8)}...{txn.transactionHash.slice(-6)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p className="text-sm">No transactions found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}


// Loan Interest Modal Component
function LoanInterestModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md mx-4 bg-white rounded-2xl shadow-xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-xl font-bold text-gray-900">Loan Interest</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 overflow-y-auto hide-scrollbar">
          <div className="space-y-4">
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <h3 className="font-medium text-red-900 mb-3">Accumulated Interest</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-red-700">Loan Amount:</span>
                  <span className="font-medium">500.00 USDT</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-red-700">Interest Rate:</span>
                  <span className="font-medium">5.5% APR</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-red-700">Days Outstanding:</span>
                  <span className="font-medium">45 days</span>
                </div>
                <hr className="border-red-200" />
                <div className="flex justify-between">
                  <span className="text-red-800 font-semibold">Total Interest Due:</span>
                  <span className="font-bold text-lg text-red-900">12.45 USDT</span>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
              <p className="text-sm text-yellow-800">⚠️ Interest compounds daily. Pay early to save on interest charges.</p>
            </div>

            <button className="w-full bg-red-500 text-white py-3 rounded-lg font-medium hover:bg-red-600 transition-colors">
              Pay Interest (12.45 USDT)
            </button>

            <div className="text-center">
              <button className="text-gray-500 text-sm hover:text-gray-700 transition-colors">
                View Interest History
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


function ActionButton({ onClick, icon, label }: { onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-2 p-2 rounded-xl hover:bg-gray-50 transition-colors">
      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
        {icon}
      </div>
      <span className="text-xs font-medium text-gray-700 text-center leading-tight">{label}</span>
    </button>
  );
}


