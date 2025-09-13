"use client";
import Image from "next/image";
import { useState, useCallback } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { QrCodeIcon, ShareIcon, DocumentDuplicateIcon } from "@heroicons/react/24/outline";
import { useAuth } from "@/contexts/AuthContext";
import SwitchAccountPopup from "@/components/SwitchAccountPopup";

export default function PortfolioPage() {
  const { user, logout } = useAuth();
  const [address] = useState("0x1234567890abcdef1234567890abcdef12345678");
  const [showSwitchAccount, setShowSwitchAccount] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [notifications] = useState(3); // Mock notification count
  const [accounts] = useState([
    {
      id: '1',
      name: 'KAIA Network',
      network: 'KAIA',
      balance: '$8,182.80',
      address: '0x1234...5678',
      isActive: true
    },
    {
      id: '2',
      name: 'BSC Network',
      network: 'BSC',
      balance: '$12,345.67',
      address: '0xdef...789a',
      isActive: false
    },
    {
      id: '3',
      name: 'ETH Network',
      network: 'ETH',
      balance: '$5,432.10',
      address: '0xabc...def0',
      isActive: false
    }
  ]);

  const handleAccountSwitch = useCallback((account: any) => {
    console.log('Switching to account:', account);
    // Handle account switch logic here
  }, []);

  const handleCopyWalletAddress = async () => {
    try {
      await navigator.clipboard.writeText(address);
      console.log('Wallet address copied to clipboard');
    } catch (err) {
      console.error('Failed to copy wallet address:', err);
    }
  };

  const handleDownloadQR = () => {
    const qrCodeData = `ethereum:${address}`;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = 200;
    canvas.height = 200;
    
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
          text: `My wallet address: ${address}`,
          url: `ethereum:${address}`
        });
      } else {
        await navigator.clipboard.writeText(`My wallet address: ${address}`);
        console.log('Wallet address copied to clipboard for sharing');
      }
    } catch (err) {
      console.error('Failed to share wallet address:', err);
    }
  };
  return (
    <main className="mx-auto max-w-md">
      <header className="pt-8 pb-8">
        {/* Top Icons */}
        <div className="flex items-center justify-between px-6 mb-8">
          <button 
            onClick={() => setShowProfile(true)}
            className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden hover:ring-2 hover:ring-green-500 transition-all"
          >
            <img
              src={user?.pictureUrl || "https://randomuser.me/api/portraits/men/0.jpg"}
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
        <div className="px-6 mb-12">
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">Hello Muminul!</h1>
          <p className="text-gray-500">Let's save your money.</p>
        </div>

        {/* Card Stack */}
        <div className="px-4 mt-24 relative">
          {/* Background stacked cards */}
          <div className="absolute inset-x-0 top-0 transform -translate-y-16 -rotate-6 origin-top-left">
            <div className="bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-[28px] p-6 shadow-lg">
              <div className="space-y-6">
                <div>
                  <div className="text-white/90 text-base font-light mb-1">Balance</div>
                  <div className="text-white text-[32px] font-normal">$5,432.10</div>
                </div>
                
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-white/90 text-base font-light mb-1">Network</div>
                    <div className="text-white text-xl font-normal">ETH Network</div>
                  </div>
                  <div className="text-right">
                    <div className="text-white/90 text-base font-light mb-1">Address</div>
                    <div className="text-white text-base font-light">0xabc...def0</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute inset-x-0 top-0 transform -translate-y-8 -rotate-3 origin-top-left">
            <div className="bg-gradient-to-br from-amber-400 to-amber-500 rounded-[28px] p-6 shadow-lg">
              <div className="space-y-6">
                <div>
                  <div className="text-white/90 text-base font-light mb-1">Balance</div>
                  <div className="text-white text-[32px] font-normal">$12,345.67</div>
                </div>
                
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-white/90 text-base font-light mb-1">Network</div>
                    <div className="text-white text-xl font-normal">BSC Network</div>
                  </div>
                  <div className="text-right">
                    <div className="text-white/90 text-base font-light mb-1">Address</div>
                    <div className="text-white text-base font-light">0xdef...789a</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Main card */}
          <div className="relative">
            <div className="bg-[#8A6FE8] rounded-[28px] p-6 relative">
              <div className="space-y-6">
                <div>
                  <div className="text-white/90 text-base font-light mb-1">Balance</div>
                  <div className="text-white text-[32px] font-normal">$8,182.80</div>
                </div>
                
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-white/90 text-base font-light mb-1">Network</div>
                    <div className="text-white text-xl font-normal">KAIA Network</div>
                  </div>
                  <div className="text-right">
                    <div className="text-white/90 text-base font-light mb-1">Address</div>
                    <div className="text-white text-base font-light">0x1234...5678</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Account Action Buttons */}
        <div className="flex justify-end px-4 mt-6 gap-3">
          <button 
            onClick={() => setShowSwitchAccount(true)}
            className="border border-green-500 text-green-500 hover:bg-green-50 flex items-center gap-2 px-6 py-3 rounded-full transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            <span className="text-lg font-normal">Switch Account</span>
          </button>
          <button className="bg-green-500 text-white flex items-center gap-2 px-6 py-3 rounded-full hover:bg-green-600 transition-colors">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="text-lg font-normal">Add Account</span>
          </button>
        </div>

        {/* Switch Account Popup */}
        <SwitchAccountPopup
          isOpen={showSwitchAccount}
          onClose={() => setShowSwitchAccount(false)}
          onSelectAccount={handleAccountSwitch}
          accounts={accounts}
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
                      {address}
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
                    onClick={() => {
                      logout();
                      setShowProfile(false);
                    }}
                    className="w-full flex items-center justify-center gap-3 p-3 bg-red-50 text-red-700 rounded-lg border border-red-200 hover:bg-red-100 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span className="font-medium">Sign Out</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* My Assets */}
        <div className="mt-12 px-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">My Assets</h2>
          
          {/* KAIA Asset */}
          <div className="bg-white rounded-2xl p-4 mb-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <Image src="/next.svg" alt="KAIA" width={24} height={24} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-900 font-medium">KAIA</span>
                    <span className="text-gray-500">• $ 66,255.01</span>
                  </div>
                  <div className="text-gray-500 text-sm">120.0 KAIA</div>
                </div>
              </div>
              <div className="text-green-500 font-medium">+28.43%</div>
            </div>
          </div>

          {/* USDT Asset */}
          <div className="bg-white rounded-2xl p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <Image src="/next.svg" alt="USDT" width={24} height={24} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-900 font-medium">USDT</span>
                    <span className="text-gray-500">• $ 3,330.18</span>
                  </div>
                  <div className="text-gray-500 text-sm">500.0 USDT</div>
                </div>
              </div>
              <div className="text-green-500 font-medium">+12.43%</div>
            </div>
          </div>
        </div>
      </header>

      {/* QR Code Section */}
      <section className="px-6 mb-6">
        <div className="rounded-2xl border border-gray-200 p-4 flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-600 font-medium ">Receive</div>
            <div className="text-xs text-gray-600">Share your address</div>
          </div>
          <div className="w-24 h-24 flex items-center justify-center bg-white rounded-lg">
            <QRCodeCanvas value={address} size={92} />
          </div>
        </div>
      </section>
    </main>
  );
}

function AssetCard({ symbol, amount, usd }: { symbol: string; amount: string; usd: string }) {
  return (
    <div className="rounded-2xl border border-green-100 p-4">
      <div className="text-sm font-medium">{symbol}</div>
      <div className="text-xs text-gray-600">{amount}</div>
      <div className="text-sm mt-1">{usd}</div>
    </div>
  );
}

function short(addr: string) {
  return addr.slice(0, 6) + "..." + addr.slice(-4);
}



