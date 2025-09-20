# 🏦 RWA Lending Protocol - Complete Frontend Integration Guide

## � Overview

The **Real World Asset (RWA) Lending Protocol** is a revolutionary DeFi platform that enables users to:
- **Use Real World Assets (USDY) as collateral**
- **Borrow USDT against RWA collateral**  
- **Provide liquidity to earn yield through LP tokens**
- **Participate in bonding curve economics**

This system demonstrates how traditional assets can be tokenized and integrated into decentralized finance.

## 📋 Contract Addresses (Kaia Testnet)

**Network**: Kaia Testnet (Chain ID: 1001)  
**RPC URL**: `https://public-en-kairos.node.kaia.io`

```javascript
const CONTRACT_ADDRESSES = {
  // Main Protocol
  LendingProtocol: "0x4e11Fd6d94059aDDEA9Ea8A81a0c40881d5E5fB6",
  
  // Tokens
  USDY: "0xC4F121aa9293c2B261bb9143b4c59b9BC9912B6c",        // RWA Collateral Token
  DummyUSDT: "0xd55B72640f3e31910A688a2Dc81876F053115B09",   // Lending/Borrowing Token
  
  // LP Tokens  
  kUSDT: "0xB6369bfC61b27856A8DCA6bebE1a51766C767133",       // USDT LP Token
  kKAIA: "0xf38b06fcf9e107EBb3AE2104D57CC3dF7279F64B",       // KAIA LP Token
  
  // Special Addresses
  KAIA: "0x0000000000000000000000000000000000000000",        // Native KAIA (zero address)
};
```

## 🎯 Key Features

### 🏛️ Real World Asset Integration
- **USDY Token**: Represents tokenized real-world assets (US Treasury Bonds simulation)
- **1:1 USD Peg**: Each USDY token is valued at $1.00 USD
- **Faucet System**: Get 1,000 USDY every 24 hours for testing
- **Collateral Only**: USDY can only be used as collateral (not borrowed)

### 💰 For Borrowers
- **RWA Collateral**: Use USDY tokens as collateral to borrow USDT
- **80% Maximum LTV**: Borrow up to 80% of collateral value
- **5% Annual Interest**: Competitive fixed interest rate  
- **Multi-Asset Borrowing**: Support for USDT and KAIA borrowing
- **Flexible Repayment**: Partial or full repayment anytime

### 📈 For Liquidity Providers  
- **Earn Yield**: Deposit USDT or KAIA to earn passive income
- **LP Tokens**: Receive kUSDT/kKAIA representing pool shares
- **Bonding Curve**: LP token prices increase with supply (`price = 0.000001 * supply + 1.0`)
- **Capital Appreciation**: Early providers earn more as demand grows

### 🔒 Risk Management
- **LTV Monitoring**: Real-time Loan-to-Value ratio tracking
- **Liquidation Protection**: Automatic position safety checks
- **Interest Accrual**: Continuous 5% APR calculation
- **Oracle Integration**: Fallback pricing with Orakl Network support

## � Complete User Workflows

### 1. 💧 Get USDY from Faucet (RWA Acquisition)

```javascript
// Check faucet availability
const canClaim = await usdyContract.canClaimFromFaucet(userAddress);
const timeUntilNext = await usdyContract.timeUntilNextClaim(userAddress);

if (canClaim) {
  // Claim 1,000 USDY tokens
  const tx = await usdyContract.claimFromFaucet();
  await tx.wait();
  
  console.log("Claimed 1,000 USDY tokens!");
}

// Check balance
const usdyBalance = await usdyContract.balanceOf(userAddress);
```

**Faucet Rules**:
- **Amount**: 1,000 USDY per claim
- **Cooldown**: 24 hours between claims  
- **Purpose**: Simulate acquiring real-world asset tokens

### 2. 🏦 Deposit USDY as Collateral

```javascript
// Check current balances
const usdyBalance = await usdyContract.balanceOf(userAddress);
const collateralAmount = ethers.parseEther("500"); // 500 USDY

// Approve USDY for lending protocol
const approveTx = await usdyContract.approve(
  CONTRACT_ADDRESSES.LendingProtocol, 
  collateralAmount
);
await approveTx.wait();

// Deposit collateral
const depositTx = await lendingContract.depositCollateral(collateralAmount);
await depositTx.wait();

// Check collateral balance in protocol
const collateralBalance = await lendingContract.collateralBalance(userAddress);
console.log(`Deposited: ${ethers.formatEther(collateralBalance)} USDY`);
```

### 3. 💰 Borrow USDT Against USDY Collateral

```javascript
// Check borrowing capacity
const collateralBalance = await lendingContract.collateralBalance(userAddress);
const maxBorrowUSD = (collateralBalance * 80n) / 100n; // 80% LTV
const borrowAmount = ethers.parseEther("300"); // Borrow 300 USDT

// Ensure sufficient protocol liquidity
const protocolLiquidity = await usdtContract.balanceOf(CONTRACT_ADDRESSES.LendingProtocol);
console.log(`Available liquidity: ${ethers.formatEther(protocolLiquidity)} USDT`);

// Borrow USDT
const borrowTx = await lendingContract.borrow(
  CONTRACT_ADDRESSES.DummyUSDT, 
  borrowAmount
);
await borrowTx.wait();

// Check debt and LTV
const debt = await lendingContract.debtBalance(userAddress, CONTRACT_ADDRESSES.DummyUSDT);
const ltv = await lendingContract.getLTV(userAddress);

console.log(`Borrowed: ${ethers.formatEther(debt)} USDT`);
console.log(`Current LTV: ${ethers.formatEther(ltv)}%`);
```

### 4. 🔄 Repay Borrowed USDT

```javascript
const repayAmount = ethers.parseEther("150"); // Repay 150 USDT

// Approve USDT for repayment
const approveTx = await usdtContract.approve(
  CONTRACT_ADDRESSES.LendingProtocol,
  repayAmount
);
await approveTx.wait();

// Repay debt
const repayTx = await lendingContract.repay(
  CONTRACT_ADDRESSES.DummyUSDT,
  repayAmount  
);
await repayTx.wait();

// Check remaining debt
const remainingDebt = await lendingContract.debtBalance(userAddress, CONTRACT_ADDRESSES.DummyUSDT);
const newLTV = await lendingContract.getLTV(userAddress);

console.log(`Remaining debt: ${ethers.formatEther(remainingDebt)} USDT`);
console.log(`New LTV: ${ethers.formatEther(newLTV)}%`);
```

### 5. 💎 Withdraw USDY Collateral

```javascript
// Calculate safe withdrawal amount
const currentCollateral = await lendingContract.collateralBalance(userAddress);
const currentDebt = await lendingContract.debtBalance(userAddress, CONTRACT_ADDRESSES.DummyUSDT);

// Keep 75% LTV for safety (below 80% limit)
const requiredCollateral = (currentDebt * 100n) / 75n;
const maxWithdrawable = currentCollateral > requiredCollateral ? 
  currentCollateral - requiredCollateral : 0n;

if (maxWithdrawable > 0n) {
  const withdrawAmount = maxWithdrawable / 2n; // Withdraw half for extra safety
  
  const withdrawTx = await lendingContract.withdrawCollateral(withdrawAmount);
  await withdrawTx.wait();
  
  console.log(`Withdrew: ${ethers.formatEther(withdrawAmount)} USDY`);
}
```

### 6. 📈 Provide USDT Liquidity (Earn LP Tokens)

```javascript
const liquidityAmount = ethers.parseEther("1000"); // Provide 1000 USDT

// Approve USDT for deposit
const approveTx = await usdtContract.approve(
  CONTRACT_ADDRESSES.LendingProtocol,
  liquidityAmount
);
await approveTx.wait();

// Deposit USDT to earn LP tokens
const depositTx = await lendingContract.deposit(
  CONTRACT_ADDRESSES.DummyUSDT,
  liquidityAmount
);
await depositTx.wait();

// Check LP tokens received
const lpBalance = await kUsdtContract.balanceOf(userAddress);
const lpPrice = await lendingContract.getLpPrice(CONTRACT_ADDRESSES.kUSDT);

console.log(`LP tokens received: ${ethers.formatEther(lpBalance)}`);
console.log(`Current LP price: ${ethers.formatEther(lpPrice)} USDT per kUSDT`);
```

### 7. 🎯 Redeem LP Tokens

```javascript
const redeemAmount = ethers.parseEther("500"); // Redeem 500 LP tokens

// Redeem LP tokens for underlying USDT
const redeemTx = await lendingContract.redeem(
  CONTRACT_ADDRESSES.kUSDT,
  redeemAmount
);
await redeemTx.wait();

// Check received USDT
const usdtReceived = await usdtContract.balanceOf(userAddress);
console.log(`USDT received: ${ethers.formatEther(usdtReceived)}`);
```

## 📊 Essential View Functions for UI

### User Portfolio Data

```javascript
// Token Balances
const getUserBalances = async (userAddress) => {
  const usdyBalance = await usdyContract.balanceOf(userAddress);
  const usdtBalance = await usdtContract.balanceOf(userAddress);
  const lpBalance = await kUsdtContract.balanceOf(userAddress);
  
  return {
    usdy: ethers.formatEther(usdyBalance),
    usdt: ethers.formatEther(usdtBalance), 
    kUSDT: ethers.formatEther(lpBalance)
  };
};

// Protocol Positions
const getUserPositions = async (userAddress) => {
  const collateral = await lendingContract.collateralBalance(userAddress);
  const usdtDebt = await lendingContract.debtBalance(userAddress, CONTRACT_ADDRESSES.DummyUSDT);
  const kaiaDebt = await lendingContract.debtBalance(userAddress, CONTRACT_ADDRESSES.KAIA);
  const ltv = await lendingContract.getLTV(userAddress);
  const isLiquidatable = await lendingContract.isLiquidatable(userAddress);
  
  return {
    collateral: ethers.formatEther(collateral),
    usdtDebt: ethers.formatEther(usdtDebt),
    kaiaDebt: ethers.formatEther(kaiaDebt),
    ltv: ethers.formatEther(ltv),
    isAtRisk: isLiquidatable
  };
};
```

### Market Data

```javascript
// Asset Prices
const getMarketData = async () => {
  const kaiaPrice = await lendingContract.getKaiaPrice();
  const usdtPrice = await lendingContract.getUsdtPrice();
  const lpPrice = await lendingContract.getLpPrice(CONTRACT_ADDRESSES.kUSDT);
  
  return {
    kaia: ethers.formatEther(kaiaPrice), // ~$0.15
    usdt: ethers.formatEther(usdtPrice), // $1.00
    kUsdtLP: ethers.formatEther(lpPrice) // Dynamic bonding curve price
  };
};

// Protocol Statistics
const getProtocolStats = async () => {
  const totalUsdtLiquidity = await usdtContract.balanceOf(CONTRACT_ADDRESSES.LendingProtocol);
  const totalLPSupply = await kUsdtContract.totalSupply();
  
  return {
    totalLiquidity: ethers.formatEther(totalUsdtLiquidity),
    totalLPTokens: ethers.formatEther(totalLPSupply)
  };
};
```

### Faucet Information

```javascript
// USDY Faucet Status
const getUsdyFaucetInfo = async (userAddress) => {
  const canClaim = await usdyContract.canClaimFromFaucet(userAddress);
  const timeUntilNext = await usdyContract.timeUntilNextClaim(userAddress);
  const faucetInfo = await usdyContract.getFaucetInfo();
  
  return {
    canClaim,
    timeUntilNext: timeUntilNext.toString(),
    amountPerClaim: ethers.formatEther(faucetInfo.amount),
    cooldownHours: faucetInfo.cooldown / 3600
  };
};

// USDT Faucet Status  
const getUsdtFaucetInfo = async (userAddress) => {
  const canClaim = await usdtContract.canClaimFaucet(userAddress);
  
  return {
    canClaim,
    amountPerClaim: "1000", // 1000 USDT per claim
    cooldownHours: 24
  };
};
```

## 🔧 Contract Initialization for Frontend

```javascript
import { ethers } from 'ethers';

// Contract ABIs (you'll need to export these from your build artifacts)
import USDYAbi from './abis/USDY.json';
import DummyUSDTAbi from './abis/DummyUSDT.json'; 
import LendingProtocolAbi from './abis/LendingProtocol.json';
import LPTokenAbi from './abis/LPToken.json';

// Provider setup
const provider = new ethers.providers.JsonRpcProvider('https://public-en-kairos.node.kaia.io');
const signer = provider.getSigner();

// Contract instances
const usdyContract = new ethers.Contract(
  CONTRACT_ADDRESSES.USDY,
  USDYAbi,
  signer
);

const usdtContract = new ethers.Contract(
  CONTRACT_ADDRESSES.DummyUSDT,
  DummyUSDTAbi,
  signer
);

const lendingContract = new ethers.Contract(
  CONTRACT_ADDRESSES.LendingProtocol,
  LendingProtocolAbi,
  signer
);

const kUsdtContract = new ethers.Contract(
  CONTRACT_ADDRESSES.kUSDT,
  LPTokenAbi,
  signer
);

// Helper function for user transactions
const executeTransaction = async (txPromise, description) => {
  try {
    console.log(`Executing: ${description}...`);
    const tx = await txPromise;
    console.log(`Transaction hash: ${tx.hash}`);
    
    const receipt = await tx.wait();
    console.log(`${description} completed! Gas used: ${receipt.gasUsed}`);
    
    return receipt;
  } catch (error) {
    console.error(`${description} failed:`, error);
    throw error;
  }
};
```

## ⚠️ Important Safety Guidelines

### 🚨 LTV Management
- **Keep LTV below 75%** for safety margin
- **Maximum LTV is 80%** - exceeding this triggers liquidation risk
- **Monitor positions regularly** - interest accrues continuously
- **Add collateral or repay debt** if LTV approaches limit

### 💧 Faucet Usage
- **USDY Faucet**: 1,000 USDY per 24 hours
- **USDT Faucet**: 1,000 USDT per 24 hours  
- **One claim per address** per cooldown period
- **Limited total supply** - claim early for testing

### 🔄 Transaction Best Practices
- **Always approve tokens** before deposits/repayments
- **Check allowances** before attempting transfers
- **Wait for confirmations** before proceeding to next step
- **Monitor gas fees** on Kaia testnet
- **Handle transaction failures** gracefully in UI

### 📊 UI Recommendations
- **Real-time LTV display** with color coding (green < 70%, yellow 70-75%, red > 75%)
- **Collateral calculator** showing borrowing capacity
- **Interest accrual timer** displaying debt growth
- **Faucet cooldown countdown** for better UX
- **LP token price chart** showing bonding curve progression

## 🎯 Example React Component Structure

```jsx
// UserDashboard.jsx
import React, { useState, useEffect } from 'react';

const UserDashboard = ({ userAddress }) => {
  const [balances, setBalances] = useState({});
  const [positions, setPositions] = useState({});
  const [marketData, setMarketData] = useState({});

  useEffect(() => {
    const loadUserData = async () => {
      const userBalances = await getUserBalances(userAddress);
      const userPositions = await getUserPositions(userAddress);
      const market = await getMarketData();
      
      setBalances(userBalances);
      setPositions(userPositions);  
      setMarketData(market);
    };
    
    loadUserData();
    const interval = setInterval(loadUserData, 10000); // Update every 10s
    
    return () => clearInterval(interval);
  }, [userAddress]);

  return (
    <div>
      <CollateralPanel positions={positions} />
      <BorrowingPanel positions={positions} marketData={marketData} />
      <LiquidityPanel balances={balances} marketData={marketData} />
      <FaucetPanel userAddress={userAddress} />
    </div>
  );
};
```

## 🌟 Success Metrics

The RWA Lending Protocol demonstrates:

✅ **Real World Asset Integration** - USDY represents tokenized RWA collateral  
✅ **Complete DeFi Lending** - Full borrow/repay cycle with interest  
✅ **Risk Management** - LTV limits and liquidation protection  
✅ **Yield Generation** - LP tokens with bonding curve appreciation  
✅ **Multi-Asset Support** - USDT, KAIA, and RWA tokens  
✅ **Production Ready** - Deployed and tested on Kaia testnet  
✅ **User-Friendly Faucets** - Easy onboarding for testing  
✅ **Frontend Ready** - Complete integration guide provided

---

**🎉 The RWA Lending Protocol successfully bridges traditional finance with DeFi, enabling Real World Assets to participate in decentralized lending markets!**

**Ready for immediate frontend integration and user testing on Kaia testnet.**

#### `redeem(address lpToken, uint256 amount)`
**Purpose**: Redeem LP tokens for underlying assets

**Parameters**:
- `lpToken`: LP token address (kKAIA or kUSDT)
- `amount`: LP tokens to redeem

**User Flow**:
1. Call redeem: `lendingProtocol.redeem(lpTokenAddress, lpAmount)`
2. Receive underlying tokens based on current LP token price

### 2. Borrowing

#### `depositCollateral(uint256 amount)`
**Purpose**: Deposit USDT as collateral for borrowing

**Parameters**:
- `amount`: USDT amount to deposit as collateral

**User Flow**:
1. Approve USDT: `usdt.approve(lendingProtocol, amount)`
2. Deposit collateral: `lendingProtocol.depositCollateral(amount)`
3. Collateral is now available for borrowing

#### `borrow(address token, uint256 amount)`
**Purpose**: Borrow KAIA or USDT against deposited collateral

**Parameters**:
- `token`: Token to borrow (KAIA or USDT)
- `amount`: Amount to borrow

**Requirements**:
- Sufficient collateral deposited
- Borrow amount keeps LTV ≤ 80%
- Protocol has sufficient liquidity

**User Flow**:
1. Ensure sufficient collateral deposited
2. Call borrow: `lendingProtocol.borrow(tokenAddress, amount)`
3. Receive borrowed tokens
4. Interest begins accruing at 5% APR

#### `repay(address token, uint256 amount)`
**Purpose**: Repay borrowed amount plus accrued interest

**Parameters**:
- `token`: Token being repaid (KAIA or USDT)
- `amount`: Amount to repay (can be partial)

**User Flow**:
1. Approve token: `token.approve(lendingProtocol, repayAmount)`
2. Call repay: `lendingProtocol.repay(tokenAddress, amount)`
3. Debt is reduced by repaid amount

#### `withdrawCollateral(uint256 amount)`
**Purpose**: Withdraw collateral (must maintain safe LTV)

**Parameters**:
- `amount`: Collateral amount to withdraw

**Requirements**:
- Withdrawal maintains LTV ≤ 80%
- No outstanding debt if withdrawing all collateral

### 3. Liquidation

#### `liquidate(address borrower, uint256 repayAmount)`
**Purpose**: Liquidate underwater positions (LTV > 80%)

**Parameters**:
- `borrower`: Address of borrower to liquidate
- `repayAmount`: Amount of debt to repay

**Incentives**:
- 10% liquidation penalty paid to liquidator
- Helps maintain protocol solvency

## 📊 Price Mechanisms

### Orakl Network Integration
```solidity
// KAIA price with fallback
function getKaiaPrice() public pure returns (uint256) {
    // Uses Orakl "KLAY-USDT" feed when available
    // Fallback: $0.15 (for testing)
    // Production: Real-time oracle prices
}

// USDT price (stable)
function getUsdtPrice() public pure returns (uint256) {
    return 1e18; // $1.00
}
```

### Bonding Curve LP Pricing
```solidity
// LP token price increases with supply
function getLpPrice(address lpToken) public view returns (uint256) {
    uint256 supply = IERC20(lpToken).totalSupply();
    return SLOPE_A * supply / PRECISION + BASE_PRICE_B;
    // Price = 0.000001 * supply + 1.0
}
```

## 🎮 Complete User Flows

### Lending Flow (Earn Interest)

1. **Get Test Tokens** (Testnet only):
   ```solidity
   dummyUSDT.faucet(); // Get 1000 USDT (24h cooldown)
   ```

2. **Become a Lender**:
   ```solidity
   // Approve spending
   usdt.approve(lendingProtocol, depositAmount);
   
   // Deposit to earn interest
   lendingProtocol.deposit(usdtAddress, depositAmount);
   
   // Check LP token balance
   uint256 lpBalance = kUSDT.balanceOf(userAddress);
   ```

3. **Monitor Earnings**:
   ```solidity
   // Check current LP token price
   uint256 currentPrice = lendingProtocol.getLpPrice(kUSDTAddress);
   
   // Calculate current value
   uint256 currentValue = lpBalance * currentPrice / 1e18;
   ```

4. **Withdraw Earnings**:
   ```solidity
   // Redeem LP tokens for underlying + interest
   lendingProtocol.redeem(kUSDTAddress, lpAmount);
   ```

### Borrowing Flow

1. **Deposit Collateral**:
   ```solidity
   // Approve collateral spending
   usdt.approve(lendingProtocol, collateralAmount);
   
   // Deposit collateral
   lendingProtocol.depositCollateral(collateralAmount);
   
   // Check collateral balance
   uint256 collateral = lendingProtocol.collateralBalance(userAddress);
   ```

2. **Borrow Against Collateral**:
   ```solidity
   // Calculate safe borrow amount (max 80% LTV)
   uint256 maxBorrow = collateral * 80 / 100; // In USD terms
   
   // Borrow USDT or KAIA
   lendingProtocol.borrow(tokenAddress, borrowAmount);
   
   // Check debt
   uint256 debt = lendingProtocol.debtBalance(userAddress, tokenAddress);
   ```

3. **Monitor Position**:
   ```solidity
   // Check current LTV
   uint256 ltv = lendingProtocol.getLTV(userAddress);
   
   // Check if liquidatable (LTV > 80%)
   bool canLiquidate = lendingProtocol.isLiquidatable(userAddress);
   ```

4. **Repay Loan**:
   ```solidity
   // Approve repayment
   token.approve(lendingProtocol, repayAmount);
   
   // Repay debt
   lendingProtocol.repay(tokenAddress, repayAmount);
   ```

5. **Withdraw Collateral**:
   ```solidity
   // Withdraw remaining collateral
   lendingProtocol.withdrawCollateral(withdrawAmount);
   ```

## 🚨 Risk Management

### For Lenders
- **Liquidity Risk**: Ensure protocol has sufficient borrowing demand
- **Smart Contract Risk**: Protocol has been tested but use at your own risk
- **Price Risk**: LP token value fluctuates with supply/demand

### For Borrowers  
- **Liquidation Risk**: Maintain LTV below 80% to avoid liquidation
- **Interest Risk**: 5% APR compounds over time
- **Price Risk**: KAIA price volatility affects borrowing capacity

## 🔧 Integration Guide for Developers

### Frontend Integration

1. **Connect to Contracts**:
   ```javascript
   const lendingProtocol = new ethers.Contract(
     LENDING_PROTOCOL_ADDRESS,
     LENDING_PROTOCOL_ABI,
     signer
   );
   ```

2. **Check User Balances**:
   ```javascript
   // Token balances
   const usdtBalance = await usdt.balanceOf(userAddress);
   const lpBalance = await kUSDT.balanceOf(userAddress);
   
   // Collateral and debt
   const collateral = await lendingProtocol.collateralBalance(userAddress);
   const debt = await lendingProtocol.debtBalance(userAddress, tokenAddress);
   ```

3. **Transaction Flow**:
   ```javascript
   // Approve + Deposit
   await usdt.approve(lendingProtocolAddress, amount);
   await lendingProtocol.deposit(usdtAddress, amount);
   
   // Listen for events
   lendingProtocol.on("Deposit", (user, token, amount, lpTokens) => {
     console.log(`${user} deposited ${amount} and received ${lpTokens} LP tokens`);
   });
   ```

### Web3 Events to Monitor

```solidity
event Deposit(address indexed user, address indexed token, uint256 amount, uint256 lpTokens);
event Redeem(address indexed user, address indexed lpToken, uint256 amount, uint256 underlying);
event Borrow(address indexed user, address indexed token, uint256 amount);
event Repay(address indexed user, address indexed token, uint256 amount);
event CollateralDeposited(address indexed user, uint256 amount);
event CollateralWithdrawn(address indexed user, uint256 amount);
event Liquidate(address indexed liquidator, address indexed borrower, uint256 repayAmount, uint256 collateralSeized);
```

## 🧪 Testing & Verification

The contracts are deployed and verified on Kaia testnet. You can:

1. **View on Kaiascan**: Search contract addresses above
2. **Test with Faucet**: Get test USDT from DummyUSDT faucet
3. **Monitor Transactions**: All transactions are publicly verifiable
4. **Run Tests**: Use provided test scripts for validation

## 📞 Support

- **GitHub**: [Project Repository]
- **Discord**: [Community Channel]  
- **Docs**: [Technical Documentation]

---

**⚠️ Disclaimer**: This protocol is in testing phase. Use testnet funds only. Audit pending for mainnet deployment.