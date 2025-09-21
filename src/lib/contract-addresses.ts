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
  // Kaia Testnet (Kairos)
  kairos: {
    // Enhanced Lending Protocol (newly deployed)
    enhancedLending: '0x5FbDB2315678afecb367f032d93F642f64180aa3', // Update after testnet deployment
    
    // Token contracts
    usdt: '0xd55B72640f3e31910A688a2Dc81876F053115B09', // From manual testing guide
    kaia: '0x0000000000000000000000000000000000000001', // Mock KAIA (replace with real)
    usdy: '0x0000000000000000000000000000000000000003', // Mock USDY (replace with real)
    
    // LP Token contracts (need to be deployed)
    kKAIA: '0x0000000000000000000000000000000000000004',
    kUSDT: '0x0000000000000000000000000000000000000005',
    
    // Existing KaiaPay contracts
    bulkPayroll: '0xE9bD986514a6d35B1B73BeA6F19804D3c7aed284',
    invoiceService: '0xc70DfAf8d864125D37237fc7B034ACAE1f3397d9',
    splitBilling: '0x6892D8358bD3EE04a35Ad5844181BDED05dcdf2f'
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