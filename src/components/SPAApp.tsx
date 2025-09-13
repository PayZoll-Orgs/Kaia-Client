"use client";
import React, { useState } from 'react';
import { HomeIcon, ClockIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { useAuth } from "@/contexts/AuthContext";

// Import tab components
import HomePage from '@/components/tabs/HomePage';
import HistoryPage from '@/components/tabs/HistoryPage';
import PortfolioPage from '@/components/tabs/PortfolioPage';

type TabType = 'home' | 'history' | 'portfolio';

export default function SPAPage() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { user } = useAuth();

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div key="home" className="animate-fadeIn">
            <HomePage onTabChange={handleTabChange} />
          </div>
        );
      case 'history':
        return (
          <div key="history" className="animate-fadeIn">
            <HistoryPage />
          </div>
        );
      case 'portfolio':
        return (
          <div key="portfolio" className="animate-fadeIn">
            <PortfolioPage />
          </div>
        );
      default:
        return (
          <div key="home" className="animate-fadeIn">
            <HomePage onTabChange={handleTabChange} />
          </div>
        );
    }
  };

  const handleTabChange = (tab: TabType) => {
    if (tab === activeTab) return;
    
    setIsTransitioning(true);
    
    // Small delay to show transition
    setTimeout(() => {
      setActiveTab(tab);
      setIsTransitioning(false);
    }, 150);
  };

  return (
    <div className="min-h-dvh flex flex-col bg-gray-50">
      {/* Content Area */}
      <div className="flex-1 min-h-0 relative">
        {isTransitioning ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
            <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          renderContent()
        )}
      </div>

      {/* Bottom Navigation */}
      <nav className="sticky bottom-0 inset-x-0 mb-6">
        <div className="mx-auto max-w-md">
          <div className="bg-white backdrop-blur-sm rounded-full flex justify-between items-center text-xs px-2 py-2 shadow-2xl border border-gray-200 mx-4">
            <Tab 
              tab="home" 
              active={activeTab === 'home'} 
              onClick={() => handleTabChange('home')}
              label="Home"
            >
              <HomeIcon className="w-6 h-6" />
            </Tab>
            <Tab 
              tab="history" 
              active={activeTab === 'history'} 
              onClick={() => handleTabChange('history')}
              label="History"
            >
              <ClockIcon className="w-6 h-6" />
            </Tab>
            <Tab 
              tab="portfolio" 
              active={activeTab === 'portfolio'} 
              onClick={() => handleTabChange('portfolio')}
              label="Profile"
            >
              <UserCircleIcon className="w-6 h-6" />
            </Tab>
          </div>
        </div>
      </nav>
    </div>
  );
}

interface TabProps {
  tab: TabType;
  active: boolean;
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}

function Tab({ active, onClick, label, children }: TabProps) {
  return (
    <button 
      onClick={onClick}
      className="flex items-center gap-2 transition-all duration-300 hover:scale-105"
    >
      <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
        active ? "bg-green-100 text-green-600 shadow-lg shadow-green-100/25" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
      }`}>
        {children}
      </div>
      <div className={`overflow-hidden transition-all duration-300 ${
        active ? "w-16 opacity-100" : "w-0 opacity-0"
      }`}>
        <span className="text-sm font-medium whitespace-nowrap text-gray-900">
          {label}
        </span>
      </div>
    </button>
  );
}
