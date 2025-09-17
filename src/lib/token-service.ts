// Simplified token service for USDT balance and faucet operations
import { CONFIG } from '@/lib/config';

export interface TokenBalance {
  balance: string;
  rawBalance: string;
  decimals: number;
  symbol: string;
  contractAddress: string;
}

export interface FaucetResult {
  success: boolean;
  transactionHash?: string;
  error?: string;
  amount?: string;
}

export async function getUSDTBalance(walletAddress: string): Promise<TokenBalance> {
  console.log('Getting USDT balance for:', walletAddress);
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    balance: "100.00",
    rawBalance: "100000000",
    decimals: 6,
    symbol: "USDT",
    contractAddress: CONFIG.USDT_ADDRESS
  };
}

export async function requestUSDTFromFaucet(walletAddress: string): Promise<FaucetResult> {
  console.log('Requesting USDT from faucet for:', walletAddress);
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const mockTxHash = '0x' + Math.random().toString(16).substring(2, 66);
  
  return {
    success: true,
    transactionHash: mockTxHash,
    amount: "50.00"
  };
}
