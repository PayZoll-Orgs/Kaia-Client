const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SplitBilling Contract", function () {
  let SplitBilling, splitBilling;
  let DummyUSDT, dummyUSDT;
  let owner, creator, payee, debtor1, debtor2, debtor3, other;
  let addrs;

  const TOKEN_SUPPLY = ethers.parseEther("1000000"); // 1M tokens

  beforeEach(async function () {
    // Get signers
    [owner, creator, payee, debtor1, debtor2, debtor3, other, ...addrs] = await ethers.getSigners();

    // Deploy DummyUSDT with initial supply of 1M tokens
    const DummyUSDTFactory = await ethers.getContractFactory("DummyUSDT");
    dummyUSDT = await DummyUSDTFactory.deploy(1000000); // 1M tokens
    await dummyUSDT.waitForDeployment();

    // Deploy SplitBilling
    const SplitBillingFactory = await ethers.getContractFactory("SplitBilling");
    splitBilling = await SplitBillingFactory.deploy();
    await splitBilling.waitForDeployment();

    // Get some tokens for testing
    await dummyUSDT.connect(creator).faucet();
    await dummyUSDT.connect(debtor1).faucet();
    await dummyUSDT.connect(debtor2).faucet();
    await dummyUSDT.connect(debtor3).faucet();
  });

  describe("Contract Deployment", function () {
    it("Should set correct constants", async function () {
      expect(await splitBilling.MAX_RECIPIENTS()).to.equal(20);
      expect(await splitBilling.GAS_LIMIT()).to.equal(50000);
      expect(await splitBilling.ETH_TOKEN()).to.equal(ethers.ZeroAddress);
      expect(await splitBilling.splitCounter()).to.equal(0);
    });
  });

  describe("Creating Split Bills", function () {
    it("Should create a split bill successfully", async function () {
      const debtors = [debtor1.address, debtor2.address];
      const amounts = [ethers.parseEther("100"), ethers.parseEther("150")];
      const deadline = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
      const description = "Dinner at restaurant";

      const tx = await splitBilling.connect(creator).createSplit(
        payee.address,
        debtors,
        amounts,
        await dummyUSDT.getAddress(),
        deadline,
        description
      );

      await expect(tx)
        .to.emit(splitBilling, "SplitCreated")
        .withArgs(
          1,
          creator.address,
          payee.address,
          await dummyUSDT.getAddress(),
          ethers.parseEther("250"), // Total amount
          deadline,
          description,
          debtors,
          amounts
        );

      const splitDetails = await splitBilling.getSplitDetails(1);
      expect(splitDetails.creator).to.equal(creator.address);
      expect(splitDetails.payee).to.equal(payee.address);
      expect(splitDetails.totalAmount).to.equal(ethers.parseEther("250"));
      expect(splitDetails.totalPaid).to.equal(0);
      expect(splitDetails.cancelled).to.be.false;
      expect(splitDetails.description).to.equal(description);
    });

    it("Should fail with empty debtors array", async function () {
      const deadline = Math.floor(Date.now() / 1000) + 3600;
      
      await expect(
        splitBilling.connect(creator).createSplit(
          payee.address,
          [],
          [],
          await dummyUSDT.getAddress(),
          deadline,
          "Test"
        )
      ).to.be.revertedWithCustomError(splitBilling, "InvalidInput");
    });

    it("Should fail with mismatched debtors and amounts arrays", async function () {
      const debtors = [debtor1.address, debtor2.address];
      const amounts = [ethers.parseEther("100")]; // Only one amount for two debtors
      const deadline = Math.floor(Date.now() / 1000) + 3600;

      await expect(
        splitBilling.connect(creator).createSplit(
          payee.address,
          debtors,
          amounts,
          await dummyUSDT.getAddress(),
          deadline,
          "Test"
        )
      ).to.be.revertedWithCustomError(splitBilling, "InvalidInput");
    });

    it("Should fail with past deadline", async function () {
      const debtors = [debtor1.address];
      const amounts = [ethers.parseEther("100")];
      const pastDeadline = Math.floor(Date.now() / 1000) - 3600; // 1 hour ago

      await expect(
        splitBilling.connect(creator).createSplit(
          payee.address,
          debtors,
          amounts,
          await dummyUSDT.getAddress(),
          pastDeadline,
          "Test"
        )
      ).to.be.revertedWithCustomError(splitBilling, "InvalidInput");
    });

    it("Should fail with zero address payee", async function () {
      const debtors = [debtor1.address];
      const amounts = [ethers.parseEther("100")];
      const deadline = Math.floor(Date.now() / 1000) + 3600;

      await expect(
        splitBilling.connect(creator).createSplit(
          ethers.ZeroAddress,
          debtors,
          amounts,
          await dummyUSDT.getAddress(),
          deadline,
          "Test"
        )
      ).to.be.revertedWithCustomError(splitBilling, "InvalidInput");
    });

    it("Should fail with zero amount", async function () {
      const debtors = [debtor1.address];
      const amounts = [0];
      const deadline = Math.floor(Date.now() / 1000) + 3600;

      await expect(
        splitBilling.connect(creator).createSplit(
          payee.address,
          debtors,
          amounts,
          await dummyUSDT.getAddress(),
          deadline,
          "Test"
        )
      ).to.be.revertedWithCustomError(splitBilling, "InvalidInput");
    });
  });

  describe("Paying Shares", function () {
    let splitId;
    let debtors;
    let amounts;
    let deadline;

    beforeEach(async function () {
      debtors = [debtor1.address, debtor2.address, debtor3.address];
      amounts = [
        ethers.parseEther("100"),
        ethers.parseEther("150"),
        ethers.parseEther("200")
      ];
      deadline = Math.floor(Date.now() / 1000) + 3600;

      // Create a split
      const tx = await splitBilling.connect(creator).createSplit(
        payee.address,
        debtors,
        amounts,
        await dummyUSDT.getAddress(),
        deadline,
        "Test Split"
      );
      await tx.wait();
      
      // Get the current splitCounter to use as splitId
      splitId = await splitBilling.splitCounter();

      // Approve tokens for all debtors
      for (let i = 0; i < 3; i++) {
        const debtor = [debtor1, debtor2, debtor3][i];
        await dummyUSDT.connect(debtor).approve(
          await splitBilling.getAddress(),
          amounts[i]
        );
      }
    });

    it("Should allow debtor to pay their share", async function () {
      const initialBalance = await dummyUSDT.balanceOf(debtor1.address);
      
      await expect(
        splitBilling.connect(debtor1).payShare(splitId)
      ).to.emit(splitBilling, "PaymentMade")
        .withArgs(
          splitId,
          debtor1.address,
          await dummyUSDT.getAddress(),
          ethers.parseEther("100"),
          ethers.parseEther("100")
        );

      expect(await dummyUSDT.balanceOf(debtor1.address))
        .to.equal(initialBalance - ethers.parseEther("100"));
      
      expect(await splitBilling.hasPaid(splitId, debtor1.address)).to.be.true;
      expect(await splitBilling.getPaidAmount(splitId, debtor1.address))
        .to.equal(ethers.parseEther("100"));
    });

    it("Should complete split when all payments are made", async function () {
      const payeeInitialBalance = await dummyUSDT.balanceOf(payee.address);

      // Pay all shares
      await splitBilling.connect(debtor1).payShare(splitId);
      await splitBilling.connect(debtor2).payShare(splitId);
      
      // Last payment should complete the split
      const tx = await splitBilling.connect(debtor3).payShare(splitId);
      const receipt = await tx.wait();
      
      // Check if SplitCompleted event was emitted
      const completedEvent = receipt.logs.find(log => {
        try {
          const parsed = splitBilling.interface.parseLog(log);
          return parsed && parsed.name === 'SplitCompleted';
        } catch {
          return false;
        }
      });
      
      expect(completedEvent).to.not.be.undefined;

      expect(await dummyUSDT.balanceOf(payee.address))
        .to.equal(payeeInitialBalance + ethers.parseEther("450"));

      expect(await splitBilling.isSplitComplete(splitId)).to.be.true;
    });

    it("Should fail if debtor tries to pay twice", async function () {
      await splitBilling.connect(debtor1).payShare(splitId);
      
      await expect(
        splitBilling.connect(debtor1).payShare(splitId)
      ).to.be.revertedWithCustomError(splitBilling, "AlreadyPaid");
    });

    it("Should fail if non-debtor tries to pay", async function () {
      await expect(
        splitBilling.connect(other).payShare(splitId)
      ).to.be.revertedWithCustomError(splitBilling, "InvalidInput");
    });

    it("Should fail to pay after deadline", async function () {
      // Increase time to past deadline
      await ethers.provider.send("evm_increaseTime", [3700]); // 1 hour + 100 seconds
      await ethers.provider.send("evm_mine");

      await expect(
        splitBilling.connect(debtor1).payShare(splitId)
      ).to.be.revertedWithCustomError(splitBilling, "SplitExpired");
    });

    it("Should fail to pay cancelled split", async function () {
      // Cancel the split (no payments made yet)
      await splitBilling.connect(creator).cancelSplit(splitId);

      await expect(
        splitBilling.connect(debtor1).payShare(splitId)
      ).to.be.revertedWithCustomError(splitBilling, "SplitAlreadyCancelled");
    });
  });

  describe("Pay For Someone", function () {
    let splitId;
    let debtors;
    let amounts;

    beforeEach(async function () {
      debtors = [debtor1.address, debtor2.address];
      amounts = [ethers.parseEther("100"), ethers.parseEther("150")];
      const deadline = Math.floor(Date.now() / 1000) + 3600;

      const tx = await splitBilling.connect(creator).createSplit(
        payee.address,
        debtors,
        amounts,
        await dummyUSDT.getAddress(),
        deadline,
        "Test Split"
      );
      await tx.wait();
      splitId = await splitBilling.splitCounter();

      // Approve tokens for the payer (other person)
      await dummyUSDT.connect(other).faucet();
      await dummyUSDT.connect(other).approve(
        await splitBilling.getAddress(),
        ethers.parseEther("250")
      );
    });

    it("Should allow someone to pay for debtor", async function () {
      const otherInitialBalance = await dummyUSDT.balanceOf(other.address);

      await expect(
        splitBilling.connect(other).payForSomeone(splitId, debtor1.address)
      ).to.emit(splitBilling, "PaymentMade")
        .withArgs(
          splitId,
          debtor1.address, // Event shows the debtor, not the payer
          await dummyUSDT.getAddress(),
          ethers.parseEther("100"),
          ethers.parseEther("100")
        );

      expect(await dummyUSDT.balanceOf(other.address))
        .to.equal(otherInitialBalance - ethers.parseEther("100"));
      
      expect(await splitBilling.hasPaid(splitId, debtor1.address)).to.be.true;
    });
  });

  describe("Cancel Split", function () {
    let splitId;

    beforeEach(async function () {
      const debtors = [debtor1.address];
      const amounts = [ethers.parseEther("100")];
      const deadline = Math.floor(Date.now() / 1000) + 3600;

      const tx = await splitBilling.connect(creator).createSplit(
        payee.address,
        debtors,
        amounts,
        await dummyUSDT.getAddress(),
        deadline,
        "Test Split"
      );
      await tx.wait();
      splitId = await splitBilling.splitCounter();
    });

    it("Should allow creator to cancel split with no payments", async function () {
      await expect(
        splitBilling.connect(creator).cancelSplit(splitId)
      ).to.emit(splitBilling, "SplitCancelled")
        .withArgs(splitId, creator.address);

      const details = await splitBilling.getSplitDetails(splitId);
      expect(details.cancelled).to.be.true;
    });

    it("Should fail if non-creator tries to cancel", async function () {
      await expect(
        splitBilling.connect(other).cancelSplit(splitId)
      ).to.be.revertedWithCustomError(splitBilling, "NotAuthorized");
    });

    it("Should fail to cancel if payments were made", async function () {
      // Make a payment first
      await dummyUSDT.connect(debtor1).approve(
        await splitBilling.getAddress(),
        ethers.parseEther("100")
      );
      await splitBilling.connect(debtor1).payShare(splitId);

      await expect(
        splitBilling.connect(creator).cancelSplit(splitId)
      ).to.be.revertedWithCustomError(splitBilling, "InvalidInput");
    });
  });

  describe("View Functions", function () {
    let splitId;

    beforeEach(async function () {
      const debtors = [debtor1.address, debtor2.address];
      const amounts = [ethers.parseEther("100"), ethers.parseEther("150")];
      const deadline = Math.floor(Date.now() / 1000) + 3600;

      const tx = await splitBilling.connect(creator).createSplit(
        payee.address,
        debtors,
        amounts,
        await dummyUSDT.getAddress(),
        deadline,
        "Test Split"
      );
      await tx.wait();
      splitId = await splitBilling.splitCounter();
    });

    it("Should return correct owed amount", async function () {
      expect(await splitBilling.getOwedAmount(splitId, debtor1.address))
        .to.equal(ethers.parseEther("100"));
      expect(await splitBilling.getOwedAmount(splitId, debtor2.address))
        .to.equal(ethers.parseEther("150"));
      expect(await splitBilling.getOwedAmount(splitId, other.address))
        .to.equal(0);
    });

    it("Should return correct paid status", async function () {
      expect(await splitBilling.hasPaid(splitId, debtor1.address)).to.be.false;
      
      // Make payment
      await dummyUSDT.connect(debtor1).approve(
        await splitBilling.getAddress(),
        ethers.parseEther("100")
      );
      await splitBilling.connect(debtor1).payShare(splitId);
      
      expect(await splitBilling.hasPaid(splitId, debtor1.address)).to.be.true;
    });

    it("Should return user splits", async function () {
      const creatorSplits = await splitBilling.getUserSplits(creator.address);
      expect(creatorSplits.length).to.equal(1);
      expect(creatorSplits[0]).to.equal(1);

      const debtor1Splits = await splitBilling.getUserSplits(debtor1.address);
      expect(debtor1Splits.length).to.equal(1);
      expect(debtor1Splits[0]).to.equal(1);
    });

    it("Should check if split is complete", async function () {
      expect(await splitBilling.isSplitComplete(splitId)).to.be.false;
      
      // Pay both shares
      await dummyUSDT.connect(debtor1).approve(
        await splitBilling.getAddress(),
        ethers.parseEther("100")
      );
      await dummyUSDT.connect(debtor2).approve(
        await splitBilling.getAddress(),
        ethers.parseEther("150")
      );
      
      await splitBilling.connect(debtor1).payShare(splitId);
      await splitBilling.connect(debtor2).payShare(splitId);
      
      expect(await splitBilling.isSplitComplete(splitId)).to.be.true;
    });
  });

  describe("ETH Payments", function () {
    let splitId;

    beforeEach(async function () {
      const debtors = [debtor1.address, debtor2.address];
      const amounts = [ethers.parseEther("1"), ethers.parseEther("2")]; // 1 ETH and 2 ETH
      const deadline = Math.floor(Date.now() / 1000) + 3600;

      const tx = await splitBilling.connect(creator).createSplit(
        payee.address,
        debtors,
        amounts,
        ethers.ZeroAddress, // ETH
        deadline,
        "ETH Split"
      );
      await tx.wait();
      splitId = await splitBilling.splitCounter();
    });

    it("Should allow ETH payment", async function () {
      const payeeInitialBalance = await ethers.provider.getBalance(payee.address);
      
      await splitBilling.connect(debtor1).payShare(splitId, {
        value: ethers.parseEther("1")
      });

      await expect(
        splitBilling.connect(debtor2).payShare(splitId, {
          value: ethers.parseEther("2")
        })
      ).to.emit(splitBilling, "SplitCompleted");

      const payeeFinalBalance = await ethers.provider.getBalance(payee.address);
      expect(payeeFinalBalance - payeeInitialBalance).to.equal(ethers.parseEther("3"));
    });

    it("Should fail with incorrect ETH amount", async function () {
      await expect(
        splitBilling.connect(debtor1).payShare(splitId, {
          value: ethers.parseEther("0.5") // Should be 1 ETH
        })
      ).to.be.revertedWithCustomError(splitBilling, "InvalidAmount");
    });
  });

  describe("Edge Cases", function () {
    it("Should fail operations on non-existent split", async function () {
      await expect(
        splitBilling.getSplitDetails(999)
      ).to.be.revertedWithCustomError(splitBilling, "SplitNotFound");

      await expect(
        splitBilling.payShare(999)
      ).to.be.revertedWithCustomError(splitBilling, "SplitNotFound");
    });

    it("Should handle overdue payments check", async function () {
      const debtors = [debtor1.address];
      const amounts = [ethers.parseEther("100")];
      const deadline = Math.floor(Date.now() / 1000) + 100; // Short deadline

      const tx = await splitBilling.connect(creator).createSplit(
        payee.address,
        debtors,
        amounts,
        await dummyUSDT.getAddress(),
        deadline,
        "Short Deadline Split"
      );
      await tx.wait();
      const splitId = await splitBilling.splitCounter();

      // Wait past deadline
      await ethers.provider.send("evm_increaseTime", [200]);
      await ethers.provider.send("evm_mine");

      await expect(
        splitBilling.checkOverduePayments(splitId)
      ).to.emit(splitBilling, "DeadlineAlert")
        .withArgs(splitId, debtor1.address, ethers.parseEther("100"), deadline);
    });
  });
});
