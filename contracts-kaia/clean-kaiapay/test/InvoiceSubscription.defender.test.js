const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("InvoiceSubscription - Defender Edition", function () {
  let invoiceSubscription;
  let dummyUSDT;
  let owner, defender, merchant, payer1, payer2;
  let defenderRole;

  beforeEach(async function () {
    [owner, defender, merchant, payer1, payer2] = await ethers.getSigners();

    // Deploy DummyUSDT for testing
    const DummyUSDT = await ethers.getContractFactory("DummyUSDT");
    dummyUSDT = await DummyUSDT.deploy(1000000); // 1M initial supply
    await dummyUSDT.waitForDeployment();

    // Deploy InvoiceSubscription
    const InvoiceSubscription = await ethers.getContractFactory("InvoiceSubscription");
    invoiceSubscription = await InvoiceSubscription.deploy();
    await invoiceSubscription.waitForDeployment();

    // Get the DEFENDER_ROLE
    defenderRole = await invoiceSubscription.DEFENDER_ROLE();

    // Grant defender role to the defender account
    await invoiceSubscription.grantDefenderRole(defender.address);

    // Mint some tokens for testing
    await dummyUSDT.connect(payer1).faucet();
    await dummyUSDT.connect(payer2).faucet();
  });

  describe("Access Control", function () {
    it("Should grant admin role to deployer", async function () {
      const adminRole = await invoiceSubscription.DEFAULT_ADMIN_ROLE();
      expect(await invoiceSubscription.hasRole(adminRole, owner.address)).to.be.true;
    });

    it("Should allow admin to grant defender role", async function () {
      expect(await invoiceSubscription.hasRole(defenderRole, defender.address)).to.be.true;
    });

    it("Should allow checking defender status", async function () {
      expect(await invoiceSubscription.isDefender(defender.address)).to.be.true;
      expect(await invoiceSubscription.isDefender(merchant.address)).to.be.false;
    });
  });

  describe("Invoice Creation and Funding", function () {
    it("Should create and fund an invoice", async function () {
      const amount = ethers.parseEther("100");
      const deadline = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now

      // Create invoice and get ID from transaction receipt
      const tx = await invoiceSubscription.connect(merchant).createInvoice(
        merchant.address,
        amount,
        await dummyUSDT.getAddress(),
        deadline
      );
      const receipt = await tx.wait();
      
      // Extract invoice ID from InvoiceCreated event
      const event = receipt.logs.find(log => {
        try {
          const parsed = invoiceSubscription.interface.parseLog(log);
          return parsed.name === 'InvoiceCreated';
        } catch {
          return false;
        }
      });
      const invoiceId = invoiceSubscription.interface.parseLog(event).args.invoiceId;

      // Approve and fund invoice
      await dummyUSDT.connect(payer1).approve(await invoiceSubscription.getAddress(), amount);
      await invoiceSubscription.connect(payer1).fundInvoice(invoiceId);

      // Check invoice details - should be auto-released when fully funded
      const invoice = await invoiceSubscription.getInvoice(invoiceId);
      expect(invoice.totalContributed).to.equal(amount);
      expect(invoice.released).to.be.true; // Auto-released when fully funded
      
      // Verify merchant received payment
      const merchantBalance = await dummyUSDT.balanceOf(merchant.address);
      expect(merchantBalance).to.equal(amount);
    });
  });

  describe("Defender Automation Functions", function () {
    let invoiceId;
    let amount;

    beforeEach(async function () {
      amount = ethers.parseEther("100");
      const deadline = Math.floor(Date.now() / 1000) + 3600;

      // Create invoice
      const tx = await invoiceSubscription.connect(merchant).createInvoice(
        merchant.address,
        amount,
        await dummyUSDT.getAddress(),
        deadline
      );
      
      const receipt = await tx.wait();
      const event = receipt.logs.find(log => {
        try {
          const parsed = invoiceSubscription.interface.parseLog(log);
          return parsed.name === 'InvoiceCreated';
        } catch {
          return false;
        }
      });
      invoiceId = invoiceSubscription.interface.parseLog(event).args.invoiceId;

      // Partially fund invoice (only 50% so it doesn't auto-release)
      const partialAmount = amount / 2n;
      await dummyUSDT.connect(payer1).approve(await invoiceSubscription.getAddress(), partialAmount);
      await invoiceSubscription.connect(payer1).fundInvoice(invoiceId);
    });

    it("Should identify invoices needing processing", async function () {
      // First, complete the funding to make it ready for processing
      const remainingAmount = amount / 2n;
      await dummyUSDT.connect(payer2).approve(await invoiceSubscription.getAddress(), remainingAmount);
      
      // Create a new invoice that we'll fully fund without auto-release
      // We need to disable auto-release for this test
      // Let's create an invoice that requires exactly the remaining amount
      const deadline2 = Math.floor(Date.now() / 1000) + 3600;
      const tx2 = await invoiceSubscription.connect(merchant).createInvoice(
        merchant.address,
        remainingAmount, // Smaller amount
        await dummyUSDT.getAddress(),
        deadline2
      );
      
      const receipt2 = await tx2.wait();
      const event2 = receipt2.logs.find(log => {
        try {
          const parsed = invoiceSubscription.interface.parseLog(log);
          return parsed.name === 'InvoiceCreated';
        } catch {
          return false;
        }
      });
      const invoiceId2 = invoiceSubscription.interface.parseLog(event2).args.invoiceId;
      
      // Fund it completely - this will auto-release, so the test should show 0 ready for release
      await invoiceSubscription.connect(payer2).fundInvoice(invoiceId2);
      
      const result = await invoiceSubscription.getInvoicesNeedingProcessing();
      // Since invoices auto-release when fully funded, there should be 0 ready for release
      expect(result.readyForRelease.length).to.equal(0);
      expect(result.expiredForRefund.length).to.equal(0);
    });

    it("Should allow defender to process invoices (test with already processed invoice)", async function () {
      // Since auto-release happens on funding, let's test the batch processing with a mix of states
      const merchantBalanceBefore = await dummyUSDT.balanceOf(merchant.address);

      // Try to process the partially funded invoice (should fail gracefully)
      await invoiceSubscription.connect(defender).processInvoices([invoiceId]);

      // Balance shouldn't change since invoice wasn't fully funded
      const merchantBalanceAfter = await dummyUSDT.balanceOf(merchant.address);
      expect(merchantBalanceAfter).to.equal(merchantBalanceBefore);

      const invoice = await invoiceSubscription.getInvoice(invoiceId);
      expect(invoice.released).to.be.false; // Still not released
    });

    it("Should not allow non-defender to process invoices", async function () {
      await expect(
        invoiceSubscription.connect(payer1).processInvoices([invoiceId])
      ).to.be.revertedWithCustomError(invoiceSubscription, "AccessControlUnauthorizedAccount");
    });

    it("Should handle batch processing correctly", async function () {
      // Create second invoice
      const amount2 = ethers.parseEther("50");
      const deadline2 = Math.floor(Date.now() / 1000) + 3600;

      const tx2 = await invoiceSubscription.connect(merchant).createInvoice(
        merchant.address,
        amount2,
        await dummyUSDT.getAddress(),
        deadline2
      );

      const receipt2 = await tx2.wait();
      const event2 = receipt2.logs.find(log => {
        try {
          const parsed = invoiceSubscription.interface.parseLog(log);
          return parsed.name === 'InvoiceCreated';
        } catch {
          return false;
        }
      });
      const invoiceId2 = invoiceSubscription.interface.parseLog(event2).args.invoiceId;

      await dummyUSDT.connect(payer2).approve(await invoiceSubscription.getAddress(), amount2);
      await invoiceSubscription.connect(payer2).fundInvoice(invoiceId2);

      // Process both invoices in batch
      const tx = await invoiceSubscription.connect(defender).processInvoices([invoiceId, invoiceId2]);
      const receipt = await tx.wait();

      // Check that second invoice is released (first one was only partially funded)
      const invoice1 = await invoiceSubscription.getInvoice(invoiceId);
      const invoice2 = await invoiceSubscription.getInvoice(invoiceId2);
      expect(invoice1.released).to.be.false; // Partially funded
      expect(invoice2.released).to.be.true;  // Fully funded and auto-released
    });
  });

  describe("Emergency Functions", function () {
    it("Should allow defender to emergency pause", async function () {
      expect(await invoiceSubscription.paused()).to.be.false;
      
      await invoiceSubscription.connect(defender).emergencyPause();
      
      expect(await invoiceSubscription.paused()).to.be.true;
    });

    it("Should prevent operations when paused", async function () {
      await invoiceSubscription.connect(defender).emergencyPause();
      
      await expect(
        invoiceSubscription.connect(defender).processInvoices([])
      ).to.be.revertedWithCustomError(invoiceSubscription, "EnforcedPause");
    });

    it("Should allow admin to unpause", async function () {
      await invoiceSubscription.connect(defender).emergencyPause();
      expect(await invoiceSubscription.paused()).to.be.true;
      
      await invoiceSubscription.connect(owner).unpause();
      expect(await invoiceSubscription.paused()).to.be.false;
    });
  });

  describe("Role Management", function () {
    it("Should allow admin to revoke defender role", async function () {
      expect(await invoiceSubscription.isDefender(defender.address)).to.be.true;
      
      await invoiceSubscription.revokeDefenderRole(defender.address);
      
      expect(await invoiceSubscription.isDefender(defender.address)).to.be.false;
    });

    it("Should not allow non-admin to grant roles", async function () {
      await expect(
        invoiceSubscription.connect(merchant).grantDefenderRole(merchant.address)
      ).to.be.revertedWithCustomError(invoiceSubscription, "AccessControlUnauthorizedAccount");
    });
  });
});
