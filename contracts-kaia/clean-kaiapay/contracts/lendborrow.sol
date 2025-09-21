// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./IFeedRouter.sol";

interface ILPToken is IERC20 {
    function mint(address to, uint256 amount) external;
    function burn(address from, uint256 amount) external;
}

interface IDummyUSDT is IERC20 {
    function decimals() external view returns (uint8);
}

contract LendingProtocol is ReentrancyGuard, Ownable {
    // State variables
    mapping(address => uint256) public collateralBalance;
    mapping(address => mapping(address => uint256)) public debtBalance; // borrower => token => amount (total = principal + interest)
    mapping(address => mapping(address => uint256)) public principalBalance; // borrower => token => principal only
    mapping(address => mapping(address => uint256)) public accruedInterest; // borrower => token => accrued interest
    mapping(address => uint256) public lastInterestUpdate; // borrower => timestamp
    
    // Token addresses
    address public immutable KAIA;
    address public immutable USDT;
    address public immutable USDY;
    address public immutable kKAIA;
    address public immutable kUSDT;
    
    // Oracle and price feed
    IFeedRouter public immutable feedRouter;
    string public constant KAIA_FEED_NAME = "KLAY-USDT"; // Assuming KAIA/USDT feed exists
    
    // Constants
    uint256 private constant PRECISION = 1e18;
    uint256 private constant MAX_LTV = 80; // 80%
    uint256 private constant LIQUIDATION_PENALTY = 10; // 10%
    uint256 private constant ANNUAL_INTEREST_RATE = 5; // 5% APR
    uint256 private constant SECONDS_PER_YEAR = 365 days;
    uint256 private constant PRICE_STALENESS_THRESHOLD = 1 hours; // Maximum age for price data
    
    // Bonding curve parameters
    uint256 private constant SLOPE_A = 1e12; // 0.000001 in 1e18 precision
    uint256 private constant BASE_PRICE_B = 1e18; // 1.0 in 1e18 precision
    
    // Stable prices (in USD with 1e18 precision)
    uint256 private constant USDT_COLLATERAL_PRICE = 1e18; // $1 (stable)
    
    // Custom errors
    error StalePriceData();
    error InvalidPriceData();
    error OraclePriceFeedError();
    
    // Events
    event Deposit(address indexed user, address indexed token, uint256 amount, uint256 lpTokens);
    event Redeem(address indexed user, address indexed lpToken, uint256 amount, uint256 underlying);
    event Borrow(address indexed user, address indexed token, uint256 amount);
    event Repay(address indexed user, address indexed token, uint256 amount);
    event InterestRepaid(address indexed user, address indexed token, uint256 amount);
    event PrincipalRepaid(address indexed user, address indexed token, uint256 amount);
    event CollateralDeposited(address indexed user, uint256 amount);
    event CollateralWithdrawn(address indexed user, uint256 amount);
    event Liquidate(address indexed liquidator, address indexed borrower, uint256 repayAmount, uint256 collateralSeized);
    
    constructor(
        address _kaia,
        address _usdt,
        address _usdy,
        address _kkaia,
        address _kusdt,
        address _feedRouter,
        address _initialOwner
    ) Ownable(_initialOwner) {
        KAIA = _kaia;
        USDT = _usdt;
        USDY = _usdy;
        kKAIA = _kkaia;
        kUSDT = _kusdt;
        feedRouter = IFeedRouter(_feedRouter);
    }
    
    // Bonding curve functions
    function getLpPrice(address lpToken) public view returns (uint256) {
        uint256 supply = IERC20(lpToken).totalSupply();
        return SLOPE_A * supply / PRECISION + BASE_PRICE_B;
    }
    
    function _calculateLpTokensToMint(address lpToken, uint256 depositAmount) private view returns (uint256) {
        uint256 currentPrice = getLpPrice(lpToken);
        
        // For linear bonding curve: tokens = amount / price
        return depositAmount * PRECISION / currentPrice;
    }
    
    function _calculateUnderlyingToReturn(address lpToken, uint256 lpAmount) private view returns (uint256) {
        uint256 currentPrice = getLpPrice(lpToken);
        return lpAmount * currentPrice / PRECISION;
    }
    
    // Lending functions
    function deposit(address token, uint256 amount) external nonReentrant {
        require(token == KAIA || token == USDT, "Invalid token");
        require(amount > 0, "Amount must be > 0");
        
        address lpToken = token == KAIA ? kKAIA : kUSDT;
        uint256 lpTokensToMint = _calculateLpTokensToMint(lpToken, amount);
        
        // Interactions
        IERC20(token).transferFrom(msg.sender, address(this), amount);
        ILPToken(lpToken).mint(msg.sender, lpTokensToMint);
        
        emit Deposit(msg.sender, token, amount, lpTokensToMint);
    }
    
    function redeem(address lpToken, uint256 amount) external nonReentrant {
        require(lpToken == kKAIA || lpToken == kUSDT, "Invalid LP token");
        require(amount > 0, "Amount must be > 0");
        require(IERC20(lpToken).balanceOf(msg.sender) >= amount, "Insufficient LP tokens");
        
        address underlyingToken = lpToken == kKAIA ? KAIA : USDT;
        uint256 underlyingAmount = _calculateUnderlyingToReturn(lpToken, amount);
        require(IERC20(underlyingToken).balanceOf(address(this)) >= underlyingAmount, "Insufficient liquidity");
        
        // Interaction≠s
        ILPToken(lpToken).burn(msg.sender, amount);
        IERC20(underlyingToken).transfer(msg.sender, underlyingAmount);
        
        emit Redeem(msg.sender, lpToken, amount, underlyingAmount);
    }
    
    // Collateral functions
    function depositCollateral(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be > 0");
        
        // Effects
        collateralBalance[msg.sender] = collateralBalance[msg.sender] + amount;
        
        // Interactions
        IERC20(USDY).transferFrom(msg.sender, address(this), amount);
        
        emit CollateralDeposited(msg.sender, amount);
    }
    
    function withdrawCollateral(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be > 0");
        require(collateralBalance[msg.sender] >= amount, "Insufficient collateral");
        
        // Check if withdrawal would make position unsafe
        uint256 newCollateralBalance = collateralBalance[msg.sender] - amount;
        require(_isPositionSafe(msg.sender, newCollateralBalance), "Withdrawal would make position unsafe");
        
        // Effects
        collateralBalance[msg.sender] = newCollateralBalance;
        
        // Interactions
        IERC20(USDY).transfer(msg.sender, amount);
        
        emit CollateralWithdrawn(msg.sender, amount);
    }
    
    // Borrowing functions
    function borrow(address token, uint256 amount) external nonReentrant {
        require(token == KAIA || token == USDT, "Invalid token");
        require(amount > 0, "Amount must be > 0");
        require(IERC20(token).balanceOf(address(this)) >= amount, "Insufficient liquidity");
        
        // Update interest before borrowing
        _updateInterest(msg.sender);
        
        // Check if borrow would make position unsafe
        uint256 newDebtBalance = debtBalance[msg.sender][token] + amount;
        require(_isPositionSafeWithNewDebt(msg.sender, token, newDebtBalance), "Borrow would exceed LTV limit");
        
        // Effects
        debtBalance[msg.sender][token] = newDebtBalance;
        principalBalance[msg.sender][token] = principalBalance[msg.sender][token] + amount; // Track principal separately
        lastInterestUpdate[msg.sender] = block.timestamp;
        
        // Interactions
        IERC20(token).transfer(msg.sender, amount);
        
        emit Borrow(msg.sender, token, amount);
    }
    
    function repay(address token, uint256 amount) external nonReentrant {
        require(token == KAIA || token == USDT, "Invalid token");
        require(amount > 0, "Amount must be > 0");
        
        // Update interest first
        _updateInterest(msg.sender);
        
        uint256 currentDebt = debtBalance[msg.sender][token];
        require(currentDebt > 0, "No debt to repay");
        
        uint256 repayAmount = amount > currentDebt ? currentDebt : amount;
        
        // Effects
        debtBalance[msg.sender][token] = currentDebt - repayAmount;
        
        // Interactions
        IERC20(token).transferFrom(msg.sender, address(this), repayAmount);
        
        emit Repay(msg.sender, token, repayAmount);
    }

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
        accruedInterest[msg.sender][token] = accruedInterest[msg.sender][token] - repayAmount;
        debtBalance[msg.sender][token] = debtBalance[msg.sender][token] - repayAmount;
        
        // Interactions
        IERC20(token).transferFrom(msg.sender, address(this), repayAmount);
        
        emit InterestRepaid(msg.sender, token, repayAmount);
    }

    /**
     * @notice Repay principal amount (interest should be current for best practice)
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
        principalBalance[msg.sender][token] = principalBalance[msg.sender][token] - repayAmount;
        debtBalance[msg.sender][token] = debtBalance[msg.sender][token] - repayAmount;
        
        // Interactions
        IERC20(token).transferFrom(msg.sender, address(this), repayAmount);
        
        emit PrincipalRepaid(msg.sender, token, repayAmount);
    }
    
    // Interest calculation
    function _updateInterest(address borrower) internal {
        uint256 lastUpdate = lastInterestUpdate[borrower];
        if (lastUpdate == 0) {
            lastInterestUpdate[borrower] = block.timestamp;
            return;
        }
        
        uint256 timeElapsed = block.timestamp - lastUpdate;
        if (timeElapsed == 0) return;
        
        // Update KAIA debt - calculate interest on principal only
        uint256 kaiaPrincipal = principalBalance[borrower][KAIA];
        if (kaiaPrincipal > 0) {
            uint256 interest = kaiaPrincipal * ANNUAL_INTEREST_RATE * timeElapsed / 100 / SECONDS_PER_YEAR;
            accruedInterest[borrower][KAIA] = accruedInterest[borrower][KAIA] + interest; // Track interest separately
            debtBalance[borrower][KAIA] = debtBalance[borrower][KAIA] + interest; // Update total debt
        }
        
        // Update USDT debt - calculate interest on principal only
        uint256 usdtPrincipal = principalBalance[borrower][USDT];
        if (usdtPrincipal > 0) {
            uint256 interest = usdtPrincipal * ANNUAL_INTEREST_RATE * timeElapsed / 100 / SECONDS_PER_YEAR;
            accruedInterest[borrower][USDT] = accruedInterest[borrower][USDT] + interest; // Track interest separately
            debtBalance[borrower][USDT] = debtBalance[borrower][USDT] + interest; // Update total debt
        }
        
        lastInterestUpdate[borrower] = block.timestamp;
    }
    
    // Liquidation
    function liquidate(address borrower, uint256 repayAmount) external nonReentrant {
        require(isLiquidatable(borrower), "Position is not liquidatable");
        require(repayAmount > 0, "Repay amount must be > 0");
        
        // Update interest before liquidation
        _updateInterest(borrower);
        
        // Determine which token to repay (prioritize KAIA for simplicity)
        address repayToken = debtBalance[borrower][KAIA] > 0 ? KAIA : USDT;
        uint256 currentDebt = debtBalance[borrower][repayToken];
        require(currentDebt > 0, "No debt to repay");
        
        uint256 actualRepayAmount = repayAmount > currentDebt ? currentDebt : repayAmount;
        
        // Calculate collateral to seize (with 10% penalty)
        uint256 repayValueUSD = _getTokenValueUSD(repayToken, actualRepayAmount);
        uint256 collateralToSeize = repayValueUSD * (100 + LIQUIDATION_PENALTY) / 100 / USDT_COLLATERAL_PRICE;
        
        require(collateralBalance[borrower] >= collateralToSeize, "Insufficient collateral");
        
        // Effects - Reduce debt from interest first, then principal
        uint256 currentAccruedInterest = accruedInterest[borrower][repayToken];
        
        if (actualRepayAmount <= currentAccruedInterest) {
            // Repaying only interest
            accruedInterest[borrower][repayToken] = currentAccruedInterest - actualRepayAmount;
        } else {
            // Repaying interest + principal
            uint256 interestPortion = currentAccruedInterest;
            uint256 principalPortion = actualRepayAmount - interestPortion;
            
            accruedInterest[borrower][repayToken] = 0;
            principalBalance[borrower][repayToken] = principalBalance[borrower][repayToken] - principalPortion;
        }
        
        debtBalance[borrower][repayToken] = currentDebt - actualRepayAmount;
        collateralBalance[borrower] = collateralBalance[borrower] - collateralToSeize;
        
        // Interactions
        IERC20(repayToken).transferFrom(msg.sender, address(this), actualRepayAmount);
        IERC20(USDY).transfer(msg.sender, collateralToSeize);
        
        emit Liquidate(msg.sender, borrower, actualRepayAmount, collateralToSeize);
    }
    
    // View functions
    function getLTV(address borrower) public view returns (uint256) {
        uint256 collateralValueUSD = collateralBalance[borrower] * USDT_COLLATERAL_PRICE / PRECISION;
        if (collateralValueUSD == 0) return 0;
        
        uint256 totalDebtUSD = _getTotalDebtValueUSD(borrower);
        return totalDebtUSD * 100 * PRECISION / collateralValueUSD;
    }
    
    function isLiquidatable(address borrower) public view returns (bool) {
        return getLTV(borrower) > MAX_LTV * PRECISION;
    }

    /**
     * @notice Get breakdown of user's debt (principal vs interest)
     * @param borrower The borrower address
     * @param token The token address (KAIA or USDT)
     * @return principal Current principal balance
     * @return accrued Current accrued interest (including pending)
     * @return total Total debt (principal + accrued interest)
     * @return currentInterestRate Annual interest rate (5%)
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
            accrued = accrued + pendingInterest;
        }
        
        total = principal + accrued;
        currentInterestRate = ANNUAL_INTEREST_RATE; // 5%
    }

    /**
     * @notice Get total accrued interest for a borrower across all tokens
     * @param borrower The borrower address
     * @return totalInterestUSD Total accrued interest in USD value
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

    /**
     * @notice Get interest payment info for UI
     * @param borrower The borrower address
     * @param token The token address
     * @return canPayInterest Whether borrower has accrued interest to pay
     * @return minInterestPayment Minimum interest payment amount
     * @return totalInterestOwed Total interest currently owed
     */
    function getInterestPaymentInfo(address borrower, address token) external view returns (
        bool canPayInterest,
        uint256 minInterestPayment,
        uint256 totalInterestOwed
    ) {
        (, uint256 accrued,,) = this.getDebtBreakdown(borrower, token);
        
        canPayInterest = accrued > 0;
        minInterestPayment = accrued > 0 ? 1 : 0; // Minimum 1 wei if any interest exists
        totalInterestOwed = accrued;
    }
    
    // Internal helper functions
    function _isPositionSafe(address borrower, uint256 newCollateralBalance) internal view returns (bool) {
        uint256 collateralValueUSD = newCollateralBalance * USDT_COLLATERAL_PRICE / PRECISION;
        uint256 totalDebtUSD = _getTotalDebtValueUSD(borrower);
        
        if (collateralValueUSD == 0 && totalDebtUSD > 0) return false;
        if (totalDebtUSD == 0) return true;
        
        return totalDebtUSD * 100 * PRECISION / collateralValueUSD <= MAX_LTV * PRECISION;
    }
    
    function _isPositionSafeWithNewDebt(address borrower, address token, uint256 newDebtBalance) internal view returns (bool) {
        uint256 collateralValueUSD = collateralBalance[borrower] * USDT_COLLATERAL_PRICE / PRECISION;
        
        uint256 otherTokenDebt = token == KAIA ? debtBalance[borrower][USDT] : debtBalance[borrower][KAIA];
        address otherToken = token == KAIA ? USDT : KAIA;
        
        uint256 newTokenDebtUSD = _getTokenValueUSD(token, newDebtBalance);
        uint256 otherTokenDebtUSD = _getTokenValueUSD(otherToken, otherTokenDebt);
        uint256 totalDebtUSD = newTokenDebtUSD + otherTokenDebtUSD;
        
        if (collateralValueUSD == 0 && totalDebtUSD > 0) return false;
        if (totalDebtUSD == 0) return true;
        
        return totalDebtUSD * 100 * PRECISION / collateralValueUSD <= MAX_LTV * PRECISION;
    }
    
    function _getTotalDebtValueUSD(address borrower) internal view returns (uint256) {
        uint256 kaiaDebtUSD = _getTokenValueUSD(KAIA, debtBalance[borrower][KAIA]);
        uint256 usdtDebtUSD = _getTokenValueUSD(USDT, debtBalance[borrower][USDT]);
        return kaiaDebtUSD + usdtDebtUSD;
    }
    
    /**
     * @notice Get KAIA price from Orakl Network price feed with fallback
     * @return price KAIA price in USD (18 decimals)
     */
    function getKaiaPrice() public pure returns (uint256) {
        // For testing: use fallback price directly
        // In production, uncomment the oracle code below
        return _getFallbackKaiaPrice();
        
        /*
        try feedRouter.latestRoundData(KAIA_FEED_NAME) returns (
            uint64 id,
            int256 answer,
            uint256 updatedAt
        ) {
            // Check for stale data
            if (block.timestamp - updatedAt > PRICE_STALENESS_THRESHOLD) {
                return _getFallbackKaiaPrice();
            }
            
            // Check for invalid price
            if (answer <= 0) {
                return _getFallbackKaiaPrice();
            }
            
            // Get feed decimals and normalize to 18 decimals
            uint8 feedDecimals = feedRouter.decimals(KAIA_FEED_NAME);
            uint256 price = uint256(answer);
            
            if (feedDecimals < 18) {
                price = price * (10 ** (18 - feedDecimals));
            } else if (feedDecimals > 18) {
                price = price / (10 ** (feedDecimals - 18));
            }
            
            return price;
        } catch {
            // Fallback to hardcoded price for testing
            return _getFallbackKaiaPrice();
        }
        */
    }
    
    /**
     * @notice Fallback KAIA price for testing (owner can update)
     * @return Fallback KAIA price ($0.15 as of current market)
     */
    function _getFallbackKaiaPrice() internal pure returns (uint256) {
        return 15e16; // $0.15 in 18 decimals
    }
    
    /**
     * @notice Get USDT price (using DummyUSDT contract for decimals, assuming $1 peg)
     * @return price USDT price in USD (18 decimals) - always $1
     */
    function getUsdtPrice() public pure returns (uint256) {
        return PRECISION; // $1.00 in 18 decimals
    }

    function _getTokenValueUSD(address token, uint256 amount) internal view returns (uint256) {
        if (token == KAIA) {
            uint256 kaiaPrice = getKaiaPrice();
            return amount * kaiaPrice / PRECISION;
        } else if (token == USDT) {
            uint256 usdtPrice = getUsdtPrice();
            return amount * usdtPrice / PRECISION;
        }
        return 0;
    }
    
    // Additional view functions using OpenZeppelin
    function getTokenDecimals(address token) external view returns (uint8) {
        return IERC20Metadata(token).decimals();
    }
    
    function getTokenSymbol(address token) external view returns (string memory) {
        return IERC20Metadata(token).symbol();
    }
    
    function getTokenName(address token) external view returns (string memory) {
        return IERC20Metadata(token).name();
    }
    
    // Emergency functions (Owner only)
    function emergencyWithdraw(address token, uint256 amount) external onlyOwner {
        IERC20(token).transfer(owner(), amount);
    }
    
    function updateTokenPrice(address token, uint256 newPrice) external onlyOwner {
        // This would require making prices non-constant in a real implementation
        // For now, keeping hardcoded prices as per original design
    }
}