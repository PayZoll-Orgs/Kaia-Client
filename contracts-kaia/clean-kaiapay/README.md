# 🚀 KaiaPay Smart Contracts

A comprehensive suite of payment-related smart contracts designed for the Kaia blockchain ecosystem. This project includes bulk payments, split billing, invoice management with subscriptions, and automated escrow release via Chainlink Automation.

## 📋 Contracts Overview

### 1. **BulkPayroll.sol**
- **Purpose**: Execute bulk payments to multiple recipients efficiently
- **Features**: 
  - ✅ Failure isolation (failed transfers don't stop others)
  - ✅ Gas limit protection against griefing attacks  
  - ✅ Support for both ETH and ERC20 tokens
  - ✅ Failed transfer claiming mechanism
  - ✅ Automatic excess refund for ETH payments

### 2. **SplitBilling.sol**  
- **Purpose**: Split payments among multiple recipients with percentage allocation
- **Features**:
  - ✅ Percentage-based splitting using basis points (10000 = 100%)
  - ✅ Deadline management for split requests
  - ✅ Individual failure isolation
  - ✅ Event emission for missed deadlines
  - ✅ Failed transfer claiming

### 3. **InvoiceSubscription.sol**
- **Purpose**: Handle invoices and subscription payments with automated escrow
- **Features**:
  - ✅ Invoice creation with partial funding support
  - ✅ EIP-712 signature verification for subscriptions  
  - ✅ **Chainlink Automation integration** for automatic escrow release
  - ✅ Refund mechanism for expired invoices
  - ✅ Subscription management with recurring payments

### 4. **DummyUSDT.sol**
- **Purpose**: Test ERC20 token with built-in faucet for testing
- **Features**:
  - ✅ Standard ERC20 functionality
  - ✅ Public faucet (1000 tokens per 24 hours)
  - ✅ Owner mint capability
  - ✅ Kaia-compatible implementation

## 🛠️ Installation & Setup

### Prerequisites
- Node.js v18+ 
- npm or yarn
- Git

### 1. Clone and Install
\`\`\`bash
git clone <repository-url>
cd kaiapay-contracts
npm install
\`\`\`

### 2. Environment Configuration
\`\`\`bash
cp .env.example .env
\`\`\`

Edit `.env` file:
\`\`\`bash
# Your deployment private key (NEVER commit this!)
PRIVATE_KEY=0x1234567890abcdef...

# Kaia Testnet RPC
KAIROS_RPC_URL=https://public-en-kairos.node.kaia.io
\`\`\`

### 3. Get Test KAIA
Visit [Kaia Faucet](https://kairos.wallet.klaytn.foundation/) to get test KAIA for deployments.

## 🚀 Deployment

### Deploy All Contracts
\`\`\`bash
# Deploy to Kaia Testnet (Kairos)
npm run deploy:kairos
\`\`\`

### Deploy Individual Contracts
\`\`\`bash
npm run deploy:usdt      # Deploy DummyUSDT
npm run deploy:bulk      # Deploy BulkPayroll  
npm run deploy:split     # Deploy SplitBilling
npm run deploy:invoice   # Deploy InvoiceSubscription
\`\`\`

### Local Development
\`\`\`bash
# Start local Hardhat node
npx hardhat node

# Deploy to local network
npm run deploy:local
\`\`\`

## 🧪 Testing & Simulation

### Run All Tests
\`\`\`bash
npm test
\`\`\`

### Run Individual Contract Tests
\`\`\`bash
npm run test:bulk      # Test BulkPayroll
npm run test:split     # Test SplitBilling  
npm run test:invoice   # Test InvoiceSubscription
npm run test:usdt      # Test DummyUSDT
\`\`\`

### Run Complete Simulation
\`\`\`bash
npm run simulate
\`\`\`

The simulation will:
1. Test DummyUSDT faucet functionality
2. Execute bulk ETH and token transfers
3. Create split payments and requests
4. Create and fund invoices
5. Demonstrate Chainlink Automation readiness

## 🤖 Chainlink Automation Setup

The `InvoiceSubscription` contract includes **automatic escrow release** when invoices are fully funded. Here's how to set it up:

### What You Need to Do:

1. **Deploy the Contract** (already done if you followed deployment steps)

2. **Visit Chainlink Automation**:
   - Go to https://automation.chain.link/
   - Connect your wallet
   - Switch to Kaia Testnet

3. **Register New Upkeep**:
   - Click "Register New Upkeep"
   - Select "Custom Logic" 
   - Enter contract address: `<InvoiceSubscription address from deployment>`
   - Set upkeep name: "KaiaPay Invoice Auto-Release"
   - Set gas limit: `500000`
   - Set trigger: "Time-based" every 5 minutes

4. **Fund the Upkeep**:
   - You'll need LINK tokens on Kaia testnet
   - Fund with at least 10 LINK for testing
   - Get LINK from Kaia testnet faucet or bridge

5. **Activate**:
   - Confirm and activate your upkeep
   - Chainlink Keepers will now automatically monitor your contract

### How Automation Works:

1. **`checkUpkeep()`**: Called by Chainlink every few minutes
   - Scans all invoices to find fully funded ones
   - Returns `true` if any invoices need release
   - Returns encoded data of invoice IDs to process

2. **`performUpkeep()`**: Called when upkeep is needed
   - Automatically releases funds to sellers
   - Emits `AutomationTriggered` events
   - Updates invoice states to `released: true`

### Benefits:
- ✅ **Zero manual intervention** required
- ✅ **Immediate payment** when invoices are fully funded  
- ✅ **Gas efficient** - only processes when needed
- ✅ **Reliable** - Chainlink's decentralized network
- ✅ **Transparent** - All actions logged on-chain

## 📖 Contract Usage Examples

### BulkPayroll Usage
\`\`\`javascript
// Send ETH to multiple recipients
await bulkPayroll.bulkTransfer(
  ethers.ZeroAddress, // ETH
  ["0x123...", "0x456...", "0x789..."],
  [ethers.parseEther("1"), ethers.parseEther("2"), ethers.parseEther("3")],
  { value: ethers.parseEther("6") }
);

// Send ERC20 tokens
await token.approve(bulkPayroll.address, ethers.parseEther("100"));
await bulkPayroll.bulkTransfer(
  token.address,
  recipients,
  amounts
);
\`\`\`

### SplitBilling Usage
\`\`\`javascript  
// Immediate split (70/30)
await splitBilling.splitPayment(
  ["0x123...", "0x456..."],
  [7000, 3000], // basis points (70%, 30%)
  ethers.ZeroAddress,
  { value: ethers.parseEther("1") }
);

// Split with deadline
const deadline = Math.floor(Date.now() / 1000) + 86400; // 24 hours
await splitBilling.createSplitRequest(
  recipients,
  shares,  
  tokenAddress,
  deadline,
  { value: amount }
);
\`\`\`

### InvoiceSubscription Usage
\`\`\`javascript
// Create invoice
const invoiceId = await invoiceSubscription.createInvoice(
  sellerAddress,
  ethers.parseEther("10"), // 10 ETH invoice
  ethers.ZeroAddress, // ETH payment
  deadline
);

// Fund invoice (partial or full)
await invoiceSubscription.fundInvoice(invoiceId, {
  value: ethers.parseEther("5") // Pay 5 ETH
});

// Funds automatically released when totalContributed >= invoiceAmount
\`\`\`

## 🔧 Configuration

### Network Settings (hardhat.config.js)
- **Kaia Testnet (Kairos)**: Chain ID 1001
- **Gas Price**: 250 gwei
- **Gas Limit**: 8.5M
- **Optimizer**: Enabled with 200 runs
- **viaIR**: Enabled for complex contracts

### Contract Limits
- **BulkPayroll**: Max 200 recipients per transaction
- **SplitBilling**: Max 20 recipients per split
- **Gas Limits**: 50,000 gas per transfer (griefing protection)

## 📊 Gas Usage Analysis

| Contract | Function | Estimated Gas |
|----------|----------|---------------|
| BulkPayroll | bulkTransfer (10 recipients) | ~300,000 |
| SplitBilling | splitPayment (5 recipients) | ~200,000 |
| InvoiceSubscription | createInvoice | ~150,000 |
| InvoiceSubscription | fundInvoice | ~100,000 |
| DummyUSDT | faucet | ~50,000 |

## 🚨 Security Features

1. **ReentrancyGuard**: All external functions protected
2. **Gas Limits**: Protection against griefing attacks
3. **Ownable**: Admin functions restricted to owner
4. **Pausable**: Emergency pause functionality  
5. **EIP-712**: Secure signature verification
6. **SafeERC20**: Safe token transfer handling
7. **Failure Isolation**: Individual transfer failures don't break batch

## 🌐 Network Information

### Kaia Testnet (Kairos)
- **Chain ID**: 1001
- **RPC URL**: https://public-en-kairos.node.kaia.io
- **Explorer**: https://baobab.klaytnscope.com
- **Faucet**: https://kairos.wallet.klaytn.foundation/

## 📄 License

MIT License - see LICENSE file for details.

## 🆘 Support

For issues or questions:
1. Check existing GitHub issues
2. Create new issue with detailed description
3. Include transaction hashes and error messages

---

**Built for Kaia blockchain with ❤️**
