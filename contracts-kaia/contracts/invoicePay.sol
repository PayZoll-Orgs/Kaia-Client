// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract InvoiceSubscriptionService is ReentrancyGuard, Ownable {
    
    // ===================== STATE VARIABLES =====================
    
    uint256 private _serviceIds;
    uint256 private _invoiceIds;
    // Platform fee (in basis points, e.g., 250 = 2.5%)
    uint256 public platformFeeRate = 250;
    address public feeCollector;
    
    /// @dev The USDT token contract
    IERC20 public immutable usdtToken;

    constructor(address _usdtToken, address _feeCollector) Ownable(msg.sender) {
        require(_usdtToken != address(0), "Invalid USDT token address");
        require(_feeCollector != address(0), "Invalid fee collector address");
        usdtToken = IERC20(_usdtToken);
        feeCollector = _feeCollector;
    }
    
    // ===================== STRUCTS =====================
    
    struct ServiceListing {
        uint256 serviceId;
        address seller;
        string serviceName;
        string description;
        string imageUrl;
        uint256 priceInWei; // Price in USDT
        bool isActive;
        uint256 createdAt;
    }
    
    struct Invoice {
        uint256 invoiceId;
        uint256 serviceId;
        address seller;
        address buyer;
        string invoiceNumber; // Format: "INV-2024-001"
        uint256 issueDate;
        uint256 dueDate;
        uint256 subtotal;
        uint256 discount; // Discount amount
        uint256 platformFee;
        uint256 totalAmount;
        address paymentToken;
        InvoiceStatus status;
        string couponCode; // Generated coupon for buyer
        bool allowsSplitPayment;
        uint256 createdAt;
    }
    
    struct SplitPayment {
        uint256 invoiceId;
        address[] contributors;
        mapping(address => uint256) contributions;
        mapping(address => bool) hasPaid;
        uint256 totalCollected;
        uint256 contributorCount;
    }
    
    enum InvoiceStatus {
        PENDING,
        PARTIALLY_PAID,
        FULLY_PAID,
        OVERDUE,
        CANCELLED
    }
    
    // ===================== MAPPINGS =====================
    
    mapping(uint256 => ServiceListing) public services;
    mapping(uint256 => Invoice) public invoices;
    mapping(uint256 => SplitPayment) public splitPayments;
    mapping(string => bool) public usedCouponCodes;
    mapping(address => uint256[]) public sellerServices;
    mapping(address => uint256[]) public buyerInvoices;
    
    // ===================== EVENTS =====================
    
    event ServiceListed(
        uint256 indexed serviceId,
        address indexed seller,
        string serviceName,
        uint256 price
    );
    
    event InvoiceCreated(
        uint256 indexed invoiceId,
        uint256 indexed serviceId,
        address indexed buyer,
        address seller,
        uint256 totalAmount,
        string couponCode
    );
    
    event InvoicePayment(
        uint256 indexed invoiceId,
        address indexed payer,
        uint256 amount,
        InvoiceStatus newStatus
    );
    
    event SplitPaymentContribution(
        uint256 indexed invoiceId,
        address indexed contributor,
        uint256 amount
    );
    

    
    // ===================== SERVICE LISTING FUNCTIONS =====================
    
    function listService(
        string memory _serviceName,
        string memory _description,
        string memory _imageUrl,
        uint256 _priceInWei
    ) external returns (uint256) {
        require(bytes(_serviceName).length > 0, "Service name required");
        require(_priceInWei > 0, "Price must be greater than 0");
        
        _serviceIds++;
        uint256 newServiceId = _serviceIds;
        
        services[newServiceId] = ServiceListing({
            serviceId: newServiceId,
            seller: msg.sender,
            serviceName: _serviceName,
            description: _description,
            imageUrl: _imageUrl,
            priceInWei: _priceInWei,
            isActive: true,
            createdAt: block.timestamp
        });
        
        sellerServices[msg.sender].push(newServiceId);
        
        emit ServiceListed(newServiceId, msg.sender, _serviceName, _priceInWei);
        return newServiceId;
    }
    
    function updateServiceStatus(uint256 _serviceId, bool _isActive) external {
        require(services[_serviceId].seller == msg.sender, "Only seller can update");
        services[_serviceId].isActive = _isActive;
    }
    
    // ===================== INVOICE CREATION =====================
    
    function purchaseService(
        uint256 _serviceId,
        bool _allowSplitPayment,
        uint256 _daysUntilDue
    ) external returns (uint256) {
        ServiceListing memory service = services[_serviceId];
        require(service.isActive, "Service not active");
        require(service.seller != msg.sender, "Cannot buy own service");
        require(_daysUntilDue >= 1 && _daysUntilDue <= 90, "Due date must be 1-90 days");
        
        _invoiceIds++;
        uint256 newInvoiceId = _invoiceIds;
        uint256 platformFee = (service.priceInWei * platformFeeRate) / 10000;
        uint256 totalAmount = service.priceInWei + platformFee;
        
        // Generate unique invoice number
        string memory invoiceNumber = string(
            abi.encodePacked("INV-", _toString(block.timestamp / 86400), "-", _toString(newInvoiceId))
        );
        
        // Generate coupon code
        string memory couponCode = string(
            abi.encodePacked("COUPON-", _toString(newInvoiceId), "-", _toString(block.timestamp % 10000))
        );
        
        invoices[newInvoiceId] = Invoice({
            invoiceId: newInvoiceId,
            serviceId: _serviceId,
            seller: service.seller,
            buyer: msg.sender,
            invoiceNumber: invoiceNumber,
            issueDate: block.timestamp,
            dueDate: block.timestamp + (_daysUntilDue * 86400),
            subtotal: service.priceInWei,
            discount: 0,
            platformFee: platformFee,
            totalAmount: totalAmount,
            paymentToken: address(usdtToken),
            status: InvoiceStatus.PENDING,
            couponCode: couponCode,
            allowsSplitPayment: _allowSplitPayment,
            createdAt: block.timestamp
        });
        
        buyerInvoices[msg.sender].push(newInvoiceId);
        usedCouponCodes[couponCode] = true;
        
        // Initialize split payment if allowed
        if (_allowSplitPayment) {
            splitPayments[newInvoiceId].invoiceId = newInvoiceId;
        }
        
        emit InvoiceCreated(newInvoiceId, _serviceId, msg.sender, service.seller, totalAmount, couponCode);
        return newInvoiceId;
    }
    
    // ===================== PAYMENT FUNCTIONS =====================
    
    function payInvoice(uint256 _invoiceId) external payable nonReentrant {
        Invoice storage invoice = invoices[_invoiceId];
        require(invoice.status == InvoiceStatus.PENDING, "Invoice not pending");
        require(block.timestamp <= invoice.dueDate, "Invoice overdue");
        
        uint256 amountToPay = invoice.totalAmount;
        
        if (invoice.paymentToken == address(0)) {
            // ETH payment
            require(msg.value >= amountToPay, "Insufficient ETH");
            
            // Transfer to seller and fee collector
            payable(invoice.seller).transfer(invoice.subtotal - invoice.discount);
            payable(feeCollector).transfer(invoice.platformFee);
            
            // Refund excess
            if (msg.value > amountToPay) {
                payable(msg.sender).transfer(msg.value - amountToPay);
            }
        } else {
            // ERC20 payment
            IERC20 token = IERC20(invoice.paymentToken);
            require(token.transferFrom(msg.sender, invoice.seller, invoice.subtotal - invoice.discount), "Transfer to seller failed");
            require(token.transferFrom(msg.sender, feeCollector, invoice.platformFee), "Fee transfer failed");
        }
        
        invoice.status = InvoiceStatus.FULLY_PAID;
        
        emit InvoicePayment(_invoiceId, msg.sender, amountToPay, InvoiceStatus.FULLY_PAID);
    }
    
    // ===================== SPLIT PAYMENT FUNCTIONS =====================
    
    function contributeToSplitPayment(uint256 _invoiceId, uint256 _amount) external payable nonReentrant {
        Invoice storage invoice = invoices[_invoiceId];
        require(invoice.allowsSplitPayment, "Split payment not allowed");
        require(invoice.status == InvoiceStatus.PENDING || invoice.status == InvoiceStatus.PARTIALLY_PAID, "Invalid status");
        require(block.timestamp <= invoice.dueDate, "Invoice overdue");
        
        SplitPayment storage splitPayment = splitPayments[_invoiceId];
        require(!splitPayment.hasPaid[msg.sender], "Already contributed");
        
        uint256 contributionAmount;
        
        if (invoice.paymentToken == address(0)) {
            contributionAmount = msg.value;
            require(contributionAmount > 0, "Must send ETH");
        } else {
            contributionAmount = _amount;
            require(contributionAmount > 0, "Amount must be > 0");
            IERC20(invoice.paymentToken).transferFrom(msg.sender, address(this), contributionAmount);
        }
        
        // Update split payment tracking
        if (splitPayment.contributions[msg.sender] == 0) {
            splitPayment.contributors.push(msg.sender);
            splitPayment.contributorCount++;
        }
        
        splitPayment.contributions[msg.sender] += contributionAmount;
        splitPayment.totalCollected += contributionAmount;
        splitPayment.hasPaid[msg.sender] = true;
        
        // Check if invoice is fully paid
        if (splitPayment.totalCollected >= invoice.totalAmount) {
            invoice.status = InvoiceStatus.FULLY_PAID;
            
            // Transfer payments
            if (invoice.paymentToken == address(0)) {
                payable(invoice.seller).transfer(invoice.subtotal - invoice.discount);
                payable(feeCollector).transfer(invoice.platformFee);
                
                // Refund excess if any
                if (splitPayment.totalCollected > invoice.totalAmount) {
                    payable(msg.sender).transfer(splitPayment.totalCollected - invoice.totalAmount);
                }
            } else {
                IERC20 token = IERC20(invoice.paymentToken);
                token.transfer(invoice.seller, invoice.subtotal - invoice.discount);
                token.transfer(feeCollector, invoice.platformFee);
            }
            
            emit InvoicePayment(_invoiceId, msg.sender, contributionAmount, InvoiceStatus.FULLY_PAID);
        } else {
            invoice.status = InvoiceStatus.PARTIALLY_PAID;
            emit InvoicePayment(_invoiceId, msg.sender, contributionAmount, InvoiceStatus.PARTIALLY_PAID);
        }
        
        emit SplitPaymentContribution(_invoiceId, msg.sender, contributionAmount);
    }
    
    // ===================== COUPON FUNCTIONS =====================
    
    function applyCouponDiscount(uint256 _invoiceId, uint256 _discountAmount) external {
        Invoice storage invoice = invoices[_invoiceId];
        require(invoice.seller == msg.sender, "Only seller can apply discount");
        require(invoice.status == InvoiceStatus.PENDING, "Can only discount pending invoices");
        require(_discountAmount <= invoice.subtotal, "Discount too large");
        
        invoice.discount = _discountAmount;
        invoice.totalAmount = invoice.subtotal - _discountAmount + invoice.platformFee;
    }
    
    // ===================== VIEW FUNCTIONS =====================
    
    function getService(uint256 _serviceId) external view returns (ServiceListing memory) {
        return services[_serviceId];
    }
    
    function getInvoice(uint256 _invoiceId) external view returns (Invoice memory) {
        return invoices[_invoiceId];
    }
    
    function getSellerServices(address _seller) external view returns (uint256[] memory) {
        return sellerServices[_seller];
    }
    
    function getBuyerInvoices(address _buyer) external view returns (uint256[] memory) {
        return buyerInvoices[_buyer];
    }
    
    function getSplitPaymentDetails(uint256 _invoiceId) external view returns (
        address[] memory contributors,
        uint256 totalCollected,
        uint256 contributorCount
    ) {
        SplitPayment storage splitPayment = splitPayments[_invoiceId];
        return (splitPayment.contributors, splitPayment.totalCollected, splitPayment.contributorCount);
    }
    
    // ===================== ADMIN FUNCTIONS =====================
    
    function updatePlatformFee(uint256 _newFeeRate) external onlyOwner {
        require(_newFeeRate <= 1000, "Fee cannot exceed 10%"); // Max 10%
        platformFeeRate = _newFeeRate;
    }
    
    function updateFeeCollector(address _newFeeCollector) external onlyOwner {
        require(_newFeeCollector != address(0), "Invalid address");
        feeCollector = _newFeeCollector;
    }
    
    function markInvoiceOverdue(uint256 _invoiceId) external {
        Invoice storage invoice = invoices[_invoiceId];
        require(block.timestamp > invoice.dueDate, "Not yet overdue");
        require(invoice.status == InvoiceStatus.PENDING || invoice.status == InvoiceStatus.PARTIALLY_PAID, "Invalid status");
        
        invoice.status = InvoiceStatus.OVERDUE;
    }
    
    // ===================== UTILITY FUNCTIONS =====================
    
    function _toString(uint256 value) internal pure returns (string memory) {
        if (value == 0) {
            return "0";
        }
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }
}