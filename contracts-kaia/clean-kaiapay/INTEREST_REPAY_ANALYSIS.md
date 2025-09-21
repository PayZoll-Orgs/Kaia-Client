// 📋 ANALYSIS: Interest Repay Function Integration Plan

## 🎯 Current Problem Analysis

### Current Repay System:
```solidity
function repay(address token, uint256 amount) external {
    _updateInterest(msg.sender);           // Adds interest to debt balance
    uint256 currentDebt = debtBalance[msg.sender][token]; // Total = Principal + Interest
    // User pays against total debt (principal + interest combined)
}
```

### Issues with Current System:
1. ❌ No way to pay interest-only
2. ❌ No separation between principal and interest tracking
3. ❌ User must always pay against total debt
4. ❌ No flexibility for interest-only payments

## 🏗️ Proposed Solution: Add Interest Tracking & Repay Function

### 1. ADD NEW STATE VARIABLES (after line 22):
```solidity
mapping(address => mapping(address => uint256)) public accruedInterest; // borrower => token => interest
mapping(address => mapping(address => uint256)) public principalBalance; // borrower => token => principal
```

### 2. MODIFY EXISTING FUNCTIONS:

#### A. Update `borrow()` function (around line 156):
```solidity
function borrow(address token, uint256 amount) external nonReentrant {
    // ... existing validation ...
    
    // Effects - Track principal separately
    principalBalance[msg.sender][token] += amount;  // NEW: Track principal
    debtBalance[msg.sender][token] += amount;       // Keep existing total tracking
    
    // ... rest of function ...
}
```

#### B. Update `_updateInterest()` function (around line 206):
```solidity
function _updateInterest(address borrower) internal {
    uint256 lastUpdate = lastInterestUpdate[borrower];
    if (lastUpdate == 0) {
        lastInterestUpdate[borrower] = block.timestamp;
        return;
    }
    
    uint256 timeElapsed = block.timestamp - lastUpdate;
    if (timeElapsed == 0) return;
    
    // Calculate and track interest separately for KAIA
    uint256 kaiaPrincipal = principalBalance[borrower][KAIA];
    if (kaiaPrincipal > 0) {
        uint256 interest = kaiaPrincipal * ANNUAL_INTEREST_RATE * timeElapsed / 100 / SECONDS_PER_YEAR;
        accruedInterest[borrower][KAIA] += interest;     // NEW: Track interest separately
        debtBalance[borrower][KAIA] += interest;         // Keep existing total tracking
    }
    
    // Calculate and track interest separately for USDT  
    uint256 usdtPrincipal = principalBalance[borrower][USDT];
    if (usdtPrincipal > 0) {
        uint256 interest = usdtPrincipal * ANNUAL_INTEREST_RATE * timeElapsed / 100 / SECONDS_PER_YEAR;
        accruedInterest[borrower][USDT] += interest;     // NEW: Track interest separately
        debtBalance[borrower][USDT] += interest;         // Keep existing total tracking
    }
    
    lastInterestUpdate[borrower] = block.timestamp;
}
```

### 3. ADD NEW INTEREST REPAY FUNCTION (after line 203):
```solidity
/**
 * @notice Repay only the accrued interest (not principal)
 * @param token The token to repay interest for (KAIA or USDT)
 * @param amount Amount of interest to repay (0 = pay all accrued interest)
 */
function repayInterest(address token, uint256 amount) external nonReentrant {
    require(token == KAIA || token == USDT, "Invalid token");
    
    // Update interest first to get latest accrued amount
    _updateInterest(msg.sender);
    
    uint256 totalAccruedInterest = accruedInterest[msg.sender][token];
    require(totalAccruedInterest > 0, "No accrued interest to repay");
    
    // Determine repay amount (0 = pay all interest)
    uint256 repayAmount = amount == 0 ? totalAccruedInterest : 
                         (amount > totalAccruedInterest ? totalAccruedInterest : amount);
    
    require(repayAmount > 0, "Repay amount must be > 0");
    
    // Effects - Reduce interest balances
    accruedInterest[msg.sender][token] -= repayAmount;
    debtBalance[msg.sender][token] -= repayAmount;
    
    // Interactions
    IERC20(token).transferFrom(msg.sender, address(this), repayAmount);
    
    emit InterestRepaid(msg.sender, token, repayAmount);
}

/**
 * @notice Repay principal amount (interest must be current)
 * @param token The token to repay principal for
 * @param amount Principal amount to repay
 */
function repayPrincipal(address token, uint256 amount) external nonReentrant {
    require(token == KAIA || token == USDT, "Invalid token");
    require(amount > 0, "Amount must be > 0");
    
    // Update interest first
    _updateInterest(msg.sender);
    
    uint256 currentPrincipal = principalBalance[msg.sender][token];
    require(currentPrincipal > 0, "No principal to repay");
    
    uint256 repayAmount = amount > currentPrincipal ? currentPrincipal : amount;
    
    // Effects - Reduce principal balances
    principalBalance[msg.sender][token] -= repayAmount;
    debtBalance[msg.sender][token] -= repayAmount;
    
    // Interactions
    IERC20(token).transferFrom(msg.sender, address(this), repayAmount);
    
    emit PrincipalRepaid(msg.sender, token, repayAmount);
}
```

### 4. ADD NEW EVENTS (after line 50):
```solidity
event InterestRepaid(address indexed user, address indexed token, uint256 amount);
event PrincipalRepaid(address indexed user, address indexed token, uint256 amount);
```

### 5. ADD NEW VIEW FUNCTIONS (after line 258):
```solidity
/**
 * @notice Get breakdown of user's debt (principal vs interest)
 */
function getDebtBreakdown(address borrower, address token) external view returns (
    uint256 principal,
    uint256 accrued, 
    uint256 total,
    uint256 currentInterestRate
) {
    principal = principalBalance[borrower][token];
    accrued = accruedInterest[borrower][token];
    
    // Calculate pending interest since last update
    uint256 lastUpdate = lastInterestUpdate[borrower];
    if (lastUpdate > 0 && principal > 0) {
        uint256 timeElapsed = block.timestamp - lastUpdate;
        uint256 pendingInterest = principal * ANNUAL_INTEREST_RATE * timeElapsed / 100 / SECONDS_PER_YEAR;
        accrued += pendingInterest;
    }
    
    total = principal + accrued;
    currentInterestRate = ANNUAL_INTEREST_RATE; // 5%
}

/**
 * @notice Get total accrued interest for a borrower across all tokens
 */
function getTotalAccruedInterest(address borrower) external view returns (uint256 totalInterestUSD) {
    // Get current interest for both tokens
    (, uint256 kaiaInterest,,) = this.getDebtBreakdown(borrower, KAIA);
    (, uint256 usdtInterest,,) = this.getDebtBreakdown(borrower, USDT);
    
    // Convert to USD
    uint256 kaiaInterestUSD = _getTokenValueUSD(KAIA, kaiaInterest);
    uint256 usdtInterestUSD = _getTokenValueUSD(USDT, usdtInterest);
    
    return kaiaInterestUSD + usdtInterestUSD;
}
```

## 🎯 Integration Points Summary:

### Location 1: **State Variables** (after line 22)
- Add `accruedInterest` and `principalBalance` mappings

### Location 2: **Events** (after line 50)  
- Add `InterestRepaid` and `PrincipalRepaid` events

### Location 3: **Borrow Function** (modify around line 156)
- Track principal separately when borrowing

### Location 4: **Interest Calculation** (modify around line 206)
- Separate interest tracking in `_updateInterest()`

### Location 5: **New Functions** (after line 203)
- Add `repayInterest()` and `repayPrincipal()` functions

### Location 6: **View Functions** (after line 258)
- Add debt breakdown and interest query functions

## 🚀 Benefits of This Approach:

✅ **Flexibility**: Users can pay interest-only or principal-only
✅ **Transparency**: Clear separation of principal vs interest
✅ **Backward Compatibility**: Existing `repay()` function still works
✅ **Better UX**: Users can manage payments strategically
✅ **DeFi Standard**: Follows lending protocol best practices