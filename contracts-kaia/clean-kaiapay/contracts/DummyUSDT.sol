// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title DummyUSDT
 * @dev A simple ERC20 token for testing purposes with faucet functionality
 * @notice Compatible with Kaia testnet, includes built-in faucet for easy testing
 */
contract DummyUSDT is ERC20, Ownable {

    /// @dev Faucet configuration
    uint256 public constant FAUCET_AMOUNT = 1000 * 10**18; // 1000 tokens
    uint256 public constant FAUCET_COOLDOWN = 24 hours;
    
    /// @dev Mapping to track last faucet claim time
    mapping(address => uint256) public lastFaucetClaim;

    /// @dev Events
    event FaucetClaimed(address indexed user, uint256 amount);
    event FaucetFunded(uint256 amount);

    /// @dev Custom errors
    error FaucetCooldown();
    error FaucetEmpty();

    /**
     * @dev Constructor - creates initial supply and sets up faucet
     * @param initialSupply Initial token supply (without decimals)
     */
    constructor(uint256 initialSupply) ERC20("Dummy USDT", "DUSDT") Ownable(msg.sender) {
        // Mint initial supply to owner
        _mint(msg.sender, initialSupply * 10**decimals());
        
        // Fund faucet with 10% of initial supply
        uint256 faucetFunding = (initialSupply * 10**decimals()) / 10;
        _mint(address(this), faucetFunding);
        
        emit FaucetFunded(faucetFunding);
    }

    /**
     * @notice Claim tokens from faucet (once per 24 hours)
     * @dev Anyone can call this to get test tokens
     */
    function faucet() external {
        // Check cooldown
        if (block.timestamp < lastFaucetClaim[msg.sender] + FAUCET_COOLDOWN) {
            revert FaucetCooldown();
        }
        
        // Check faucet balance
        if (balanceOf(address(this)) < FAUCET_AMOUNT) {
            revert FaucetEmpty();
        }
        
        // Update claim time before transfer (reentrancy protection)
        lastFaucetClaim[msg.sender] = block.timestamp;
        
        // Transfer tokens
        _transfer(address(this), msg.sender, FAUCET_AMOUNT);
        
        emit FaucetClaimed(msg.sender, FAUCET_AMOUNT);
    }

    /**
     * @notice Mint new tokens (only owner)
     * @param to Address to mint tokens to
     * @param amount Amount to mint (with decimals)
     */
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    /**
     * @notice Fund the faucet (only owner)
     * @param amount Amount to fund faucet with
     */
    function fundFaucet(uint256 amount) external onlyOwner {
        _transfer(msg.sender, address(this), amount);
        emit FaucetFunded(amount);
    }

    /**
     * @notice Get faucet balance
     */
    function getFaucetBalance() external view returns (uint256) {
        return balanceOf(address(this));
    }

    /**
     * @notice Get time until next faucet claim for user
     * @param user Address to check
     */
    function getTimeUntilNextClaim(address user) external view returns (uint256) {
        uint256 nextClaim = lastFaucetClaim[user] + FAUCET_COOLDOWN;
        if (block.timestamp >= nextClaim) {
            return 0;
        }
        return nextClaim - block.timestamp;
    }

    /**
     * @notice Check if user can claim from faucet
     * @param user Address to check
     */
    function canClaimFaucet(address user) external view returns (bool) {
        return block.timestamp >= lastFaucetClaim[user] + FAUCET_COOLDOWN 
               && balanceOf(address(this)) >= FAUCET_AMOUNT;
    }

    /**
     * @notice Emergency withdrawal of faucet funds (only owner)
     */
    function withdrawFaucetFunds() external onlyOwner {
        uint256 balance = balanceOf(address(this));
        if (balance > 0) {
            _transfer(address(this), owner(), balance);
        }
    }
}
