// Contract Addresses Configuration
// This file contains all deployed contract addresses for different networks

export interface ContractAddresses {
  // Enhanced Lending Protocol
  enhancedLending: string;
  
  // Token Contracts
  usdt: string;
  kaia: string;
  usdy: string;
  
  // LP Token Contracts
  kKAIA: string;
  kUSDT: string;
  
  // KaiaPay Contracts (existing)
  bulkPayroll: string;
  invoiceService: string;
  splitBilling: string;
}

// Network configurations
export const CONTRACT_ADDRESSES: Record<string, ContractAddresses> = {
  // Kaia Testnet (Kairos) - LIVE DEPLOYMENT
  kairos: {
    // Enhanced Lending Protocol - DEPLOYED AND FUNCTIONAL
    enhancedLending: '0x59a817BA3FfB4a2590B96B3625F4Ac2B7B79c5D8', // ✅ DEPLOYED ON KAIA TESTNET
    
    // Token contracts - DEPLOYED AND FUNCTIONAL
    usdt: '0xd5578DD1B35713484DD8f872e36674F2ED2839a3', // ✅ DummyUSDT on Kaia testnet
    kaia: '0x0000000000000000000000000000000000000000', // Native KAIA (zero address)
    usdy: '0xE449AB36fA3DD7167D1A73Fd598E1377e5ff1461', // ✅ USDY on Kaia testnet
    
    // LP Token contracts - DEPLOYED AND FUNCTIONAL
    kKAIA: '0xAc364154272d1B79539d2d7B35156ca7134EBfB7', // ✅ kKAIA LP token on Kaia testnet
    kUSDT: '0x22cD2E80e3a63f8FF01AdFeBEA27bE08AB46aF3b', // ✅ kUSDT LP token on Kaia testnet
    
    // KaiaPay contracts - DEPLOYED AND FUNCTIONAL
    bulkPayroll: '0xB096Fe0128e804B0ed99055A93D438137998A337', // ✅ BulkPayroll on Kaia testnet
    invoiceService: '0xa23A75AFe9987F6D7db06792061AB4bEbdEcCbF8', // ✅ InvoiceSubscription on Kaia testnet
    splitBilling: '0x913Adbaa70Ba693636c2663653F517761B23C61e' // ✅ SplitBilling on Kaia testnet
  },
  
  // Local Hardhat Network
  hardhat: {
    // Enhanced Lending Protocol (deployed locally)
    enhancedLending: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    
    // Mock token contracts for local testing
    usdt: '0xd55B72640f3e31910A688a2Dc81876F053115B09',
    kaia: '0x0000000000000000000000000000000000000001',
    usdy: '0x0000000000000000000000000000000000000003',
    
    // Mock LP token contracts
    kKAIA: '0x0000000000000000000000000000000000000004',
    kUSDT: '0x0000000000000000000000000000000000000005',
    
    // Mock KaiaPay contracts for local testing
    bulkPayroll: '0xE9bD986514a6d35B1B73BeA6F19804D3c7aed284',
    invoiceService: '0xc70DfAf8d864125D37237fc7B034ACAE1f3397d9',
    splitBilling: '0x6892D8358bD3EE04a35Ad5844181BDED05dcdf2f'
  },
  
  // Kaia Mainnet (when ready)
  kaia: {
    enhancedLending: '', // To be deployed
    usdt: '', // Real USDT on mainnet
    kaia: '', // Real KAIA on mainnet
    usdy: '', // Real USDY on mainnet
    kKAIA: '',
    kUSDT: '',
    bulkPayroll: '',
    invoiceService: '',
    splitBilling: ''
  }
};

// Get current network (you can detect this from wallet or environment)
export function getCurrentNetwork(): string {
  // For now, default to kairos testnet
  // In production, this should detect the actual network
  if (typeof window !== 'undefined') {
    // Check if running in development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'hardhat';
    }
  }
  
  return 'kairos'; // Default to testnet
}

// Get contract addresses for current network
export function getContractAddresses(): ContractAddresses {
  const network = getCurrentNetwork();
  return CONTRACT_ADDRESSES[network];
}

// Get specific contract address
export function getContractAddress(contractName: keyof ContractAddresses): string {
  const addresses = getContractAddresses();
  return addresses[contractName];
}

// Validate if all required addresses are set
export function validateContractAddresses(): { valid: boolean; missing: string[] } {
  const addresses = getContractAddresses();
  const missing: string[] = [];
  
  Object.entries(addresses).forEach(([name, address]) => {
    if (!address || address === '' || address.startsWith('0x0000000000000000000000000000000000000000')) {
      missing.push(name);
    }
  });
  
  return {
    valid: missing.length === 0,
    missing
  };
}

// Export for easy access
export const ENHANCED_LENDING_ADDRESS = () => getContractAddress('enhancedLending');
export const USDT_ADDRESS = () => getContractAddress('usdt');
export const KAIA_ADDRESS = () => getContractAddress('kaia');
export const USDY_ADDRESS = () => getContractAddress('usdy');