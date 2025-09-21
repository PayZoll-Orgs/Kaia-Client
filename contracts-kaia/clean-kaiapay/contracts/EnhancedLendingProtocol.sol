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

contract EnhancedLendingProtocol is ReentrancyGuard, Ownable {
    // === ORIGINAL STATE VARIABLES ===
    mapping(address => uint256) public collateralBalance;
    mapping(address => mapping(address => uint256)) public debtBalance; // borrower => token => amount (total = principal + interest)
    mapping(address => mapping(address => uint256)) public principalBalance; // borrower => token => principal only
    mapping(address => mapping(address => uint256)) public accruedInterest; // borrower => token => accrued interest
    mapping(address => uint256) public lastInterestUpdate; // borrower => timestamp
    
    // === NEW: REFERRAL SYSTEM ===
    struct ReferralData {
        address referrer;           // Who referred this user
        uint256 totalReferrals;     // Number of people referred
        uint256 totalRewards;       // Total USDT rewards earned
        uint256 claimableRewards;   // Available rewards to claim
        uint256 referralTimestamp;  // When they were referred
        bool isRegistered;          // Whether user has registered a referral code
    }

    mapping(address => ReferralData) public referralData;
    mapping(address => address[]) public userReferrals; // referrer => list of referred users
    mapping(bytes32 => address) public referralCodes;   // referralCode => referrer address

    // === NEW: LENDING REWARDS ===
    struct LenderData {
        uint256 totalDeposited;        // Total amount ever deposited
        uint256 accruedEarnings;       // Earnings from lending
        uint256 lastEarningsUpdate;    // Last timestamp earnings were calculated
        uint256 claimableEarnings;     // Available earnings to claim
    }

    mapping(address => mapping(address => LenderData)) public lenderData; // user => token => data

    // === NEW: TRANSACTION HISTORY ===
    struct TransactionRecord {
        address user;
        string transactionType;    // "DEPOSIT", "WITHDRAW", "BORROW", "REPAY", "LIQUIDATE", "CLAIM_REWARDS"
        address token;
        uint256 amount;
        uint256 timestamp;
        bytes32 txHash;           // For cross-referencing
    }

    TransactionRecord[] public transactionHistory;
    mapping(address => uint256[]) public userTransactionIndices; // user => transaction indices

    // Token addresses
    address public immutable KAIA;
    address public immutable USDT;
    address public immutable USDY;
    address public immutable kKAIA;
    address public immutable kUSDT;
    
    // Oracle and price feed
    IFeedRouter public immutable feedRouter;
    string public constant KAIA_FEED_NAME = "KLAY-USDT"; // Assuming KAIA/USDT feed exists
    
    // === CONSTANTS ===
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
    
    // === NEW: PROTOCOL CONSTANTS ===
    uint256 private constant LENDING_REWARD_RATE = 850; // 8.5% APR (basis points)
    uint256 private constant REFERRAL_REWARD = 5e18;    // 5 USDT per referral
    uint256 private constant REFERRAL_BONUS = 2e18;     // 2 USDT signup bonus
    uint256 private constant TRANSACTION_FEE_RATE = 10; // 0.1% of transaction volume

    // Custom errors
    error StalePriceData();
    error InvalidPriceData();
    error OraclePriceFeedError();
    
    // === ORIGINAL EVENTS ===
    event Deposit(address indexed user, address indexed token, uint256 amount, uint256 lpTokens);
    event Redeem(address indexed user, address indexed lpToken, uint256 amount, uint256 underlying);
    event Borrow(address indexed user, address indexed token, uint256 amount);
    event Repay(address indexed user, address indexed token, uint256 amount);
    event InterestRepaid(address indexed user, address indexed token, uint256 amount);
    event PrincipalRepaid(address indexed user, address indexed token, uint256 amount);
    event CollateralDeposited(address indexed user, uint256 amount);
    event CollateralWithdrawn(address indexed user, uint256 amount);
    event Liquidate(address indexed liquidator, address indexed borrower, uint256 repayAmount, uint256 collateralSeized);

    // === NEW: ENHANCED EVENTS ===
    // Referral events
    event ReferralCodeRegistered(address indexed user, bytes32 indexed codeHash, uint256 timestamp);
    event ReferralJoined(address indexed referee, address indexed referrer, uint256 referrerReward, uint256 refereeBonus, uint256 timestamp);
    event ReferralRewardsClaimed(address indexed user, uint256 amount, uint256 timestamp);
    event TransactionVolumeReward(address indexed referrer, address indexed user, uint256 reward, uint256 timestamp);

    // Lending earnings events
    event LendingEarningsUpdated(address indexed lender, address indexed token, uint256 newEarnings, uint256 timestamp);
    event LendingEarningsClaimed(address indexed lender, address indexed token, uint256 amount, uint256 timestamp);

    // Transaction history events
    event TransactionRecorded(
        address indexed user,
        string indexed transactionType,
        address indexed token,
        uint256 amount,
        bytes32 txHash,
        uint256 timestamp
    );

    // Enhanced existing events
    event DepositEnhanced(
        address indexed user, 
        address indexed token, 
        uint256 amount, 
        uint256 lpTokens,
        uint256 totalDeposited,
        uint256 timestamp
    );
    
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

    // === REFERRAL SYSTEM FUNCTIONS ===

    /**
     * @notice Register a referral code for the caller
     * @param code Unique referral code (will be hashed)
     */
    function registerReferralCode(string calldata code) external {
        bytes32 codeHash = keccak256(abi.encodePacked(code, msg.sender));
        require(referralCodes[codeHash] == address(0), "Code already exists");
        
        referralCodes[codeHash] = msg.sender;
        referralData[msg.sender].isRegistered = true;
        
        emit ReferralCodeRegistered(msg.sender, codeHash, block.timestamp);
    }

    /**
     * @notice Join using a referral code
     * @param code Referral code from referrer
     * @param referrer Address of the referrer
     */
    function joinWithReferral(string calldata code, address referrer) external {
        require(referralData[msg.sender].referrer == address(0), "Already referred");
        
        bytes32 codeHash = keccak256(abi.encodePacked(code, referrer));
        require(referralCodes[codeHash] == referrer, "Invalid referral code");
        
        // Set referral relationship
        referralData[msg.sender].referrer = referrer;
        referralData[msg.sender].referralTimestamp = block.timestamp;
        
        // Update referrer data
        referralData[referrer].totalReferrals++;
        referralData[referrer].totalRewards += REFERRAL_REWARD;
        referralData[referrer].claimableRewards += REFERRAL_REWARD;
        
        // Give signup bonus to new user
        referralData[msg.sender].claimableRewards += REFERRAL_BONUS;
        
        // Track referral
        userReferrals[referrer].push(msg.sender);
        
        emit ReferralJoined(msg.sender, referrer, REFERRAL_REWARD, REFERRAL_BONUS, block.timestamp);
    }

    /**
     * @notice Claim accumulated referral rewards
     */
    function claimReferralRewards() external nonReentrant {
        uint256 claimable = referralData[msg.sender].claimableRewards;
        require(claimable > 0, "No rewards to claim");
        require(IERC20(USDT).balanceOf(address(this)) >= claimable, "Insufficient contract balance");
        
        referralData[msg.sender].claimableRewards = 0;
        
        IERC20(USDT).transfer(msg.sender, claimable);
        
        _recordTransaction(msg.sender, "CLAIM_REFERRAL_REWARDS", USDT, claimable);
        emit ReferralRewardsClaimed(msg.sender, claimable, block.timestamp);
    }

    // === ENHANCED LENDING FUNCTIONS ===

    /**
     * @notice Enhanced deposit with earnings tracking
     */
    function deposit(address token, uint256 amount) external nonReentrant {
        require(token == KAIA || token == USDT, "Invalid token");
        require(amount > 0, "Amount must be > 0");
        
        // Update earnings before new deposit
        _updateLendingEarnings(msg.sender, token);
        
        address lpToken = token == KAIA ? kKAIA : kUSDT;
        uint256 lpTokensToMint = _calculateLpTokensToMint(lpToken, amount);
        
        // Update lender data
        lenderData[msg.sender][token].totalDeposited += amount;
        lenderData[msg.sender][token].lastEarningsUpdate = block.timestamp;
        
        // Process referral rewards for transaction volume
        _processTransactionVolumeReward(msg.sender, amount);
        
        // Interactions
        IERC20(token).transferFrom(msg.sender, address(this), amount);
        ILPToken(lpToken).mint(msg.sender, lpTokensToMint);
        
        _recordTransaction(msg.sender, "DEPOSIT", token, amount);
        emit Deposit(msg.sender, token, amount, lpTokensToMint);
        emit DepositEnhanced(msg.sender, token, amount, lpTokensToMint, lenderData[msg.sender][token].totalDeposited, block.timestamp);
    }

    /**
     * @notice Claim accumulated lending earnings
     * @param token Token to claim earnings for
     */
    function claimLendingEarnings(address token) external nonReentrant {
        require(token == KAIA || token == USDT, "Invalid token");
        
        _updateLendingEarnings(msg.sender, token);
        
        uint256 claimable = lenderData[msg.sender][token].claimableEarnings;
        require(claimable > 0, "No earnings to claim");
        require(IERC20(token).balanceOf(address(this)) >= claimable, "Insufficient liquidity");
        
        lenderData[msg.sender][token].claimableEarnings = 0;
        
        IERC20(token).transfer(msg.sender, claimable);
        
        _recordTransaction(msg.sender, "CLAIM_LENDING_EARNINGS", token, claimable);
        emit LendingEarningsClaimed(msg.sender, token, claimable, block.timestamp);
    }

    // === ORIGINAL LENDING FUNCTIONS (Enhanced) ===
    
    function redeem(address lpToken, uint256 amount) external nonReentrant {
        require(lpToken == kKAIA || lpToken == kUSDT, "Invalid LP token");
        require(amount > 0, "Amount must be > 0");
        require(IERC20(lpToken).balanceOf(msg.sender) >= amount, "Insufficient LP tokens");
        
        address underlyingToken = lpToken == kKAIA ? KAIA : USDT;
        uint256 underlyingAmount = _calculateUnderlyingToReturn(lpToken, amount);
        require(IERC20(underlyingToken).balanceOf(address(this)) >= underlyingAmount, "Insufficient liquidity");
        
        // Update earnings before withdrawal
        _updateLendingEarnings(msg.sender, underlyingToken);
        
        // Update lender data
        if (lenderData[msg.sender][underlyingToken].totalDeposited >= underlyingAmount) {
            lenderData[msg.sender][underlyingToken].totalDeposited -= underlyingAmount;
        }
        
        // Interactions
        ILPToken(lpToken).burn(msg.sender, amount);
        IERC20(underlyingToken).transfer(msg.sender, underlyingAmount);
        
        _recordTransaction(msg.sender, "WITHDRAW", underlyingToken, underlyingAmount);
        emit Redeem(msg.sender, lpToken, amount, underlyingAmount);
    }

    // === COLLATERAL FUNCTIONS ===
    
    function depositCollateral(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be > 0");
        
        // Effects
        collateralBalance[msg.sender] = collateralBalance[msg.sender] + amount;
        
        // Interactions
        IERC20(USDY).transferFrom(msg.sender, address(this), amount);
        
        _recordTransaction(msg.sender, "DEPOSIT_COLLATERAL", USDY, amount);
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
        
        _recordTransaction(msg.sender, "WITHDRAW_COLLATERAL", USDY, amount);
        emit CollateralWithdrawn(msg.sender, amount);
    }

    // === BORROWING FUNCTIONS ===
    
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
        
        // Process referral rewards for transaction volume
        _processTransactionVolumeReward(msg.sender, amount);
        
        // Interactions
        IERC20(token).transfer(msg.sender, amount);
        
        _recordTransaction(msg.sender, "BORROW", token, amount);
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
        
        _recordTransaction(msg.sender, "REPAY", token, repayAmount);
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
        
        _recordTransaction(msg.sender, "REPAY_INTEREST", token, repayAmount);
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
        
        _recordTransaction(msg.sender, "REPAY_PRINCIPAL", token, repayAmount);
        emit PrincipalRepaid(msg.sender, token, repayAmount);
    }

    // === LIQUIDATION ===
    
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
        
        _recordTransaction(borrower, "LIQUIDATED", repayToken, actualRepayAmount);
        emit Liquidate(msg.sender, borrower, actualRepayAmount, collateralToSeize);
    }

    // === VIEW FUNCTIONS ===

    /**
     * @notice Get complete lender information for UI
     */
    function getLenderInfo(address lender, address token) external view returns (
        uint256 totalDeposited,
        uint256 currentEarnings,
        uint256 claimableEarnings,
        uint256 projectedAPY,
        uint256 lpTokenBalance
    ) {
        LenderData memory data = lenderData[lender][token];
        totalDeposited = data.totalDeposited;
        claimableEarnings = data.claimableEarnings;
        
        // Calculate current earnings including pending
        if (data.lastEarningsUpdate > 0 && data.totalDeposited > 0) {
            uint256 timeElapsed = block.timestamp - data.lastEarningsUpdate;
            uint256 pendingEarnings = data.totalDeposited * LENDING_REWARD_RATE * timeElapsed / 10000 / SECONDS_PER_YEAR;
            currentEarnings = data.accruedEarnings + pendingEarnings;
        } else {
            currentEarnings = data.accruedEarnings;
        }
        
        projectedAPY = LENDING_REWARD_RATE; // Return as basis points
        
        address lpToken = token == KAIA ? kKAIA : kUSDT;
        lpTokenBalance = IERC20(lpToken).balanceOf(lender);
    }

    /**
     * @notice Get referral information for UI
     */
    function getReferralInfo(address user) external view returns (
        uint256 totalReferrals,
        uint256 totalRewardsEarned,
        uint256 claimableRewards,
        address[] memory referredUsers,
        bool hasReferrer,
        bool isRegistered
    ) {
        ReferralData memory data = referralData[user];
        totalReferrals = data.totalReferrals;
        totalRewardsEarned = data.totalRewards;
        claimableRewards = data.claimableRewards;
        referredUsers = userReferrals[user];
        hasReferrer = data.referrer != address(0);
        isRegistered = data.isRegistered;
    }

    /**
     * @notice Get user transaction history (for blockchain fallback)
     */
    function getUserTransactions(address user, uint256 offset, uint256 limit) external view returns (
        TransactionRecord[] memory transactions
    ) {
        uint256[] memory indices = userTransactionIndices[user];
        uint256 length = indices.length;
        
        if (offset >= length) {
            return new TransactionRecord[](0);
        }
        
        uint256 end = offset + limit;
        if (end > length) {
            end = length;
        }
        
        uint256 resultLength = end - offset;
        transactions = new TransactionRecord[](resultLength);
        
        for (uint256 i = 0; i < resultLength; i++) {
            transactions[i] = transactionHistory[indices[length - 1 - offset - i]]; // Reverse order (newest first)
        }
    }

    /**
     * @notice Get comprehensive borrower dashboard data
     */
    function getBorrowerDashboard(address borrower) external view returns (
        uint256 currentLTV,
        uint256 totalCollateralUSD,
        uint256 totalDebtUSD,
        uint256 kaiaDebtPrincipal,
        uint256 kaiaDebtInterest,
        uint256 usdtDebtPrincipal,
        uint256 usdtDebtInterest,
        uint256 liquidationThreshold,
        bool isLiquidatableStatus
    ) {
        currentLTV = getLTV(borrower);
        totalCollateralUSD = collateralBalance[borrower] * USDT_COLLATERAL_PRICE / PRECISION;
        totalDebtUSD = _getTotalDebtValueUSD(borrower);
        
        (, kaiaDebtInterest, , ) = this.getDebtBreakdown(borrower, KAIA);
        kaiaDebtPrincipal = principalBalance[borrower][KAIA];
        
        (, usdtDebtInterest, , ) = this.getDebtBreakdown(borrower, USDT);
        usdtDebtPrincipal = principalBalance[borrower][USDT];
        
        liquidationThreshold = MAX_LTV * PRECISION; // 80%
        isLiquidatableStatus = currentLTV > liquidationThreshold;
    }

    // === ORIGINAL VIEW FUNCTIONS ===
    
    function getLTV(address borrower) public view returns (uint256) {
        uint256 collateralValueUSD = collateralBalance[borrower] * USDT_COLLATERAL_PRICE / PRECISION;
        if (collateralValueUSD == 0) return 0;
        
        uint256 totalDebtUSD = _getTotalDebtValueUSD(borrower);
        return totalDebtUSD * 100 * PRECISION / collateralValueUSD;
    }
    
    function isLiquidatable(address borrower) public view returns (bool) {
        return getLTV(borrower) > MAX_LTV * PRECISION;
    }

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

    function getTotalAccruedInterest(address borrower) external view returns (uint256 totalInterestUSD) {
        // Get current interest for both tokens
        (, uint256 kaiaInterest,,) = this.getDebtBreakdown(borrower, KAIA);
        (, uint256 usdtInterest,,) = this.getDebtBreakdown(borrower, USDT);
        
        // Convert to USD
        uint256 kaiaInterestUSD = _getTokenValueUSD(KAIA, kaiaInterest);
        uint256 usdtInterestUSD = _getTokenValueUSD(USDT, usdtInterest);
        
        return kaiaInterestUSD + usdtInterestUSD;
    }

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

    // === BONDING CURVE FUNCTIONS ===
    
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

    // === INTERNAL FUNCTIONS ===

    /**
     * @notice Update lending earnings for a user
     */
    function _updateLendingEarnings(address lender, address token) internal {
        LenderData storage data = lenderData[lender][token];
        
        if (data.lastEarningsUpdate == 0 || data.totalDeposited == 0) {
            data.lastEarningsUpdate = block.timestamp;
            return;
        }
        
        uint256 timeElapsed = block.timestamp - data.lastEarningsUpdate;
        if (timeElapsed == 0) return;
        
        uint256 earnings = data.totalDeposited * LENDING_REWARD_RATE * timeElapsed / 10000 / SECONDS_PER_YEAR;
        data.accruedEarnings += earnings;
        data.claimableEarnings += earnings;
        data.lastEarningsUpdate = block.timestamp;
        
        emit LendingEarningsUpdated(lender, token, earnings, block.timestamp);
    }

    /**
     * @notice Process referral rewards for transaction volume
     */
    function _processTransactionVolumeReward(address user, uint256 amount) internal {
        address referrer = referralData[user].referrer;
        if (referrer != address(0)) {
            uint256 reward = amount * TRANSACTION_FEE_RATE / 10000; // 0.1%
            referralData[referrer].totalRewards += reward;
            referralData[referrer].claimableRewards += reward;
            
            emit TransactionVolumeReward(referrer, user, reward, block.timestamp);
        }
    }

    /**
     * @notice Record transaction for history tracking
     */
    function _recordTransaction(
        address user,
        string memory transactionType,
        address token,
        uint256 amount
    ) internal {
        bytes32 txHash = keccak256(abi.encodePacked(user, transactionType, token, amount, block.timestamp));
        
        TransactionRecord memory record = TransactionRecord({
            user: user,
            transactionType: transactionType,
            token: token,
            amount: amount,
            timestamp: block.timestamp,
            txHash: txHash
        });
        
        uint256 index = transactionHistory.length;
        transactionHistory.push(record);
        userTransactionIndices[user].push(index);
        
        emit TransactionRecorded(user, transactionType, token, amount, txHash, block.timestamp);
    }

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

    // === PRICE FUNCTIONS ===
    
    function getKaiaPrice() public pure returns (uint256) {
        return _getFallbackKaiaPrice();
    }
    
    function _getFallbackKaiaPrice() internal pure returns (uint256) {
        return 15e16; // $0.15 in 18 decimals
    }
    
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
    
    // === METADATA FUNCTIONS ===
    
    function getTokenDecimals(address token) external view returns (uint8) {
        return IERC20Metadata(token).decimals();
    }
    
    function getTokenSymbol(address token) external view returns (string memory) {
        return IERC20Metadata(token).symbol();
    }
    
    function getTokenName(address token) external view returns (string memory) {
        return IERC20Metadata(token).name();
    }
    
    // === EMERGENCY FUNCTIONS (Owner only) ===
    
    function emergencyWithdraw(address token, uint256 amount) external onlyOwner {
        IERC20(token).transfer(owner(), amount);
    }
    
    function updateTokenPrice(address token, uint256 newPrice) external onlyOwner {
        // This would require making prices non-constant in a real implementation
        // For now, keeping hardcoded prices as per original design
    }
}