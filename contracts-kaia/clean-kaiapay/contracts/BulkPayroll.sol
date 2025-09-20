// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title BulkPayroll
 * @dev Enhanced bulk payment contract with failure isolation
 * @notice Handles bulk ETH and ERC20 transfers with individual failure handling
 */
contract BulkPayroll is ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;

    constructor() Ownable(msg.sender) {}

    /// @dev Maximum recipients per batch to prevent gas limit issues
    uint256 public constant MAX_RECIPIENTS = 200;
    
    /// @dev Gas limit for ETH transfers to prevent griefing
    uint256 public constant GAS_LIMIT = 50000;

    /// @dev Mapping for failed transfers: recipient => token => amount
    mapping(address => mapping(address => uint256)) public failedTransfers;

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
     * @notice Executes a bulk transfer of tokens/Native currency with failure isolation
     * @dev Failed transfers are stored for later claiming
     * @param token ERC20 token address or address(0) for Native currency
     * @param recipients Array of recipient addresses
     * @param amounts Array of corresponding transfer amounts
     */
    function bulkTransfer(
        address token,
        address[] calldata recipients,
        uint256[] calldata amounts
    ) external payable nonReentrant {
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

        if (token == address(0)) {
            _handleNativeTransfer(totalAmount, recipients, amounts);
        } else {
            _handleERC20Transfer(token, totalAmount, recipients, amounts);
        }
    }

    /**
     * @notice Claim failed transfers
     * @param token Token to claim (address(0) for ETH)
     */
    function claimFailedTransfer(address token) external nonReentrant {
        uint256 amount = failedTransfers[msg.sender][token];
        if (amount == 0) revert InvalidInput();

        failedTransfers[msg.sender][token] = 0;

        bool success = _attemptTransfer(msg.sender, token, amount);
        
        if (success) {
            emit FailedTransferClaimed(msg.sender, token, amount);
        } else {
            failedTransfers[msg.sender][token] = amount; // Restore balance
            revert TransferError();
        }
    }

    /**
     * @dev Handle native currency transfers with failure isolation
     */
    function _handleNativeTransfer(
        uint256 totalAmount,
        address[] calldata recipients,
        uint256[] calldata amounts
    ) private {
        if (msg.value < totalAmount) revert InsufficientBalance();

        uint256 successCount = 0;
        uint256 failCount = 0;

        for (uint256 i; i < recipients.length;) {
            if (_attemptTransfer(recipients[i], address(0), amounts[i])) {
                successCount++;
            } else {
                failCount++;
                failedTransfers[recipients[i]][address(0)] += amounts[i];
                emit TransferFailed(recipients[i], address(0), amounts[i]);
            }
            unchecked { ++i; }
        }

        emit BulkTransferExecuted(msg.sender, address(0), recipients.length, totalAmount, successCount, failCount);
        _refundExcessNative(totalAmount);
    }

    /**
     * @dev Handle ERC20 transfers with failure isolation
     */
    function _handleERC20Transfer(
        address token,
        uint256 totalAmount,
        address[] calldata recipients,
        uint256[] calldata amounts
    ) private {
        IERC20 tokenContract = IERC20(token);
        uint256 allowance = tokenContract.allowance(msg.sender, address(this));
        if (allowance < totalAmount) revert InsufficientAllowance();

        // Transfer total amount to contract first
        tokenContract.safeTransferFrom(msg.sender, address(this), totalAmount);

        uint256 successCount = 0;
        uint256 failCount = 0;

        for (uint256 i; i < recipients.length;) {
            if (_attemptTransfer(recipients[i], token, amounts[i])) {
                successCount++;
            } else {
                failCount++;
                failedTransfers[recipients[i]][token] += amounts[i];
                emit TransferFailed(recipients[i], token, amounts[i]);
            }
            unchecked { ++i; }
        }

        emit BulkTransferExecuted(msg.sender, token, recipients.length, totalAmount, successCount, failCount);
    }

    /**
     * @dev Attempt transfer with gas limit protection
     */
    function _attemptTransfer(
        address recipient,
        address token,
        uint256 amount
    ) internal returns (bool success) {
        if (token == address(0)) {
            (success, ) = recipient.call{value: amount, gas: GAS_LIMIT}("");
        } else {
            try IERC20(token).transfer(recipient, amount) {
                success = true;
            } catch {
                success = false;
            }
        }
    }

    /**
     * @dev Refund excess native currency
     */
    function _refundExcessNative(uint256 totalAmount) private {
        uint256 remainder = msg.value - totalAmount;
        if (remainder > 0) {
            (bool success,) = msg.sender.call{value: remainder, gas: GAS_LIMIT}("");
            if (!success) revert RefundFailed();
        }
    }

    /**
     * @notice Get failed transfer amount for a recipient
     */
    function getFailedAmount(address recipient, address token) external view returns (uint256) {
        return failedTransfers[recipient][token];
    }

    /**
     * @notice Emergency withdrawal for owner (only failed transfers)
     */
    function emergencyWithdraw(address token) external onlyOwner {
        if (token == address(0)) {
            payable(owner()).transfer(address(this).balance);
        } else {
            IERC20(token).safeTransfer(owner(), IERC20(token).balanceOf(address(this)));
        }
    }

    // Accept ETH
    receive() external payable {}
}
