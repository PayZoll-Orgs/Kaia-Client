# KaiaPay Deployment Guide

This guide will walk you through deploying and testing the KaiaPay smart contracts on Kaia testnet.

## 🚀 Quick Deployment

### Prerequisites
- Node.js v16+ installed
- A wallet with Kaia testnet tokens ([Get from faucet](https://kairos.wallet.kaia.io/faucet))
- Private key from your wallet

### Step 1: Setup Environment

```bash
# Clone the repository (if not already done)
git clone <your-repo-url>
cd contracts-kaia

# Install dependencies
npm install

# Configure environment
cp .env.example .env
```

Edit the `.env` file:
```bash
PRIVATE_KEY=your_private_key_without_0x_prefix
FEE_COLLECTOR_ADDRESS=your_address_for_collecting_fees
```

### Step 2: Deploy Everything

```bash
# Run complete deployment pipeline
npm run full-deploy
```

This single command will:
1. ✅ Compile all contracts
2. ✅ Run comprehensive tests
3. ✅ Deploy to Kaia testnet
4. ✅ Verify contract functionality
5. ✅ Run interaction tests
6. ✅ Extract ABIs for frontend

### Step 3: Check Results

After deployment, you'll have these files:
- `deployed-contracts.json` - Contract addresses
- `verification-results.json` - Verification results
- `interaction-test-results.json` - Test results
- `abis/` directory - All ABIs and frontend helpers

## 📋 Manual Step-by-Step Deployment

If you prefer to run each step manually:

### 1. Compile Contracts
```bash
npm run compile
```

### 2. Run Tests
```bash
npm run test
# Or with gas reporting
npm run test:gas
```

### 3. Deploy to Testnet
```bash
npm run deploy:testnet
```

### 4. Verify Contracts
```bash
npm run verify:testnet
```

### 5. Run Interaction Tests
```bash
npm run interact:testnet
```

### 6. Extract ABIs
```bash
npm run extract-abis
```

## 📊 Expected Output

### Deployment Output
```
Deploying contracts to Kaia testnet...
Deploying with account: 0x...
Account balance: 1000.0 KAIA

1. Deploying MyDummyTokenWithFaucet (USDT)...
✅ USDT deployed to: 0x...

2. Deploying BulkPayroll...
✅ BulkPayroll deployed to: 0x...

3. Deploying InvoiceSubscriptionService...
✅ InvoiceService deployed to: 0x...

4. Deploying SplitBilling...
✅ SplitBilling deployed to: 0x...

🎉 ALL CONTRACTS DEPLOYED SUCCESSFULLY!
```

### Contract Addresses
After successful deployment, your contracts will be deployed to addresses like:
```json
{
  "USDT": "0x1234567890123456789012345678901234567890",
  "BulkPayroll": "0x2345678901234567890123456789012345678901", 
  "InvoiceService": "0x3456789012345678901234567890123456789012",
  "SplitBilling": "0x4567890123456789012345678901234567890123"
}
```

## 🌐 Frontend Integration

### Using the Generated Files

1. **Contract Addresses**: Use `deployed-contracts.json`
2. **ABIs**: Use files in `abis/` directory
3. **Frontend Config**: Use `abis/frontend-config.json`

### Example Integration

```javascript
import frontendConfig from './abis/frontend-config.json';
import { ethers } from 'ethers';

// Setup provider
const provider = new ethers.BrowserProvider(window.ethereum);
const signer = await provider.getSigner();

// Use contract
const usdtContract = new ethers.Contract(
  frontendConfig.contracts.USDT.address,
  frontendConfig.contracts.USDT.abi,
  signer
);

// Claim from faucet
await usdtContract.faucet();
```

## 🔧 Troubleshooting

### Common Issues

1. **"Insufficient funds"**
   - Get KAIA tokens from [testnet faucet](https://kairos.wallet.kaia.io/faucet)

2. **"Invalid private key"**
   - Ensure private key is without '0x' prefix
   - Check that private key has sufficient KAIA balance

3. **"Network connection failed"**
   - Check internet connection
   - Kaia testnet RPC might be temporarily down

4. **"Contract verification failed"**
   - This is expected on testnet (no verification service)
   - All functional tests will still pass

### Getting Help

- Check the error message carefully
- Ensure your `.env` file is configured correctly
- Make sure you have sufficient KAIA tokens
- Try again after a few minutes if network issues

## 📚 Next Steps

After successful deployment:

1. **Update README**: Replace placeholder addresses with actual deployed addresses
2. **Frontend Integration**: Use the generated ABI files in your frontend
3. **Testing**: Use the deployed contracts for testing your application
4. **Mainnet Deployment**: When ready, configure for Kaia mainnet

## 🛠 Development Workflow

For ongoing development:

```bash
# Make changes to contracts
# Then re-run the pipeline
npm run clean
npm run full-deploy
```

## 📝 Contract Verification on Explorer

Visit [Kaia Testnet Explorer](https://kairos.kaiascope.com) and search for your contract addresses to:
- View transactions
- Check contract state
- Monitor events
- Verify contract source (if supported)

---

**Ready to deploy? Run `npm run full-deploy` and you're all set!** 🚀
