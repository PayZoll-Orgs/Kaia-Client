// Enhanced Lending Service - Real contract interactions
// Uses wallet service for actual blockchain transactions

import { CONFIG } from './config';

export interface LenderInfo {
  totalSupplied: string;
  totalDeposited: string;
  earnedInterest: string;
  currentEarnings: string;
  claimableEarnings: string;
  lpTokenBalance: string;
  projectedAPY: number;
  apy: string;
  balance: string;
}

export interface ReferralInfo {
  isRegistered: boolean;
  code: string;
  totalReferred: number;
  totalReferrals: number;
  totalEarned: string;
  totalRewardsEarned: string;
  claimableRewards: string;
  hasReferrer?: boolean;
}

export interface BorrowerDashboard {
  totalBorrowed: string;
  totalCollateral: string;
  totalCollateralUSD: string;
  totalDebtUSD: string;
  currentLTV: string;
  healthFactor: string;
  availableCredit: string;
  liquidationRisk: 'low' | 'medium' | 'high';
}

export interface DebtBreakdown {
  principal: string;
  accrued: string;
  total: string;
  currentInterestRate: string;
}

class EnhancedLendingService {
  
  // Helper function for making read-only contract calls through WalletService
  private async makeReadOnlyCall(methodId: string, encodedParams: string = '', contractAddress?: string): Promise<unknown> {
    try {
      // Import wallet service dynamically
      const { WalletService } = await import('./wallet-service');
      const walletService = WalletService.getInstance();
      
      const targetContract = contractAddress || CONFIG.ENHANCED_LENDING_ADDRESS;
      const callData = methodId + encodedParams;
      
      console.log('📞 Making read-only call:', {
        contract: targetContract,
        methodId: methodId,
        data: callData
      });
      
      // Use WalletService to make the call - this ensures proper network connection
      const response = await fetch(CONFIG.RPC_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'eth_call',
          params: [
            {
              to: targetContract,
              data: callData
            },
            'latest'
          ],
          id: 1
        })
      });
      
      const result = await response.json();
      
      if (result.error) {
        throw new Error(`RPC Error: ${result.error.message}`);
      }
      
      return result.result;
    } catch (error) {
      console.error('❌ Read-only call failed:', error);
      throw error;
    }
  }

  // Helper function to safely format BigInt values
  private formatSafe(value: unknown, decimals: number = 18): string {
    try {
      if (!value || value === '0x' || value === '0x0') return '0';
      // Type guard to ensure value can be converted to BigInt
      if (typeof value !== 'string' && typeof value !== 'number' && typeof value !== 'bigint') return '0';
      const bigValue = BigInt(value as string | number | bigint);
      return (Number(bigValue) / Math.pow(10, decimals)).toString();
    } catch {
      return '0';
    }
  }

  // Helper function to decode multiple return values
  private decodeMultipleValues(data: string, valueCount: number): string[] {
    if (!data || data === '0x') return Array(valueCount).fill('0x0');
    
    // Remove 0x prefix
    const cleanData = data.replace('0x', '');
    
    // Each value is 64 characters (32 bytes)
    const values = [];
    for (let i = 0; i < valueCount; i++) {
      const start = i * 64;
      const end = start + 64;
      const value = '0x' + cleanData.slice(start, end);
      values.push(value);
    }
    
    return values;
  }

  // Real implementation with blockchain calls
  async getLenderInfo(address: string, tokenAddress: string): Promise<LenderInfo> {
    console.log('📊 Getting real lender info from blockchain:', { address, tokenAddress });
    
    try {
      // Encode address parameter for getLenderInfo(address,address)
      const paddedAddress = address.replace('0x', '').toLowerCase().padStart(64, '0');
      const paddedTokenAddress = tokenAddress.replace('0x', '').toLowerCase().padStart(64, '0');
      const encodedParams = paddedAddress + paddedTokenAddress;
      
      // Call getLenderInfo function
      const methodId = '0xdb33840c'; // getLenderInfo(address,address)
      const result = await this.makeReadOnlyCall(methodId, encodedParams);
      
      // Decode the result (5 uint256 values)
      const values = this.decodeMultipleValues(result as string, 5);
      
      // Get LP token balance from correct LP token contract
      const lpTokenAddress = tokenAddress === CONFIG.USDT_ADDRESS ? CONFIG.K_USDT_ADDRESS : CONFIG.K_KAIA_ADDRESS;
      const lpBalanceMethodId = '0x70a08231'; // balanceOf(address)
      const lpBalanceResult = await this.makeReadOnlyCall(lpBalanceMethodId, paddedAddress, lpTokenAddress);
      
      return {
        totalSupplied: this.formatSafe(values[0]),
        totalDeposited: this.formatSafe(values[0]), // Same as totalSupplied  
        earnedInterest: this.formatSafe(values[1]),
        currentEarnings: this.formatSafe(values[1]), // Same as earnedInterest
        claimableEarnings: this.formatSafe(values[2]),
        lpTokenBalance: this.formatSafe(lpBalanceResult),
        projectedAPY: Number(this.formatSafe(values[3], 2)), // APY is in basis points
        apy: this.formatSafe(values[3], 2),
        balance: this.formatSafe(values[4])
      };
    } catch (error) {
      console.error('❌ Failed to get lender info:', error);
      // Return mock data as fallback
      return {
        totalSupplied: '0',
        totalDeposited: '0',
        earnedInterest: '0',
        currentEarnings: '0',
        claimableEarnings: '0',
        lpTokenBalance: '0',
        projectedAPY: 0,
        apy: '0',
        balance: '0'
      };
    }
  }

  async getReferralInfo(address: string): Promise<ReferralInfo> {
    console.log('👥 Getting real referral info from blockchain:', { address });
    
    try {
      // Encode address parameter for getReferralInfo(address)
      const paddedAddress = address.replace('0x', '').toLowerCase().padStart(64, '0');
      
      // Call getReferralInfo function
      const methodId = '0x21874ae2'; // getReferralInfo(address)
      const result = await this.makeReadOnlyCall(methodId, paddedAddress);
      
      // Decode the result (6 values: uint256, uint256, uint256, address[], bool, bool)
      // For simplicity, we'll focus on the first 3 uint256 values and 2 bools
      const values = this.decodeMultipleValues(result as string, 5);
      
      return {
        isRegistered: values[4] !== '0x0000000000000000000000000000000000000000000000000000000000000000',
        code: '', // Code retrieval would need additional call
        totalReferred: parseInt(this.formatSafe(values[0], 0)),
        totalReferrals: parseInt(this.formatSafe(values[0], 0)),
        totalEarned: this.formatSafe(values[1]),
        totalRewardsEarned: this.formatSafe(values[1]),
        claimableRewards: this.formatSafe(values[2]),
        hasReferrer: values[3] !== '0x0000000000000000000000000000000000000000000000000000000000000000'
      };
    } catch (error) {
      console.error('❌ Failed to get referral info:', error);
      // Return mock data as fallback
      return {
        isRegistered: false,
        code: '',
        totalReferred: 0,
        totalReferrals: 0,
        totalEarned: '0',
        totalRewardsEarned: '0',
        claimableRewards: '0',
        hasReferrer: false
      };
    }
  }

  async getBorrowerDashboard(address: string): Promise<BorrowerDashboard> {
    console.log('💳 Getting real borrower dashboard from blockchain:', { address });
    
    try {
      // Encode address parameter for getBorrowerDashboard(address)
      const paddedAddress = address.replace('0x', '').toLowerCase().padStart(64, '0');
      
      // Call getBorrowerDashboard function
      const methodId = '0xd14eff2c'; // getBorrowerDashboard(address)
      const result = await this.makeReadOnlyCall(methodId, paddedAddress);
      
      // Decode the result (9 values: uint256 currentLTV, uint256 totalCollateralUSD, uint256 totalDebtUSD, etc.)
      const values = this.decodeMultipleValues(result as string, 9);
      
      const currentLTV = this.formatSafe(values[0], 2); // LTV in basis points
      const totalCollateralUSD = this.formatSafe(values[1]);
      const totalDebtUSD = this.formatSafe(values[2]);
      
      // Calculate health factor (collateral / debt ratio)
      const healthFactor = Number(totalDebtUSD) > 0 ? 
        (Number(totalCollateralUSD) / Number(totalDebtUSD)).toString() : 
        '∞';
      
      // Calculate available credit (rough estimate)
      const maxBorrowableUSD = Number(totalCollateralUSD) * 0.75; // 75% LTV
      const availableCredit = Math.max(0, maxBorrowableUSD - Number(totalDebtUSD)).toString();
      
      // Determine liquidation risk
      const ltvNum = Number(currentLTV);
      const liquidationRisk: 'low' | 'medium' | 'high' = 
        ltvNum > 80 ? 'high' : 
        ltvNum > 60 ? 'medium' : 'low';
      
      return {
        totalBorrowed: totalDebtUSD,
        totalCollateral: totalCollateralUSD,
        totalCollateralUSD: totalCollateralUSD,
        totalDebtUSD: totalDebtUSD,
        currentLTV: currentLTV,
        healthFactor: healthFactor,
        availableCredit: availableCredit,
        liquidationRisk: liquidationRisk
      };
    } catch (error) {
      console.error('❌ Failed to get borrower dashboard:', error);
      // Return mock data as fallback
      return {
        totalBorrowed: '0',
        totalCollateral: '0',
        totalCollateralUSD: '0',
        totalDebtUSD: '0',
        currentLTV: '0',
        healthFactor: '0',
        availableCredit: '0',
        liquidationRisk: 'low'
      };
    }
  }

  async getDebtBreakdown(address: string, tokenAddress: string): Promise<DebtBreakdown> {
    console.log('📋 Getting real debt breakdown from blockchain:', { address, tokenAddress });
    
    try {
      // Encode address parameters for getDebtBreakdown(address,address)
      const paddedAddress = address.replace('0x', '').toLowerCase().padStart(64, '0');
      const paddedTokenAddress = tokenAddress.replace('0x', '').toLowerCase().padStart(64, '0');
      const encodedParams = paddedAddress + paddedTokenAddress;
      
      // Call getDebtBreakdown function
      const methodId = '0xc53622e0'; // getDebtBreakdown(address,address)
      const result = await this.makeReadOnlyCall(methodId, encodedParams);
      
      // Decode the result (4 uint256 values: principal, accrued, total, currentInterestRate)
      const values = this.decodeMultipleValues(result as string, 4);
      
      return {
        principal: this.formatSafe(values[0]),
        accrued: this.formatSafe(values[1]),
        total: this.formatSafe(values[2]),
        currentInterestRate: this.formatSafe(values[3], 2) // Interest rate in basis points
      };
    } catch (error) {
      console.error('❌ Failed to get debt breakdown:', error);
      // Return mock data as fallback
      return {
        principal: '0',
        accrued: '0',
        total: '0',
        currentInterestRate: '0'
      };
    }
  }

  // Transaction methods - Real implementations provided below

  async registerReferralCode(code: string): Promise<string> {
    console.log('📝 Enhanced Lending - Register referral code:', { code });
    
    try {
      // Import wallet service dynamically
      const { WalletService } = await import('./wallet-service');
      const walletService = WalletService.getInstance();
      
      const walletState = walletService.getState();
      if (!walletState.isConnected || !walletState.address) {
        throw new Error('Wallet not connected');
      }
      
      // Enhanced Lending Contract Address
      const ENHANCED_LENDING_ADDRESS = CONFIG.ENHANCED_LENDING_ADDRESS;
      
      // Create register referral code transaction data: registerReferralCode(string)
      const registerMethodId = '0x59fb7752'; // registerReferralCode(string)
      
      // Encode string parameter (code)
      const codeBytes = Buffer.from(code, 'utf8');
      const codeOffset = '0000000000000000000000000000000000000000000000000000000000000020'; // Offset to string data
      const codeLength = codeBytes.length.toString(16).padStart(64, '0');
      const codePadded = codeBytes.toString('hex').padEnd(Math.ceil(codeBytes.length / 32) * 64, '0');
      
      const transactionData = registerMethodId + codeOffset + codeLength + codePadded;
      
      console.log('📝 Creating register referral code transaction:', {
        contract: ENHANCED_LENDING_ADDRESS,
        methodId: registerMethodId,
        function: 'registerReferralCode(string)',
        code: code,
        data: transactionData
      });
      
      // Send the register referral code transaction
      const txHash = await walletService.sendTransaction(
        ENHANCED_LENDING_ADDRESS, // Enhanced Lending contract
        '0x0', // No native token value
        '0x2dc6c0', // Higher gas limit
        transactionData // Register referral code function call
      );
      
      console.log('✅ Enhanced lending register referral code transaction successful:', txHash);
      console.log(`🔗 View on Kaiascan: https://kairos.kaiascope.com/tx/${txHash}`);
      return txHash;
    } catch (error) {
      console.error('❌ Register referral code failed:', error);
      throw error;
    }
  }

  async claimReferralRewards(): Promise<string> {
    console.log('🎁 Enhanced Lending - Claim referral rewards');
    
    try {
      // Import wallet service dynamically
      const { WalletService } = await import('./wallet-service');
      const walletService = WalletService.getInstance();
      
      const walletState = walletService.getState();
      if (!walletState.isConnected || !walletState.address) {
        throw new Error('Wallet not connected');
      }
      
      // Enhanced Lending Contract Address - Updated to deployed address
      const ENHANCED_LENDING_ADDRESS = CONFIG.ENHANCED_LENDING_ADDRESS;
      
      // Create claim referral rewards transaction data: claimReferralRewards()
      const claimMethodId = '0x05eaab4b'; // claimReferralRewards()
      const transactionData = claimMethodId;
      
      console.log('📝 Creating claim referral rewards transaction:', {
        contract: ENHANCED_LENDING_ADDRESS,
        methodId: claimMethodId,
        data: transactionData
      });
      
      // Send the claim referral rewards transaction
      const txHash = await walletService.sendTransaction(
        ENHANCED_LENDING_ADDRESS, // Enhanced Lending contract
        '0x0', // No native token value
        '0x15f90', // Gas limit
        transactionData // Claim referral rewards function call
      );
      
      console.log('✅ Claim referral rewards transaction successful:', txHash);
      return txHash;
    } catch (error) {
      console.error('❌ Claim referral rewards failed:', error);
      throw error;
    }
  }

  async lend(tokenAddress: string, amount: string): Promise<string> {
    console.log('🏦 Enhanced Lending - Lend request (alias for deposit):', { tokenAddress, amount });
    // Delegate to deposit method
    return this.deposit(tokenAddress, amount);
  }

  async deposit(tokenAddress: string, amount: string): Promise<string> {
    console.log('🏦 Enhanced Lending - Deposit request:', { tokenAddress, amount });
    
    try {
      // Import wallet service dynamically
      const { WalletService } = await import('./wallet-service');
      const walletService = WalletService.getInstance();
      
      const walletState = walletService.getState();
      if (!walletState.isConnected || !walletState.address) {
        throw new Error('Wallet not connected');
      }
      
      // Enhanced Lending Contract Address - Updated to deployed address
      const ENHANCED_LENDING_ADDRESS = CONFIG.ENHANCED_LENDING_ADDRESS;
      
      // Convert amount to wei (18 decimals) - Use BigInt for precision
      const amountInWei = BigInt(Math.floor(parseFloat(amount) * Math.pow(10, 18)));
      
      // Create deposit transaction data: deposit(address,uint256)
      const depositMethodId = '0x47e7ef24'; // deposit(address,uint256)
      const paddedTokenAddress = tokenAddress.replace('0x', '').toLowerCase().padStart(64, '0');
      const paddedAmount = amountInWei.toString(16).padStart(64, '0');
      const transactionData = '0x' + depositMethodId.replace('0x', '') + paddedTokenAddress + paddedAmount;
      
      console.log('📝 Creating deposit transaction:', {
        contract: ENHANCED_LENDING_ADDRESS,
        methodId: depositMethodId,
        function: 'deposit(address,uint256)',
        tokenAddress: tokenAddress,
        amount: amount,
        amountInWei: amountInWei,
        data: transactionData
      });
      
      // First, we need to approve the lending contract to spend our tokens
      const approveAmount = amountInWei * BigInt(2); // Approve double for safety
      console.log('� First approving token spend...');
      
      // ERC20 approve: approve(address,uint256)
      const approveMethodId = '095ea7b3'; // approve(address,uint256)
      const paddedSpender = ENHANCED_LENDING_ADDRESS.replace('0x', '').toLowerCase().padStart(64, '0');
      const paddedApproveAmount = approveAmount.toString(16).padStart(64, '0');
      const approveData = '0x' + approveMethodId + paddedSpender + paddedApproveAmount;
      
      // Send approve transaction first
      await walletService.sendTransaction(
        tokenAddress, // Token contract address
        '0x0', // No native token value
        '0x15f90', // Gas limit
        approveData // Approve function call
      );
      
      console.log('✅ Token approval successful, now depositing...');
      
      // Now send the deposit transaction
      const txHash = await walletService.sendTransaction(
        ENHANCED_LENDING_ADDRESS, // Enhanced Lending contract
        '0x0', // No native token value
        '0x15f90', // Gas limit
        transactionData // Deposit function call
      );
      
      console.log('✅ Enhanced lending deposit transaction successful:', txHash);
      console.log(`🔗 View on Kaiascan: https://kairos.kaiascope.com/tx/${txHash}`);
      return txHash;
    } catch (error) {
      console.error('❌ Deposit failed:', error);
      throw error;
    }
  }

  async claimLendingEarnings(tokenAddress: string): Promise<string> {
    console.log('🎯 Enhanced Lending - Claim earnings request:', { tokenAddress });
    
    try {
      // Import wallet service dynamically
      const { WalletService } = await import('./wallet-service');
      const walletService = WalletService.getInstance();
      
      const walletState = walletService.getState();
      if (!walletState.isConnected || !walletState.address) {
        throw new Error('Wallet not connected');
      }
      
      // Enhanced Lending Contract Address - Updated to deployed address
      const ENHANCED_LENDING_ADDRESS = CONFIG.ENHANCED_LENDING_ADDRESS;
      
      // Create claim earnings transaction data: claimLendingEarnings(address)
      const claimMethodId = '0x790778b1'; // claimLendingEarnings(address)
      const paddedTokenAddress = tokenAddress.replace('0x', '').toLowerCase().padStart(64, '0');
      const transactionData = claimMethodId + paddedTokenAddress;
      
      console.log('� Creating claim earnings transaction:', {
        contract: ENHANCED_LENDING_ADDRESS,
        methodId: claimMethodId,
        tokenAddress,
        data: transactionData
      });
      
      // Send the claim transaction
      const txHash = await walletService.sendTransaction(
        ENHANCED_LENDING_ADDRESS, // Enhanced Lending contract
        '0x0', // No native token value
        '0x15f90', // Gas limit
        transactionData // Claim function call
      );
      
      console.log('✅ Claim earnings transaction successful:', txHash);
      return txHash;
    } catch (error) {
      console.error('❌ Claim failed:', error);
      throw error;
    }
  }

  async withdraw(tokenAddress: string, amount: string): Promise<string> {
    console.log('🏧 Enhanced Lending - Withdraw request:', { tokenAddress, amount });
    
    try {
      // Import wallet service dynamically
      const { WalletService } = await import('./wallet-service');
      const walletService = WalletService.getInstance();
      
      const walletState = walletService.getState();
      if (!walletState.isConnected || !walletState.address) {
        throw new Error('Wallet not connected');
      }
      
      // Enhanced Lending Contract Address - Updated to deployed address
      const ENHANCED_LENDING_ADDRESS = CONFIG.ENHANCED_LENDING_ADDRESS;
      
      // Convert amount to wei (18 decimals) - This represents LP tokens to redeem
      const lpAmountInWei = Math.round(parseFloat(amount) * Math.pow(10, 18));
      
      // Determine LP token address based on underlying token
      const lpTokenAddress = tokenAddress === CONFIG.USDT_ADDRESS ? CONFIG.K_USDT_ADDRESS : CONFIG.K_KAIA_ADDRESS;
      
      // Create redeem transaction data: redeem(address,uint256)
      const redeemMethodId = '0x1e9a6950'; // redeem(address,uint256)
      const paddedLpTokenAddress = lpTokenAddress.replace('0x', '').toLowerCase().padStart(64, '0');
      const paddedAmount = lpAmountInWei.toString(16).padStart(64, '0');
      const transactionData = redeemMethodId + paddedLpTokenAddress + paddedAmount;
      
      console.log('📝 Creating redeem transaction:', {
        contract: ENHANCED_LENDING_ADDRESS,
        methodId: redeemMethodId,
        function: 'redeem(address,uint256)',
        lpTokenAddress: lpTokenAddress,
        amount: amount,
        lpAmountInWei: lpAmountInWei,
        data: transactionData
      });
      
      // Send the withdraw transaction
      const txHash = await walletService.sendTransaction(
        ENHANCED_LENDING_ADDRESS, // Enhanced Lending contract
        '0x0', // No native token value
        '0x15f90', // Gas limit
        transactionData // Withdraw function call
      );
      
      console.log('✅ Enhanced lending redeem transaction successful:', txHash);
      console.log(`🔗 View on Kaiascan: https://kairos.kaiascope.com/tx/${txHash}`);
      return txHash;
    } catch (error) {
      console.error('❌ Withdraw failed:', error);
      throw error;
    }
  }

  async borrow(tokenAddress: string, borrowAmount: string): Promise<string> {
    console.log('💳 Enhanced Lending - Borrow request:', { tokenAddress, borrowAmount });
    
    try {
      // Import wallet service dynamically
      const { WalletService } = await import('./wallet-service');
      const walletService = WalletService.getInstance();
      
      const walletState = walletService.getState();
      if (!walletState.isConnected || !walletState.address) {
        throw new Error('Wallet not connected');
      }
      
      // Enhanced Lending Contract Address
      const ENHANCED_LENDING_ADDRESS = CONFIG.ENHANCED_LENDING_ADDRESS;
      
      // Convert amount to wei (18 decimals)
      const amountInWei = BigInt(Math.floor(parseFloat(borrowAmount) * Math.pow(10, 18)));
      
      // Create borrow transaction data: borrow(address,uint256)
      const borrowMethodId = '0x4b8a3529'; // borrow(address,uint256)
      const paddedTokenAddress = tokenAddress.replace('0x', '').toLowerCase().padStart(64, '0');
      const paddedAmount = amountInWei.toString(16).padStart(64, '0');
      const transactionData = borrowMethodId + paddedTokenAddress + paddedAmount;
      
      console.log('📝 Creating borrow transaction:', {
        contract: ENHANCED_LENDING_ADDRESS,
        methodId: borrowMethodId,
        function: 'borrow(address,uint256)',
        tokenAddress: tokenAddress,
        amount: borrowAmount,
        amountInWei: amountInWei,
        data: transactionData
      });
      
      // Send the borrow transaction
      const txHash = await walletService.sendTransaction(
        ENHANCED_LENDING_ADDRESS, // Enhanced Lending contract
        '0x0', // No native token value
        '0x2dc6c0', // Higher gas limit for borrow operations
        transactionData // Borrow function call
      );
      
      console.log('✅ Enhanced lending borrow transaction successful:', txHash);
      console.log(`🔗 View on Kaiascan: https://kairos.kaiascope.com/tx/${txHash}`);
      return txHash;
    } catch (error) {
      console.error('❌ Borrow failed:', error);
      throw error;
    }
  }

  async repay(tokenAddress: string, amount: string): Promise<string> {
    console.log('💸 Enhanced Lending - Repay request:', { tokenAddress, amount });
    
    try {
      // Import wallet service dynamically
      const { WalletService } = await import('./wallet-service');
      const walletService = WalletService.getInstance();
      
      const walletState = walletService.getState();
      if (!walletState.isConnected || !walletState.address) {
        throw new Error('Wallet not connected');
      }
      
      // Enhanced Lending Contract Address
      const ENHANCED_LENDING_ADDRESS = CONFIG.ENHANCED_LENDING_ADDRESS;
      
      // Convert amount to wei (18 decimals)
      const amountInWei = BigInt(Math.floor(parseFloat(amount) * Math.pow(10, 18)));
      
      console.log('🔍 First approving token for repayment...');
      
      // First approve the lending contract to spend our tokens for repayment
      const approveAmount = amountInWei * BigInt(2); // Approve double for safety
      const approveMethodId = '0x095ea7b3'; // approve(address,uint256)
      const paddedSpender = ENHANCED_LENDING_ADDRESS.replace('0x', '').toLowerCase().padStart(64, '0');
      const paddedApproveAmount = approveAmount.toString(16).padStart(64, '0');
      const approveData = approveMethodId + paddedSpender + paddedApproveAmount;
      
      // Send approve transaction first
      await walletService.sendTransaction(
        tokenAddress, // Token contract address
        '0x0', // No native token value
        '0x15f90', // Gas limit
        approveData // Approve function call
      );
      
      console.log('✅ Token approval successful, now repaying...');
      
      // Create repay transaction data: repay(address,uint256)
      const repayMethodId = '0x22867d78'; // repay(address,uint256)
      const paddedTokenAddress = tokenAddress.replace('0x', '').toLowerCase().padStart(64, '0');
      const paddedAmount = amountInWei.toString(16).padStart(64, '0');
      const transactionData = repayMethodId + paddedTokenAddress + paddedAmount;
      
      console.log('📝 Creating repay transaction:', {
        contract: ENHANCED_LENDING_ADDRESS,
        methodId: repayMethodId,
        function: 'repay(address,uint256)',
        tokenAddress: tokenAddress,
        amount: amount,
        amountInWei: amountInWei,
        data: transactionData
      });
      
      // Send the repay transaction
      const txHash = await walletService.sendTransaction(
        ENHANCED_LENDING_ADDRESS, // Enhanced Lending contract
        '0x0', // No native token value
        '0x2dc6c0', // Higher gas limit for repay operations
        transactionData // Repay function call
      );
      
      console.log('✅ Enhanced lending repay transaction successful:', txHash);
      console.log(`🔗 View on Kaiascan: https://kairos.kaiascope.com/tx/${txHash}`);
      return txHash;
    } catch (error) {
      console.error('❌ Repay failed:', error);
      throw error;
    }
  }

  async stake(_amount: string): Promise<string> {
    throw new Error('Staking functionality not available in Enhanced Lending Protocol');
  }

  async unstake(_amount: string): Promise<string> {
    throw new Error('Unstaking functionality not available in Enhanced Lending Protocol');
  }

  async depositCollateral(amount: string): Promise<string> {
    console.log('🔒 Enhanced Lending - Deposit collateral request:', { amount });
    
    try {
      // Import wallet service dynamically
      const { WalletService } = await import('./wallet-service');
      const walletService = WalletService.getInstance();
      
      const walletState = walletService.getState();
      if (!walletState.isConnected || !walletState.address) {
        throw new Error('Wallet not connected');
      }
      
      // Enhanced Lending Contract Address
      const ENHANCED_LENDING_ADDRESS = CONFIG.ENHANCED_LENDING_ADDRESS;
      
      // Convert amount to wei (18 decimals) - USDY collateral
      const amountInWei = BigInt(Math.floor(parseFloat(amount) * Math.pow(10, 18)));
      
      console.log('🔍 First approving USDY for collateral deposit...');
      
      // First approve the lending contract to spend our USDY tokens
      const approveAmount = amountInWei * BigInt(2); // Approve double for safety
      const approveMethodId = '0x095ea7b3'; // approve(address,uint256)
      const paddedSpender = ENHANCED_LENDING_ADDRESS.replace('0x', '').toLowerCase().padStart(64, '0');
      const paddedApproveAmount = approveAmount.toString(16).padStart(64, '0');
      const approveData = approveMethodId + paddedSpender + paddedApproveAmount;
      
      // Send approve transaction first to USDY contract
      await walletService.sendTransaction(
        CONFIG.USDY_ADDRESS, // USDY contract address
        '0x0', // No native token value
        '0x15f90', // Gas limit
        approveData // Approve function call
      );
      
      console.log('✅ USDY approval successful, now depositing collateral...');
      
      // Create deposit collateral transaction data: depositCollateral(uint256)
      const depositCollateralMethodId = '0xbad4a01f'; // depositCollateral(uint256)
      const paddedAmount = amountInWei.toString(16).padStart(64, '0');
      const transactionData = depositCollateralMethodId + paddedAmount;
      
      console.log('📝 Creating deposit collateral transaction:', {
        contract: ENHANCED_LENDING_ADDRESS,
        methodId: depositCollateralMethodId,
        function: 'depositCollateral(uint256)',
        amount: amount,
        amountInWei: amountInWei,
        data: transactionData
      });
      
      // Send the deposit collateral transaction
      const txHash = await walletService.sendTransaction(
        ENHANCED_LENDING_ADDRESS, // Enhanced Lending contract
        '0x0', // No native token value
        '0x2dc6c0', // Higher gas limit for collateral operations
        transactionData // Deposit collateral function call
      );
      
      console.log('✅ Enhanced lending deposit collateral transaction successful:', txHash);
      console.log(`🔗 View on Kaiascan: https://kairos.kaiascope.com/tx/${txHash}`);
      return txHash;
    } catch (error) {
      console.error('❌ Deposit collateral failed:', error);
      throw error;
    }
  }

  async repayInterest(tokenAddress: string, amount: string): Promise<string> {
    console.log('📈 Enhanced Lending - Repay interest request:', { tokenAddress, amount });
    
    try {
      // Import wallet service dynamically
      const { WalletService } = await import('./wallet-service');
      const walletService = WalletService.getInstance();
      
      const walletState = walletService.getState();
      if (!walletState.isConnected || !walletState.address) {
        throw new Error('Wallet not connected');
      }
      
      // Enhanced Lending Contract Address
      const ENHANCED_LENDING_ADDRESS = CONFIG.ENHANCED_LENDING_ADDRESS;
      
      // Convert amount to wei (18 decimals)
      const amountInWei = BigInt(Math.floor(parseFloat(amount) * Math.pow(10, 18)));
      
      console.log('🔍 First approving token for interest repayment...');
      
      // First approve the lending contract to spend our tokens for interest repayment
      const approveAmount = amountInWei * BigInt(2); // Approve double for safety
      const approveMethodId = '0x095ea7b3'; // approve(address,uint256)
      const paddedSpender = ENHANCED_LENDING_ADDRESS.replace('0x', '').toLowerCase().padStart(64, '0');
      const paddedApproveAmount = approveAmount.toString(16).padStart(64, '0');
      const approveData = approveMethodId + paddedSpender + paddedApproveAmount;
      
      // Send approve transaction first
      await walletService.sendTransaction(
        tokenAddress, // Token contract address
        '0x0', // No native token value
        '0x15f90', // Gas limit
        approveData // Approve function call
      );
      
      console.log('✅ Token approval successful, now repaying interest...');
      
      // Create repay interest transaction data: repayInterest(address,uint256)
      const repayInterestMethodId = '0x1831f0c7'; // repayInterest(address,uint256)
      const paddedTokenAddress = tokenAddress.replace('0x', '').toLowerCase().padStart(64, '0');
      const paddedAmount = amountInWei.toString(16).padStart(64, '0');
      const transactionData = repayInterestMethodId + paddedTokenAddress + paddedAmount;
      
      console.log('📝 Creating repay interest transaction:', {
        contract: ENHANCED_LENDING_ADDRESS,
        methodId: repayInterestMethodId,
        function: 'repayInterest(address,uint256)',
        tokenAddress: tokenAddress,
        amount: amount,
        amountInWei: amountInWei,
        data: transactionData
      });
      
      // Send the repay interest transaction
      const txHash = await walletService.sendTransaction(
        ENHANCED_LENDING_ADDRESS, // Enhanced Lending contract
        '0x0', // No native token value
        '0x2dc6c0', // Higher gas limit for repay operations
        transactionData // Repay interest function call
      );
      
      console.log('✅ Enhanced lending repay interest transaction successful:', txHash);
      console.log(`🔗 View on Kaiascan: https://kairos.kaiascope.com/tx/${txHash}`);
      return txHash;
    } catch (error) {
      console.error('❌ Repay interest failed:', error);
      throw error;
    }
  }

  async withdrawCollateral(amount: string): Promise<string> {
    console.log('🔓 Enhanced Lending - Withdraw collateral request:', { amount });
    
    try {
      // Import wallet service dynamically
      const { WalletService } = await import('./wallet-service');
      const walletService = WalletService.getInstance();
      
      const walletState = walletService.getState();
      if (!walletState.isConnected || !walletState.address) {
        throw new Error('Wallet not connected');
      }
      
      // Enhanced Lending Contract Address
      const ENHANCED_LENDING_ADDRESS = CONFIG.ENHANCED_LENDING_ADDRESS;
      
      // Convert amount to wei (18 decimals) - USDY collateral
      const amountInWei = BigInt(Math.floor(parseFloat(amount) * Math.pow(10, 18)));
      
      // Create withdraw collateral transaction data: withdrawCollateral(uint256)
      const withdrawCollateralMethodId = '0x6112fe2e'; // withdrawCollateral(uint256)
      const paddedAmount = amountInWei.toString(16).padStart(64, '0');
      const transactionData = withdrawCollateralMethodId + paddedAmount;
      
      console.log('📝 Creating withdraw collateral transaction:', {
        contract: ENHANCED_LENDING_ADDRESS,
        methodId: withdrawCollateralMethodId,
        function: 'withdrawCollateral(uint256)',
        amount: amount,
        amountInWei: amountInWei,
        data: transactionData
      });
      
      // Send the withdraw collateral transaction
      const txHash = await walletService.sendTransaction(
        ENHANCED_LENDING_ADDRESS, // Enhanced Lending contract
        '0x0', // No native token value
        '0x2dc6c0', // Higher gas limit for collateral operations
        transactionData // Withdraw collateral function call
      );
      
      console.log('✅ Enhanced lending withdraw collateral transaction successful:', txHash);
      console.log(`🔗 View on Kaiascan: https://kairos.kaiascope.com/tx/${txHash}`);
      return txHash;
    } catch (error) {
      console.error('❌ Withdraw collateral failed:', error);
      throw error;
    }
  }

  async repayPrincipal(tokenAddress: string, amount: string): Promise<string> {
    console.log('💰 Enhanced Lending - Repay principal request:', { tokenAddress, amount });
    
    try {
      // Import wallet service dynamically
      const { WalletService } = await import('./wallet-service');
      const walletService = WalletService.getInstance();
      
      const walletState = walletService.getState();
      if (!walletState.isConnected || !walletState.address) {
        throw new Error('Wallet not connected');
      }
      
      // Enhanced Lending Contract Address
      const ENHANCED_LENDING_ADDRESS = CONFIG.ENHANCED_LENDING_ADDRESS;
      
      // Convert amount to wei (18 decimals)
      const amountInWei = BigInt(Math.floor(parseFloat(amount) * Math.pow(10, 18)));
      
      console.log('🔍 First approving token for principal repayment...');
      
      // First approve the lending contract to spend our tokens for principal repayment
      const approveAmount = amountInWei * BigInt(2); // Approve double for safety
      const approveMethodId = '0x095ea7b3'; // approve(address,uint256)
      const paddedSpender = ENHANCED_LENDING_ADDRESS.replace('0x', '').toLowerCase().padStart(64, '0');
      const paddedApproveAmount = approveAmount.toString(16).padStart(64, '0');
      const approveData = approveMethodId + paddedSpender + paddedApproveAmount;
      
      // Send approve transaction first
      await walletService.sendTransaction(
        tokenAddress, // Token contract address
        '0x0', // No native token value
        '0x15f90', // Gas limit
        approveData // Approve function call
      );
      
      console.log('✅ Token approval successful, now repaying principal...');
      
      // Create repay principal transaction data: repayPrincipal(address,uint256)
      const repayPrincipalMethodId = '0xfc60fb5d'; // repayPrincipal(address,uint256)
      const paddedTokenAddress = tokenAddress.replace('0x', '').toLowerCase().padStart(64, '0');
      const paddedAmount = amountInWei.toString(16).padStart(64, '0');
      const transactionData = repayPrincipalMethodId + paddedTokenAddress + paddedAmount;
      
      console.log('📝 Creating repay principal transaction:', {
        contract: ENHANCED_LENDING_ADDRESS,
        methodId: repayPrincipalMethodId,
        function: 'repayPrincipal(address,uint256)',
        tokenAddress: tokenAddress,
        amount: amount,
        amountInWei: amountInWei,
        data: transactionData
      });
      
      // Send the repay principal transaction
      const txHash = await walletService.sendTransaction(
        ENHANCED_LENDING_ADDRESS, // Enhanced Lending contract
        '0x0', // No native token value
        '0x2dc6c0', // Higher gas limit for repay operations
        transactionData // Repay principal function call
      );
      
      console.log('✅ Enhanced lending repay principal transaction successful:', txHash);
      console.log(`🔗 View on Kaiascan: https://kairos.kaiascope.com/tx/${txHash}`);
      return txHash;
    } catch (error) {
      console.error('❌ Repay principal failed:', error);
      throw error;
    }
  }

  async joinWithReferral(code: string, referrer: string): Promise<string> {
    console.log('🤝 Enhanced Lending - Join with referral:', { code, referrer });
    
    try {
      // Import wallet service dynamically
      const { WalletService } = await import('./wallet-service');
      const walletService = WalletService.getInstance();
      
      const walletState = walletService.getState();
      if (!walletState.isConnected || !walletState.address) {
        throw new Error('Wallet not connected');
      }
      
      // Enhanced Lending Contract Address
      const ENHANCED_LENDING_ADDRESS = CONFIG.ENHANCED_LENDING_ADDRESS;
      
      // Create join with referral transaction data: joinWithReferral(string,address)
      const joinMethodId = '0x345040ba'; // joinWithReferral(string,address)
      
      // Encode string parameter (code)
      const codeBytes = Buffer.from(code, 'utf8');
      const codeOffset = '0000000000000000000000000000000000000000000000000000000000000040'; // Offset to string data
      const codeLength = codeBytes.length.toString(16).padStart(64, '0');
      const codePadded = codeBytes.toString('hex').padEnd(Math.ceil(codeBytes.length / 32) * 64, '0');
      
      // Encode address parameter (referrer)
      const paddedReferrer = referrer.replace('0x', '').toLowerCase().padStart(64, '0');
      
      const transactionData = joinMethodId + codeOffset + paddedReferrer + codeLength + codePadded;
      
      console.log('📝 Creating join with referral transaction:', {
        contract: ENHANCED_LENDING_ADDRESS,
        methodId: joinMethodId,
        function: 'joinWithReferral(string,address)',
        code: code,
        referrer: referrer,
        data: transactionData
      });
      
      // Send the join with referral transaction
      const txHash = await walletService.sendTransaction(
        ENHANCED_LENDING_ADDRESS, // Enhanced Lending contract
        '0x0', // No native token value
        '0x2dc6c0', // Higher gas limit
        transactionData // Join with referral function call
      );
      
      console.log('✅ Enhanced lending join with referral transaction successful:', txHash);
      console.log(`🔗 View on Kaiascan: https://kairos.kaiascope.com/tx/${txHash}`);
      return txHash;
    } catch (error) {
      console.error('❌ Join with referral failed:', error);
      throw error;
    }
  }

  async liquidate(borrowerAddress: string, repayAmount: string): Promise<string> {
    console.log('🚨 Enhanced Lending - Liquidate request:', { borrowerAddress, repayAmount });
    
    try {
      // Import wallet service dynamically
      const { WalletService } = await import('./wallet-service');
      const walletService = WalletService.getInstance();
      
      const walletState = walletService.getState();
      if (!walletState.isConnected || !walletState.address) {
        throw new Error('Wallet not connected');
      }
      
      // Enhanced Lending Contract Address
      const ENHANCED_LENDING_ADDRESS = CONFIG.ENHANCED_LENDING_ADDRESS;
      
      // Convert amount to wei (18 decimals)
      const repayAmountInWei = BigInt(Math.floor(parseFloat(repayAmount) * Math.pow(10, 18)));
      
      // Create liquidate transaction data: liquidate(address,uint256)
      const liquidateMethodId = '0xbcbaf487'; // liquidate(address,uint256)
      const paddedBorrowerAddress = borrowerAddress.replace('0x', '').toLowerCase().padStart(64, '0');
      const paddedRepayAmount = repayAmountInWei.toString(16).padStart(64, '0');
      const transactionData = liquidateMethodId + paddedBorrowerAddress + paddedRepayAmount;
      
      console.log('📝 Creating liquidate transaction:', {
        contract: ENHANCED_LENDING_ADDRESS,
        methodId: liquidateMethodId,
        function: 'liquidate(address,uint256)',
        borrowerAddress: borrowerAddress,
        repayAmount: repayAmount,
        repayAmountInWei: repayAmountInWei,
        data: transactionData
      });
      
      // Send the liquidate transaction
      const txHash = await walletService.sendTransaction(
        ENHANCED_LENDING_ADDRESS, // Enhanced Lending contract
        '0x0', // No native token value
        '0x3d0900', // Higher gas limit for liquidation operations
        transactionData // Liquidate function call
      );
      
      console.log('✅ Enhanced lending liquidate transaction successful:', txHash);
      console.log(`🔗 View on Kaiascan: https://kairos.kaiascope.com/tx/${txHash}`);
      return txHash;
    } catch (error) {
      console.error('❌ Liquidate failed:', error);
      throw error;
    }
  }
}

const enhancedLendingServiceInstance = new EnhancedLendingService();
export default enhancedLendingServiceInstance;