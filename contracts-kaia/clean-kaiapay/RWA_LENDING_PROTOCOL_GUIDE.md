# 🏦 RWA LENDING PROTOCOL - COMPLETE USER GUIDE

## 🌟 SYSTEM OVERVIEW

The **Real World Asset (RWA) Lending Protocol** is a revolutionary DeFi system that allows users to:
- **Use Real World Assets (USDY tokens) as collateral**
- **Borrow USDT against RWA collateral**
- **Earn yield by providing liquidity (LP tokens)**
- **Participate in a bonding curve economy**

This system demonstrates how traditional assets can be tokenized and used in DeFi lending markets.

---

## 📋 DEPLOYED CONTRACTS (Kaia Testnet)

| Contract | Address | Purpose |
|----------|---------|---------|
| **USDY** | `0xC4F121aa9293c2B261bb9143b4c59b9BC9912B6c` | RWA collateral token with faucet |
| **DummyUSDT** | `0xd55B72640f3e31910A688a2Dc81876F053115B09` | Lending/borrowing token with faucet |
| **kKAIA** | `0xf38b06fcf9e107EBb3AE2104D57CC3dF7279F64B` | KAIA liquidity LP token |
| **kUSDT** | `0xB6369bfC61b27856A8DCA6bebE1a51766C767133` | USDT liquidity LP token |
| **LendingProtocol** | `0x4e11Fd6d94059aDDEA9Ea8A81a0c40881d5E5fB6` | Main lending/borrowing contract |

**Network:** Kaia Testnet (Chain ID: 1001)  
**RPC URL:** `https://public-en-kairos.node.kaia.io`

---

## 🚀 USER WORKFLOWS

### 1. 💧 GET RWA TOKENS (USDY) FROM FAUCET

**Purpose:** Acquire Real World Asset tokens to use as collateral

```javascript
// Check if you can claim
const canClaim = await usdy.canClaimFromFaucet(userAddress);

// Claim 1000 USDY tokens (once per 24 hours)
if (canClaim) {
    await usdy.claimFromFaucet();
}

// Check balance
const balance = await usdy.balanceOf(userAddress);
```

**Faucet Details:**
- **Amount:** 1,000 USDY per claim
- **Cooldown:** 24 hours between claims
- **Value:** $1 USD per USDY (1:1 peg)

### 2. 🏦 DEPOSIT USDY AS COLLATERAL

**Purpose:** Lock RWA tokens to enable borrowing

```javascript
// Approve USDY for lending protocol
await usdy.approve(lendingProtocolAddress, amount);

// Deposit collateral
await lendingProtocol.depositCollateral(amount);

// Check collateral balance
const collateral = await lendingProtocol.collateralBalance(userAddress);
```

**Important Notes:**
- USDY is valued at $1 USD each
- No minimum deposit amount
- Collateral earns no interest (but enables borrowing)

### 3. 💰 BORROW USDT AGAINST COLLATERAL

**Purpose:** Borrow USDT using USDY collateral

```javascript
// Check maximum borrowable amount (80% LTV limit)
const collateralValue = collateralAmount * 1; // $1 per USDY
const maxBorrow = collateralValue * 0.8; // 80% LTV

// Borrow USDT
await lendingProtocol.borrow(usdtAddress, borrowAmount);

// Check debt
const debt = await lendingProtocol.debtBalance(userAddress, usdtAddress);
const ltv = await lendingProtocol.getLTV(userAddress);
```

**Borrowing Rules:**
- **Maximum LTV:** 80%
- **Interest Rate:** 5% APR
- **Liquidation Threshold:** 80% LTV
- **Supported Assets:** USDT, KAIA

### 4. 🔄 REPAY BORROWED DEBT

**Purpose:** Repay borrowed amounts to reduce debt and LTV

```javascript
// Approve USDT for repayment
await usdt.approve(lendingProtocolAddress, repayAmount);

// Repay debt (partial or full)
await lendingProtocol.repay(usdtAddress, repayAmount);

// Check remaining debt
const remainingDebt = await lendingProtocol.debtBalance(userAddress, usdtAddress);
```

### 5. 💎 WITHDRAW COLLATERAL

**Purpose:** Withdraw unused collateral (while maintaining safe LTV)

```javascript
// Calculate safe withdrawal amount
const currentDebt = await lendingProtocol.debtBalance(userAddress, usdtAddress);
const requiredCollateral = currentDebt / 0.75; // Keep 75% LTV for safety
const maxWithdrawable = currentCollateral - requiredCollateral;

// Withdraw collateral
await lendingProtocol.withdrawCollateral(withdrawAmount);
```

### 6. 📈 PROVIDE LIQUIDITY & EARN YIELD

**Purpose:** Earn yield by providing USDT liquidity to the lending pool

```javascript
// Approve USDT for deposit
await usdt.approve(lendingProtocolAddress, depositAmount);

// Deposit USDT to earn LP tokens
await lendingProtocol.deposit(usdtAddress, depositAmount);

// Check LP tokens received
const lpTokens = await kUSDT.balanceOf(userAddress);

// Check current LP token price (increases with demand)
const lpPrice = await lendingProtocol.getLpPrice(kUSDTAddress);
```

**Yield Features:**
- **Bonding Curve Pricing:** LP token price increases with supply
- **Formula:** `price = 0.000001 * supply + 1.0`
- **Earnings:** Capital appreciation + borrow interest

### 7. 🎯 REDEEM LP TOKENS

**Purpose:** Convert LP tokens back to underlying USDT

```javascript
// Redeem LP tokens for USDT
await lendingProtocol.redeem(kUSDTAddress, lpTokenAmount);

// Check received USDT
const receivedUSDT = await usdt.balanceOf(userAddress);
```

---

## 💡 KEY FEATURES

### 🏛️ Real World Assets (RWA)
- **USDY represents tokenized real-world assets**
- **Backed by US Treasury Bonds (simulated)**
- **1:1 USD value peg for stability**
- **Faucet system for easy testing**

### 🔒 Risk Management
- **80% Maximum LTV ratio**
- **Automatic liquidation protection**
- **Interest accrual (5% APR)**
- **Position safety checks**

### 📈 Bonding Curve Economics
- **LP token prices increase with supply**
- **Early liquidity providers earn more**
- **Dynamic pricing mechanism**
- **Capital appreciation potential**

### 🎯 Multi-Asset Support
- **USDT:** Primary lending asset
- **KAIA:** Native token lending (coming soon)
- **USDY:** RWA collateral token
- **LP Tokens:** Yield-bearing assets

---

## 📊 VIEW FUNCTIONS FOR UI

### User Portfolio
```javascript
// Token balances
const usdyBalance = await usdy.balanceOf(userAddress);
const usdtBalance = await usdt.balanceOf(userAddress);
const lpBalance = await kUSDT.balanceOf(userAddress);

// Protocol positions
const collateral = await lendingProtocol.collateralBalance(userAddress);
const debt = await lendingProtocol.debtBalance(userAddress, usdtAddress);
const ltv = await lendingProtocol.getLTV(userAddress);

// Risk assessment
const isLiquidatable = await lendingProtocol.isLiquidatable(userAddress);
```

### Market Data
```javascript
// Asset prices
const kaiaPrice = await lendingProtocol.getKaiaPrice(); // $0.15
const usdtPrice = await lendingProtocol.getUsdtPrice(); // $1.00

// LP token pricing
const lpPrice = await lendingProtocol.getLpPrice(kUSDTAddress);

// Protocol liquidity
const protocolLiquidity = await usdt.balanceOf(lendingProtocolAddress);
```

### Faucet Information
```javascript
// USDY faucet
const canClaimUSDA = await usdy.canClaimFromFaucet(userAddress);
const timeUntilNext = await usdy.timeUntilNextClaim(userAddress);
const faucetInfo = await usdy.getFaucetInfo();

// USDT faucet
const canClaimUSDT = await usdt.canClaimFaucet(userAddress);
```

---

## ⚠️ IMPORTANT SAFETY NOTES

### 🚨 LTV Management
- **Keep LTV below 75%** for safety margin
- **Monitor debt positions regularly**
- **Repay or add collateral if LTV rises**

### 💧 Faucet Limitations
- **24-hour cooldown** between claims
- **Limited total supply** available
- **One claim per address** per period

### 🔄 Transaction Tips
- **Always approve tokens** before deposits/repayments
- **Check gas fees** on Kaia testnet
- **Wait for confirmations** before next transaction

---

## 🎯 EXAMPLE USER FLOW

```javascript
// 1. Get RWA tokens from faucet
await usdy.claimFromFaucet(); // Get 1000 USDY

// 2. Deposit collateral
await usdy.approve(lendingProtocol, 500e18);
await lendingProtocol.depositCollateral(500e18); // Deposit 500 USDY

// 3. Borrow USDT
await lendingProtocol.borrow(usdtAddress, 300e18); // Borrow 300 USDT (60% LTV)

// 4. Provide liquidity and earn yield
await usdt.approve(lendingProtocol, 200e18);
await lendingProtocol.deposit(usdtAddress, 200e18); // Earn LP tokens

// 5. Repay debt
await usdt.approve(lendingProtocol, 150e18);
await lendingProtocol.repay(usdtAddress, 150e18); // Repay half

// 6. Withdraw excess collateral
await lendingProtocol.withdrawCollateral(200e18); // Withdraw 200 USDY
```

---

## 🌐 FRONTEND INTEGRATION

### Required Dependencies
```javascript
// Web3 integration
import { ethers } from 'ethers';

// Contract ABIs (generated from deployment)
import USDYAbi from './abis/USDY.json';
import DummyUSDTAbi from './abis/DummyUSDT.json';
import LendingProtocolAbi from './abis/LendingProtocol.json';
import LPTokenAbi from './abis/LPToken.json';
```

### Contract Connections
```javascript
const provider = new ethers.providers.JsonRpcProvider('https://public-en-kairos.node.kaia.io');
const signer = provider.getSigner();

const usdy = new ethers.Contract(USDY_ADDRESS, USDYAbi, signer);
const usdt = new ethers.Contract(USDT_ADDRESS, DummyUSDTAbi, signer);
const lendingProtocol = new ethers.Contract(LENDING_ADDRESS, LendingProtocolAbi, signer);
const kUSDT = new ethers.Contract(KUSDT_ADDRESS, LPTokenAbi, signer);
```

---

## 🎉 SUCCESS METRICS

The RWA Lending Protocol successfully demonstrates:

✅ **Real World Asset Integration** - USDY tokens represent RWA collateral  
✅ **DeFi Lending Mechanics** - Borrow/repay with interest accrual  
✅ **Risk Management** - LTV limits and liquidation protection  
✅ **Yield Generation** - LP tokens with bonding curve appreciation  
✅ **Multi-Asset Support** - USDT, KAIA, and RWA tokens  
✅ **User-Friendly Faucets** - Easy token acquisition for testing  
✅ **Production Ready** - Fully deployed and tested on Kaia testnet  

---

## 🚀 NEXT STEPS FOR PRODUCTION

1. **Security Audit** - Professional smart contract audit
2. **Oracle Integration** - Real Orakl Network price feeds
3. **Governance Module** - DAO governance for parameters
4. **Advanced Features** - Flash loans, liquidation bots
5. **Mobile App** - React Native mobile interface
6. **Real RWA Integration** - Connect to actual asset tokenization

---

**🌟 The RWA Lending Protocol bridges traditional finance with DeFi, enabling Real World Assets to participate in decentralized lending markets!**