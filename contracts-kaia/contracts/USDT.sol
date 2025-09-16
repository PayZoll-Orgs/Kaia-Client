// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// This imports the base KIP7 contract from the installed Kaia contracts package.
import "@kaiachain/contracts/KIP/token/KIP7/KIP7.sol";

/**
 * @title MyDummyTokenWithFaucet
 * @dev A complete, deployable KIP7 token with a built-in faucet for testing.
 * The owner mints the initial supply and can fund the faucet.
 * Any user can request a small number of tokens from the faucet once every 24 hours.
 */
contract MyDummyTokenWithFaucet is KIP7 {

    // The address of the person who deployed the contract.
    address public owner;

    // Mapping to track the last time an address claimed from the faucet.
    mapping(address => uint256) private _lastClaimedTimestamp;

    // The cooldown period for the faucet (e.g., 24 hours).
    uint256 public constant FAUCET_COOLDOWN = 24 hours;

    // The amount of tokens the faucet dispenses per request.
    uint256 public constant FAUCET_AMOUNT = 100;

    // A modifier to ensure only the owner can call certain functions.
    modifier onlyOwner() {
        require(owner == _msgSender(), "Caller is not the owner");
        _;
    }

    /**
     * @dev The constructor sets up the token.
     * It assigns a name, a symbol, and creates the initial number of tokens.
     */
    constructor(string memory name_, string memory symbol_, uint256 initialSupply_) KIP7(name_, symbol_) {
        // Set the owner to the address that deploys this contract.
        owner = _msgSender();

        // Calculate the initial supply with 18 decimals.
        uint256 supplyWithDecimals = initialSupply_ * (10**decimals());

        // Mint the initial tokens to the owner.
        _mint(owner, supplyWithDecimals);
    }

    /**
     * @dev Creates new tokens and assigns them to a specified address.
     * Can only be called by the owner. Useful for adding more test tokens.
     */
    function mint(address to, uint256 amount) public onlyOwner {
        uint256 amountWithDecimals = amount * (10**decimals());
        _mint(to, amountWithDecimals);
    }

    /**
     * @dev Public faucet function.
     * Allows any user to claim a fixed amount of tokens once per cooldown period.
     * The faucet must be funded by the owner first.
     */
    function faucet() external {
        // Check if the user has waited long enough since their last claim.
        require(
            block.timestamp >= _lastClaimedTimestamp[msg.sender] + FAUCET_COOLDOWN,
            "Faucet: You can only claim once every 24 hours."
        );

        uint256 faucetAmountWithDecimals = FAUCET_AMOUNT * (10**decimals());

        // Check if the contract has enough funds to dispense.
        require(
            balanceOf(address(this)) >= faucetAmountWithDecimals,
            "Faucet: The faucet is empty. Please ask the owner to refill it."
        );

        // Update the user's last claim timestamp before transferring to prevent re-entrancy attacks.
        _lastClaimedTimestamp[msg.sender] = block.timestamp;
        
        // Transfer the tokens from the contract to the user.
        _transfer(address(this), msg.sender, faucetAmountWithDecimals);
    }

    /**
     * @dev Allows the owner to withdraw any tokens sent to this contract.
     * Useful for recovering funds from the faucet.
     */
    function withdrawFaucetFunds() external onlyOwner {
        uint256 contractBalance = balanceOf(address(this));
        require(contractBalance > 0, "Faucet has no funds to withdraw.");
        _transfer(address(this), owner, contractBalance);
    }
}