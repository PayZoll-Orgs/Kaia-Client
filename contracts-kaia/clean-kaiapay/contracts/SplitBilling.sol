// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title SplitBilling  
 * @dev Contract for creating split bills where each person pays their own share directly to payee
 * @notice Allows creating split payment requests with direct payments - no funds held by contract
 * @notice Each payment is immediately transferred to the payee with on-chain verification
 */
contract SplitBilling is ReentrancyGuard {
    
    // Constants
    uint256 public constant MAX_RECIPIENTS = 20;
    uint256 public constant GAS_LIMIT = 50000;
    address public constant ETH_TOKEN = address(0);

    // Structs
    struct SplitRequest {
        address creator;
        address payee; // Who receives the money (can be creator or someone else)
        address token;
        uint256 totalAmount;
        uint256 totalPaid;
        uint256 deadline;
        bool cancelled;
        string description;
        address[] debtors;
        uint256[] amounts;
        mapping(address => uint256) owedAmounts;
        mapping(address => uint256) paidAmounts;
        mapping(address => bool) hasPaid;
    }

    // Storage
    mapping(uint256 => SplitRequest) public splitRequests;
    mapping(address => uint256[]) public userSplits; // Track splits per user
    uint256 public splitCounter;

    // Events
    event SplitCreated(
        uint256 indexed splitId,
        address indexed creator,
        address indexed payee,
        address token,
        uint256 totalAmount,
        uint256 deadline,
        string description,
        address[] debtors,
        uint256[] amounts
    );

    event PaymentMade(
        uint256 indexed splitId,
        address indexed payer,
        address token,
        uint256 amount,
        uint256 totalPaid
    );

    event SplitCompleted(
        uint256 indexed splitId,
        address indexed payee,
        address token,
        uint256 totalAmount
    );

    event SplitCancelled(
        uint256 indexed splitId,
        address indexed creator
    );

    event FundsWithdrawn(
        uint256 indexed splitId,
        address indexed payee,
        address token,
        uint256 amount
    );

    event DeadlineAlert(
        uint256 indexed splitId,
        address indexed debtor,
        uint256 amountOwed,
        uint256 deadline
    );

    // Custom errors
    error InvalidInput();
    error SplitNotFound();
    error SplitExpired();
    error SplitAlreadyCancelled();
    error AlreadyPaid();
    error InvalidAmount();
    error NotAuthorized();
    error TransferFailed();
    error SplitNotCompleted();

    /**
     * @dev Create a split payment request
     * @param payee Address who will receive the collected funds
     * @param debtors Array of addresses who owe money
     * @param amounts Array of amounts each debtor owes
     * @param token Token address (address(0) for ETH)
     * @param deadline Unix timestamp deadline for payments
     * @param description Description of the split bill
     */
    function createSplit(
        address payee,
        address[] calldata debtors,
        uint256[] calldata amounts,
        address token,
        uint256 deadline,
        string calldata description
    ) external returns (uint256 splitId) {
        // Input validation
        if (debtors.length == 0 || debtors.length > MAX_RECIPIENTS) revert InvalidInput();
        if (debtors.length != amounts.length) revert InvalidInput();
        if (deadline <= block.timestamp) revert InvalidInput();
        if (payee == address(0)) revert InvalidInput();
        
        // Calculate total amount and validate
        uint256 totalAmount = 0;
        for (uint256 i = 0; i < amounts.length; i++) {
            if (debtors[i] == address(0) || amounts[i] == 0) revert InvalidInput();
            totalAmount += amounts[i];
        }
        
        if (totalAmount == 0) revert InvalidAmount();

        // Create split request
        splitId = ++splitCounter;
        SplitRequest storage split = splitRequests[splitId];
        split.creator = msg.sender;
        split.payee = payee;
        split.token = token;
        split.totalAmount = totalAmount;
        split.deadline = deadline;
        split.description = description;
        split.debtors = debtors;
        split.amounts = amounts;
        
        // Set owed amounts for each debtor
        for (uint256 i = 0; i < debtors.length; i++) {
            split.owedAmounts[debtors[i]] = amounts[i];
            userSplits[debtors[i]].push(splitId);
        }

        // Also add to creator's tracking
        userSplits[msg.sender].push(splitId);

        emit SplitCreated(splitId, msg.sender, payee, token, totalAmount, deadline, description, debtors, amounts);
    }

    /**
     * @dev Pay your share of a split bill
     * @param splitId The ID of the split to pay
     */
    function payShare(uint256 splitId) external payable nonReentrant {
        if (splitId == 0 || splitId > splitCounter) revert SplitNotFound();
        
        SplitRequest storage split = splitRequests[splitId];
        if (split.cancelled) revert SplitAlreadyCancelled();
        if (block.timestamp > split.deadline) revert SplitExpired();
        if (split.hasPaid[msg.sender]) revert AlreadyPaid();
        
        uint256 owedAmount = split.owedAmounts[msg.sender];
        if (owedAmount == 0) revert InvalidInput(); // Not part of this split

        // Handle payment - DIRECT TRANSFER TO PAYEE
        if (split.token == ETH_TOKEN) {
            if (msg.value != owedAmount) revert InvalidAmount();
            // Send ETH directly to payee
            (bool success, ) = split.payee.call{value: owedAmount, gas: GAS_LIMIT}("");
            if (!success) revert TransferFailed();
        } else {
            // Transfer tokens directly to payee
            IERC20(split.token).transferFrom(msg.sender, split.payee, owedAmount);
        }

        // Update payment tracking
        split.paidAmounts[msg.sender] = owedAmount;
        split.hasPaid[msg.sender] = true;
        split.totalPaid += owedAmount;

        emit PaymentMade(splitId, msg.sender, split.token, owedAmount, split.totalPaid);

        // Check if split is now complete (no need to transfer, already done above)
        if (split.totalPaid == split.totalAmount) {
            emit SplitCompleted(splitId, split.payee, split.token, split.totalAmount);
        }
    }

    /**
     * @dev Pay someone else's share (useful for covering friends)
     * @param splitId The ID of the split
     * @param debtor Address of the person whose share you're paying
     */
    function payForSomeone(uint256 splitId, address debtor) external payable nonReentrant {
        if (splitId == 0 || splitId > splitCounter) revert SplitNotFound();
        
        SplitRequest storage split = splitRequests[splitId];
        if (split.cancelled) revert SplitAlreadyCancelled();
        if (block.timestamp > split.deadline) revert SplitExpired();
        if (split.hasPaid[debtor]) revert AlreadyPaid();
        
        uint256 owedAmount = split.owedAmounts[debtor];
        if (owedAmount == 0) revert InvalidInput();

        // Handle payment - DIRECT TRANSFER TO PAYEE
        if (split.token == ETH_TOKEN) {
            if (msg.value != owedAmount) revert InvalidAmount();
            // Send ETH directly to payee
            (bool success, ) = split.payee.call{value: owedAmount, gas: GAS_LIMIT}("");
            if (!success) revert TransferFailed();
        } else {
            // Transfer tokens directly to payee
            IERC20(split.token).transferFrom(msg.sender, split.payee, owedAmount);
        }

        // Update payment tracking
        split.paidAmounts[debtor] = owedAmount;
        split.hasPaid[debtor] = true;
        split.totalPaid += owedAmount;

        emit PaymentMade(splitId, debtor, split.token, owedAmount, split.totalPaid);

        // Check if split is now complete (no need to transfer, already done above)
        if (split.totalPaid == split.totalAmount) {
            emit SplitCompleted(splitId, split.payee, split.token, split.totalAmount);
        }
    }

    // Note: _completeSplit function removed as payments are now direct
    // Each payment goes directly to the payee, no funds held by contract

    /**
     * @dev Cancel a split (only creator, only if no payments made)
     * @param splitId The ID of the split to cancel
     */
    function cancelSplit(uint256 splitId) external {
        if (splitId == 0 || splitId > splitCounter) revert SplitNotFound();
        
        SplitRequest storage split = splitRequests[splitId];
        if (msg.sender != split.creator) revert NotAuthorized();
        if (split.totalPaid > 0) revert InvalidInput(); // Can't cancel if payments made
        
        split.cancelled = true;
        emit SplitCancelled(splitId, msg.sender);
    }

    /**
     * @dev Check for unpaid debtors after deadline
     * @param splitId The ID of the split to check
     */
    function checkOverduePayments(uint256 splitId) external {
        if (splitId == 0 || splitId > splitCounter) revert SplitNotFound();
        
        SplitRequest storage split = splitRequests[splitId];
        if (block.timestamp <= split.deadline) revert InvalidInput();
        
        for (uint256 i = 0; i < split.debtors.length; i++) {
            address debtor = split.debtors[i];
            if (!split.hasPaid[debtor]) {
                emit DeadlineAlert(splitId, debtor, split.owedAmounts[debtor], split.deadline);
            }
        }
    }

    // View Functions

    /**
     * @dev Get split details
     */
    function getSplitDetails(uint256 splitId) external view returns (
        address creator,
        address payee,
        address token,
        uint256 totalAmount,
        uint256 totalPaid,
        uint256 deadline,
        bool cancelled,
        string memory description,
        address[] memory debtors,
        uint256[] memory amounts
    ) {
        if (splitId == 0 || splitId > splitCounter) revert SplitNotFound();
        
        SplitRequest storage split = splitRequests[splitId];
        return (
            split.creator,
            split.payee,
            split.token,
            split.totalAmount,
            split.totalPaid,
            split.deadline,
            split.cancelled,
            split.description,
            split.debtors,
            split.amounts
        );
    }

    /**
     * @dev Check how much someone owes in a split
     */
    function getOwedAmount(uint256 splitId, address debtor) external view returns (uint256) {
        if (splitId == 0 || splitId > splitCounter) revert SplitNotFound();
        return splitRequests[splitId].owedAmounts[debtor];
    }

    /**
     * @dev Check if someone has paid their share
     */
    function hasPaid(uint256 splitId, address debtor) external view returns (bool) {
        if (splitId == 0 || splitId > splitCounter) revert SplitNotFound();
        return splitRequests[splitId].hasPaid[debtor];
    }

    /**
     * @dev Get how much someone has paid
     */
    function getPaidAmount(uint256 splitId, address debtor) external view returns (uint256) {
        if (splitId == 0 || splitId > splitCounter) revert SplitNotFound();
        return splitRequests[splitId].paidAmounts[debtor];
    }

    /**
     * @dev Get all splits for a user
     */
    function getUserSplits(address user) external view returns (uint256[] memory) {
        return userSplits[user];
    }

    /**
     * @dev Check if split is fully paid
     */
    function isSplitComplete(uint256 splitId) external view returns (bool) {
        if (splitId == 0 || splitId > splitCounter) revert SplitNotFound();
        SplitRequest storage split = splitRequests[splitId];
        return split.totalPaid == split.totalAmount;
    }

    // Accept ETH
    receive() external payable {}
}