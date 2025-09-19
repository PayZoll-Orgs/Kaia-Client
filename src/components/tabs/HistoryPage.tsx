"use client";
import { ArrowDownIcon, ArrowUpIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
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

interface TransactionSummary {
  totalTransactions: number;
  p2pCount: number;
  bulkCount: number;
  splitCount: number;
  sentTransactions: number;
  receivedTransactions: number;
}

interface TransactionHistoryResponse {
  summary: TransactionSummary;
  transactions: TransactionDetail[];
}

export default function HistoryPage() {
  const { userProfile } = useAuth();
  
  // State for transaction data
  const [transactions, setTransactions] = useState<TransactionDetail[]>([]);
  const [summary, setSummary] = useState<TransactionSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for UI
  const [hoveredBar, setHoveredBar] = useState<{ month: string; type: 'receiving' | 'spending'; amount: number } | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
  const [isChartVisible, setIsChartVisible] = useState(false);
  const [hoveredSegment, setHoveredSegment] = useState<'received' | 'sent' | 'available' | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number } | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionDetail | null>(null);

  // Fetch transaction history
  const fetchTransactionHistory = async () => {
    if (!userProfile?.userId) return;

    try {
      setLoading(true);
      const response = await fetch(`${CONFIG.BACKEND_URL}/api/history/getUserTxnHistory/${userProfile.userId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch transaction history');
      }
      
      const data: TransactionHistoryResponse = await response.json();
      setTransactions(data.transactions);
      setSummary(data.summary);
      setError(null);
    } catch (err) {
      console.error('Error fetching transaction history:', err);
      setError(err instanceof Error ? err.message : 'Failed to load transaction history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactionHistory();
  }, [userProfile?.userId]);

  useEffect(() => {
    // Trigger animation after component mount
    setIsChartVisible(true);
  }, []);

  // Calculate analytics from real data
  const calculateAnalytics = () => {
    if (!transactions.length) return { totalReceived: 0, totalSent: 0, netBalance: 0 };

    let totalReceived = 0;
    let totalSent = 0;

    transactions.forEach(txn => {
      const amount = txn.userAmount || txn.amount || 0;
      if (txn.userRole === 'receiver' || txn.userRole === 'contributor') {
        totalReceived += amount;
      } else if (txn.userRole === 'sender' || txn.userRole === 'payee') {
        totalSent += amount;
      }
    });

    return {
      totalReceived,
      totalSent,
      netBalance: totalReceived - totalSent
    };
  };

  // Calculate monthly data from transactions
  const calculateMonthlyData = () => {
    const monthlyData = Array(12).fill(0).map(() => ({ receiving: 0, spending: 0 }));
    
    transactions.forEach(txn => {
      const date = new Date(txn.createdAt);
      const month = date.getMonth();
      const amount = txn.userAmount || txn.amount || 0;
      
      if (txn.userRole === 'receiver' || txn.userRole === 'contributor') {
        monthlyData[month].receiving += amount;
      } else if (txn.userRole === 'sender' || txn.userRole === 'payee') {
        monthlyData[month].spending += amount;
      }
    });

    return monthlyData;
  };

  const analytics = calculateAnalytics();
  const monthlyData = calculateMonthlyData();
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

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

  const getTransactionDisplayName = (transaction: TransactionDetail) => {
    switch (transaction.transactionType) {
      case 'P2P':
        return transaction.userRole === 'sender' ? transaction.receiverId : transaction.senderId;
      case 'Bulk Transfer':
        if (transaction.userRole === 'sender') {
          return `${transaction.receiverIds?.length || 0} Recipients`;
        } else {
          return transaction.senderId;
        }
      case 'Split Payment':
        if (transaction.userRole === 'payee') {
          return `${transaction.contributorIds?.length || 0} Contributors`;
        } else {
          return transaction.payeeId;
        }
      default:
        return 'Unknown';
    }
  };

  const getTransactionIcon = (transaction: TransactionDetail) => {
    switch (transaction.transactionType) {
      case 'P2P':
        return '💳';
      case 'Bulk Transfer':
        return '📤';
      case 'Split Payment':
        return '🧾';
      default:
        return '💰';
    }
  };

  if (loading) {
    return (
      <main className="mx-auto max-w-md px-4 pb-24 pt-4">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading transaction history...</span>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-md px-4 pb-24 pt-4">
        <div className="text-center py-12">
          <div className="text-red-600 mb-2">⚠️ Error loading transactions</div>
          <div className="text-gray-600 text-sm">{error}</div>
          <button 
            onClick={fetchTransactionHistory}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-md px-4 pb-24 pt-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">Transaction History</h1>
      </div>

      {/* Total Amount */}
      <div className="text-center mb-6">
        <div className="text-3xl font-bold text-gray-900">
          <span className="text-green-600">$</span>{Math.abs(analytics.netBalance).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
        <div className="text-sm text-gray-500 mt-1">
          Net Balance {analytics.netBalance >= 0 ? '(Positive)' : '(Negative)'}
        </div>
      </div>

      {/* Monthly Chart */}
      <div className="mb-6">
        <div className="overflow-x-auto pb-2">
          <div className="flex items-end h-20 mb-2 relative min-w-max gap-2 px-2">
            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, index) => {
              const data = monthlyData[index];
              const maxHeight = 60;
              const maxAmount = Math.max(...monthlyData.flatMap(d => [d.receiving, d.spending]));
              const receivingHeight = maxAmount > 0 ? (data.receiving / maxAmount) * maxHeight : 0;
              const spendingHeight = maxAmount > 0 ? (data.spending / maxAmount) * maxHeight : 0;

              return (
                <div key={month} className="flex flex-col items-center gap-1 relative">
                  <div className="flex flex-col items-end gap-0.5">
                    {/* Receiving bar (green) */}
                    <div
                      className="w-5 rounded-t-sm bg-gradient-to-t from-green-500 to-green-400 cursor-pointer hover:from-green-600 hover:to-green-500 transition-all"
                      style={{ height: `${receivingHeight}px` }}
                      onMouseEnter={() => setHoveredBar({ month, type: 'receiving', amount: data.receiving })}
                      onMouseLeave={() => setHoveredBar(null)}
                    ></div>
                    {/* Spending bar (red) */}
                    <div
                      className="w-5 rounded-t-sm bg-gradient-to-t from-red-500 to-red-400 cursor-pointer hover:from-red-600 hover:to-red-500 transition-all"
                      style={{ height: `${spendingHeight}px` }}
                      onMouseEnter={() => setHoveredBar({ month, type: 'spending', amount: data.spending })}
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
                        <div>${hoveredBar.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
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
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">2025</span>
            
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
                    {hoveredSegment === 'available' && 'Net Balance'}
                  </div>
                  <div className="flex items-center gap-2">
                    <span>
                      ${hoveredSegment === 'received' && analytics.totalReceived.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      {hoveredSegment === 'sent' && analytics.totalSent.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      {hoveredSegment === 'available' && Math.abs(analytics.netBalance).toLocaleString('en-US', { minimumFractionDigits: 2 })}
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
              {/* Received - Green segment */}
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
              {/* Sent - Emerald segment */}
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
              {/* Available - Dark green segment */}
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
                <div className="text-lg font-bold text-gray-900">${Math.abs(analytics.netBalance).toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
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
                }`}>${analytics.totalReceived.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
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
                }`}>${analytics.totalSent.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
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
                  }`}>Net Balance</span>
                </div>
                <span className={`text-gray-900 font-medium transition-opacity ${
                  hoveredSegment && hoveredSegment !== 'available' ? 'opacity-50' : ''
                }`}>${Math.abs(analytics.netBalance).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction List */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4">Transaction History</h2>
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-600">{error}</div>
        ) : (
          <div className="space-y-3">
            {transactions.map((transaction: TransactionDetail, index: number) => {
              // Determine if this is a received transaction based on user role
              const isReceived = transaction.userRole === 'receiver' || transaction.userRole === 'contributor';
              
              // Get the display amount
              const displayAmount = transaction.userAmount || transaction.totalAmount || transaction.amount || 0;
              
              // Get display name based on transaction type and role
              let displayName = '';
              if (transaction.transactionType === 'P2P') {
                displayName = isReceived ? (transaction.senderId || 'Unknown Sender') : 
                                         (transaction.receiverId || 'Unknown Receiver');
              } else if (transaction.transactionType === 'Bulk Transfer') {
                displayName = transaction.userRole === 'sender' ? 'Bulk Payment' : 'Bulk Received';
              } else if (transaction.transactionType === 'Split Payment') {
                displayName = transaction.title || 'Split Payment';
              }

              return (
                <div key={transaction._id || index} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-3">
                    {/* Transaction Icon */}
                    <div className="relative">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        isReceived ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        {isReceived ? (
                          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                          </svg>
                        ) : (
                          <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                          </svg>
                        )}
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                        transaction.transactionType === 'P2P' ? 'bg-blue-500' : 
                        transaction.transactionType === 'Bulk Transfer' ? 'bg-purple-500' : 'bg-orange-500'
                      }`}>
                        {transaction.transactionType === 'P2P' ? 'P' : transaction.transactionType === 'Bulk Transfer' ? 'B' : 'S'}
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">{displayName}</span>
                      </div>
                      
                      {transaction.transactionType === 'P2P' && (
                        <div className="text-xs text-gray-400 font-mono truncate mt-1">
                          {isReceived ? `From: ${transaction.senderId}` : `To: ${transaction.receiverId}`}
                        </div>
                      )}
                      
                      {transaction.transactionType === 'Bulk Transfer' && (
                        <div className="text-xs text-gray-400 truncate mt-1">
                          Bulk Transfer • {transaction.receiverIds?.length || 0} recipients
                        </div>
                      )}
                      
                      {transaction.transactionType === 'Split Payment' && (
                        <div className="text-xs text-gray-400 truncate mt-1">
                          Split Bill • {transaction.contributorIds?.length || 0} contributors
                          {transaction.deadline && ` • Due: ${new Date(transaction.deadline).toLocaleDateString()}`}
                        </div>
                      )}
                      
                      {transaction.description && (
                        <div className="text-sm text-gray-600 truncate mt-1">{transaction.description}</div>
                      )}
                    </div>
                    
                    <div className="text-right flex-shrink-0 ml-2">
                      <div className={`font-semibold ${isReceived ? 'text-green-600' : 'text-red-600'}`}>
                        {isReceived ? '+' : '-'}${Math.abs(displayAmount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(transaction.createdAt).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {typeof transaction.status === 'string' ? transaction.status : 'Completed'}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            {transactions.length === 0 && !loading && (
              <div className="text-center py-8 text-gray-500">No transactions found</div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}


