const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("InvoiceSubscriptionService Contract", function () {
  let InvoiceSubscription, invoiceSubscription;
  let DummyUSDT, dummyUSDT;
  let owner, seller, buyer, contributor1, contributor2, feeCollector;

  beforeEach(async function () {
    // Get signers
    [owner, seller, buyer, contributor1, contributor2, feeCollector] = await ethers.getSigners();

    // Deploy DummyUSDT
    const DummyUSDTFactory = await ethers.getContractFactory("DummyUSDT");
    dummyUSDT = await DummyUSDTFactory.deploy(1000000); // 1M tokens
    await dummyUSDT.waitForDeployment();

    // Deploy InvoiceSubscription
    const InvoiceSubscriptionFactory = await ethers.getContractFactory("InvoiceSubscriptionService");
    invoiceSubscription = await InvoiceSubscriptionFactory.deploy(feeCollector.address);
    await invoiceSubscription.waitForDeployment();

    // Get some test tokens
    await dummyUSDT.connect(buyer).faucet();
    await dummyUSDT.connect(contributor1).faucet();
    await dummyUSDT.connect(contributor2).faucet();
  });

  describe("Contract Deployment", function () {
    it("Should set correct fee collector and platform fee", async function () {
      expect(await invoiceSubscription.feeCollector()).to.equal(feeCollector.address);
      expect(await invoiceSubscription.platformFeeRate()).to.equal(250); // 2.5%
    });
  });

  describe("Service Listing", function () {
    it("Should allow seller to list a service", async function () {
      const serviceName = "Web Development";
      const description = "Professional web development services";
      const imageUrl = "https://example.com/image.jpg";
      const price = ethers.parseEther("100"); // 100 DUSDT
      
      const tx = await invoiceSubscription.connect(seller).listService(
        serviceName,
        description,
        imageUrl,
        price,
        await dummyUSDT.getAddress()
      );

      await expect(tx)
        .to.emit(invoiceSubscription, "ServiceListed")
        .withArgs(1, seller.address, serviceName, price, await dummyUSDT.getAddress());

      const service = await invoiceSubscription.getService(1);
      expect(service.serviceName).to.equal(serviceName);
      expect(service.seller).to.equal(seller.address);
      expect(service.priceInWei).to.equal(price);
      expect(service.isActive).to.be.true;
    });

    it("Should fail with empty service name", async function () {
      await expect(
        invoiceSubscription.connect(seller).listService(
          "",
          "Description",
          "image.jpg",
          ethers.parseEther("100"),
          await dummyUSDT.getAddress()
        )
      ).to.be.revertedWith("Service name required");
    });

    it("Should fail with zero price", async function () {
      await expect(
        invoiceSubscription.connect(seller).listService(
          "Service Name",
          "Description",
          "image.jpg",
          0,
          await dummyUSDT.getAddress()
        )
      ).to.be.revertedWith("Price must be greater than 0");
    });
  });

  describe("Invoice Creation", function () {
    let serviceId;

    beforeEach(async function () {
      // Create a service first
      await invoiceSubscription.connect(seller).listService(
        "Web Development",
        "Professional web development services",
        "https://example.com/image.jpg",
        ethers.parseEther("100"),
        await dummyUSDT.getAddress()
      );
      serviceId = 1;
    });

    it("Should create an invoice when purchasing service", async function () {
      const tx = await invoiceSubscription.connect(buyer).purchaseService(
        serviceId,
        false, // No split payment
        7 // 7 days until due
      );

      const receipt = await tx.wait();
      const event = receipt.logs.find(log => {
        try {
          const parsed = invoiceSubscription.interface.parseLog(log);
          return parsed && parsed.name === 'InvoiceCreated';
        } catch {
          return false;
        }
      });

      expect(event).to.not.be.undefined;
      const invoiceId = 1;

      const invoice = await invoiceSubscription.getInvoice(invoiceId);
      expect(invoice.serviceId).to.equal(serviceId);
      expect(invoice.seller).to.equal(seller.address);
      expect(invoice.buyer).to.equal(buyer.address);
      expect(invoice.subtotal).to.equal(ethers.parseEther("100"));
      expect(invoice.platformFee).to.equal(ethers.parseEther("2.5")); // 2.5% of 100
      expect(invoice.totalAmount).to.equal(ethers.parseEther("102.5"));
    });

    it("Should fail when buying own service", async function () {
      await expect(
        invoiceSubscription.connect(seller).purchaseService(serviceId, false, 7)
      ).to.be.revertedWith("Cannot buy own service");
    });

    it("Should fail with invalid due date", async function () {
      await expect(
        invoiceSubscription.connect(buyer).purchaseService(serviceId, false, 0)
      ).to.be.revertedWith("Due date must be 1-90 days");

      await expect(
        invoiceSubscription.connect(buyer).purchaseService(serviceId, false, 91)
      ).to.be.revertedWith("Due date must be 1-90 days");
    });
  });

  describe("Invoice Payment", function () {
    let serviceId, invoiceId;

    beforeEach(async function () {
      // Create service and invoice
      await invoiceSubscription.connect(seller).listService(
        "Web Development",
        "Professional services",
        "image.jpg",
        ethers.parseEther("100"),
        await dummyUSDT.getAddress()
      );
      serviceId = 1;

      await invoiceSubscription.connect(buyer).purchaseService(serviceId, false, 7);
      invoiceId = 1;
    });

    it("Should allow buyer to pay invoice", async function () {
      const invoice = await invoiceSubscription.getInvoice(invoiceId);
      const totalAmount = invoice.totalAmount;

      // Approve tokens
      await dummyUSDT.connect(buyer).approve(
        await invoiceSubscription.getAddress(),
        totalAmount
      );

      const sellerBalanceBefore = await dummyUSDT.balanceOf(seller.address);
      const feeCollectorBalanceBefore = await dummyUSDT.balanceOf(feeCollector.address);

      const tx = await invoiceSubscription.connect(buyer).payInvoice(invoiceId);
      
      await expect(tx)
        .to.emit(invoiceSubscription, "InvoicePayment")
        .withArgs(invoiceId, buyer.address, totalAmount, 2); // FULLY_PAID = 2

      const updatedInvoice = await invoiceSubscription.getInvoice(invoiceId);
      expect(updatedInvoice.status).to.equal(2); // FULLY_PAID

      const sellerBalanceAfter = await dummyUSDT.balanceOf(seller.address);
      const feeCollectorBalanceAfter = await dummyUSDT.balanceOf(feeCollector.address);

      expect(sellerBalanceAfter - sellerBalanceBefore).to.equal(ethers.parseEther("100"));
      expect(feeCollectorBalanceAfter - feeCollectorBalanceBefore).to.equal(ethers.parseEther("2.5"));
    });
  });

  describe("Split Payment", function () {
    let serviceId, invoiceId;

    beforeEach(async function () {
      // Create service and invoice with split payment enabled
      await invoiceSubscription.connect(seller).listService(
        "Web Development",
        "Professional services",
        "image.jpg",
        ethers.parseEther("100"),
        await dummyUSDT.getAddress()
      );
      serviceId = 1;

      await invoiceSubscription.connect(buyer).purchaseService(
        serviceId, 
        true, // Enable split payment
        7
      );
      invoiceId = 1;
    });

    it("Should allow multiple contributors to split payment", async function () {
      const invoice = await invoiceSubscription.getInvoice(invoiceId);
      expect(invoice.allowsSplitPayment).to.be.true;

      // First contributor pays 50 DUSDT
      await dummyUSDT.connect(contributor1).approve(
        await invoiceSubscription.getAddress(),
        ethers.parseEther("50")
      );
      
      await invoiceSubscription.connect(contributor1).contributeToSplitPayment(
        invoiceId,
        ethers.parseEther("50")
      );

      let updatedInvoice = await invoiceSubscription.getInvoice(invoiceId);
      expect(updatedInvoice.status).to.equal(1); // PARTIALLY_PAID

      // Second contributor pays remaining amount
      await dummyUSDT.connect(contributor2).approve(
        await invoiceSubscription.getAddress(),
        ethers.parseEther("52.5")
      );

      const tx = await invoiceSubscription.connect(contributor2).contributeToSplitPayment(
        invoiceId,
        ethers.parseEther("52.5")
      );

      await expect(tx).to.emit(invoiceSubscription, "InvoicePayment");

      updatedInvoice = await invoiceSubscription.getInvoice(invoiceId);
      expect(updatedInvoice.status).to.equal(2); // FULLY_PAID

      // Check split payment details
      const splitDetails = await invoiceSubscription.getSplitPaymentDetails(invoiceId);
      expect(splitDetails.contributorCount).to.equal(2);
      expect(splitDetails.totalCollected).to.equal(ethers.parseEther("102.5"));
    });
  });

  describe("Coupon and Discount", function () {
    let serviceId, invoiceId;

    beforeEach(async function () {
      await invoiceSubscription.connect(seller).listService(
        "Web Development",
        "Professional services", 
        "image.jpg",
        ethers.parseEther("100"),
        await dummyUSDT.getAddress()
      );
      serviceId = 1;

      await invoiceSubscription.connect(buyer).purchaseService(serviceId, false, 7);
      invoiceId = 1;
    });

    it("Should allow seller to apply discount", async function () {
      const discountAmount = ethers.parseEther("10");
      
      await invoiceSubscription.connect(seller).applyCouponDiscount(invoiceId, discountAmount);

      const updatedInvoice = await invoiceSubscription.getInvoice(invoiceId);
      expect(updatedInvoice.discount).to.equal(discountAmount);
      expect(updatedInvoice.totalAmount).to.equal(ethers.parseEther("92.5")); // 100 - 10 + 2.5 fee
    });

    it("Should fail if non-seller tries to apply discount", async function () {
      await expect(
        invoiceSubscription.connect(buyer).applyCouponDiscount(invoiceId, ethers.parseEther("10"))
      ).to.be.revertedWith("Only seller can apply discount");
    });
  });

  describe("ETH Payments", function () {
    let serviceId, invoiceId;

    beforeEach(async function () {
      // Create service with ETH payment
      await invoiceSubscription.connect(seller).listService(
        "Web Development",
        "Professional services",
        "image.jpg", 
        ethers.parseEther("1"), // 1 ETH
        ethers.ZeroAddress // ETH payment
      );
      serviceId = 1;

      await invoiceSubscription.connect(buyer).purchaseService(serviceId, false, 7);
      invoiceId = 1;
    });

    it("Should allow ETH payment", async function () {
      const invoice = await invoiceSubscription.getInvoice(invoiceId);
      const sellerBalanceBefore = await ethers.provider.getBalance(seller.address);
      
      const tx = await invoiceSubscription.connect(buyer).payInvoice(invoiceId, {
        value: invoice.totalAmount
      });

      const sellerBalanceAfter = await ethers.provider.getBalance(seller.address);
      expect(sellerBalanceAfter - sellerBalanceBefore).to.equal(ethers.parseEther("1"));
    });
  });

  describe("Admin Functions", function () {
    it("Should allow owner to update platform fee", async function () {
      await invoiceSubscription.connect(owner).updatePlatformFee(500); // 5%
      expect(await invoiceSubscription.platformFeeRate()).to.equal(500);
    });

    it("Should fail if fee exceeds 10%", async function () {
      await expect(
        invoiceSubscription.connect(owner).updatePlatformFee(1001)
      ).to.be.revertedWith("Fee cannot exceed 10%");
    });

    it("Should allow owner to update fee collector", async function () {
      const newCollector = contributor1.address;
      await invoiceSubscription.connect(owner).updateFeeCollector(newCollector);
      expect(await invoiceSubscription.feeCollector()).to.equal(newCollector);
    });
  });

  describe("View Functions", function () {
    it("Should return seller services", async function () {
      await invoiceSubscription.connect(seller).listService(
        "Service 1", "Desc 1", "img1.jpg", ethers.parseEther("100"), await dummyUSDT.getAddress()
      );
      await invoiceSubscription.connect(seller).listService(
        "Service 2", "Desc 2", "img2.jpg", ethers.parseEther("200"), await dummyUSDT.getAddress()
      );

      const sellerServices = await invoiceSubscription.getSellerServices(seller.address);
      expect(sellerServices.length).to.equal(2);
      expect(sellerServices[0]).to.equal(1);
      expect(sellerServices[1]).to.equal(2);
    });

    it("Should return buyer invoices", async function () {
      await invoiceSubscription.connect(seller).listService(
        "Service 1", "Desc 1", "img1.jpg", ethers.parseEther("100"), await dummyUSDT.getAddress()
      );
      
      await invoiceSubscription.connect(buyer).purchaseService(1, false, 7);

      const buyerInvoices = await invoiceSubscription.getBuyerInvoices(buyer.address);
      expect(buyerInvoices.length).to.equal(1);
      expect(buyerInvoices[0]).to.equal(1);
    });
  });
});
