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
  
  // ✅ KAIA TESTNET DEPLOYED CONTRACTS - LIVE DEPLOYMENT
  USDT_ADDRESS: '0xd5578DD1B35713484DD8f872e36674F2ED2839a3', // ✅ DummyUSDT - Kaia testnet
  USDY_ADDRESS: '0xE449AB36fA3DD7167D1A73Fd598E1377e5ff1461', // ✅ USDY - Real World Asset token - Kaia testnet
  BULK_PAYROLL_ADDRESS: '0xB096Fe0128e804B0ed99055A93D438137998A337', // ✅ BulkPayroll - Kaia testnet
  SPLIT_BILLING_ADDRESS: '0x913Adbaa70Ba693636c2663653F517761B23C61e', // ✅ SplitBilling - Kaia testnet
  INVOICE_SERVICE_ADDRESS: '0xa23A75AFe9987F6D7db06792061AB4bEbdEcCbF8', // ✅ InvoiceSubscription - Kaia testnet
  ENHANCED_LENDING_ADDRESS: '0x59a817BA3FfB4a2590B96B3625F4Ac2B7B79c5D8', // ✅ Enhanced Lending Protocol - Kaia testnet
  
  // ✅ LP Token Addresses - Kaia testnet deployment
  K_KAIA_ADDRESS: '0xAc364154272d1B79539d2d7B35156ca7134EBfB7', // ✅ kKAIA LP token - Kaia testnet
  K_USDT_ADDRESS: '0x22cD2E80e3a63f8FF01AdFeBEA27bE08AB46aF3b', // ✅ kUSDT LP token - Kaia testnet
  
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

// ✅ VERIFIED METHOD IDs - FROM CLEAN DEPLOYMENT
export const METHOD_IDS = {
  // DummyUSDT (Faucet USDT)
  USDT: {
    FAUCET: '0xde5f72fd',           // faucet()
    TRANSFER: '0xa9059cbb',         // transfer(address,uint256)
    APPROVE: '0x095ea7b3',          // approve(address,uint256)
    BALANCE_OF: '0x70a08231',       // balanceOf(address)
    ALLOWANCE: '0xdd62ed3e'         // allowance(address,address)
  },
  
  // USDY (Real World Asset)
  USDY: {
    FAUCET: '0xfbbfb782',           // claimFromFaucet()
    TRANSFER: '0xa9059cbb',         // transfer(address,uint256)
    APPROVE: '0x095ea7b3',          // approve(address,uint256)
    BALANCE_OF: '0x70a08231',       // balanceOf(address)
    ALLOWANCE: '0xdd62ed3e'         // allowance(address,address)
  },
  
  // BulkPayroll
  BULK_PAYROLL: {
    BULK_TRANSFER: '0xe886dade',    // bulkTransfer(address,address[],uint256[])
    CLAIM_FAILED: '0x09ae54be',     // claimFailedTransfer(address)
    GET_FAILED_AMOUNT: '0xe65c31c4' // getFailedAmount(address,address)
  },
  
  // SplitBilling
  SPLIT_BILLING: {
    CREATE_SPLIT: '0x68fcb6fd',     // createSplit(address,address[],uint256[],address,uint256,string)
    PAY_SHARE: '0xc97320a7',        // payShare(uint256)
    GET_SPLIT_DETAILS: '0xf6b30c60', // getSplitDetails(uint256)
    CANCEL_SPLIT: '0xb3a0ab98'      // cancelSplit(uint256)
  },
  
  // LPToken
  LP_TOKEN: {
    MINT: '0x40c10f19',             // mint(address,uint256)
    BURN: '0x9dc29fac',             // burn(address,uint256)
    BALANCE_OF: '0x70a08231',       // balanceOf(address)
    TRANSFER: '0xa9059cbb'          // transfer(address,uint256)
  },
  
  // Enhanced Lending Protocol - Complete method IDs
  ENHANCED_LENDING: {
    // 💰 CORE LENDING FUNCTIONS
    DEPOSIT: '0x47e7ef24',                    // deposit(address,uint256)
    REDEEM: '0x1e9a6950',                     // redeem(address,uint256)
    CLAIM_LENDING_EARNINGS: '0x790778b1',     // claimLendingEarnings(address)
    
    // 🔒 COLLATERAL FUNCTIONS
    DEPOSIT_COLLATERAL: '0xbad4a01f',         // depositCollateral(uint256)
    WITHDRAW_COLLATERAL: '0x6112fe2e',        // withdrawCollateral(uint256)
    
    // 💳 BORROWING FUNCTIONS  
    BORROW: '0x4b8a3529',                     // borrow(address,uint256)
    REPAY: '0x22867d78',                      // repay(address,uint256)
    REPAY_INTEREST: '0x1831f0c7',             // repayInterest(address,uint256)
    REPAY_PRINCIPAL: '0xfc60fb5d',            // repayPrincipal(address,uint256)
    
    // 👥 REFERRAL FUNCTIONS
    REGISTER_REFERRAL_CODE: '0x59fb7752',     // registerReferralCode(string)
    JOIN_WITH_REFERRAL: '0x345040ba',         // joinWithReferral(string,address)
    CLAIM_REFERRAL_REWARDS: '0x05eaab4b',     // claimReferralRewards()
    
    // 📊 DASHBOARD FUNCTIONS (View)
    GET_BORROWER_DASHBOARD: '0xd14eff2c',     // getBorrowerDashboard(address)
    GET_LENDER_INFO: '0xdb33840c',            // getLenderInfo(address,address)
    GET_REFERRAL_INFO: '0x21874ae2',          // getReferralInfo(address)
    GET_DEBT_BREAKDOWN: '0xc53622e0',         // getDebtBreakdown(address,address)
    
    // 📈 ANALYTICS FUNCTIONS (View)
    GET_LTV: '0xaca25f9a',                    // getLTV(address)
    IS_LIQUIDATABLE: '0x042e02cf',            // isLiquidatable(address)
    COLLATERAL_BALANCE: '0xa1bf2840',         // collateralBalance(address)
    DEBT_BALANCE: '0xad8f240e',               // debtBalance(address,address)
    ACCRUED_INTEREST: '0xd6c4f32c',           // accruedInterest(address,address)
    
    // 🆘 EMERGENCY FUNCTIONS
    LIQUIDATE: '0xbcbaf487',                  // liquidate(address,uint256)
    EMERGENCY_WITHDRAW: '0x95ccea67'          // emergencyWithdraw(address,uint256)
  }
} as const;

// LEGACY USDT Contract Methods (for backward compatibility)
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