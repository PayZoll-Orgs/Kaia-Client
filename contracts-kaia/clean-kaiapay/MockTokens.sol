// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Mock Tokenized Gold (tGOLD)
 * @notice Simulates tokenized physical gold for RWA lending demonstration
 * @dev Each token represents 1 gram of gold (~$65 at current prices)
 */
contract TokenizedGold is ERC20, Ownable {
    uint8 private _decimals = 18;
    
    constructor() ERC20("Tokenized Gold", "tGOLD") {
        // Mint initial supply for testing (1000 ounces = ~31,103 grams)
        _mint(msg.sender, 31103 * 10**_decimals);
    }
    
    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }
    
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
    
    function faucet(uint256 amount) external {
        require(amount <= 100 * 10**_decimals, "Max 100 grams per request");
        _mint(msg.sender, amount);
    }
}

/**
 * @title Mock Tokenized Silver (tSILVER) 
 * @notice Simulates tokenized physical silver for RWA lending demonstration
 * @dev Each token represents 1 ounce of silver (~$30 at current prices)
 */
contract TokenizedSilver is ERC20, Ownable {
    uint8 private _decimals = 18;
    
    constructor() ERC20("Tokenized Silver", "tSILVER") {
        // Mint initial supply for testing (10,000 ounces)
        _mint(msg.sender, 10000 * 10**_decimals);
    }
    
    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }
    
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
    
    function faucet(uint256 amount) external {
        require(amount <= 50 * 10**_decimals, "Max 50 ounces per request");
        _mint(msg.sender, amount);
    }
}

/**
 * @title Mock Tokenized Real Estate (tREAL)
 * @notice Simulates tokenized real estate for RWA lending demonstration
 * @dev Each token represents $1,000 worth of real estate
 */
contract TokenizedRealEstate is ERC20, Ownable {
    uint8 private _decimals = 18;
    
    constructor() ERC20("Tokenized Real Estate", "tREAL") {
        // Mint initial supply for testing ($10M worth)
        _mint(msg.sender, 10000 * 10**_decimals);
    }
    
    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }
    
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
    
    function faucet(uint256 amount) external {
        require(amount <= 10 * 10**_decimals, "Max $10,000 worth per request");
        _mint(msg.sender, amount);
    }
}

/**
 * @title Mock USDT for borrowing
 * @notice Simulates USDT for borrowing against RWA collateral
 */
contract MockUSDT is ERC20, Ownable {
    uint8 private _decimals = 6; // USDT has 6 decimals
    
    constructor() ERC20("Mock USDT", "mUSDT") {
        // Mint initial supply for testing ($1M)
        _mint(msg.sender, 1000000 * 10**_decimals);
    }
    
    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }
    
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
    
    function faucet(uint256 amount) external {
        require(amount <= 1000 * 10**_decimals, "Max $1,000 per request");
        _mint(msg.sender, amount);
    }
}

/**
 * @title RWA Platform Deployer with Bonding Curves
 * @notice Deploys and configures the complete RWA lending platform with bonding curve parameters
 */
contract BondingCurvePlatformDeployer {
    
    struct DeployedContracts {
        address lendingPlatform;
        address tokenizedGold;
        address tokenizedSilver;
        address tokenizedRealEstate;
        address mockUSDT;
        address demoContract;
    }
    
    DeployedContracts public deployedContracts;
    
    event PlatformDeployed(DeployedContracts contracts);
    event BondingCurveConfigured(address asset, string assetType);
    
    /**
     * @notice Deploy complete RWA lending platform with sophisticated bonding curves
     * @param oraklRouter The Orakl Network router address
     * @param feeRecipient Address to receive platform fees
     */
    function deployPlatformWithBondingCurves(
        address oraklRouter,
        address feeRecipient
    ) external returns (DeployedContracts memory) {
        
        // Deploy mock RWA tokens
        deployedContracts.tokenizedGold = address(new TokenizedGold());
        deployedContracts.tokenizedSilver = address(new TokenizedSilver());
        deployedContracts.tokenizedRealEstate = address(new TokenizedRealEstate());
        deployedContracts.mockUSDT = address(new MockUSDT());
        
        // Deploy enhanced lending platform
        RWALendingPlatformWithBondingCurves lending = new RWALendingPlatformWithBondingCurves(
            oraklRouter, 
            feeRecipient
        );
        deployedContracts.lendingPlatform = address(lending);
        
        // Configure assets with sophisticated bonding curve parameters
        _configureGoldWithBondingCurves(lending);
        _configureSilverWithBondingCurves(lending);
        _configureRealEstateWithBondingCurves(lending);
        _configureUSDTWithBondingCurves(lending);
        
        // Deploy demo contract
        deployedContracts.demoContract = address(new BondingCurveDemo(
            deployedContracts.lendingPlatform,
            deployedContracts.tokenizedGold,
            deployedContracts.tokenizedSilver,
            deployedContracts.tokenizedRealEstate,
            deployedContracts.mockUSDT
        ));
        
        // Transfer ownership of all contracts to deployer
        _transferOwnerships();
        
        emit PlatformDeployed(deployedContracts);
        return deployedContracts;
    }
    
    /**
     * @notice Configure Tokenized Gold with conservative bonding curves
     */
    function _configureGoldWithBondingCurves(RWALendingPlatformWithBondingCurves lending) internal {
        RWALendingPlatformWithBondingCurves.BondingCurveConfig memory goldCurve = 
            RWALendingPlatformWithBondingCurves.BondingCurveConfig({
                // Interest Rate Curve: Conservative for precious metals
                baseRate: 300,              // 3% base rate
                optimalUtilization: 7000,   // 70% optimal utilization
                curveExponent: 2 * 1e18,    // Quadratic curve above optimal
                maxRate: 1500,              // 15% max rate
                
                // Liquidation Penalty Curve: Progressive penalties
                minPenalty: 800,            // 8% minimum penalty
                maxPenalty: 1500,           // 15% maximum penalty
                penaltyCurveSlope: 200,     // 2% additional per liquidation
                
                // Collateral Haircut: Volatility-based adjustments
                baseHaircut: 500,           // 5% base haircut
                volatilityFactor: 1e18,     // 1:1 volatility to haircut ratio
                maxHaircut: 2000,           // 20% max haircut
                
                // Time Decay: Gradual LTV reduction for risk management
                ltvDecayRate: 1e17,         // 10% decay factor
                maxDecayPeriod: 180 days    // 6 months max decay period
            });
            
        lending.addAssetWithBondingCurves(
            deployedContracts.tokenizedGold,
            7000,    // 70% base LTV
            8000,    // 80% liquidation threshold
            "PAXG-USDT", // PAX Gold price feed
            false,   // Cannot borrow gold
            true,    // Can use as collateral
            goldCurve
        );
        
        emit BondingCurveConfigured(deployedContracts.tokenizedGold, "Gold");
    }
    
    /**
     * @notice Configure Tokenized Silver with higher volatility bonding curves
     */
    function _configureSilverWithBondingCurves(RWALendingPlatformWithBondingCurves lending) internal {
        RWALendingPlatformWithBondingCurves.BondingCurveConfig memory silverCurve = 
            RWALendingPlatformWithBondingCurves.BondingCurveConfig({
                // Interest Rate Curve: Higher rates due to volatility
                baseRate: 400,              // 4% base rate
                optimalUtilization: 6000,   // 60% optimal utilization
                curveExponent: 25 * 1e17,   // 2.5x exponential curve
                maxRate: 2000,              // 20% max rate
                
                // Liquidation Penalty Curve: Higher penalties
                minPenalty: 1000,           // 10% minimum penalty
                maxPenalty: 2000,           // 20% maximum penalty  
                penaltyCurveSlope: 300,     // 3% additional per liquidation
                
                // Collateral Haircut: Higher volatility adjustments
                baseHaircut: 800,           // 8% base haircut
                volatilityFactor: 15 * 1e17, // 1.5:1 volatility ratio
                maxHaircut: 2500,           // 25% max haircut
                
                // Time Decay: Faster decay due to volatility
                ltvDecayRate: 15 * 1e16,    // 15% decay factor
                maxDecayPeriod: 120 days    // 4 months max decay
            });
            
        lending.addAssetWithBondingCurves(
            deployedContracts.tokenizedSilver,
            6000,    // 60% base LTV
            7500,    // 75% liquidation threshold
            "XAUT-USDT", // Tether Gold as closest proxy
            false,   // Cannot borrow silver
            true,    // Can use as collateral
            silverCurve
        );
        
        emit BondingCurveConfigured(deployedContracts.tokenizedSilver, "Silver");
    }
    
    /**
     * @notice Configure Tokenized Real Estate with stable asset bonding curves
     */
    function _configureRealEstateWithBondingCurves(RWALendingPlatformWithBondingCurves lending) internal {
        RWALendingPlatformWithBondingCurves.BondingCurveConfig memory realEstateCurve = 
            RWALendingPlatformWithBondingCurves.BondingCurveConfig({
                // Interest Rate Curve: Low rates for stable assets
                baseRate: 250,              // 2.5% base rate
                optimalUtilization: 8500,   // 85% optimal utilization
                curveExponent: 15 * 1e17,   // 1.5x exponential curve
                maxRate: 1200,              // 12% max rate
                
                // Liquidation Penalty Curve: Lower penalties for stable assets
                minPenalty: 500,            // 5% minimum penalty
                maxPenalty: 1000,           // 10% maximum penalty
                penaltyCurveSlope: 100,     // 1% additional per liquidation
                
                // Collateral Haircut: Minimal haircuts for real estate
                baseHaircut: 300,           // 3% base haircut
                volatilityFactor: 5 * 1e17, // 0.5:1 volatility ratio
                maxHaircut: 1500,           // 15% max haircut
                
                // Time Decay: Minimal decay for stable assets
                ltvDecayRate: 5 * 1e16,     // 5% decay factor
                maxDecayPeriod: 365 days    // 1 year max decay
            });
            
        lending.addAssetWithBondingCurves(
            deployedContracts.tokenizedRealEstate,
            8000,    // 80% base LTV
            9000,    // 90% liquidation threshold
            "BTC-USDT", // Use BTC as real estate proxy for demo
            false,   // Cannot borrow real estate tokens
            true,    // Can use as collateral
            realEstateCurve
        );
        
        emit BondingCurveConfigured(deployedContracts.tokenizedRealEstate, "RealEstate");
    }
    
    /**
     * @notice Configure USDT as the primary borrowable asset
     */
    function _configureUSDTWithBondingCurves(RWALendingPlatformWithBondingCurves lending) internal {
        RWALendingPlatformWithBondingCurves.BondingCurveConfig memory usdtCurve = 
            RWALendingPlatformWithBondingCurves.BondingCurveConfig({
                // Interest Rate Curve: Market-driven rates for borrowing
                baseRate: 500,              // 5% base rate
                optimalUtilization: 8000,   // 80% optimal utilization
                curveExponent: 2 * 1e18,    // Quadratic curve
                maxRate: 2500,              // 25% max rate
                
                // Liquidation Penalty Curve: N/A for borrowable asset
                minPenalty: 0,              // No penalties
                maxPenalty: 0,              // No penalties
                penaltyCurveSlope: 0,       // No penalties
                
                // Collateral Haircut: N/A for non-collateral asset
                baseHaircut: 0,             // No haircuts
                volatilityFactor: 0,        // No volatility adjustments
                maxHaircut: 0,              // No haircuts
                
                // Time Decay: N/A for borrowable asset
                ltvDecayRate: 0,            // No decay
                maxDecayPeriod: 0           // No decay
            });
            
        lending.addAssetWithBondingCurves(
            deployedContracts.mockUSDT,
            0,       // 0% LTV (cannot use borrowed USDT as collateral)
            0,       // No liquidation threshold
            "USDT-USD", // Direct USD peg
            true,    // Can borrow
            false,   // Cannot use as collateral
            usdtCurve
        );
        
        emit BondingCurveConfigured(deployedContracts.mockUSDT, "USDT");
    }
    
    function _transferOwnerships() internal {
        TokenizedGold(deployedContracts.tokenizedGold).transferOwnership(msg.sender);
        TokenizedSilver(deployedContracts.tokenizedSilver).transferOwnership(msg.sender);
        TokenizedRealEstate(deployedContracts.tokenizedRealEstate).transferOwnership(msg.sender);
        MockUSDT(deployedContracts.mockUSDT).transferOwnership(msg.sender);
        RWALendingPlatformWithBondingCurves(deployedContracts.lendingPlatform).transferOwnership(msg.sender);
    }
    
    /**
     * @notice Fund platform with initial liquidity
     */
    function fundPlatform(uint256 usdtAmount) external {
        require(deployedContracts.mockUSDT != address(0), "Platform not deployed");
        MockUSDT(deployedContracts.mockUSDT).transferFrom(
            msg.sender, 
            deployedContracts.lendingPlatform, 
            usdtAmount
        );
    }
    
    /**
     * @notice Get all deployed contract addresses
     */
    function getContracts() external view returns (DeployedContracts memory) {
        return deployedContracts;
    }
}

/**
 * @title Bonding Curve Demo Contract
 * @notice Provides comprehensive demo functions showcasing bonding curve features
 */
contract BondingCurveDemo {
    RWALendingPlatformWithBondingCurves public platform;
    address public goldToken;
    address public silverToken;
    address public realEstateToken;
    address public usdtToken;
    
    event DemoStepCompleted(string step, address user, uint256 value);
    event BondingCurveShowcase(string curveType, uint256 inputValue, uint256 outputValue);
    
    constructor(
        address _platform,
        address _gold,
        address _silver, 
        address _realEstate,
        address _usdt
    ) {
        platform = RWALendingPlatformWithBondingCurves(_platform);
        goldToken = _gold;
        silverToken = _silver;
        realEstateToken = _realEstate;
        usdtToken = _usdt;
    }
    
    /**
     * @notice Complete demo showcasing all bonding curve features
     */
    function runFullBondingCurveDemo(address user) external {
        
        // Step 1: Get RWA tokens and show initial state
        _demoStep1_GetRWATokens(user);
        
        // Step 2: Deposit collateral and show bonding curve adjustments
        _demoStep2_DepositAndShowCurves();
        
        // Step 3: Borrow with dynamic LTV calculations
        _demoStep3_BorrowWithDynamicLTV();
        
        // Step 4: Simulate market conditions and curve responses
        _demoStep4_SimulateMarketConditions();
        
        // Step 5: Show liquidation with dynamic penalties
        _demoStep5_ShowDynamicLiquidation();
        
        // Step 6: Display comprehensive analytics
        _demoStep6_ShowAnalytics(user);
    }
    
    function _demoStep1_GetRWATokens(address user) internal {
        // Distribute RWA tokens to user
        TokenizedGold(goldToken).faucet(20 * 1e18);        // 20 grams gold
        TokenizedSilver(silverToken).faucet(40 * 1e18);    // 40 ounces silver  
        TokenizedRealEstate(realEstateToken).faucet(10 * 1e18); // $10,000 real estate
        
        // Transfer to user
        TokenizedGold(goldToken).transfer(user, 20 * 1e18);
        TokenizedSilver(silverToken).transfer(user, 40 * 1e18);
        TokenizedRealEstate(realEstateToken).transfer(user, 10 * 1e18);
        
        emit DemoStepCompleted("GetRWATokens", user, 70000); // ~$70k in assets
    }
    
    function _demoStep2_DepositAndShowCurves() internal {
        // Approve and deposit tokens
        TokenizedGold(goldToken).approve(address(platform), 20 * 1e18);
        TokenizedSilver(silverToken).approve(address(platform), 40 * 1e18);
        TokenizedRealEstate(realEstateToken).approve(address(platform), 10 * 1e18);
        
        // Deposit with bonding curve calculations
        platform.deposit(goldToken, 20 * 1e18);
        platform.deposit(silverToken, 40 * 1e18);  
        platform.deposit(realEstateToken, 10 * 1e18);
        
        // Show bonding curve metrics
        (uint256 goldRate,,,, uint256 goldCurve) = platform.getBondingCurveMetrics(goldToken);
        emit BondingCurveShowcase("InterestRateGold", 0, goldRate);
        emit BondingCurveShowcase("CurveValueGold", 0, goldCurve);
        
        emit DemoStepCompleted("DepositWithCurves", address(this), goldRate);
    }
    
    function _demoStep3_BorrowWithDynamicLTV() internal {
        // Borrow USDT using bonding curve LTV calculations
        uint256 borrowAmount = 25000 * 1e6; // $25,000 USDT
        platform.borrow(usdtToken, borrowAmount);
        
        // Show effective vs base LTV
        uint256 effectiveCollateralUSD = platform.getEffectiveCollateralUSD(address(this));
        emit BondingCurveShowcase("EffectiveCollateralUSD", 70000 * 1e8, effectiveCollateralUSD);
        
        emit DemoStepCompleted("BorrowWithDynamicLTV", address(this), borrowAmount);
    }
    
    function _demoStep4_SimulateMarketConditions() internal {
        // Update volatility metrics to show bonding curve responses
        platform.updateVolatilityMetrics(goldToken);
        platform.updateVolatilityMetrics(silverToken);
        platform.updateVolatilityMetrics(realEstateToken);
        
        // Show updated metrics after volatility changes
        (, uint256 goldUtilization, uint256 goldVolatility, uint256 goldHaircut,) = 
            platform.getBondingCurveMetrics(goldToken);
            
        emit BondingCurveShowcase("VolatilityResponse", goldVolatility, goldHaircut);
        
        emit DemoStepCompleted("SimulateMarketConditions", address(this), goldUtilization);
    }
    
    function _demoStep5_ShowDynamicLiquidation() internal {
        // Check liquidation status and calculate dynamic penalty
        (bool liquidatable, uint256 healthFactor) = platform.checkLiquidation(address(this));
        
        if (liquidatable) {
            uint256 dynamicPenalty = platform.calculateBondingCurveLiquidationPenalty(
                address(this), 
                healthFactor
            );
            emit BondingCurveShowcase("DynamicLiquidationPenalty", healthFactor, dynamicPenalty);
        }
        
        emit DemoStepCompleted("ShowDynamicLiquidation", address(this), healthFactor);
    }
    
    function _demoStep6_ShowAnalytics(address user) internal {
        // Get comprehensive position analytics
        (
            uint256 totalCollateralUSD,
            uint256 effectiveCollateralUSD,
            uint256 totalBorrowUSD,
            uint256 healthFactor,
            uint256 riskScore,
        ) = platform.getEnhancedUserPosition(user);
        
        emit BondingCurveShowcase("CollateralEfficiency", 
            totalCollateralUSD, effectiveCollateralUSD);
        emit BondingCurveShowcase("PositionHealth", totalBorrowUSD, healthFactor);
        
        emit DemoStepCompleted("ShowAnalytics", user, riskScore);
    }
    
    /**
     * @notice Show individual bonding curve calculations
     */
    function demonstrateBondingCurves() external view returns (
        uint256 goldInterestRate,
        uint256 silverLiquidationPenalty,
        uint256 realEstateHaircut,
        uint256 timeLTVDecay
    ) {
        // Interest rate bonding curve
        goldInterestRate = platform.calculateBondingCurveInterestRate(goldToken);
        
        // Liquidation penalty bonding curve
        silverLiquidationPenalty = platform.calculateBondingCurveLiquidationPenalty(
            address(this), 
            9e17 // 0.9 health factor
        );
        
        // Collateral haircut bonding curve
        realEstateHaircut = platform.calculateCollateralHaircut(realEstateToken);
        
        // Time decay bonding curve
        timeLTVDecay = platform.calculateTimeBondingCurveLTV(address(this), goldToken);
    }
    
    /**
     * @notice Get current prices from Orakl Network
     */
    function getCurrentPrices() external view returns (
        uint256 goldPrice,
        uint256 silverPrice,
        uint256 realEstatePrice,
        uint256 usdtPrice
    ) {
        goldPrice = platform.getAssetPrice(goldToken);
        silverPrice = platform.getAssetPrice(silverToken);
        realEstatePrice = platform.getAssetPrice(realEstateToken);
        usdtPrice = platform.getAssetPrice(usdtToken);
    }
    
    /**
     * @notice Show all bonding curve metrics for platform overview
     */
    function getPlatformBondingCurveOverview() external view returns (
        uint256[5] memory goldMetrics,    // [rate, utilization, volatility, haircut, curve]
        uint256[5] memory silverMetrics,  // [rate, utilization, volatility, haircut, curve]
        uint256[5] memory realEstateMetrics, // [rate, utilization, volatility, haircut, curve]
        uint256[5] memory usdtMetrics     // [rate, utilization, volatility, haircut, curve]
    ) {
        (goldMetrics[0], goldMetrics[1], goldMetrics[2], goldMetrics[3], goldMetrics[4]) = 
            platform.getBondingCurveMetrics(goldToken);
            
        (silverMetrics[0], silverMetrics[1], silverMetrics[2], silverMetrics[3], silverMetrics[4]) = 
            platform.getBondingCurveMetrics(silverToken);
            
        (realEstateMetrics[0], realEstateMetrics[1], realEstateMetrics[2], realEstateMetrics[3], realEstateMetrics[4]) = 
            platform.getBondingCurveMetrics(realEstateToken);
            
        (usdtMetrics[0], usdtMetrics[1], usdtMetrics[2], usdtMetrics[3], usdtMetrics[4]) = 
            platform.getBondingCurveMetrics(usdtToken);
    }
}