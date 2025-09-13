"use client";
import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";

export default function HistoryPage() {
  const [hoveredBar, setHoveredBar] = useState<{ month: string; type: 'receiving' | 'spending'; amount: number } | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
  const [isChartVisible, setIsChartVisible] = useState(false);
  const [hoveredSegment, setHoveredSegment] = useState<'received' | 'sent' | 'available' | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number } | null>(null);

  const handleSegmentHover = (segment: 'received' | 'sent' | 'available', event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    setTooltipPosition({ x, y });
    setHoveredSegment(segment);
  };

  const handleSegmentLeave = () => {
    setTooltipPosition(null);
    setHoveredSegment(null);
  };
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  useEffect(() => {
    // Trigger animation after component mount
    setIsChartVisible(true);
  }, []);
  
  const transactions = [
    {
      id: 1,
      message: "Payment received from employer",
      category: "Income",
      amount: 4000.00,
      date: "01 Sep 24",
      icon: "💰",
      senderAddress: "0x1234...5678...9ABC...DEF0",
      receiverAddress: null,
      senderName: "Tech Corp Inc.",
      senderImage: "https://api.dicebear.com/7.x/initials/svg?seed=TCI&backgroundColor=22c55e",
      receiverName: "John Doe",
      receiverImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=John"
    },
    {
      id: 2,
      message: "Dividend payout from investment portfolio",
      category: "Investment Income",
      amount: 150.00,
      date: "30 Aug 24",
      icon: "📈",
      senderAddress: "0xABCD...EFGH...IJKL...MNOP",
      receiverAddress: null,
      senderName: "Investment Fund",
      senderImage: "https://api.dicebear.com/7.x/initials/svg?seed=IF&backgroundColor=059669",
      receiverName: "John Doe",
      receiverImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=John"
    },
    {
      id: 3,
      message: "Freelance project completion payment",
      category: "Income",
      amount: 200.00,
      date: "25 Aug 24",
      icon: "💼",
      senderAddress: "0x9876...5432...1FED...CBA9",
      receiverAddress: null,
      senderName: "Sarah Wilson",
      senderImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      receiverName: "John Doe",
      receiverImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=John"
    },
    {
      id: 4,
      message: "Payment sent for grocery purchase",
      category: "Food & Dining",
      amount: -85.50,
      date: "15 Sep 24",
      icon: "🛒",
      senderAddress: null,
      receiverAddress: "0x5555...7777...9999...BBBB",
      senderName: "John Doe",
      senderImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
      receiverName: "Fresh Mart",
      receiverImage: "https://api.dicebear.com/7.x/initials/svg?seed=FM&backgroundColor=10b981"
    },
    {
      id: 5,
      message: "Payment sent for coffee order",
      category: "Food & Dining",
      amount: -12.75,
      date: "14 Sep 24",
      icon: "☕",
      senderAddress: null,
      receiverAddress: "0x3333...4444...5555...6666",
      senderName: "John Doe",
      senderImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
      receiverName: "Coffee House",
      receiverImage: "https://api.dicebear.com/7.x/initials/svg?seed=CH&backgroundColor=047857"
    },
    {
      id: 6,
      message: "Transfer received from friend",
      category: "Transfer",
      amount: 250.00,
      date: "10 Sep 24",
      icon: "💳",
      senderAddress: "0x7777...8888...9999...AAAA",
      receiverAddress: null,
      senderName: "Mike Johnson",
      senderImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
      receiverName: "John Doe",
      receiverImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=John"
    },
    {
      id: 7,
      message: "Payment sent for dinner bill",
      category: "Food & Dining",
      amount: -45.20,
      date: "08 Sep 24",
      icon: "🍽️",
      senderAddress: null,
      receiverAddress: "0x2222...3333...4444...5555",
      senderName: "John Doe",
      senderImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
      receiverName: "Fine Dining Restaurant",
      receiverImage: "https://api.dicebear.com/7.x/initials/svg?seed=FD&backgroundColor=166534"
    }
  ];

  return (
    <main className="mx-auto max-w-md px-4 pb-24 pt-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">Transaction History</h1>
      </div>

      {/* Total Amount */}
      <div className="text-center mb-6">
        <div className="text-3xl font-bold text-gray-900">
          <span className="text-green-600">$</span>4,456.55
        </div>
        <div className="text-sm text-gray-500 mt-1">
          Net Balance
        </div>
      </div>

            {/* Monthly Chart */}
            <div className="mb-6">
              <div className="overflow-x-auto pb-2">
                <div className="flex items-end h-20 mb-2 relative min-w-max gap-2 px-2">
                  {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, index) => {
                    // Mock data for each month with both receiving and spending
                    const chartData = [
                      { receiving: 5, spending: 7 },
                      { receiving: 8, spending: 4 },
                      { receiving: 12, spending: 6 },
                      { receiving: 9, spending: 5 },
                      { receiving: 11, spending: 8 },
                      { receiving: 8, spending: 3 },
                      { receiving: 6, spending: 4 },
                      { receiving: 10, spending: 5 },
                      { receiving: 12, spending: 6 },
                      { receiving: 4, spending: 8 },
                      { receiving: 7, spending: 5 },
                      { receiving: 9, spending: 7 }
                    ];
                    const data = chartData[index];
            
                    return (
                      <div key={month} className="flex flex-col items-center gap-1 relative">
                        <div className="flex flex-col items-end gap-0.5">
                          {/* Receiving bar (green) */}
                          <div
                            className="w-5 rounded-t-sm bg-gradient-to-t from-green-500 to-green-400 cursor-pointer hover:from-green-600 hover:to-green-500 transition-all"
                            style={{ height: `${data.receiving * 3}px` }}
                            onMouseEnter={() => setHoveredBar({ month, type: 'receiving', amount: data.receiving * 1000 })}
                            onMouseLeave={() => setHoveredBar(null)}
                          ></div>
                          {/* Spending bar (red) */}
                          <div
                            className="w-5 rounded-t-sm bg-gradient-to-t from-red-500 to-red-400 cursor-pointer hover:from-red-600 hover:to-red-500 transition-all"
                            style={{ height: `${data.spending * 3}px` }}
                            onMouseEnter={() => setHoveredBar({ month, type: 'spending', amount: data.spending * 1000 })}
                            onMouseLeave={() => setHoveredBar(null)}
                          ></div>
                        </div>

                        {/* Tooltip */}
                        {hoveredBar && hoveredBar.month === month && (
                          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap z-10">
                            <div className="text-center">
                              <div className="font-semibold">
                                {hoveredBar.type === 'receiving' ? 'Received' : 'Spent'}
                              </div>
                              <div>${hoveredBar.amount.toLocaleString()}</div>
                            </div>
                            {/* Arrow pointing down */}
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-between text-xs text-gray-500 px-2">
                  {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(month => (
                    <span key={month} className="min-w-[24px] text-center">{month}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Analytics Card */}
            <div className="bg-white rounded-2xl p-6 mb-8 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Analytics</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <button 
                      onClick={() => setSelectedMonth(prev => (prev - 1 + 12) % 12)}
                      className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                    >
                      <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <span className="text-sm text-gray-600 min-w-[100px] text-center">{months[selectedMonth]}</span>
                    <button 
                      onClick={() => setSelectedMonth(prev => (prev + 1) % 12)}
                      className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                    >
                      <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">2024</span>
                  <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                {/* Donut Chart */}
                <div className="relative w-32 h-32">
                  {tooltipPosition && hoveredSegment && (
                    <div 
                      className="absolute z-10 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg shadow-lg whitespace-nowrap transform -translate-x-1/2 -translate-y-full"
                      style={{ 
                        left: tooltipPosition.x,
                        top: tooltipPosition.y - 10
                      }}
                    >
                      <div className="text-center">
                        <div className="font-medium mb-1">
                          {hoveredSegment === 'received' && 'Received'}
                          {hoveredSegment === 'sent' && 'Sent'}
                          {hoveredSegment === 'available' && 'Available'}
                        </div>
                        <div className="flex items-center gap-2">
                          <span>
                            {hoveredSegment === 'received' && '40%'}
                            {hoveredSegment === 'sent' && '30%'}
                            {hoveredSegment === 'available' && '30%'}
                          </span>
                          <span>•</span>
                          <span>
                            {hoveredSegment === 'received' && '$40,911'}
                            {hoveredSegment === 'sent' && '$12,273'}
                            {hoveredSegment === 'available' && '$4,091'}
                          </span>
                        </div>
                      </div>
                      <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-full">
                        <div className="border-solid border-t-gray-900 border-t-8 border-x-transparent border-x-8 border-b-0"></div>
                      </div>
                    </div>
                  )}
                  <svg className="w-full h-full transform -rotate-90">
                    {/* Background circle */}
                    <circle
                      cx="64"
                      cy="64"
                      r="60"
                      fill="none"
                      stroke="#E5E7EB"
                      strokeWidth="8"
                      className="opacity-25"
                    />
                    {/* Received - Green segment (40%) */}
                    <circle
                      cx="64"
                      cy="64"
                      r="60"
                      fill="none"
                      stroke="#22C55E"
                      strokeWidth="8"
                      strokeDasharray="150.79 377"
                      onMouseEnter={(e) => handleSegmentHover('received', e)}
                      onMouseLeave={handleSegmentLeave}
                      className={`opacity-90 transition-all duration-[2000ms] ease-out cursor-pointer ${
                        isChartVisible ? '' : 'stroke-dashoffset-[377]'
                      } ${hoveredSegment === 'received' ? 'stroke-[#16A34A]' : hoveredSegment ? 'opacity-50' : ''}`}
                    />
                    {/* Sent - Emerald segment (30%) */}
                    <circle
                      cx="64"
                      cy="64"
                      r="60"
                      fill="none"
                      stroke="#059669"
                      strokeWidth="8"
                      strokeDasharray="113.09 377"
                      strokeDashoffset="-150.79"
                      onMouseEnter={(e) => handleSegmentHover('sent', e)}
                      onMouseLeave={handleSegmentLeave}
                      className={`opacity-90 transition-all duration-[2000ms] ease-out delay-[600ms] cursor-pointer ${
                        isChartVisible ? '' : 'stroke-dashoffset-[377]'
                      } ${hoveredSegment === 'sent' ? 'stroke-[#047857]' : hoveredSegment ? 'opacity-50' : ''}`}
                    />
                    {/* Available - Dark green segment (30%) */}
                    <circle
                      cx="64"
                      cy="64"
                      r="60"
                      fill="none"
                      stroke="#10B981"
                      strokeWidth="8"
                      strokeDasharray="113.09 377"
                      strokeDashoffset="-263.88"
                      onMouseEnter={(e) => handleSegmentHover('available', e)}
                      onMouseLeave={handleSegmentLeave}
                      className={`opacity-90 transition-all duration-[2000ms] ease-out delay-[1200ms] cursor-pointer ${
                        isChartVisible ? '' : 'stroke-dashoffset-[377]'
                      } ${hoveredSegment === 'available' ? 'stroke-[#0D9488]' : hoveredSegment ? 'opacity-50' : ''}`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-sm text-gray-500">Total Balance</div>
                      <div className="text-lg font-bold text-gray-900">$8,182</div>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex-1 ml-8">
                  <div className="space-y-4">
                    <div 
                      className={`flex items-center justify-between p-2 rounded-lg transition-colors cursor-pointer ${
                        hoveredSegment === 'received' ? 'bg-green-50' : ''
                      }`}
                      onMouseEnter={() => setHoveredSegment('received')}
                      onMouseLeave={() => setHoveredSegment(null)}
                    >
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full bg-green-500 transition-colors ${
                            hoveredSegment === 'received' ? 'bg-[#16A34A]' : hoveredSegment ? 'opacity-50' : ''
                          }`}></div>
                          <span className={`text-gray-600 transition-colors ${
                            hoveredSegment === 'received' ? 'text-gray-900' : hoveredSegment ? 'opacity-50' : ''
                          }`}>Received</span>
                        </div>
                        <span className={`text-gray-900 font-medium transition-opacity ${
                          hoveredSegment && hoveredSegment !== 'received' ? 'opacity-50' : ''
                        }`}>$40,911</span>
                      </div>
                      <div 
                        className={`flex items-center justify-between p-2 rounded-lg transition-colors cursor-pointer ${
                          hoveredSegment === 'sent' ? 'bg-emerald-50' : ''
                        }`}
                        onMouseEnter={() => setHoveredSegment('sent')}
                        onMouseLeave={() => setHoveredSegment(null)}
                      >
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full bg-emerald-600 transition-colors ${
                            hoveredSegment === 'sent' ? 'bg-[#047857]' : hoveredSegment ? 'opacity-50' : ''
                          }`}></div>
                          <span className={`text-gray-600 transition-colors ${
                            hoveredSegment === 'sent' ? 'text-gray-900' : hoveredSegment ? 'opacity-50' : ''
                          }`}>Sent</span>
                        </div>
                        <span className={`text-gray-900 font-medium transition-opacity ${
                          hoveredSegment && hoveredSegment !== 'sent' ? 'opacity-50' : ''
                        }`}>$12,273</span>
                      </div>
                      <div 
                        className={`flex items-center justify-between p-2 rounded-lg transition-colors cursor-pointer ${
                          hoveredSegment === 'available' ? 'bg-emerald-50' : ''
                        }`}
                        onMouseEnter={() => setHoveredSegment('available')}
                        onMouseLeave={() => setHoveredSegment(null)}
                      >
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full bg-emerald-500 transition-colors ${
                            hoveredSegment === 'available' ? 'bg-[#0D9488]' : hoveredSegment ? 'opacity-50' : ''
                          }`}></div>
                          <span className={`text-gray-600 transition-colors ${
                            hoveredSegment === 'available' ? 'text-gray-900' : hoveredSegment ? 'opacity-50' : ''
                          }`}>Available</span>
                        </div>
                        <span className={`text-gray-900 font-medium transition-opacity ${
                          hoveredSegment && hoveredSegment !== 'available' ? 'opacity-50' : ''
                        }`}>$4,091</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

      {/* Transaction List */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4">Card Transactions</h2>
        <div className="space-y-3">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                {/* Profile Image */}
                <div className="relative">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <img 
                      src={transaction.amount > 0 ? transaction.senderImage : transaction.receiverImage}
                      alt={transaction.amount > 0 ? transaction.senderName : transaction.receiverName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center ${
                    transaction.amount > 0 ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {transaction.amount > 0 ? (
                      <ArrowDownIcon className="w-4 h-4 text-green-600" />
                    ) : (
                      <ArrowUpIcon className="w-4 h-4 text-red-600" />
                    )}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">
                      {transaction.amount > 0 ? transaction.senderName : transaction.receiverName}
                    </span>
                  </div>
                  {transaction.amount > 0 && transaction.senderAddress && (
                    <div className="text-xs text-gray-400 font-mono truncate mt-1">
                      From: {transaction.senderAddress}
                    </div>
                  )}
                  {transaction.amount < 0 && transaction.receiverAddress && (
                    <div className="text-xs text-gray-400 font-mono truncate mt-1">
                      To: {transaction.receiverAddress}
                    </div>
                  )}
                  <div className="text-sm text-gray-600 truncate mt-1">{transaction.message}</div>
                </div>
                <div className="text-right flex-shrink-0 ml-2">
                  <div className={`font-semibold ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${Math.abs(transaction.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{transaction.date}</div>
                  <div className="text-xs text-gray-400 mt-1">
                    {transaction.amount > 0 ? 'Payment received' : 'Payment sent'}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}


