// Enhanced Lending Protocol Service
// This service provides all interactions with the Enhanced Lending Protocol contract

import { CONFIG } from './config';
import { ENHANCED_LENDING_ADDRESS, USDT_ADDRESS, KAIA_ADDRESS, USDY_ADDRESS } from './contract-addresses';

// Enhanced Lending Protocol ABI (essential functions)
const ENHANCED_LENDING_ABI = [
  // === REFERRAL FUNCTIONS ===
  'function registerReferralCode(string calldata code) external',
  'function joinWithReferral(string calldata code, address referrer) external',
  'function claimReferralRewards() external',
  'function getReferralInfo(address user) external view returns (uint256 totalReferrals, uint256 totalRewardsEarned, uint256 claimableRewards, address[] memory referredUsers, bool hasReferrer, bool isRegistered)',

  // === LENDING FUNCTIONS ===
  'function deposit(address token, uint256 amount) external',
  'function claimLendingEarnings(address token) external',
  'function getLenderInfo(address lender, address token) external view returns (uint256 totalDeposited, uint256 currentEarnings, uint256 claimableEarnings, uint256 projectedAPY, uint256 lpTokenBalance)',

  // === BORROWING FUNCTIONS ===
  'function depositCollateral(uint256 amount) external',
  'function withdrawCollateral(uint256 amount) external',
  'function borrow(address token, uint256 amount) external',
  'function repay(address token, uint256 amount) external',
  'function repayInterest(address token, uint256 amount) external',
  'function repayPrincipal(address token, uint256 amount) external',
  'function getBorrowerDashboard(address borrower) external view returns (uint256 currentLTV, uint256 totalCollateralUSD, uint256 totalDebtUSD, uint256 kaiaDebtPrincipal, uint256 kaiaDebtInterest, uint256 usdtDebtPrincipal, uint256 usdtDebtInterest, uint256 liquidationThreshold, bool isLiquidatableStatus)',
  'function getDebtBreakdown(address borrower, address token) external view returns (uint256 principal, uint256 accrued, uint256 total, uint256 currentInterestRate)',

  // === VIEW FUNCTIONS ===
  'function getUserTransactions(address user, uint256 offset, uint256 limit) external view returns (tuple(address user, string transactionType, address token, uint256 amount, uint256 timestamp, bytes32 txHash)[] memory transactions)',
  'function getKaiaPrice() public view returns (uint256)',
  'function getUsdtPrice() public view returns (uint256)',
  'function KAIA() public view returns (address)',
  'function USDT() public view returns (address)',
  'function USDY() public view returns (address)',
  
  // === EVENTS ===
  'event ReferralJoined(address indexed referee, address indexed referrer, uint256 referrerReward, uint256 refereeBonus, uint256 timestamp)',
  'event ReferralRewardsClaimed(address indexed user, uint256 amount, uint256 timestamp)',
  'event LendingEarningsClaimed(address indexed lender, address indexed token, uint256 amount, uint256 timestamp)',
  'event DepositEnhanced(address indexed user, address indexed token, uint256 amount, uint256 lpTokens, uint256 totalDeposited, uint256 timestamp)'
];

// TypeScript interfaces
export interface ReferralInfo {
  totalReferrals: number;
  totalRewardsEarned: string;
  claimableRewards: string;
  referredUsers: string[];
  hasReferrer: boolean;
  isRegistered: boolean;
}

export interface LenderInfo {
  totalDeposited: string;
  currentEarnings: string;
  claimableEarnings: string;
  projectedAPY: number; // in basis points
  lpTokenBalance: string;
}

export interface BorrowerDashboard {
  currentLTV: string;
  totalCollateralUSD: string;
  totalDebtUSD: string;
  kaiaDebtPrincipal: string;
  kaiaDebtInterest: string;
  usdtDebtPrincipal: string;
  usdtDebtInterest: string;
  liquidationThreshold: string;
  isLiquidatable: boolean;
}

export interface DebtBreakdown {
  principal: string;
  accrued: string;
  total: string;
  currentInterestRate: number;
}

export interface TransactionRecord {
  user: string;
  transactionType: string;
  token: string;
  amount: string;
  timestamp: number;
  txHash: string;
}

// Wallet service integration
declare global {
  interface Window {
    klaytn?: any;
  }
}

class EnhancedLendingService {
  private contractAddress: string;
  private abi: string[];

  constructor() {
    this.contractAddress = ENHANCED_LENDING_ADDRESS();
    this.abi = ENHANCED_LENDING_ABI;
  }

  // === REFERRAL SYSTEM ===

  /**
   * Register a referral code for the current user
   */
  async registerReferralCode(code: string): Promise<string> {
    try {
      const walletService = (await import('./wallet-service')).default;
      
      // Encode function call: registerReferralCode(string)
      const functionSelector = '0xa4b5e361'; // registerReferralCode(string) selector
      
      // Encode the string parameter
      const encodedCode = this.encodeString(code);
      const callData = functionSelector + encodedCode.slice(2);

      const txHash = await walletService.sendTransaction(
        this.contractAddress,
        '0x0',
        '0x186a0', // 100k gas
        callData
      );

      console.log('✅ Referral code registered:', { code, txHash });
      return txHash;
    } catch (error) {
      console.error('❌ Failed to register referral code:', error);
      throw error;
    }
  }

  /**
   * Join using a referral code
   */
  async joinWithReferral(code: string, referrer: string): Promise<string> {
    try {
      const walletService = (await import('./wallet-service')).default;
      
      // Encode function call: joinWithReferral(string,address)
      const functionSelector = '0x12345678'; // joinWithReferral(string,address) selector
      
      // Encode parameters
      const encodedCode = this.encodeString(code);
      const encodedReferrer = referrer.toLowerCase().replace('0x', '').padStart(64, '0');
      const callData = functionSelector + '0000000000000000000000000000000000000000000000000000000000000040' + encodedReferrer + encodedCode.slice(2);

      const txHash = await walletService.sendTransaction(
        this.contractAddress,
        '0x0',
        '0x249f0', // 150k gas
        callData
      );

      console.log('✅ Joined with referral:', { code, referrer, txHash });
      return txHash;
    } catch (error) {
      console.error('❌ Failed to join with referral:', error);
      throw error;
    }
  }

  /**
   * Claim accumulated referral rewards
   */
  async claimReferralRewards(): Promise<string> {
    try {
      const walletService = (await import('./wallet-service')).default;
      
      // Encode function call: claimReferralRewards()
      const functionSelector = '0x87654321'; // claimReferralRewards() selector
      const callData = functionSelector;

      const txHash = await walletService.sendTransaction(
        this.contractAddress,
        '0x0',
        '0x1c9c3', // 120k gas
        callData
      );

      console.log('✅ Referral rewards claimed:', txHash);
      return txHash;
    } catch (error) {
      console.error('❌ Failed to claim referral rewards:', error);
      throw error;
    }
  }

  /**
   * Get referral information for a user
   */
  async getReferralInfo(userAddress: string): Promise<ReferralInfo> {
    try {
      // For now, return mock data - in production, this would call the contract
      return {
        totalReferrals: 12,
        totalRewardsEarned: '60.0',
        claimableRewards: '15.0',
        referredUsers: [],
        hasReferrer: false,
        isRegistered: true
      };
    } catch (error) {
      console.error('❌ Failed to get referral info:', error);
      throw error;
    }
  }

  // === LENDING SYSTEM ===

  /**
   * Deposit tokens for lending
   */
  async deposit(tokenAddress: string, amount: string): Promise<string> {
    try {
      const walletService = (await import('./wallet-service')).default;
      
      // Encode function call: deposit(address,uint256)
      const functionSelector = '0x47e7ef24'; // deposit(address,uint256) selector
      
      // Encode parameters
      const encodedToken = tokenAddress.toLowerCase().replace('0x', '').padStart(64, '0');
      const amountInWei = BigInt(Math.floor(parseFloat(amount) * 1e18));
      const encodedAmount = amountInWei.toString(16).padStart(64, '0');
      
      const callData = functionSelector + encodedToken + encodedAmount;

      const txHash = await walletService.sendTransaction(
        this.contractAddress,
        '0x0',
        '0x2dc6c', // 200k gas
        callData
      );

      console.log('✅ Deposit successful:', { tokenAddress, amount, txHash });
      return txHash;
    } catch (error) {
      console.error('❌ Failed to deposit:', error);
      throw error;
    }
  }

  /**
   * Claim accumulated lending earnings
   */
  async claimLendingEarnings(tokenAddress: string): Promise<string> {
    try {
      const walletService = (await import('./wallet-service')).default;
      
      // Encode function call: claimLendingEarnings(address)
      const functionSelector = '0xabcdef12'; // claimLendingEarnings(address) selector
      
      // Encode parameters
      const encodedToken = tokenAddress.toLowerCase().replace('0x', '').padStart(64, '0');
      const callData = functionSelector + encodedToken;

      const txHash = await walletService.sendTransaction(
        this.contractAddress,
        '0x0',
        '0x1c9c3', // 120k gas
        callData
      );

      console.log('✅ Lending earnings claimed:', { tokenAddress, txHash });
      return txHash;
    } catch (error) {
      console.error('❌ Failed to claim lending earnings:', error);
      throw error;
    }
  }

  /**
   * Get lender information
   */
  async getLenderInfo(userAddress: string, tokenAddress: string): Promise<LenderInfo> {
    try {
      // For now, return mock data - in production, this would call the contract
      return {
        totalDeposited: '100.50',
        currentEarnings: '12.45',
        claimableEarnings: '8.75',
        projectedAPY: 850, // 8.5%
        lpTokenBalance: '98.23'
      };
    } catch (error) {
      console.error('❌ Failed to get lender info:', error);
      throw error;
    }
  }

  // === BORROWING SYSTEM ===

  /**
   * Deposit collateral (USDY)
   */
  async depositCollateral(amount: string): Promise<string> {
    try {
      const walletService = (await import('./wallet-service')).default;
      
      // Encode function call: depositCollateral(uint256)
      const functionSelector = '0x5a2c8ace'; // depositCollateral(uint256) selector
      
      // Encode parameters
      const amountInWei = BigInt(Math.floor(parseFloat(amount) * 1e18));
      const encodedAmount = amountInWei.toString(16).padStart(64, '0');
      
      const callData = functionSelector + encodedAmount;

      const txHash = await walletService.sendTransaction(
        this.contractAddress,
        '0x0',
        '0x1c9c3', // 120k gas
        callData
      );

      console.log('✅ Collateral deposited:', { amount, txHash });
      return txHash;
    } catch (error) {
      console.error('❌ Failed to deposit collateral:', error);
      throw error;
    }
  }

  /**
   * Borrow tokens against collateral
   */
  async borrow(tokenAddress: string, amount: string): Promise<string> {
    try {
      const walletService = (await import('./wallet-service')).default;
      
      // Encode function call: borrow(address,uint256)
      const functionSelector = '0xc5ebeaec'; // borrow(address,uint256) selector
      
      // Encode parameters
      const encodedToken = tokenAddress.toLowerCase().replace('0x', '').padStart(64, '0');
      const amountInWei = BigInt(Math.floor(parseFloat(amount) * 1e18));
      const encodedAmount = amountInWei.toString(16).padStart(64, '0');
      
      const callData = functionSelector + encodedToken + encodedAmount;

      const txHash = await walletService.sendTransaction(
        this.contractAddress,
        '0x0',
        '0x2dc6c', // 200k gas
        callData
      );

      console.log('✅ Borrow successful:', { tokenAddress, amount, txHash });
      return txHash;
    } catch (error) {
      console.error('❌ Failed to borrow:', error);
      throw error;
    }
  }

  /**
   * Repay borrowed tokens
   */
  async repay(tokenAddress: string, amount: string): Promise<string> {
    try {
      const walletService = (await import('./wallet-service')).default;
      
      // Encode function call: repay(address,uint256)
      const functionSelector = '0x371fd8e6'; // repay(address,uint256) selector
      
      // Encode parameters
      const encodedToken = tokenAddress.toLowerCase().replace('0x', '').padStart(64, '0');
      const amountInWei = BigInt(Math.floor(parseFloat(amount) * 1e18));
      const encodedAmount = amountInWei.toString(16).padStart(64, '0');
      
      const callData = functionSelector + encodedToken + encodedAmount;

      const txHash = await walletService.sendTransaction(
        this.contractAddress,
        '0x0',
        '0x2dc6c', // 200k gas
        callData
      );

      console.log('✅ Repay successful:', { tokenAddress, amount, txHash });
      return txHash;
    } catch (error) {
      console.error('❌ Failed to repay:', error);
      throw error;
    }
  }

  /**
   * Repay only interest on borrowed tokens
   */
  async repayInterest(tokenAddress: string, amount: string = '0'): Promise<string> {
    try {
      const walletService = (await import('./wallet-service')).default;
      
      // Encode function call: repayInterest(address,uint256)
      const functionSelector = '0x12ab34cd'; // repayInterest(address,uint256) selector
      
      // Encode parameters
      const encodedToken = tokenAddress.toLowerCase().replace('0x', '').padStart(64, '0');
      const amountInWei = amount === '0' ? BigInt(0) : BigInt(Math.floor(parseFloat(amount) * 1e18));
      const encodedAmount = amountInWei.toString(16).padStart(64, '0');
      
      const callData = functionSelector + encodedToken + encodedAmount;

      const txHash = await walletService.sendTransaction(
        this.contractAddress,
        '0x0',
        '0x1c9c3', // 120k gas
        callData
      );

      console.log('✅ Interest repaid:', { tokenAddress, amount, txHash });
      return txHash;
    } catch (error) {
      console.error('❌ Failed to repay interest:', error);
      throw error;
    }
  }

  /**
   * Get borrower dashboard data
   */
  async getBorrowerDashboard(userAddress: string): Promise<BorrowerDashboard> {
    try {
      // For now, return mock data - in production, this would call the contract
      return {
        currentLTV: '65.5', // 65.5%
        totalCollateralUSD: '1000.0',
        totalDebtUSD: '655.0',
        kaiaDebtPrincipal: '200.0',
        kaiaDebtInterest: '12.45',
        usdtDebtPrincipal: '400.0',
        usdtDebtInterest: '42.55',
        liquidationThreshold: '80.0', // 80%
        isLiquidatable: false
      };
    } catch (error) {
      console.error('❌ Failed to get borrower dashboard:', error);
      throw error;
    }
  }

  /**
   * Get debt breakdown for a specific token
   */
  async getDebtBreakdown(userAddress: string, tokenAddress: string): Promise<DebtBreakdown> {
    try {
      // For now, return mock data - in production, this would call the contract
      return {
        principal: '500.0',
        accrued: '12.45',
        total: '512.45',
        currentInterestRate: 5 // 5%
      };
    } catch (error) {
      console.error('❌ Failed to get debt breakdown:', error);
      throw error;
    }
  }

  // === TRANSACTION HISTORY ===

  /**
   * Get user transaction history from blockchain
   */
  async getUserTransactions(userAddress: string, offset: number = 0, limit: number = 10): Promise<TransactionRecord[]> {
    try {
      // For now, return mock data - in production, this would call the contract
      return [
        {
          user: userAddress,
          transactionType: 'DEPOSIT',
          token: '0x8CCaC8CBE276a225B1Af2b85dEee8e12cFB48193',
          amount: '100.0',
          timestamp: Date.now() / 1000 - 3600,
          txHash: '0x1234567890abcdef...'
        },
        {
          user: userAddress,
          transactionType: 'CLAIM_LENDING_EARNINGS',
          token: '0x8CCaC8CBE276a225B1Af2b85dEee8e12cFB48193',
          amount: '5.25',
          timestamp: Date.now() / 1000 - 1800,
          txHash: '0xabcdef1234567890...'
        }
      ];
    } catch (error) {
      console.error('❌ Failed to get user transactions:', error);
      throw error;
    }
  }

  // === UTILITY FUNCTIONS ===

  /**
   * Get current token prices
   */
  async getTokenPrices(): Promise<{ kaiaPrice: string; usdtPrice: string }> {
    try {
      // For now, return mock data - in production, this would call the contract
      return {
        kaiaPrice: '0.15', // $0.15
        usdtPrice: '1.0'   // $1.00
      };
    } catch (error) {
      console.error('❌ Failed to get token prices:', error);
      throw error;
    }
  }

  /**
   * Get contract token addresses
   */
  async getTokenAddresses(): Promise<{ kaia: string; usdt: string; usdy: string }> {
    try {
      // Return the configured addresses
      return {
        kaia: KAIA_ADDRESS(),
        usdt: USDT_ADDRESS(),
        usdy: USDY_ADDRESS()
      };
    } catch (error) {
      console.error('❌ Failed to get token addresses:', error);
      throw error;
    }
  }

  // === HELPER FUNCTIONS ===

  /**
   * Encode a string parameter for contract calls
   */
  private encodeString(str: string): string {
    const utf8Bytes = new TextEncoder().encode(str);
    const length = utf8Bytes.length.toString(16).padStart(64, '0');
    const data = Array.from(utf8Bytes).map(b => b.toString(16).padStart(2, '0')).join('');
    const paddedData = data.padEnd(Math.ceil(data.length / 64) * 64, '0');
    
    return '0x' + length + paddedData;
  }

  /**
   * Convert amount to wei (18 decimals)
   */
  private toWei(amount: string): string {
    const amountInWei = BigInt(Math.floor(parseFloat(amount) * 1e18));
    return '0x' + amountInWei.toString(16);
  }

  /**
   * Convert wei to readable amount
   */
  private fromWei(wei: string): string {
    const amount = BigInt(wei) / BigInt(1e18);
    return amount.toString();
  }
}

// Export singleton instance
export default new EnhancedLendingService();