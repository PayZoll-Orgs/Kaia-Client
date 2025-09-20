// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title USDY - USD Yield Token (Real World Asset Demo)
 * @notice A demonstration RWA token representing real-world assets
 * @dev ERC20 token with faucet functionality for testing RWA lending scenarios
 * 
 * This contract demonstrates how real-world asset tokens could work:
 * - Users can claim tokens from faucet (simulating RWA token acquisition)
 * - Tokens can be used as collateral in lending protocols
 * - Represents $1 USD value per token (pegged to USD)
 * - Includes anti-spam measures with time-based claiming limits
 */
contract USDY is ERC20, Ownable, ReentrancyGuard {
    
    // Faucet configuration
    uint256 public constant FAUCET_AMOUNT = 1000e18; // 1000 USDY per claim
    uint256 public constant FAUCET_COOLDOWN = 24 hours; // 24 hour cooldown
    uint256 public constant MAX_SUPPLY = 1000000e18; // 1M USDY max supply
    
    // Faucet state
    mapping(address => uint256) public lastFaucetClaim;
    uint256 public totalFaucetClaimed;
    
    // RWA metadata
    string public constant RWA_TYPE = "USD_YIELD_BEARING";
    string public constant BACKING_ASSET = "US_TREASURY_BONDS";
    uint256 public constant ASSET_VALUE_USD = 1e18; // $1 per token
    
    // Events
    event FaucetClaimed(address indexed user, uint256 amount, uint256 timestamp);
    event FaucetConfigured(uint256 newAmount, uint256 newCooldown);
    event RWATokenMinted(address indexed to, uint256 amount, string reason);
    
    // Errors
    error FaucetCooldownNotMet(uint256 timeRemaining);
    error FaucetSupplyExhausted();
    error InvalidAmount();
    error MaxSupplyExceeded();
    
    constructor() ERC20("USD Yield Token", "USDY") Ownable(msg.sender) {
        // Mint initial supply to owner for liquidity
        _mint(msg.sender, 100000e18); // 100k USDY for initial liquidity
    }
    
    /**
     * @notice Claim tokens from faucet (simulates acquiring RWA tokens)
     * @dev Users can claim once every 24 hours to prevent spam
     */
    function claimFromFaucet() external nonReentrant {
        address user = msg.sender;
        
        // Check cooldown period
        if (block.timestamp < lastFaucetClaim[user] + FAUCET_COOLDOWN) {
            uint256 timeRemaining = (lastFaucetClaim[user] + FAUCET_COOLDOWN) - block.timestamp;
            revert FaucetCooldownNotMet(timeRemaining);
        }
        
        // Check if faucet has supply remaining
        if (totalFaucetClaimed + FAUCET_AMOUNT > MAX_SUPPLY - totalSupply() + totalFaucetClaimed) {
            revert FaucetSupplyExhausted();
        }
        
        // Update state
        lastFaucetClaim[user] = block.timestamp;
        totalFaucetClaimed += FAUCET_AMOUNT;
        
        // Mint tokens to user
        _mint(user, FAUCET_AMOUNT);
        
        emit FaucetClaimed(user, FAUCET_AMOUNT, block.timestamp);
    }
    
    /**
     * @notice Check how much time until user can claim from faucet again
     * @param user Address to check
     * @return timeRemaining Seconds until next claim is available (0 if ready)
     */
    function timeUntilNextClaim(address user) external view returns (uint256) {
        uint256 nextClaimTime = lastFaucetClaim[user] + FAUCET_COOLDOWN;
        if (block.timestamp >= nextClaimTime) {
            return 0;
        }
        return nextClaimTime - block.timestamp;
    }
    
    /**
     * @notice Check if user can claim from faucet
     * @param user Address to check
     * @return canClaim True if user can claim now
     */
    function canClaimFromFaucet(address user) external view returns (bool) {
        return block.timestamp >= lastFaucetClaim[user] + FAUCET_COOLDOWN &&
               totalFaucetClaimed + FAUCET_AMOUNT <= MAX_SUPPLY - totalSupply() + totalFaucetClaimed;
    }
    
    /**
     * @notice Get faucet information
     * @return amount Amount per claim
     * @return cooldown Cooldown period in seconds
     * @return totalClaimed Total amount claimed from faucet
     * @return remainingSupply Remaining faucet supply
     */
    function getFaucetInfo() external view returns (
        uint256 amount,
        uint256 cooldown,
        uint256 totalClaimed,
        uint256 remainingSupply
    ) {
        amount = FAUCET_AMOUNT;
        cooldown = FAUCET_COOLDOWN;
        totalClaimed = totalFaucetClaimed;
        
        uint256 maxFaucetSupply = MAX_SUPPLY - (totalSupply() - totalFaucetClaimed);
        remainingSupply = maxFaucetSupply > totalFaucetClaimed ? 
            maxFaucetSupply - totalFaucetClaimed : 0;
    }
    
    /**
     * @notice Emergency mint function for owner (for special circumstances)
     * @param to Address to mint to
     * @param amount Amount to mint
     * @param reason Reason for minting
     */
    function emergencyMint(address to, uint256 amount, string calldata reason) 
        external 
        onlyOwner 
        nonReentrant 
    {
        if (amount == 0) revert InvalidAmount();
        if (totalSupply() + amount > MAX_SUPPLY) revert MaxSupplyExceeded();
        
        _mint(to, amount);
        emit RWATokenMinted(to, amount, reason);
    }
    
    /**
     * @notice Burn tokens (for RWA redemption scenarios)
     * @param amount Amount to burn
     */
    function burn(uint256 amount) external {
        if (amount == 0) revert InvalidAmount();
        _burn(msg.sender, amount);
    }
    
    /**
     * @notice Burn tokens from specific address (with allowance)
     * @param from Address to burn from
     * @param amount Amount to burn
     */
    function burnFrom(address from, uint256 amount) external {
        if (amount == 0) revert InvalidAmount();
        
        uint256 currentAllowance = allowance(from, msg.sender);
        require(currentAllowance >= amount, "ERC20: burn amount exceeds allowance");
        
        _approve(from, msg.sender, currentAllowance - amount);
        _burn(from, amount);
    }
    
    /**
     * @notice Get RWA token metadata
     * @return rwaType Type of RWA
     * @return backingAsset What backs this token
     * @return valueUSD USD value per token
     * @return maxSupply Maximum token supply
     */
    function getRWAMetadata() external pure returns (
        string memory rwaType,
        string memory backingAsset,
        uint256 valueUSD,
        uint256 maxSupply
    ) {
        return (RWA_TYPE, BACKING_ASSET, ASSET_VALUE_USD, MAX_SUPPLY);
    }
    
    /**
     * @notice Override decimals to match USD (18 decimals)
     */
    function decimals() public pure override returns (uint8) {
        return 18;
    }
}