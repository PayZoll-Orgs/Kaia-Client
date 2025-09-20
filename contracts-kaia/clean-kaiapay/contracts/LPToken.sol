// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title LPToken
 * @dev LP Token for the lending protocol with mint/burn functionality
 * @notice This token represents liquidity provider shares in the lending pool
 */
contract LPToken is ERC20, Ownable {
    
    address public lendingProtocol;
    
    event Minted(address indexed to, uint256 amount);
    event Burned(address indexed from, uint256 amount);
    event LendingProtocolUpdated(address indexed oldProtocol, address indexed newProtocol);
    
    modifier onlyLendingProtocol() {
        require(msg.sender == lendingProtocol, "Only lending protocol can call");
        _;
    }
    
    constructor(
        string memory name,
        string memory symbol,
        address _lendingProtocol,
        address _owner
    ) ERC20(name, symbol) Ownable(_owner) {
        lendingProtocol = _lendingProtocol;
    }
    
    /**
     * @notice Mint LP tokens to address (only lending protocol)
     * @param to Address to mint tokens to
     * @param amount Amount to mint
     */
    function mint(address to, uint256 amount) external onlyLendingProtocol {
        _mint(to, amount);
        emit Minted(to, amount);
    }
    
    /**
     * @notice Burn LP tokens from address (only lending protocol)
     * @param from Address to burn tokens from
     * @param amount Amount to burn
     */
    function burn(address from, uint256 amount) external onlyLendingProtocol {
        _burn(from, amount);
        emit Burned(from, amount);
    }
    
    /**
     * @notice Update the lending protocol address (only owner)
     * @param _newLendingProtocol New lending protocol address
     */
    function updateLendingProtocol(address _newLendingProtocol) external onlyOwner {
        require(_newLendingProtocol != address(0), "Invalid address");
        address oldProtocol = lendingProtocol;
        lendingProtocol = _newLendingProtocol;
        emit LendingProtocolUpdated(oldProtocol, _newLendingProtocol);
    }
}