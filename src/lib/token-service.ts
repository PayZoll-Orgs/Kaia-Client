// Token service for USDT balance and faucet operations
// Uses Kaia SDK (@kaiachain/ethers-ext) and contract interactions

import { JsonRpcProvider, Contract, Wallet } from '@kaiachain/ethers-ext';
import { CONFIG, USDT_METHODS } from '@/lib/config';

// USDT Contract ABI - Essential functions only
const USDT_ABI = [
  // Read functions
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function totalSupply() view returns (uint256)",
  
  // Write functions
  "function faucet() external", // Mint test USDT
  "function transfer(address to, uint256 amount) external returns (bool)",
  "function approve(address spender, uint256 amount) external returns (bool)",
  
  // Events
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "event Approval(address indexed owner, address indexed spender, uint256 value)"
];

// Initialize provider
const provider = new JsonRpcProvider(CONFIG.RPC_URL);

// Initialize USDT contract (read-only)
const usdtContract = new Contract(CONFIG.USDT_ADDRESS, USDT_ABI, provider);

export interface TokenBalance {
  balance: string;      // Formatted balance (e.g., "10.50")
  rawBalance: bigint;   // Raw balance from contract
  decimals: number;     // Token decimals (usually 6 for USDT)
  symbol: string;       // Token symbol (USDT)
}

export interface FaucetResult {
  success: boolean;
  transactionHash?: string;
  error?: string;
}

/**
 * Get USDT balance for a wallet address
 */
export async function getUSDTBalance(walletAddress: string): Promise<TokenBalance> {
  try {
    console.log('🔍 Getting USDT balance for:', walletAddress);
    
    // Get balance and token info
    const [rawBalance, decimals, symbol] = await Promise.all([
      usdtContract.balanceOf(walletAddress),
      usdtContract.decimals(),
      usdtContract.symbol()
    ]);

    // Format balance (divide by 10^decimals)
    const balance = formatTokenAmount(rawBalance, decimals);
    
    console.log('✅ USDT balance retrieved:', {
      address: walletAddress,
      balance,
      rawBalance: rawBalance.toString(),
      decimals,
      symbol
    });

    return {
      balance,
      rawBalance,
      decimals,
      symbol
    };
  } catch (error) {
    console.error('❌ Failed to get USDT balance:', error);
    throw new Error(`Failed to get USDT balance: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Request test USDT from faucet (using direct contract call via Kaia SDK)
 */
export async function requestUSDTFromFaucet(walletAddress: string): Promise<FaucetResult> {
  try {
    console.log('🚰 Requesting USDT from faucet for address:', walletAddress);
    
    // For now, we'll use a simple approach that calls the contract directly
    // This will be enhanced with fee delegation in the next task
    
    // Create a wallet instance for contract interaction
    // Note: This is a temporary implementation that will be replaced with fee delegation
    const wallet = new Wallet(
      '0x' + '1'.repeat(64), // Temporary private key - will be replaced with proper wallet integration
      provider
    );
    
    const usdtWithSigner = usdtContract.connect(wallet);
    
    console.log('📤 Calling faucet function...');
    const tx = await usdtWithSigner.faucet();
    
    console.log('⏳ Transaction sent, waiting for confirmation...', tx.hash);
    const receipt = await tx.wait();
    
    console.log('✅ Faucet transaction confirmed:', {
      hash: receipt.hash,
      status: receipt.status
    });

    return {
      success: true,
      transactionHash: receipt.hash
    };
  } catch (error) {
    console.error('❌ Faucet request failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Transfer USDT to another address
 */
export async function transferUSDT(
  walletPrivateKey: string,
  toAddress: string,
  amount: string
): Promise<FaucetResult> {
  try {
    console.log('💸 Transferring USDT:', {
      to: toAddress,
      amount
    });
    
    // Create wallet instance
    const wallet = new Wallet(walletPrivateKey, provider);
    
    // Connect contract with wallet
    const usdtWithSigner = usdtContract.connect(wallet);
    
    // Get decimals and convert amount
    const decimals = await usdtContract.decimals();
    const amountInWei = parseTokenAmount(amount, decimals);
    
    console.log('📤 Sending transfer transaction...', {
      rawAmount: amountInWei.toString(),
      decimals
    });
    
    // Send transfer
    const tx = await usdtWithSigner.transfer(toAddress, amountInWei);
    
    console.log('⏳ Transfer transaction sent, waiting...', tx.hash);
    const receipt = await tx.wait();
    
    console.log('✅ Transfer confirmed:', {
      hash: receipt.hash,
      status: receipt.status
    });

    return {
      success: true,
      transactionHash: receipt.hash
    };
  } catch (error) {
    console.error('❌ Transfer failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Approve USDT spending (for bulk payments)
 */
export async function approveUSDT(
  walletPrivateKey: string,
  spenderAddress: string,
  amount: string
): Promise<FaucetResult> {
  try {
    console.log('✅ Approving USDT spending:', {
      spender: spenderAddress,
      amount
    });
    
    const wallet = new Wallet(walletPrivateKey, provider);
    const usdtWithSigner = usdtContract.connect(wallet);
    
    // Get decimals and convert amount
    const decimals = await usdtContract.decimals();
    const amountInWei = parseTokenAmount(amount, decimals);
    
    // Send approval
    const tx = await usdtWithSigner.approve(spenderAddress, amountInWei);
    const receipt = await tx.wait();
    
    console.log('✅ Approval confirmed:', receipt.hash);

    return {
      success: true,
      transactionHash: receipt.hash
    };
  } catch (error) {
    console.error('❌ Approval failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Format token amount from wei to human readable
 */
export function formatTokenAmount(rawAmount: bigint, decimals: number): string {
  const divisor = BigInt(10 ** decimals);
  const quotient = rawAmount / divisor;
  const remainder = rawAmount % divisor;
  
  // Convert remainder to decimal part
  const decimalPart = remainder.toString().padStart(decimals, '0');
  
  // Remove trailing zeros and format
  const trimmedDecimal = decimalPart.replace(/0+$/, '');
  
  if (trimmedDecimal === '') {
    return quotient.toString();
  } else {
    return `${quotient}.${trimmedDecimal}`;
  }
}

/**
 * Parse token amount from human readable to wei
 */
export function parseTokenAmount(amount: string, decimals: number): bigint {
  const parts = amount.split('.');
  const wholePart = BigInt(parts[0] || '0');
  const decimalPart = (parts[1] || '').padEnd(decimals, '0').slice(0, decimals);
  
  const factor = BigInt(10 ** decimals);
  const decimalValue = BigInt(decimalPart || '0');
  
  return wholePart * factor + decimalValue;
}

/**
 * Check if address has sufficient USDT balance
 */
export async function hasValidUSDTBalance(walletAddress: string, requiredAmount: string): Promise<boolean> {
  try {
    const balance = await getUSDTBalance(walletAddress);
    return parseFloat(balance.balance) >= parseFloat(requiredAmount);
  } catch (error) {
    console.error('❌ Error checking USDT balance:', error);
    return false;
  }
}

// Export contract instance for advanced usage
export { usdtContract, provider };