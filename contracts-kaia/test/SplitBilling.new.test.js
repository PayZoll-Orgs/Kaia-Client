const { expect } = require("chai");
const { ethers, network } = require("hardhat");

describe("SplitBilling", function () {
    let splitBilling;
    let testToken;
    let creator;
    let payee;
    let debtor1;
    let debtor2;
    let debtor3;
    let user1;

    const MAX_RECIPIENTS = 20;

    beforeEach(async function () {
        [creator, payee, debtor1, debtor2, debtor3, user1] = await ethers.getSigners();
        
        // Deploy USDT token
        const TokenFactory = await ethers.getContractFactory("MyDummyTokenWithFaucet");
        testToken = await TokenFactory.deploy("Test USDT", "USDT", 1000000);
        await testToken.waitForDeployment();
        
        // Deploy SplitBilling contract
        const SplitBillingFactory = await ethers.getContractFactory("SplitBilling");
        splitBilling = await SplitBillingFactory.deploy(await testToken.getAddress());
        await splitBilling.waitForDeployment();

        // Give debtors some tokens and approve
        await testToken.mint(debtor1.address, ethers.parseUnits("1000", 18));
        await testToken.mint(debtor2.address, ethers.parseUnits("1000", 18));
        await testToken.mint(debtor3.address, ethers.parseUnits("1000", 18));
        await testToken.mint(user1.address, ethers.parseUnits("1000", 18));
        
        // Approve splitBilling to spend tokens
        await testToken.connect(debtor1).approve(await splitBilling.getAddress(), ethers.parseUnits("1000", 18));
        await testToken.connect(debtor2).approve(await splitBilling.getAddress(), ethers.parseUnits("1000", 18));
        await testToken.connect(debtor3).approve(await splitBilling.getAddress(), ethers.parseUnits("1000", 18));
        await testToken.connect(user1).approve(await splitBilling.getAddress(), ethers.parseUnits("1000", 18));
    });

    describe("Deployment", function () {
        it("Should set correct constants", async function () {
            expect(await splitBilling.MAX_RECIPIENTS()).to.equal(MAX_RECIPIENTS);
            expect(await splitBilling.usdtToken()).to.equal(await testToken.getAddress());
        });

        it("Should initialize split counter to 0", async function () {
            expect(await splitBilling.splitCounter()).to.equal(0);
        });
    });

    describe("Split Creation", function () {
        it("Should create a split request successfully", async function () {
            const debtors = [debtor1.address, debtor2.address];
            const amounts = [ethers.parseUnits("100", 18), ethers.parseUnits("150", 18)];
            const currentBlock = await ethers.provider.getBlock('latest');
            const deadline = currentBlock.timestamp + 7 * 24 * 60 * 60;
            const description = "Dinner split";
            const totalAmount = amounts.reduce((sum, amount) => sum + amount, 0n);

            await expect(splitBilling.connect(creator).createSplit(
                payee.address,
                debtors,
                amounts,
                deadline,
                description
            )).to.emit(splitBilling, "SplitCreated")
            .withArgs(1, creator.address, payee.address, await testToken.getAddress(), totalAmount, deadline, description, debtors, amounts);

            const [splitCreator, splitPayee, token, splitTotalAmount, totalPaid, splitDeadline, cancelled, splitDescription, splitDebtors, splitAmounts] = await splitBilling.getSplitDetails(1);
            
            expect(splitCreator).to.equal(creator.address);
            expect(splitPayee).to.equal(payee.address);
            expect(token).to.equal(await testToken.getAddress());
            expect(splitTotalAmount).to.equal(totalAmount);
            expect(totalPaid).to.equal(0);
            expect(splitDeadline).to.equal(deadline);
            expect(cancelled).to.equal(false);
            expect(splitDescription).to.equal(description);
            expect(splitDebtors).to.deep.equal(debtors);
            expect(splitAmounts).to.deep.equal(amounts);
        });

        it("Should increment split counter", async function () {
            const debtors = [debtor1.address];
            const amounts = [ethers.parseUnits("100", 18)];
            const currentBlock = await ethers.provider.getBlock('latest');
            const deadline = currentBlock.timestamp + 7 * 24 * 60 * 60;

            await splitBilling.connect(creator).createSplit(
                payee.address,
                debtors,
                amounts,
                deadline,
                "Test"
            );

            expect(await splitBilling.splitCounter()).to.equal(1);
        });

        it("Should track user splits", async function () {
            const debtors = [debtor1.address];
            const amounts = [ethers.parseUnits("100", 18)];
            const currentBlock = await ethers.provider.getBlock('latest');
            const deadline = currentBlock.timestamp + 7 * 24 * 60 * 60;

            await splitBilling.connect(creator).createSplit(
                payee.address,
                debtors,
                amounts,
                deadline,
                "Test"
            );

            const creatorSplits = await splitBilling.userSplits(creator.address, 0);
            const debtorSplits = await splitBilling.userSplits(debtor1.address, 0);
            
            expect(creatorSplits).to.equal(1);
            expect(debtorSplits).to.equal(1);
        });
    });

    describe("Input Validation", function () {
        const amounts = [ethers.parseUnits("100", 18)];
        let deadline;

        beforeEach(async function () {
            const currentBlock = await ethers.provider.getBlock('latest');
            deadline = currentBlock.timestamp + 7 * 24 * 60 * 60;
        });

        it("Should revert with empty debtors array", async function () {
            await expect(splitBilling.connect(creator).createSplit(
                payee.address,
                [],
                [],
                deadline,
                "Description"
            )).to.be.revertedWithCustomError(splitBilling, "InvalidInput");
        });

        it("Should revert with too many recipients", async function () {
            const tooManyDebtors = Array(21).fill(debtor1.address);
            const tooManyAmounts = Array(21).fill(amounts[0]);

            await expect(splitBilling.connect(creator).createSplit(
                payee.address,
                tooManyDebtors,
                tooManyAmounts,
                deadline,
                "Description"
            )).to.be.revertedWithCustomError(splitBilling, "InvalidInput");
        });

        it("Should revert with mismatched array lengths", async function () {
            await expect(splitBilling.connect(creator).createSplit(
                payee.address,
                [debtor1.address, debtor2.address],
                amounts,
                deadline,
                "Description"
            )).to.be.revertedWithCustomError(splitBilling, "InvalidInput");
        });

        it("Should revert with past deadline", async function () {
            const currentBlock = await ethers.provider.getBlock('latest');
            const pastDeadline = currentBlock.timestamp - 1;
            
            await expect(splitBilling.connect(creator).createSplit(
                payee.address,
                [debtor1.address],
                amounts,
                pastDeadline,
                "Description"
            )).to.be.revertedWithCustomError(splitBilling, "InvalidInput");
        });

        it("Should revert with zero address payee", async function () {
            await expect(splitBilling.connect(creator).createSplit(
                ethers.ZeroAddress,
                [debtor1.address],
                amounts,
                deadline,
                "Description"
            )).to.be.revertedWithCustomError(splitBilling, "InvalidInput");
        });

        it("Should revert with zero address debtor", async function () {
            await expect(splitBilling.connect(creator).createSplit(
                payee.address,
                [ethers.ZeroAddress],
                amounts,
                deadline,
                "Description"
            )).to.be.revertedWithCustomError(splitBilling, "InvalidInput");
        });

        it("Should revert with zero amount", async function () {
            await expect(splitBilling.connect(creator).createSplit(
                payee.address,
                [debtor1.address],
                [0],
                deadline,
                "Description"
            )).to.be.revertedWithCustomError(splitBilling, "InvalidInput");
        });
    });

    describe("Payment", function () {
        let splitId;
        const amounts = [ethers.parseUnits("100", 18), ethers.parseUnits("150", 18)];

        beforeEach(async function () {
            const debtors = [debtor1.address, debtor2.address];
            const currentBlock = await ethers.provider.getBlock('latest');
            const deadline = currentBlock.timestamp + 7 * 24 * 60 * 60;

            await splitBilling.connect(creator).createSplit(
                payee.address,
                debtors,
                amounts,
                deadline,
                "Test split"
            );
            splitId = 1;
        });

        it("Should allow debtor to pay their share", async function () {
            const payeeBalanceBefore = await testToken.balanceOf(payee.address);

            await expect(splitBilling.connect(debtor1).payShare(splitId))
                .to.emit(splitBilling, "PaymentMade")
                .withArgs(splitId, debtor1.address, await testToken.getAddress(), amounts[0], amounts[0]);

            const payeeBalanceAfter = await testToken.balanceOf(payee.address);
            expect(payeeBalanceAfter - payeeBalanceBefore).to.equal(amounts[0]);

            expect(await splitBilling.hasPaid(splitId, debtor1.address)).to.equal(true);
            expect(await splitBilling.getPaidAmount(splitId, debtor1.address)).to.equal(amounts[0]);
        });

        it("Should complete split when all payments are made", async function () {
            await splitBilling.connect(debtor1).payShare(splitId);
            
            await expect(splitBilling.connect(debtor2).payShare(splitId))
                .to.emit(splitBilling, "SplitCompleted")
                .withArgs(splitId, payee.address, await testToken.getAddress(), amounts.reduce((sum, amount) => sum + amount, 0n));

            expect(await splitBilling.isSplitComplete(splitId)).to.equal(true);
        });

        it("Should not allow double payment from same debtor", async function () {
            await splitBilling.connect(debtor1).payShare(splitId);
            
            await expect(splitBilling.connect(debtor1).payShare(splitId))
                .to.be.revertedWithCustomError(splitBilling, "AlreadyPaid");
        });

        it("Should not allow payment by non-debtor", async function () {
            await expect(splitBilling.connect(user1).payShare(splitId))
                .to.be.revertedWithCustomError(splitBilling, "InvalidInput");
        });

        it("Should not allow payment after deadline", async function () {
            // Fast forward time past deadline
            await ethers.provider.send("evm_increaseTime", [8 * 24 * 60 * 60]); // 8 days
            await ethers.provider.send("evm_mine");
            
            await expect(splitBilling.connect(debtor1).payShare(splitId))
                .to.be.revertedWithCustomError(splitBilling, "SplitExpired");
        });

        it("Should not allow payment for cancelled split", async function () {
            await splitBilling.connect(creator).cancelSplit(splitId);
            
            await expect(splitBilling.connect(debtor1).payShare(splitId))
                .to.be.revertedWithCustomError(splitBilling, "SplitAlreadyCancelled");
        });
    });

    describe("Pay For Someone Else", function () {
        let splitId;
        const amounts = [ethers.parseUnits("50", 18), ethers.parseUnits("30", 18)];

        beforeEach(async function () {
            const debtors = [debtor1.address, debtor2.address];
            const currentBlock = await ethers.provider.getBlock('latest');
            const deadline = currentBlock.timestamp + 7 * 24 * 60 * 60;
            
            await splitBilling.connect(creator).createSplit(
                payee.address,
                debtors,
                amounts,
                deadline,
                "Helping friend"
            );
            splitId = 1;
        });

        it("Should allow paying for someone else", async function () {
            const payeeBalanceBefore = await testToken.balanceOf(payee.address);
            
            await expect(splitBilling.connect(user1).payForSomeone(splitId, debtor1.address))
                .to.emit(splitBilling, "PaymentMade")
                .withArgs(splitId, debtor1.address, await testToken.getAddress(), amounts[0], amounts[0]);

            const payeeBalanceAfter = await testToken.balanceOf(payee.address);
            expect(payeeBalanceAfter - payeeBalanceBefore).to.equal(amounts[0]);

            expect(await splitBilling.hasPaid(splitId, debtor1.address)).to.equal(true);
            expect(await splitBilling.getPaidAmount(splitId, debtor1.address)).to.equal(amounts[0]);
        });

        it("Should not allow paying for someone who already paid", async function () {
            await splitBilling.connect(debtor1).payShare(splitId);
            
            await expect(splitBilling.connect(user1).payForSomeone(splitId, debtor1.address))
                .to.be.revertedWithCustomError(splitBilling, "AlreadyPaid");
        });

        it("Should not allow paying for non-debtor", async function () {
            await expect(splitBilling.connect(user1).payForSomeone(splitId, user1.address))
                .to.be.revertedWithCustomError(splitBilling, "InvalidInput");
        });
    });

    describe("Split Cancellation", function () {
        let splitId;
        const amounts = [ethers.parseUnits("50", 18)];

        beforeEach(async function () {
            const debtors = [debtor1.address];
            const currentBlock = await ethers.provider.getBlock('latest');
            const deadline = currentBlock.timestamp + 7 * 24 * 60 * 60;
            
            await splitBilling.connect(creator).createSplit(
                payee.address,
                debtors,
                amounts,
                deadline,
                "Test cancellation"
            );
            splitId = 1;
        });

        it("Should allow creator to cancel split", async function () {
            await expect(splitBilling.connect(creator).cancelSplit(splitId))
                .to.emit(splitBilling, "SplitCancelled")
                .withArgs(splitId, creator.address);

            const [, , , , , , cancelled] = await splitBilling.getSplitDetails(splitId);
            expect(cancelled).to.equal(true);
        });

        it("Should not allow non-creator to cancel split", async function () {
            await expect(splitBilling.connect(user1).cancelSplit(splitId))
                .to.be.revertedWithCustomError(splitBilling, "NotAuthorized");
        });

        it("Should not allow cancellation after payments made", async function () {
            await splitBilling.connect(debtor1).payShare(splitId);
            
            await expect(splitBilling.connect(creator).cancelSplit(splitId))
                .to.be.revertedWithCustomError(splitBilling, "InvalidInput");
        });
    });

    describe("View Functions", function () {
        let splitId;
        const amounts = [ethers.parseUnits("100", 18), ethers.parseUnits("200", 18)];

        beforeEach(async function () {
            const debtors = [debtor1.address, debtor2.address];
            const currentBlock = await ethers.provider.getBlock('latest');
            const deadline = currentBlock.timestamp + 7 * 24 * 60 * 60;
            
            await splitBilling.connect(creator).createSplit(
                payee.address,
                debtors,
                amounts,
                deadline,
                "View test"
            );
            splitId = 1;
        });

        it("Should return correct owed amount", async function () {
            expect(await splitBilling.getOwedAmount(splitId, debtor1.address)).to.equal(amounts[0]);
            expect(await splitBilling.getOwedAmount(splitId, debtor2.address)).to.equal(amounts[1]);
            expect(await splitBilling.getOwedAmount(splitId, user1.address)).to.equal(0);
        });

        it("Should return correct paid amount", async function () {
            expect(await splitBilling.getPaidAmount(splitId, debtor1.address)).to.equal(0);
            
            await splitBilling.connect(debtor1).payShare(splitId);
            
            expect(await splitBilling.getPaidAmount(splitId, debtor1.address)).to.equal(amounts[0]);
        });

        it("Should return correct payment status", async function () {
            expect(await splitBilling.hasPaid(splitId, debtor1.address)).to.equal(false);
            
            await splitBilling.connect(debtor1).payShare(splitId);
            
            expect(await splitBilling.hasPaid(splitId, debtor1.address)).to.equal(true);
        });

        it("Should return split completion status", async function () {
            expect(await splitBilling.isSplitComplete(splitId)).to.equal(false);
            
            await splitBilling.connect(debtor1).payShare(splitId);
            expect(await splitBilling.isSplitComplete(splitId)).to.equal(false);
            
            await splitBilling.connect(debtor2).payShare(splitId);
            expect(await splitBilling.isSplitComplete(splitId)).to.equal(true);
        });
    });
});
