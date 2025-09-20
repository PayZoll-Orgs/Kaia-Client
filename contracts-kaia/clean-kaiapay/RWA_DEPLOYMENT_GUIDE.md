# RWA Lending Platform Deployment Guide for Kaia Testnet

## 🌟 Overview

This guide provides comprehensive instructions for deploying and verifying the RWA (Real World Assets) Lending Platform with Bonding Curves on the Kaia testnet. The platform enables lending and borrowing using tokenized real-world assets as collateral with sophisticated bonding curve mathematics for dynamic pricing and risk management.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Platform Architecture](#platform-architecture)
3. [Pre-Deployment Setup](#pre-deployment-setup)
4. [Deployment Process](#deployment-process)
5. [Verification Process](#verification-process)
6. [User Flow Testing](#user-flow-testing)
7. [Platform Features](#platform-features)
8. [Bonding Curve Mathematics](#bonding-curve-mathematics)
9. [Security Considerations](#security-considerations)
10. [Troubleshooting](#troubleshooting)
11. [Maintenance](#maintenance)

## 🔧 Prerequisites

### Required Software
- Node.js (v16+ recommended)
- npm or yarn package manager
- Git

### Required Accounts
- Kaia testnet account with sufficient KAIA tokens
- Private key with deployment permissions

### Environment Setup
```bash
# Clone the repository
git clone <repository-url>
cd contracts/clean-kaiapay

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

### Environment Variables
Create a `.env` file with the following variables:

```bash
# Kaia Testnet Configuration
PRIVATE_KEY=your_private_key_here
KAIROS_RPC_URL=https://public-en-kairos.node.kaia.io

# Optional: Custom gas settings
GAS_PRICE=250000000000
GAS_LIMIT=8500000
```

### Funding Your Account
Get KAIA testnet tokens from the faucet:
- Visit: https://kairos.wallet.klaytn.foundation/faucet
- Minimum recommended balance: 10 KAIA

## 🏗️ Platform Architecture

### Core Contracts

1. **RWALendingPlatformWithBondingCurves** - Main lending protocol
2. **TokenizedGold** - Gold-backed RWA token (collateral)
3. **TokenizedSilver** - Silver-backed RWA token (collateral)
4. **TokenizedRealEstate** - Real estate-backed RWA token (collateral)
5. **DummyUSDT** - Existing USDT for borrowing (0x07bA937403023CcD444923B183d42438b7057811)
6. **KaiaBondingCurveDemo** - Demo contract for testing

### Contract Interactions
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   RWA Tokens    │───▶│  Lending Pool   │───▶│   DummyUSDT     │
│  (Collateral)   │    │  (Platform)     │    │  (Borrowable)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ Bonding Curves  │    │ Risk Management │    │ Interest Rates  │
│   & Haircuts    │    │  & Liquidation  │    │  & Utilization  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Pre-Deployment Setup

### 1. Compile Contracts
```bash
npm run compile
```

### 2. Run Pre-Deployment Verification
```bash
node scripts/verify-pre-deployment.js
```

This script verifies:
- ✅ Environment variables
- ✅ Network connectivity
- ✅ Account balance
- ✅ Contract compilation
- ✅ Dependencies
- ✅ Existing DummyUSDT integration

### 3. Review Configuration
Check the bonding curve parameters in the deployment script match your requirements:

**Gold Configuration (Conservative)**
- Base Rate: 3%
- Optimal Utilization: 70%
- Base LTV: 75%
- Liquidation Threshold: 85%

**Silver Configuration (Moderate Risk)**
- Base Rate: 4%
- Optimal Utilization: 60%
- Base LTV: 65%
- Liquidation Threshold: 75%

**Real Estate Configuration (Stable)**
- Base Rate: 2.5%
- Optimal Utilization: 80%
- Base LTV: 80%
- Liquidation Threshold: 90%

## 🚀 Deployment Process

### Option 1: Complete Platform Deployment
```bash
# Deploy entire RWA platform
node scripts/deploy-rwa-platform.js
```

### Option 2: Step-by-Step Deployment

#### Step 1: Deploy RWA Tokens
```bash
# Deploy individual tokens (if needed)
npx hardhat run scripts/deploy-rwa-tokens.js --network kairos
```

#### Step 2: Deploy Main Platform
```bash
# Deploy lending platform
npx hardhat run scripts/deploy-lending-platform.js --network kairos
```

#### Step 3: Configure Assets
```bash
# Configure bonding curves
npx hardhat run scripts/configure-bonding-curves.js --network kairos
```

### Deployment Output
After successful deployment, you'll see:

```
🎉 ============================================
🎉 RWA PLATFORM DEPLOYMENT COMPLETED!
🎉 ============================================

📋 DEPLOYED CONTRACTS:
   🥇 Tokenized Gold: 0x1234...5678
   🥈 Tokenized Silver: 0x2345...6789
   🏠 Tokenized Real Estate: 0x3456...7890
   💵 DummyUSDT (existing): 0x07bA937403023CcD444923B183d42438b7057811
   🏦 RWA Lending Platform: 0x4567...8901
   🎮 Demo Contract: 0x5678...9012

📊 BONDING CURVE CONFIGURATION:
   🥇 Gold: Conservative (3% base, 75% LTV, 6-month decay)
   🥈 Silver: Volatile (4% base, 65% LTV, 4-month decay)
   🏠 Real Estate: Stable (2.5% base, 80% LTV, 1-year decay)
   💵 DummyUSDT: Borrowable (2% base, liquid asset)
```

## ✅ Verification Process

### 1. Post-Deployment Verification
```bash
node scripts/verify-post-deployment.js
```

This script verifies:
- ✅ Contract deployments
- ✅ Platform configuration
- ✅ Bonding curve setup
- ✅ Basic functionality
- ✅ Contract integrations
- ✅ Security settings

### 2. Manual Verification
```bash
# Check contract addresses
npx hardhat verify --network kairos 0xYourContractAddress

# View deployment info
cat deployment-info.json
```

## 🧪 User Flow Testing

### Run Comprehensive Tests
```bash
node scripts/test-user-flow.js
```

### Test Scenarios Covered:
1. **Token Faucets** - Get RWA tokens for testing
2. **Collateral Deposits** - Deposit RWA tokens
3. **Bonding Curve Metrics** - Verify dynamic calculations
4. **Dynamic LTV Borrowing** - Borrow with time-adjusted LTV
5. **Interest Rate Updates** - Test utilization-based rates
6. **Repayment** - Repay borrowed amounts
7. **Demo Contract** - Test integration functions
8. **Liquidation Simulation** - Test penalty calculations
9. **Withdrawal** - Withdraw collateral safely

### Expected Test Results:
```
📊 Tests Passed: 9/9
📈 Success Rate: 100.0%

📋 Individual Test Results:
   1. Token Faucets: ✅ PASS
   2. Collateral Deposits: ✅ PASS
   3. Bonding Curve Metrics: ✅ PASS
   4. Dynamic LTV Borrowing: ✅ PASS
   5. Interest Rate Updates: ✅ PASS
   6. Repayment: ✅ PASS
   7. Demo Contract: ✅ PASS
   8. Liquidation Simulation: ✅ PASS
   9. Withdrawal: ✅ PASS
```

## 🌟 Platform Features

### Core Lending Features
- **Multi-Asset Collateral** - Gold, Silver, Real Estate tokens
- **Dynamic LTV** - Time-decaying loan-to-value ratios
- **Flexible Borrowing** - Borrow against RWA collateral
- **Interest Optimization** - Bonding curve-driven rates
- **Safe Liquidation** - Progressive penalty system

### Bonding Curve Features
- **Interest Rate Curves** - Exponential rates based on utilization
- **Liquidation Penalties** - Dynamic penalties for risky positions
- **Collateral Haircuts** - Volatility-based risk adjustments
- **Time Decay** - LTV reduction over time for safety

### User Experience Features
- **Token Faucets** - Easy testing token acquisition
- **Real-time Metrics** - Live bonding curve calculations
- **Health Monitoring** - Position health tracking
- **Demo Integration** - Guided platform exploration

## 📈 Bonding Curve Mathematics

### Interest Rate Calculation
```
if utilization ≤ optimal_utilization:
    rate = base_rate + (base_rate × utilization_ratio)
else:
    excess_ratio = (utilization - optimal) / (100% - optimal)
    exponential_factor = excess_ratio^curve_exponent
    rate = base_rate + (max_rate - base_rate) × exponential_factor
```

### Liquidation Penalty Calculation
```
health_risk = max(0, 1 - health_factor)
risk_multiplier = 1 + (liquidation_count × penalty_slope)
penalty = (min_penalty + (max_penalty - min_penalty) × health_risk) × risk_multiplier
```

### Collateral Haircut Calculation
```
volatility_multiplier = avg_volatility × volatility_factor
haircut = min(base_haircut + volatility_multiplier, max_haircut)
```

### Time-Based LTV Decay
```
time_factor = min(time_since_open, max_decay_period) / max_decay_period
ltv_reduction = base_ltv × ltv_decay_rate × time_factor
effective_ltv = max(base_ltv - ltv_reduction, base_ltv / 2)
```

## 🔒 Security Considerations

### Access Control
- **Owner-only functions** - Asset configuration, parameter updates
- **Reentrancy protection** - All external calls protected
- **Input validation** - Comprehensive parameter checking

### Risk Management
- **Grace periods** - Protection against immediate liquidation
- **Health factor monitoring** - Continuous position tracking
- **Collateral safety checks** - Withdrawal validation

### Audit Checklist
- [ ] Owner permissions properly configured
- [ ] Bonding curve parameters within safe ranges
- [ ] Emergency pause functionality (if implemented)
- [ ] Price feed integration security
- [ ] Token approval limits

## 🔧 Troubleshooting

### Common Issues

#### Deployment Failures
```bash
# Issue: Insufficient gas
# Solution: Increase gas limit in hardhat.config.cjs
gas: 10000000

# Issue: Network connection timeout
# Solution: Check RPC URL and network connectivity
KAIROS_RPC_URL=https://public-en-kairos.node.kaia.io
```

#### Contract Interaction Failures
```bash
# Issue: Transaction reverted
# Check: Account has sufficient KAIA balance
# Check: Contract addresses are correct
# Check: Function parameters are valid

# Issue: Price feed errors
# Solution: Verify price feed integration
# For testnet: Uses mock prices
```

#### Verification Failures
```bash
# Issue: Contract verification failed
# Solution: Check compiler version matches
# Solution: Verify constructor arguments
# Solution: Ensure contract source matches deployed bytecode
```

### Debug Commands
```bash
# Check deployment status
cat deployment-info.json

# Check account balance
npx hardhat run scripts/check-balance.js --network kairos

# Test specific function
npx hardhat console --network kairos
```

## 🛠️ Maintenance

### Regular Tasks

#### Monitor Platform Health
```bash
# Check platform metrics
node scripts/check-platform-health.js

# Monitor bonding curve performance
node scripts/analyze-bonding-curves.js
```

#### Update Bonding Curve Parameters
```bash
# Update interest rate parameters
npx hardhat run scripts/update-curve-params.js --network kairos
```

#### Upgrade Contracts (if needed)
```bash
# Deploy new implementation
# Update proxy (if using proxy pattern)
# Migrate data (if required)
```

### Performance Optimization

#### Gas Optimization
- Batch multiple operations
- Use multicall for complex transactions
- Optimize bonding curve calculations

#### Scalability Considerations
- Monitor transaction volume
- Consider layer 2 solutions
- Implement efficient data structures

## 📚 Additional Resources

### Documentation Links
- [Kaia Documentation](https://docs.kaia.io/)
- [Hardhat Documentation](https://hardhat.org/docs)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/)

### Support Channels
- GitHub Issues: [Repository Issues]
- Discord: [Project Discord]
- Telegram: [Project Telegram]

### Code Repository Structure
```
contracts/
├── clean-kaiapay/
│   ├── contracts/
│   │   ├── RWALendingPlatformWithBondingCurves.sol
│   │   ├── KaiaCompatibleRWATokens.sol
│   │   └── DummyUSDT.sol
│   ├── scripts/
│   │   ├── deploy-rwa-platform.js
│   │   ├── verify-pre-deployment.js
│   │   ├── verify-post-deployment.js
│   │   └── test-user-flow.js
│   ├── test/
│   ├── hardhat.config.cjs
│   └── package.json
```

## 🎯 Next Steps

After successful deployment:

1. **Production Readiness**
   - Audit smart contracts
   - Test with real users
   - Monitor gas costs
   - Optimize parameters

2. **Feature Enhancements**
   - Add more RWA asset types
   - Implement governance
   - Add flash loan functionality
   - Integrate with DeFi protocols

3. **Scaling Considerations**
   - Monitor usage patterns
   - Optimize for high volume
   - Consider cross-chain deployment
   - Implement auto-rebalancing

## 📞 Support

For deployment assistance or technical questions:

1. Check the troubleshooting section
2. Review the test output for specific errors
3. Submit detailed issue reports with:
   - Deployment logs
   - Network configuration
   - Error messages
   - Steps to reproduce

---

**Deployment Checklist:**
- [ ] Environment configured
- [ ] Pre-deployment verification passed
- [ ] Contracts deployed successfully
- [ ] Post-deployment verification passed
- [ ] User flow tests completed
- [ ] Security checklist reviewed
- [ ] Documentation updated
- [ ] Team notified of deployment

**Congratulations! Your RWA Lending Platform is ready for use on Kaia testnet! 🎉**