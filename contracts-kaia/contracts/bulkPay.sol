// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title BulkPayroll
 * @dev Enhanced bulk payment contract with failure isolation
 * @notice Handles bulk USDT transfers with individual failure handling
 */
contract BulkPayroll is ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;

    /// @dev The USDT token contract address
    IERC20 public immutable usdtToken;

    constructor(address _usdtToken) Ownable(msg.sender) {
        require(_usdtToken != address(0), "Invalid USDT token address");
        usdtToken = IERC20(_usdtToken);
    }

    /// @dev Maximum recipients per batch to prevent gas limit issues
    uint256 public constant MAX_RECIPIENTS = 200;

    /// @dev Mapping for failed transfers: recipient => amount
    mapping(address => uint256) public failedTransfers;

    /// @dev Custom errors
    error LengthMismatch();
    error InsufficientBalance();
    error InsufficientAllowance();
    error TransferError();
    error RefundFailed();
    error TooManyRecipients();
    error InvalidInput();

    /// @dev Events
    event BulkTransferExecuted(
        address indexed sender,
        address indexed token,
        uint256 totalRecipients,
        uint256 totalAmount,
        uint256 successCount,
        uint256 failCount
    );

    event TransferFailed(
        address indexed recipient,
        address indexed token,
        uint256 amount
    );

    event FailedTransferClaimed(
        address indexed recipient,
        address token,
        uint256 amount
    );

    /**
     * @notice Executes a bulk transfer of USDT tokens with failure isolation
     * @dev Failed transfers are stored for later claiming
     * @param recipients Array of recipient addresses
     * @param amounts Array of corresponding transfer amounts
     */
    function bulkTransfer(
        address[] calldata recipients,
        uint256[] calldata amounts
    ) external nonReentrant {
        uint256 length = recipients.length;
        
        // Input validation
        if (length == 0) revert InvalidInput();
        if (length > MAX_RECIPIENTS) revert TooManyRecipients();
        if (length != amounts.length) revert LengthMismatch();

        uint256 totalAmount;
        for (uint256 i; i < length;) {
            if (recipients[i] == address(0) || amounts[i] == 0) revert InvalidInput();
            totalAmount += amounts[i];
            unchecked { ++i; }
        }

        _handleUSDTTransfer(totalAmount, recipients, amounts);
    }

    /**
     * @notice Claim failed USDT transfers
     */
    function claimFailedTransfer() external nonReentrant {
        uint256 amount = failedTransfers[msg.sender];
        if (amount == 0) revert InvalidInput();

        failedTransfers[msg.sender] = 0;

        try usdtToken.transfer(msg.sender, amount) returns (bool success) {
            if (success) {
                emit FailedTransferClaimed(msg.sender, address(usdtToken), amount);
            } else {
                failedTransfers[msg.sender] = amount; // Restore balance
                revert TransferError();
            }
        } catch {
            failedTransfers[msg.sender] = amount; // Restore balance
            revert TransferError();
        }
    }

    /**
     * @dev Handle USDT transfers with failure isolation
     */
    function _handleUSDTTransfer(
        uint256 totalAmount,
        address[] calldata recipients,
        uint256[] calldata amounts
    ) private {
        uint256 allowance = usdtToken.allowance(msg.sender, address(this));
        if (allowance < totalAmount) revert InsufficientAllowance();

        // Transfer total amount to contract first
        usdtToken.safeTransferFrom(msg.sender, address(this), totalAmount);

        uint256 successCount = 0;
        uint256 failCount = 0;

        for (uint256 i; i < recipients.length;) {
            if (_attemptUSDTTransfer(recipients[i], amounts[i])) {
                successCount++;
            } else {
                failCount++;
                failedTransfers[recipients[i]] += amounts[i];
                emit TransferFailed(recipients[i], address(usdtToken), amounts[i]);
            }
            unchecked { ++i; }
        }

        emit BulkTransferExecuted(msg.sender, address(usdtToken), recipients.length, totalAmount, successCount, failCount);
    }

    /**
     * @dev Attempt USDT transfer
     */
    function _attemptUSDTTransfer(
        address recipient,
        uint256 amount
    ) internal returns (bool success) {
        try usdtToken.transfer(recipient, amount) {
            success = true;
        } catch {
            success = false;
        }
    }

    /**
     * @notice Get failed transfer amount for a recipient
     */
    function getFailedAmount(address recipient) external view returns (uint256) {
        return failedTransfers[recipient];
    }

    /**
     * @notice Emergency withdrawal for owner (only failed transfers)
     */
    function emergencyWithdraw() external onlyOwner {
        uint256 balance = usdtToken.balanceOf(address(this));
        if (balance > 0) {
            usdtToken.safeTransfer(owner(), balance);
        }
    }
}
