const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("InvoiceSubscriptionService", function () {
    let invoiceService;
    let testToken;
    let owner;
    let seller;
    let buyer;
    let feeCollector;
    let user1;
    let user2;

    const PLATFORM_FEE_RATE = 250; // 2.5%
    const SERVICE_PRICE = ethers.parseUnits("100", 18);

    beforeEach(async function () {
        [owner, seller, buyer, feeCollector, user1, user2] = await ethers.getSigners();
        
        // Deploy USDT token
        const TokenFactory = await ethers.getContractFactory("MyDummyTokenWithFaucet");
        testToken = await TokenFactory.deploy("Test USDT", "USDT", 1000000);
        await testToken.waitForDeployment();
        
        // Deploy InvoiceSubscriptionService
        const InvoiceServiceFactory = await ethers.getContractFactory("InvoiceSubscriptionService");
        invoiceService = await InvoiceServiceFactory.deploy(await testToken.getAddress(), feeCollector.address);
        await invoiceService.waitForDeployment();

        // Give buyers some tokens and approve
        await testToken.mint(buyer.address, ethers.parseUnits("1000", 18));
        await testToken.mint(user1.address, ethers.parseUnits("1000", 18));
        await testToken.mint(user2.address, ethers.parseUnits("1000", 18));
        
        await testToken.connect(buyer).approve(await invoiceService.getAddress(), ethers.parseUnits("1000", 18));
        await testToken.connect(user1).approve(await invoiceService.getAddress(), ethers.parseUnits("1000", 18));
        await testToken.connect(user2).approve(await invoiceService.getAddress(), ethers.parseUnits("1000", 18));
    });

    describe("Deployment", function () {
        it("Should set the right owner and fee collector", async function () {
            expect(await invoiceService.owner()).to.equal(owner.address);
            expect(await invoiceService.feeCollector()).to.equal(feeCollector.address);
            expect(await invoiceService.platformFeeRate()).to.equal(PLATFORM_FEE_RATE);
            expect(await invoiceService.usdtToken()).to.equal(await testToken.getAddress());
        });
    });

    describe("Service Listing", function () {
        it("Should allow users to list services", async function () {
            await expect(invoiceService.connect(seller).listService(
                "Web Development",
                "Full stack web development service",
                "https://example.com/image.jpg",
                SERVICE_PRICE
            )).to.emit(invoiceService, "ServiceListed")
            .withArgs(1, seller.address, "Web Development", SERVICE_PRICE);

            const service = await invoiceService.getService(1);
            expect(service.serviceName).to.equal("Web Development");
            expect(service.seller).to.equal(seller.address);
            expect(service.priceInWei).to.equal(SERVICE_PRICE);
            expect(service.isActive).to.equal(true);
        });

        it("Should revert with empty service name", async function () {
            await expect(invoiceService.connect(seller).listService(
                "",
                "Description",
                "https://example.com/image.jpg",
                SERVICE_PRICE
            )).to.be.revertedWith("Service name required");
        });

        it("Should revert with zero price", async function () {
            await expect(invoiceService.connect(seller).listService(
                "Service",
                "Description",
                "https://example.com/image.jpg",
                0
            )).to.be.revertedWith("Price must be greater than 0");
        });

        it("Should allow seller to update service status", async function () {
            await invoiceService.connect(seller).listService(
                "Web Development",
                "Description",
                "https://example.com/image.jpg",
                SERVICE_PRICE
            );

            await invoiceService.connect(seller).updateServiceStatus(1, false);
            
            const service = await invoiceService.getService(1);
            expect(service.isActive).to.equal(false);
        });

        it("Should not allow non-seller to update service status", async function () {
            await invoiceService.connect(seller).listService(
                "Web Development",
                "Description",
                "https://example.com/image.jpg",
                SERVICE_PRICE
            );

            await expect(invoiceService.connect(user1).updateServiceStatus(1, false))
                .to.be.revertedWith("Only seller can update");
        });
    });

    describe("Invoice Creation", function () {
        let serviceId;

        beforeEach(async function () {
            await invoiceService.connect(seller).listService(
                "Web Development",
                "Full stack web development service",
                "https://example.com/image.jpg",
                SERVICE_PRICE
            );
            serviceId = 1;
        });

        it("Should create invoice for service purchase", async function () {
            const daysUntilDue = 7;
            
            await expect(invoiceService.connect(buyer).purchaseService(serviceId, false, daysUntilDue))
                .to.emit(invoiceService, "InvoiceCreated");

            const invoice = await invoiceService.getInvoice(1);
            expect(invoice.buyer).to.equal(buyer.address);
            expect(invoice.serviceId).to.equal(serviceId);
            expect(invoice.status).to.equal(0); // PENDING
        });

        it("Should not allow buying inactive service", async function () {
            await invoiceService.connect(seller).updateServiceStatus(serviceId, false);
            
            await expect(invoiceService.connect(buyer).purchaseService(serviceId, false, 7))
                .to.be.revertedWith("Service not active");
        });

        it("Should not allow seller to buy own service", async function () {
            await expect(invoiceService.connect(seller).purchaseService(serviceId, false, 7))
                .to.be.revertedWith("Cannot buy own service");
        });

        it("Should validate due date range", async function () {
            await expect(invoiceService.connect(buyer).purchaseService(serviceId, false, 0))
                .to.be.revertedWith("Due date must be 1-90 days");
                
            await expect(invoiceService.connect(buyer).purchaseService(serviceId, false, 366))
                .to.be.revertedWith("Due date must be 1-90 days");
        });
    });

    describe("Invoice Payment - USDT", function () {
        let serviceId;
        let invoiceId;

        beforeEach(async function () {
            await invoiceService.connect(seller).listService(
                "Web Development",
                "Description",
                "https://example.com/image.jpg",
                SERVICE_PRICE
            );
            serviceId = 1;
            
            await invoiceService.connect(buyer).purchaseService(serviceId, false, 7);
            invoiceId = 1;
        });

        it("Should pay invoice with USDT tokens", async function () {
            const invoiceBefore = await invoiceService.getInvoice(invoiceId);
            const sellerBalanceBefore = await testToken.balanceOf(seller.address);
            const feeCollectorBalanceBefore = await testToken.balanceOf(feeCollector.address);
            
            await expect(invoiceService.connect(buyer).payInvoice(invoiceId))
                .to.emit(invoiceService, "InvoicePayment");
            
            const invoiceAfter = await invoiceService.getInvoice(invoiceId);
            expect(invoiceAfter.status).to.equal(2); // FULLY_PAID
            
            const sellerBalanceAfter = await testToken.balanceOf(seller.address);
            const feeCollectorBalanceAfter = await testToken.balanceOf(feeCollector.address);
            
            expect(sellerBalanceAfter - sellerBalanceBefore).to.equal(SERVICE_PRICE);
            expect(feeCollectorBalanceAfter - feeCollectorBalanceBefore).to.equal(invoiceBefore.platformFee);
        });
    });

    describe("Admin Functions", function () {
        it("Should allow owner to update platform fee", async function () {
            const newFeeRate = 300; // 3%
            await invoiceService.connect(owner).updatePlatformFee(newFeeRate);
            expect(await invoiceService.platformFeeRate()).to.equal(newFeeRate);
        });

        it("Should not allow fee rate above 10%", async function () {
            await expect(invoiceService.connect(owner).updatePlatformFee(1001))
                .to.be.revertedWith("Fee cannot exceed 10%");
        });

        it("Should allow owner to update fee collector", async function () {
            await invoiceService.connect(owner).updateFeeCollector(user1.address);
            expect(await invoiceService.feeCollector()).to.equal(user1.address);
        });

        it("Should not allow zero address as fee collector", async function () {
            await expect(invoiceService.connect(owner).updateFeeCollector(ethers.ZeroAddress))
                .to.be.revertedWith("Invalid address");
        });
    });

    describe("View Functions", function () {
        it("Should return seller services", async function () {
            await invoiceService.connect(seller).listService(
                "Service 1",
                "Description 1",
                "https://example1.com",
                SERVICE_PRICE
            );
            
            await invoiceService.connect(seller).listService(
                "Service 2",
                "Description 2", 
                "https://example2.com",
                SERVICE_PRICE * 2n
            );

            const sellerServices = await invoiceService.getSellerServices(seller.address);
            expect(sellerServices.length).to.equal(2);
            expect(sellerServices[0]).to.equal(1);
            expect(sellerServices[1]).to.equal(2);
        });

        it("Should return buyer invoices", async function () {
            await invoiceService.connect(seller).listService(
                "Service",
                "Description",
                "https://example.com",
                SERVICE_PRICE
            );
            
            await invoiceService.connect(buyer).purchaseService(1, false, 7);

            const buyerInvoices = await invoiceService.getBuyerInvoices(buyer.address);
            expect(buyerInvoices.length).to.equal(1);
            expect(buyerInvoices[0]).to.equal(1);
        });
    });
});
