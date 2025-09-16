// Configuration constants for KaiaPay dApp
// Based on task1.md requirements and actual deployed backend

export const CONFIG = {
  // Backend API Configuration  
  BACKEND_URL: 'https://kaia-server.onrender.com',
  
  // Kaia Network
  CHAIN_ID: 1001, // Kaia testnet
  RPC_URL: 'https://public-en-kairos.node.kaia.io',
  
  // Fee Delegation Service  
  FEE_DELEGATION_URL: 'https://fee-delegation-kairos.kaia.io',
  
  // Contract Addresses (deployed contracts from artifacts)
  USDT_ADDRESS: '0x8CCaC8CBE276a225B1Af2b85dEee8e12cFB48193',
  BULK_PAYROLL_ADDRESS: '0xE9bD986514a6d35B1B73BeA6F19804D3c7aed284', 
  SPLIT_BILLING_ADDRESS: '0x6892D8358bD3EE04a35Ad5844181BDED05dcdf2f',
  INVOICE_SERVICE_ADDRESS: '0xc70DfAf8d864125D37237fc7B034ACAE1f3397d9',
  
  // LINE Configuration (from .env)
  LIFF_ID: '2008110181-oen1dWyd',
  LINE_CLIENT_ID: '2008110181',
  LINE_REDIRECT_URI: 'https://payzoll-pay.onrender.com/auth/callback',
  
  // DappPortal Configuration (from .env)
  DAPP_PORTAL_CLIENT_ID: 'feab7d6b-52d3-4568-ab0f-ad72c35fe884',
  
  // App Configuration
  APP_URL: 'https://payzoll-pay.onrender.com'
} as const;

// Backend API Endpoints - exact routes from Kaia-Server
export const API_ENDPOINTS = {
  // Auth routes (from authRoutes.js)
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout', 
    CALLBACK: '/auth/callback'
  },
  
  // User profile routes
  USER: {
    PROFILE: '/api/user/profile',
    UPDATE_PROFILE: '/api/user/profile'
  },
  
  // P2P routes (from p2pRoutes.js)
  P2P: {
    SEND: '/api/p2p/send',
    HISTORY: '/api/p2p/history'
  },
  
  // Bulk transfer routes (from bulkRoutes.js)
  BULK: {
    CREATE: '/api/bulk/create',
    HISTORY: '/api/bulk/history'
  },
  
  // Split payment routes (from splitRoutes.js)  
  SPLIT: {
    CREATE: '/api/split/create',
    JOIN: '/api/split/join',
    HISTORY: '/api/split/history'
  },
  
  // Transaction history routes (from txnHistoryRoutes.js)
  TRANSACTIONS: {
    HISTORY: '/api/transactions/history'
  }
} as const;

// Schema interfaces matching backend models
export interface UserSchema {
  userId: string;           // Required, unique - our app user ID
  displayName?: string;     // Optional - user display name
  pictureUrl?: string;      // Optional - profile picture URL
  statusMessage?: string;   // Optional - user status message
  walletAddress?: string;   // Optional - user's wallet address
  lineUserId?: string;      // Optional - LINE user ID for integration
}

// P2P Transaction Schema (from p2pSchema.js)
export interface P2PTransaction {
  senderId: string;         // Required - sender user ID
  receiverId: string;       // Required - receiver user ID
  amount: number;          // Required - transaction amount
  currency: string;        // Required - currency type (e.g., 'USDT')
  transactionHash?: string; // Optional - blockchain transaction hash
  status: 'pending' | 'completed' | 'failed'; // Transaction status
  createdAt?: Date;        // Timestamp
  updatedAt?: Date;        // Timestamp
}

// Bulk Payment Schema (from BulkPayment.js)
export interface BulkPayment {
  payerId: string;         // Required - payer user ID
  recipients: Array<{      // Required - array of recipients
    userId: string;        // Recipient user ID
    amount: number;        // Amount for this recipient
  }>;
  totalAmount: number;     // Required - total payment amount
  currency: string;        // Required - currency type
  contractAddress?: string; // Optional - smart contract address
  transactionHash?: string; // Optional - blockchain transaction hash
  status: 'pending' | 'completed' | 'failed';
  createdAt?: Date;
  updatedAt?: Date;
}

// Split Payment Schema (from SplitPayments.js)  
export interface SplitPayment {
  billId: string;          // Required - unique bill identifier
  creatorId: string;       // Required - bill creator user ID
  participants: Array<{    // Required - array of participants
    userId: string;        // Participant user ID
    amount: number;        // Amount owed by participant
    paid: boolean;         // Whether participant has paid
  }>;
  totalAmount: number;     // Required - total bill amount
  description?: string;    // Optional - bill description
  currency: string;        // Required - currency type
  contractAddress?: string; // Optional - smart contract address
  status: 'active' | 'completed' | 'cancelled';
  createdAt?: Date;
  updatedAt?: Date;
}

// USDT Contract Methods (from USDT.json ABI)
export const USDT_METHODS = {
  BALANCE_OF: 'balanceOf',
  TRANSFER: 'transfer', 
  FAUCET: 'faucet',        // Confirmed from ABI - mint USDT for testing
  DECIMALS: 'decimals',    // For proper amount formatting
  SYMBOL: 'symbol'
} as const;

// Contract interaction utilities
export const CONTRACT_METHODS = {
  USDT: USDT_METHODS,
  BULK_PAYROLL: {
    CREATE_BATCH: 'createBatch',
    EXECUTE_BATCH: 'executeBatch',
    GET_BATCH: 'getBatch'
  },
  SPLIT_BILLING: {
    CREATE_BILL: 'createBill',
    PAY_SHARE: 'payShare', 
    GET_BILL: 'getBill'
  }
} as const;