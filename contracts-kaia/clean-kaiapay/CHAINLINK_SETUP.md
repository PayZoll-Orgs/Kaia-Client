# 🔗 Chainlink Automation Setup Guide

## 🎉 Deployed Contract Addresses (Kaia Testnet)

| Contract | Address | Purpose |
|----------|---------|---------|
| **InvoiceSubscription** | `0xF9f94692001602b5E4AEe778659814593B9315C4` | 🤖 **Main Automation Target** |
| DummyUSDT | `0x67484e7f93564F4e839Df694842B95647826B36a` | Test token with faucet |
| BulkPayroll | `0x2ccb132b985d096dF1A1bFAd1432CD79947295Ad` | Bulk payment processing |
| SplitBilling | `0x541cD0763c52ac9304A099b48fC81554Dd0A0493` | Payment splitting |

## 🚀 Chainlink Automation Setup Steps

### Step 1: Access Chainlink Automation
1. Go to [Chainlink Automation](https://automation.chain.link/)
2. Connect your wallet: `0xEEFfe4C8B285A3f55EEC9fB50C9c96F69f9B453e`
3. Select **Kaia Testnet** network

### Step 2: Register New Upkeep
1. Click **"Register new Upkeep"**
2. Choose **"Custom Logic"**
3. Fill in the details:
   - **Target Contract Address**: `0xF9f94692001602b5E4AEe778659814593B9315C4`
   - **Upkeep Name**: `KaiaPay Invoice Automation`
   - **Gas Limit**: `500000`
   - **Starting Balance**: `5 LINK` (minimum)
   - **Check Data**: Leave empty or use `0x`

### Step 3: Configure Automation
The InvoiceSubscription contract includes:
- ✅ `checkUpkeep()` function - Returns true when invoices need processing
- ✅ `performUpkeep()` function - Releases payments and handles refunds
- ✅ Gas-efficient batch processing
- ✅ Automatic failure handling

### Step 4: Fund with LINK Tokens
1. Get LINK tokens from [Kaia LINK Faucet](https://faucets.chain.link/kaia-kairos)
2. Fund your upkeep with at least 5 LINK
3. Monitor LINK balance in Chainlink Automation UI

## 🔧 Contract Features

### InvoiceSubscription Automation Logic
```solidity
// Automatically checks for:
• Expired invoices that need refunds
• Funded invoices ready for release
• Subscription payments due for processing

// Performs:
• Automatic escrow release to merchants
• Refund processing for expired invoices
• Gas-efficient batch operations
```

### Key Functions
- **checkUpkeep()**: Determines if automation is needed
- **performUpkeep()**: Executes the automation logic
- **getInvoicesNeedingProcessing()**: View function to see pending invoices

## 🧪 Testing Your Setup

### 1. Get Test Tokens
```javascript
// Connect to DummyUSDT contract
const dummyUSDT = await ethers.getContractAt("DummyUSDT", "0x67484e7f93564F4e839Df694842B95647826B36a");
await dummyUSDT.faucet(); // Get 1000 DUSDT (24h cooldown)
```

### 2. Create Test Invoice
```javascript
// Connect to InvoiceSubscription contract
const invoice = await ethers.getContractAt("InvoiceSubscription", "0xF9f94692001602b5E4AEe778659814593B9315C4");

// Create and fund an invoice
const amount = ethers.utils.parseEther("100");
const deadline = Math.floor(Date.now() / 1000) + 3600; // 1 hour

await invoice.createInvoice(amount, deadline, "Test Invoice");
// Fund it and wait for automation!
```

### 3. Monitor Automation
- Check Chainlink Automation UI for execution history
- View contract events for automated payments
- Monitor LINK balance consumption

## 📊 Network Information

- **Network**: Kaia Testnet (Kairos)
- **Chain ID**: 1001
- **RPC URL**: https://public-en-kairos.node.kaia.io
- **Explorer**: https://kairos.kaiascan.io
- **Faucet**: https://faucet.kaia.io

## ⚡ Gas Optimization Features

- **Batch Processing**: Multiple invoices processed in single transaction
- **Gas Limits**: Built-in protection against gas limit issues
- **Failure Isolation**: Failed operations don't block other processing
- **Event Emission**: Comprehensive logging for monitoring

## 🎯 Next Actions for You

1. ✅ **Copy contract addresses to your frontend/backend**
2. ✅ **Register Chainlink Automation with the provided address**
3. ✅ **Fund the upkeep with LINK tokens**
4. ✅ **Test with DummyUSDT faucet and sample invoices**
5. ✅ **Monitor automation performance in Chainlink UI**

## 🆘 Troubleshooting

### Common Issues:
- **Upkeep not triggering**: Check LINK balance and gas limits
- **Performance failures**: Review contract events for specific errors
- **Network issues**: Verify Kaia testnet connectivity

### Support Resources:
- [Chainlink Docs](https://docs.chain.link/chainlink-automation)
- [Kaia Network Docs](https://docs.kaia.io/)
- Contract source code in `clean-kaiapay/contracts/`

---

🎉 **Your KaiaPay contracts are now live and ready for Chainlink Automation!**
