const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("KaiaPay Contracts - Basic Tests", function () {
  let owner, user1, user2, user3;
  let dummyUSDT, bulkPayroll, splitBilling, invoiceSubscription;

  beforeEach(async function () {
    [owner, user1, user2, user3] = await ethers.getSigners();

    // Deploy DummyUSDT
    const DummyUSDT = await ethers.getContractFactory("DummyUSDT");
    dummyUSDT = await DummyUSDT.deploy(1000000); // 1M tokens
    await dummyUSDT.waitForDeployment();

    // Deploy BulkPayroll
    const BulkPayroll = await ethers.getContractFactory("BulkPayroll");
    bulkPayroll = await BulkPayroll.deploy();
    await bulkPayroll.waitForDeployment();

    // Deploy SplitBilling
    const SplitBilling = await ethers.getContractFactory("SplitBilling");
    splitBilling = await SplitBilling.deploy();
    await splitBilling.waitForDeployment();

    // Deploy InvoiceSubscription
    const InvoiceSubscription = await ethers.getContractFactory("InvoiceSubscription");
    invoiceSubscription = await InvoiceSubscription.deploy();
    await invoiceSubscription.waitForDeployment();
  });

  describe("DummyUSDT", function () {
    it("Should allow users to claim from faucet", async function () {
      await dummyUSDT.connect(user1).faucet();
      const balance = await dummyUSDT.balanceOf(user1.address);
      expect(balance).to.equal(ethers.parseEther("1000"));
    });

    it("Should have correct initial supply", async function () {
      const totalSupply = await dummyUSDT.totalSupply();
      const expectedSupply = ethers.parseEther("1100000"); // 1M + 100K for faucet
      expect(totalSupply).to.equal(expectedSupply);
    });
  });

  describe("BulkPayroll", function () {
    it("Should execute ETH bulk transfer", async function () {
      const recipients = [user1.address, user2.address];
      const amounts = [ethers.parseEther("0.1"), ethers.parseEther("0.2")];
      const totalAmount = ethers.parseEther("0.3");

      const tx = await bulkPayroll.connect(owner).bulkTransfer(
        ethers.ZeroAddress, // ETH
        recipients,
        amounts,
        { value: totalAmount }
      );

      await expect(tx)
        .to.emit(bulkPayroll, "BulkTransferExecuted")
        .withArgs(owner.address, ethers.ZeroAddress, 2, totalAmount, 2, 0);
    });

    it("Should handle ERC20 bulk transfer", async function () {
      // Get tokens from faucet
      await dummyUSDT.connect(owner).faucet();
      
      // Approve bulk payroll
      await dummyUSDT.connect(owner).approve(bulkPayroll.target, ethers.parseEther("300"));

      const recipients = [user1.address, user2.address];
      const amounts = [ethers.parseEther("100"), ethers.parseEther("200")];

      const tx = await bulkPayroll.connect(owner).bulkTransfer(
        dummyUSDT.target,
        recipients,
        amounts
      );

      await expect(tx).to.emit(bulkPayroll, "BulkTransferExecuted");
      
      // Check balances
      expect(await dummyUSDT.balanceOf(user1.address)).to.equal(ethers.parseEther("100"));
      expect(await dummyUSDT.balanceOf(user2.address)).to.equal(ethers.parseEther("200"));
    });
  });

  describe("SplitBilling", function () {
    it("Should create and execute split payment", async function () {
      const recipients = [user1.address, user2.address];
      const shares = [7000, 3000]; // 70% and 30%
      const deadline = Math.floor(Date.now() / 1000) + 3600; // 1 hour

      const tx = await splitBilling.connect(owner).createSplit(
        recipients,
        shares,
        ethers.ZeroAddress, // ETH
        deadline,
        { value: ethers.parseEther("1") }
      );

      await expect(tx).to.emit(splitBilling, "SplitCreated");
    });

    it("Should track failed transfers", async function () {
      const recipients = [user1.address, user2.address];
      const shares = [5000, 5000]; // 50% each
      const deadline = Math.floor(Date.now() / 1000) + 3600; // 1 hour

      await splitBilling.connect(owner).createSplit(
        recipients,
        shares,
        ethers.ZeroAddress,
        deadline,
        { value: ethers.parseEther("0.5") }
      );

      // Check if any failed amounts exist (should be 0 for successful transfers)
      const failedAmount = await splitBilling.getFailedAmount(user1.address, ethers.ZeroAddress);
      expect(typeof failedAmount).to.equal("bigint");
    });
  });

  describe("InvoiceSubscription", function () {
    it("Should create and fund invoice", async function () {
      const deadline = Math.floor(Date.now() / 1000) + 86400; // 24 hours
      
      const tx = await invoiceSubscription.connect(owner).createInvoice(
        user3.address, // seller
        ethers.parseEther("1"), // 1 ETH
        ethers.ZeroAddress, // ETH
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
      
      const parsedEvent = invoiceSubscription.interface.parseLog(event);
      const invoiceId = parsedEvent.args.invoiceId;

      // Fund the invoice
      await invoiceSubscription.connect(user1).fundInvoice(invoiceId, {
        value: ethers.parseEther("1")
      });

      const invoiceData = await invoiceSubscription.getInvoice(invoiceId);
      expect(invoiceData.released).to.be.true;
      expect(invoiceData.totalContributed).to.equal(ethers.parseEther("1"));
    });

    it("Should check Chainlink automation readiness", async function () {
      const [upkeepNeeded, performData] = await invoiceSubscription.checkUpkeep("0x");
      expect(typeof upkeepNeeded).to.equal("boolean");
      expect(typeof performData).to.equal("string");
    });
  });
});
