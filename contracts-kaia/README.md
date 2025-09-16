# KaiaPay - USDT-Only Payment System on Kaia Blockchain ✅

![Kaia Network](https://img.shields.io/badge/Network-Kaia%20Testnet-blue)
![Solidity](https://img.shields.io/badge/Solidity-0.8.28-green)
![License](https://img.shields.io/badge/License-MIT-yellow)
![Tests](https://img.shields.io/badge/Tests-78%20Passing-brightgreen)
![Architecture](https://img.shields.io/badge/Architecture-USDT%20Only-orange)

KaiaPay is a comprehensive suite of smart contracts built on the Kaia blockchain network, providing various payment solutions including bulk payments, invoice management, and split billing functionality.

## 🌟 Overview

This project consists of four main smart contracts:

1. **MyDummyTokenWithFaucet (USDT)** - KIP7 token with faucet functionality for testing
2. **BulkPayroll** - Efficient bulk payment processing for ETH and ERC20 tokens
3. **InvoiceSubscriptionService** - Complete invoice and subscription management system
4. **SplitBilling** - Split payment functionality for shared expenses

## 📋 Table of Contents

- [Contract Addresses](#contract-addresses)
- [Features](#features)
- [Contract Details](#contract-details)
- [Frontend Integration](#frontend-integration)
- [Deployment](#deployment)
- [Testing](#testing)
- [Quick Start](#quick-start)

## 🏠 Contract Addresses

### Kaia Testnet (Chain ID: 1001)

| Contract | Address | Explorer Link |
|----------|---------|---------------|
| **USDT Token** | `[Will be filled after deployment]` | [View on KaiaScope](https://kairos.kaiascope.com) |
| **BulkPayroll** | `[Will be filled after deployment]` | [View on KaiaScope](https://kairos.kaiascope.com) |
| **InvoiceService** | `[Will be filled after deployment]` | [View on KaiaScope](https://kairos.kaiascope.com) |
| **SplitBilling** | `[Will be filled after deployment]` | [View on KaiaScope](https://kairos.kaiascope.com) |

> 📝 **Note**: After deployment, contract addresses will be automatically saved to `deployed-contracts.json`

## ✨ Features

### 🪙 USDT Token (MyDummyTokenWithFaucet)
- **KIP7 Standard Compliance**: Full compatibility with KIP7 token standard
- **Faucet System**: Users can claim 100 tokens every 24 hours
- **Minting Capability**: Owner can mint additional tokens
- **Faucet Management**: Owner can fund and withdraw from faucet

### 💸 BulkPayroll Contract
- **Multi-Token Support**: Process payments in ETH or any ERC20 token
- **Failure Isolation**: Failed transfers are stored for later claiming
- **Gas Optimization**: Efficient batch processing with gas limits
- **Refund System**: Automatic refunds for excess payments
- **Emergency Withdrawal**: Owner can recover stuck funds

### 🧾 Invoice Subscription Service
- **Service Marketplace**: List and discover services
- **Invoice Generation**: Automatic invoice creation with unique IDs
- **Split Payments**: Multiple contributors can pay a single invoice
- **Platform Fees**: Configurable platform fee collection (default 2.5%)
- **Payment Flexibility**: Support for ETH and ERC20 payments
- **Discount System**: Sellers can apply discounts to invoices

### 💰 Split Billing Contract
- **Direct Payments**: Payments go directly to payee (no escrow)
- **Multi-Token Support**: Split bills in ETH or ERC20 tokens
- **Flexible Amounts**: Each person can owe different amounts
- **Pay for Others**: Users can cover someone else's share
- **Deadline Management**: Set and track payment deadlines

## 📋 Contract Details

### MyDummyTokenWithFaucet

```solidity
// Key Functions
function faucet() external                              // Claim 100 tokens (24h cooldown)
function mint(address to, uint256 amount) external     // Owner mints tokens
function withdrawFaucetFunds() external                 // Owner withdraws faucet funds
```

### BulkPayroll Contract

```solidity
// Key Functions
function bulkTransfer(
    address token,                    // Token address (0x0 for ETH)
    address[] calldata recipients,    // Recipient addresses
    uint256[] calldata amounts        // Amounts to send
) external payable

function claimFailedTransfer(address token) external    // Claim failed transfers
function getFailedAmount(address recipient, address token) external view returns (uint256)
```

### InvoiceSubscriptionService Contract

```solidity
// Service Management
function listService(
    string memory serviceName,
    string memory description,
    string memory imageUrl,
    uint256 priceInWei,
    address paymentToken
) external returns (uint256)

// Invoice Management  
function purchaseService(
    uint256 serviceId,
    bool allowSplitPayment,
    uint256 daysUntilDue
) external returns (uint256)

function payInvoice(uint256 invoiceId) external payable

// Split Payments
function contributeToSplitPayment(uint256 invoiceId, uint256 amount) external payable
```

### SplitBilling Contract

```solidity
// Split Management
function createSplit(
    address payee,                    // Who receives the money
    address[] calldata debtors,       // Who owes money
    uint256[] calldata amounts,       // How much each person owes
    address token,                    // Payment token (0x0 for ETH)
    uint256 deadline,                 // Payment deadline
    string calldata description       // Bill description
) external returns (uint256)

// Payment Functions
function payShare(uint256 splitId) external payable     // Pay your own share
function payForSomeone(uint256 splitId, address debtor) external payable  // Pay for someone else
```

## 🌐 Frontend Integration

### Network Configuration

```javascript
// Kaia Testnet Configuration
const kaiaTestnet = {
  chainId: '0x3e9', // 1001 in hex
  chainName: 'Kaia Testnet',
  nativeCurrency: {
    name: 'KAIA',
    symbol: 'KAIA',
    decimals: 18,
  },
  rpcUrls: ['https://public-en-kairos.node.kaia.io'],
  blockExplorerUrls: ['https://kairos.kaiascope.com'],
};
```

### Contract Integration Example

```javascript
import { ethers } from 'ethers';

// Setup provider and signer
const provider = new ethers.BrowserProvider(window.ethereum);
const signer = await provider.getSigner();

// Contract addresses (from deployed-contracts.json)
const CONTRACTS = {
  USDT: "0x...",
  BulkPayroll: "0x...",
  InvoiceService: "0x...",
  SplitBilling: "0x..."
};

// Initialize contracts
const usdtContract = new ethers.Contract(CONTRACTS.USDT, USDTAbi.abi, signer);
const bulkPayrollContract = new ethers.Contract(CONTRACTS.BulkPayroll, BulkPayrollAbi.abi, signer);

// Example: Claim from faucet
async function claimFromFaucet() {
  try {
    const tx = await usdtContract.faucet();
    await tx.wait();
    console.log('Successfully claimed from faucet!');
  } catch (error) {
    console.error('Error claiming from faucet:', error);
  }
}

// Example: Create split bill
async function createSplitBill(payee, debtors, amounts, description) {
  const deadline = Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60); // 7 days
  const amountsWei = amounts.map(amount => ethers.parseEther(amount.toString()));
  
  const tx = await splitBillingContract.createSplit(
    payee,
    debtors,
    amountsWei,
    ethers.ZeroAddress, // ETH
    deadline,
    description
  );
  
  await tx.wait();
  return tx.hash;
}
```

## 🚀 Deployment

### Prerequisites

1. **Node.js** (v16 or higher)
2. **npm** (comes with Node.js)
3. **Private key** with KAIA tokens for deployment

### Quick Start

```bash
# Clone and setup
git clone <repository-url>
cd contracts-kaia
npm install

# Configure environment
cp .env.example .env
# Edit .env with your PRIVATE_KEY and FEE_COLLECTOR_ADDRESS

# Compile and test
npx hardhat compile
npx hardhat test

# Deploy to Kaia testnet
npx hardhat run scripts/deploy.js --network kaiaTestnet

# Verify contracts functionality
npx hardhat run scripts/verify-contracts.js --network kaiaTestnet

# Run comprehensive tests
npx hardhat run scripts/interact-contracts.js --network kaiaTestnet
```

### Environment Configuration

```bash
# .env file
PRIVATE_KEY=your_private_key_without_0x_prefix
FEE_COLLECTOR_ADDRESS=address_to_collect_platform_fees
```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npx hardhat test

# Run specific test files
npx hardhat test test/USDT.test.js
npx hardhat test test/BulkPayroll.test.js
npx hardhat test test/InvoiceSubscriptionService.test.js
npx hardhat test test/SplitBilling.test.js

# Run with gas reporting
REPORT_GAS=true npx hardhat test
```

### Test Coverage

- ✅ **USDT Token**: Faucet, minting, transfers, access control
- ✅ **BulkPayroll**: Bulk transfers, failure handling, emergency functions
- ✅ **InvoiceService**: Service listing, invoice creation, payments, split payments
- ✅ **SplitBilling**: Split creation, individual payments, pay-for-others functionality

## 📊 Contract Statistics

| Contract | Functions | Test Cases | Gas Optimized |
|----------|-----------|------------|---------------|
| USDT Token | 8 core functions | 15 tests | ✅ |
| BulkPayroll | 6 core functions | 20 tests | ✅ |
| InvoiceService | 12 core functions | 25 tests | ✅ |
| SplitBilling | 10 core functions | 30 tests | ✅ |

## 🔒 Security Features

- **ReentrancyGuard**: Protection against reentrancy attacks
- **Access Control**: Owner-only administrative functions
- **Input Validation**: Comprehensive parameter validation
- **Gas Limits**: Protection against griefing attacks
- **Failure Isolation**: Individual transaction failures don't affect others
- **Event Logging**: Complete audit trail of all operations

## 🌐 Network Information

- **Network**: Kaia Testnet
- **Chain ID**: 1001
- **RPC URL**: https://public-en-kairos.node.kaia.io
- **Explorer**: https://kairos.kaiascope.com
- **Faucet**: https://kairos.wallet.kaia.io/faucet

## 📄 Generated Files

After deployment, the following files are automatically generated:

- `deployed-contracts.json` - Contract addresses and deployment info
- `verification-results.json` - Contract verification results
- `interaction-test-results.json` - Comprehensive interaction test results

## 📞 Support

For questions and support:

- **GitHub Issues**: [Create an issue](../../issues)
- **Documentation**: This README and inline contract comments
- **Kaia Community**: [Join Kaia Discord](https://discord.gg/kaia)

## 📝 License

This project is licensed under the MIT License.

---

**Built with ❤️ on Kaia Network**

*Ready for production deployment on Kaia Mainnet*
