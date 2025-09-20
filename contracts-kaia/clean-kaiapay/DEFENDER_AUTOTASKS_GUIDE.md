# 🛡️ OpenZeppelin Defender Autotasks Setup Guide

## 🎯 Overview

This guide explains how to set up OpenZeppelin Defender Autotasks for automated invoice processing in the KaiaPay system. Defender Autotasks replaces Chainlink Automation to provide reliable automation on Kaia testnet.

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Monitor       │───▶│   Autotask      │───▶│   Relayer       │
│                 │    │                 │    │                 │
│ Watches Events  │    │ Process Logic   │    │ Send TX         │
│ Time Conditions │    │ JavaScript      │    │ On-chain       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────────────────────────────────────────────────────┐
│              InvoiceSubscription Contract                        │
│                                                                 │
│  • processInvoices(invoiceIds[])                               │
│  • refundExpiredInvoices(invoiceIds[])                         │
│  • Emergency functions                                          │
└─────────────────────────────────────────────────────────────────┘
```

## 🔄 Migration from Chainlink Automation

### What Changed
- ❌ Removed: `checkUpkeep()` and `performUpkeep()` functions
- ❌ Removed: `AutomationCompatibleInterface` inheritance
- ✅ Added: External processing functions for Defender calls
- ✅ Added: Access control for Autotask-only functions
- ✅ Kept: All existing business logic and features

### Key Differences

| Aspect | Chainlink Automation | Defender Autotasks |
|--------|---------------------|-------------------|
| **Trigger** | On-chain polling | Event-driven monitoring |
| **Execution** | Decentralized network | Defender infrastructure |
| **Network Support** | Limited networks | Custom networks (Kaia ✅) |
| **Cost** | LINK tokens per execution | Monthly subscription |
| **Logic** | Solidity only | JavaScript + Solidity |

## 🛠️ Setup Components

### 1. Contract Modifications
The InvoiceSubscription contract has been modified to work with Defender:

```solidity
// New external functions for Defender
function processInvoices(uint256[] calldata invoiceIds) external onlyDefender
function refundExpiredInvoices(uint256[] calldata invoiceIds) external onlyDefender
function emergencyPause() external onlyDefender
```

### 2. Defender Components Needed

#### A. Relayer
- **Purpose**: Sends transactions to Kaia testnet
- **Configuration**: Kaia testnet (Chain ID 1001)
- **Funding**: Requires KAIA tokens for gas

#### B. Monitor
- **Purpose**: Watches contract events and time conditions
- **Events to Monitor**:
  - `InvoiceCreated` - New invoices
  - `InvoiceFunded` - Ready for processing
  - `PaymentReleased` - Completed payments
  - `RefundProcessed` - Refunded invoices

#### C. Autotask (Action)
- **Purpose**: Contains automation logic
- **Language**: JavaScript/Node.js
- **Triggers**: Monitor events + scheduled checks

## 📋 Contract Addresses (Kaia Testnet)

| Contract | Address | Defender Role |
|----------|---------|---------------|
| **InvoiceSubscription** | `0xF9f94692001602b5E4AEe778659814593B9315C4` | 🎯 **Main Target** |
| DummyUSDT | `0x67484e7f93564F4e839Df694842B95647826B36a` | Test token |
| BulkPayroll | `0x2ccb132b985d096dF1A1bFAd1432CD79947295Ad` | Optional monitoring |
| SplitBilling | `0x541cD0763c52ac9304A099b48fC81554Dd0A0493` | Optional monitoring |

## 🚀 Step-by-Step Setup

### Step 1: Access OpenZeppelin Defender
1. Go to [defender.openzeppelin.com](https://defender.openzeppelin.com)
2. Sign up/Login with your wallet
3. Create a new tenant or use existing

### Step 2: Add Kaia Testnet Network
```json
{
  "name": "Kaia Testnet",
  "chainId": 1001,
  "rpcUrl": "https://public-en-kairos.node.kaia.io",
  "blockExplorer": "https://kairos.kaiascan.io"
}
```

### Step 3: Create Relayer
1. Navigate to **Relayers** section
2. Click **"Create Relayer"**
3. Configure:
   - **Name**: `KaiaPay Relayer`
   - **Network**: `Kaia Testnet`
   - **Funding**: Transfer KAIA tokens to relayer address

### Step 4: Import Contracts
1. Go to **Address Book**
2. Add InvoiceSubscription contract:
   - **Name**: `KaiaPay InvoiceSubscription`
   - **Address**: `0xF9f94692001602b5E4AEe778659814593B9315C4`
   - **Network**: `Kaia Testnet`
   - **ABI**: Upload contract ABI

### Step 5: Create Monitor
1. Navigate to **Monitors**
2. Create **Contract Monitor**:
   - **Name**: `InvoiceSubscription Events Monitor`
   - **Contract**: Select imported contract
   - **Events**: Select relevant events
   - **Conditions**: Set up filtering logic

### Step 6: Create Autotask
1. Go to **Actions**
2. Create new **Autotask**:
   - **Name**: `Invoice Processing Autotask`
   - **Trigger**: Monitor created above
   - **Code**: Upload JavaScript logic

### Step 7: Set Permissions
1. In contract, call `grantRole(DEFENDER_ROLE, relayerAddress)`
2. Verify permissions are correctly set

## 🧪 Testing Strategy

### 1. Manual Testing
```javascript
// Test individual functions
await invoiceContract.processInvoices([1, 2, 3]);
await invoiceContract.refundExpiredInvoices([4, 5]);
```

### 2. Monitor Testing
- Create test invoices
- Fund some invoices
- Wait for deadlines to pass
- Verify autotask execution

### 3. End-to-End Testing
- Full invoice lifecycle
- Multiple concurrent invoices
- Error handling scenarios
- Gas limit testing

## 📊 Monitoring and Maintenance

### Defender Dashboard
- **Execution History**: View all autotask runs
- **Error Logs**: Debug failed executions
- **Gas Usage**: Monitor transaction costs
- **Performance**: Track execution times

### Key Metrics to Monitor
- ✅ Successful invoice processing rate
- ⚠️ Failed execution count
- ⏱️ Average processing time
- 💰 Gas consumption per execution
- 🔄 Relayer balance

### Alerts and Notifications
Set up notifications for:
- Failed autotask executions
- Low relayer balance
- High gas usage
- Contract errors

## 💡 Best Practices

### 1. Security
- ✅ Use role-based access control
- ✅ Implement pause mechanisms
- ✅ Monitor for unusual activity
- ✅ Regular security updates

### 2. Performance
- ✅ Batch operations when possible
- ✅ Set appropriate gas limits
- ✅ Monitor execution frequency
- ✅ Optimize JavaScript logic

### 3. Reliability
- ✅ Handle edge cases
- ✅ Implement retry mechanisms
- ✅ Monitor relayer balance
- ✅ Test failure scenarios

## 🔧 Troubleshooting

### Common Issues

**Autotask Not Triggering**
- Check monitor configuration
- Verify event filters
- Confirm contract is emitting events

**Transaction Failures**
- Check relayer balance
- Verify gas limits
- Confirm contract permissions

**Performance Issues**
- Optimize batch sizes
- Review JavaScript logic
- Check network congestion

### Debug Commands
```javascript
// Check relayer balance
await relayer.getBalance();

// View recent transactions
await relayer.list({ limit: 10 });

// Test autotask manually
await autotask.run(testPayload);
```

## 📞 Support Resources

- [Defender Documentation](https://docs.openzeppelin.com/defender/)
- [Kaia Network Docs](https://docs.kaia.io/)
- [KaiaPay Contract Source](./contracts/)
- [Defender Community Forum](https://forum.openzeppelin.com/)

---

## 🎉 Next Steps After Setup

1. ✅ Deploy modified contracts
2. ✅ Configure Defender components
3. ✅ Test with sample invoices
4. ✅ Monitor automation performance
5. ✅ Set up alerting and notifications

**Your KaiaPay system will now have reliable, event-driven automation on Kaia testnet! 🚀**
