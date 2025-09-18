"use client";
import { useState } from "react";
import { QrCodeIcon, UserIcon, ShareIcon, DocumentDuplicateIcon } from "@heroicons/react/24/outline";
import { useAuth } from "@/contexts/AuthContext";
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

interface Contact {
  id: string;
  name: string;
  walletAddress: string;
  profilePhoto: string;
  phoneNumber: string;
}

interface HomePageProps {
  onTabChange?: (tab: 'home' | 'history' | 'portfolio') => void;
}

export default function HomePage({ onTabChange }: HomePageProps = {}) {
  const { user, userProfile, friends, logout } = useAuth();
  const [showQRScanner, setShowQRScanner] = useState(false);

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

  // Convert LineFriend to Contact
  const convertLineFriendToContact = (friend: LineFriend): Contact => ({
    id: friend.userId,
    name: friend.displayName,
    walletAddress: '', // This would need to be fetched from the backend
    profilePhoto: friend.pictureUrl || '',
    phoneNumber: '', // Not available from LINE friend data
  });

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
              src={userProfile?.pictureUrl || user?.pictureUrl || "https://randomuser.me/api/portraits/men/0.jpg"}
              alt="Profile"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "https://randomuser.me/api/portraits/women/0.jpg";
              }}
            />
          </button>
          <button className="relative w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
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
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">Hello {userProfile?.displayName || user?.displayName || 'User'}!</h1>
          <p className="text-gray-500">Let&apos;s save your money.</p>
          {userProfile && (
            <p className="text-xs text-gray-400 mt-1">
              Wallet: {userProfile.walletAddress.slice(0, 6)}...{userProfile.walletAddress.slice(-4)}
            </p>
          )}
        </div>
      </header>

      {/* Action Buttons */}
      <section className="px-6 mb-6">
        <div className="bg-white rounded-2xl p-4 shadow-lg grid grid-cols-4 gap-3">
          <ActionButton onClick={() => setShowQRPay(true)} icon={<QrCodeIcon className="w-5 h-5" />} label="QR Pay" />
          <ActionButton onClick={() => setShowPayAnyoneModal(true)} icon={<UserIcon className="w-5 h-5" />} label="Pay anyone" />
          <ActionButton onClick={() => setShowSplitBillModal(true)} icon={<ShareIcon className="w-5 h-5" />} label="Split bills" />
          <ActionButton onClick={() => setShowBulkPaymentModal(true)} icon={<DocumentDuplicateIcon className="w-5 h-5" />} label="Bulk payment" />
        </div>
      </section>

      {/* Recent Transactions */}
      <section className="px-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Recent Transaction</h2>
          <button 
            onClick={() => onTabChange?.('history')}
            className="text-green-600 text-sm font-medium hover:text-green-700 transition-colors"
          >
            View All
          </button>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2 pt-2 px-2">
          {[
            { name: "Alice", id: 5, gender: "women", notifications: 2 },
            { name: "Bob", id: 6, gender: "men", notifications: 0 },
            { name: "Charlie", id: 7, gender: "men", notifications: 1 },
            { name: "Diana", id: 8, gender: "women", notifications: 0 },
            { name: "Eve", id: 9, gender: "women", notifications: 3 }
          ].map((person, i) => (
            <div key={i} className="flex flex-col items-center gap-2 min-w-[60px]">
              <div className="relative w-12 h-12">
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  <img 
                    src={`https://randomuser.me/api/portraits/${person.gender}/${person.id}.jpg`}
                    alt={person.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = `https://randomuser.me/api/portraits/lego/${person.id}.jpg`;
                    }}
                  />
                </div>
                {person.notifications > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                    {person.notifications > 9 ? '9+' : person.notifications}
                  </div>
                )}
              </div>
              <span className="text-xs text-gray-600">{person.name}</span>
            </div>
          ))}
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

      {/* Invoice Section */}
      <section className="px-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Invoices</h2>
          <button className="text-green-600 text-sm font-medium hover:text-green-700 transition-colors">
            View All
          </button>
        </div>
        <div className="space-y-3">
          {[
            { id: "INV-001", from: "Restaurant ABC", amount: "$45.50", status: "Pending", date: "2 hours ago" },
            { id: "INV-002", from: "Uber Ride", amount: "$12.30", status: "Paid", date: "1 day ago" },
            { id: "INV-003", from: "Coffee Shop", amount: "$8.75", status: "Overdue", date: "3 days ago" }
          ].map((invoice, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold text-sm">
                    {invoice.from.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{invoice.from}</p>
                    <p className="text-xs text-gray-500">{invoice.id} • {invoice.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">{invoice.amount}</p>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                    invoice.status === 'Paid' ? 'bg-green-100 text-green-800' :
                    invoice.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {invoice.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
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
    </main>
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


