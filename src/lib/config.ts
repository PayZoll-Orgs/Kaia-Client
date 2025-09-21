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
  
  // Contract Addresses (deployed contracts from latest deployment - 2025-09-20T19:17:20.180Z)
  USDT_ADDRESS: '0xd55B72640f3e31910A688a2Dc81876F053115B09',
  BULK_PAYROLL_ADDRESS: '0xE9bD986514a6d35B1B73BeA6F19804D3c7aed284', 
  SPLIT_BILLING_ADDRESS: '0x6892D8358bD3EE04a35Ad5844181BDED05dcdf2f',
  INVOICE_SERVICE_ADDRESS: '0xc70DfAf8d864125D37237fc7B034ACAE1f3397d9',
  ENHANCED_LENDING_ADDRESS: '0xc754860D0064f0707F5c5c9de2f0930d580E7Db7', // Latest Enhanced Lending Protocol
  
  // LP Token Addresses (for Enhanced Lending Protocol - Latest deployment)
  K_KAIA_ADDRESS: '0xf38b06fcf9e107EBb3AE2104D57CC3dF7279F64B', // kKAIA LP token - latest
  K_USDT_ADDRESS: '0xB6369bfC61b27856A8DCA6bebE1a51766C767133', // kUSDT LP token - latest
  
  // LINE Configuration (from .env)
  LIFF_ID: '2008110181-oen1dWyd',
  LINE_CLIENT_ID: '2008110181',
  LINE_REDIRECT_URI: 'https://payzoll-pay.onrender.com/auth/callback',
  
  // DappPortal Configuration (from .env)
  DAPP_PORTAL_CLIENT_ID: 'feab7d6b-52d3-4568-ab0f-ad72c35fe884',
  
  // App Configuration
  APP_URL: 'https://payzoll-pay.onrender.com'
} as const;

// Backend API Endpoints - exact routes from backend.md
export const API_ENDPOINTS = {
  // Auth routes (from backend.md)
  AUTH: {
    ADD_USER: '/api/auth/addUser',           // POST - Create new user
    GET_USER: '/api/auth/getUser',           // GET - Get user by username (/api/auth/getUser/:username)
    SEARCH_USERS: '/api/auth/searchUsers',   // GET - Search users by query  
    GET_ALL_USERS: '/api/auth/getAllUsers'   // GET - Get all users
  },
  
  // P2P routes (from backend.md)
  P2P: {
    RECORD: '/api/p2p/recordP2PTxn',         // POST - Record P2P transaction
    GET_TRANSACTIONS: '/api/p2p/getP2PTxns'  // GET - Get P2P transactions (/api/p2p/getP2PTxns/:username)
  },
  
  // Bulk transfer routes (from backend.md)
  BULK: {
    RECORD: '/api/bulk/recordBulkTxn',       // POST - Record bulk transaction
    UPDATE_STATUS: '/api/bulk/updateBulkTxnStatus', // PUT - Update bulk transaction status
    GET_TRANSACTIONS: '/api/bulk/getBulkTxns'        // GET - Get bulk transactions (/api/bulk/getBulkTxns/:userId)
  },
  
  // Split payment routes (from backend.md)  
  SPLIT: {
    RECORD: '/api/split/recordSplitTxn',     // POST - Record split transaction
    UPDATE_STATUS: '/api/split/updateSplitTxnStatus', // PUT - Update split payment status  
    GET_TRANSACTIONS: '/api/split/getSplitTxns',      // GET - Get split transactions by user
    GET_BY_ID: '/api/split/getSplitTxnById'           // GET - Get split transaction by ID
  }
} as const;

// Schema interfaces matching backend models exactly
export interface UserSchema {
  username: string;         // Required, unique - custom username chosen by user
  displayName: string;      // Required - user display name  
  pictureUrl?: string;      // Optional - profile picture URL
  statusMessage?: string;   // Optional - user status message
  walletAddress: string;    // Required - user's wallet address
  userId: string;           // Required - LINE user ID for notifications
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