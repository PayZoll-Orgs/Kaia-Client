const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MyDummyTokenWithFaucet (USDT)", function () {
    let token;
    let owner;
    let user1;
    let user2;
    let user3;

    const INITIAL_SUPPLY = 1000000; // 1M tokens
    const FAUCET_AMOUNT = ethers.parseUnits("100", 18);
    const FAUCET_COOLDOWN = 24 * 60 * 60; // 24 hours

    beforeEach(async function () {
        [owner, user1, user2, user3] = await ethers.getSigners();
        
        const TokenFactory = await ethers.getContractFactory("MyDummyTokenWithFaucet");
        token = await TokenFactory.deploy("Test USDT", "TUSDT", INITIAL_SUPPLY);
        await token.waitForDeployment();
    });

    describe("Deployment", function () {
        it("Should set the right owner", async function () {
            expect(await token.owner()).to.equal(owner.address);
        });

        it("Should assign the total supply to the owner", async function () {
            const ownerBalance = await token.balanceOf(owner.address);
            expect(ownerBalance).to.equal(ethers.parseUnits(INITIAL_SUPPLY.toString(), 18));
        });

        it("Should set correct token details", async function () {
            expect(await token.name()).to.equal("Test USDT");
            expect(await token.symbol()).to.equal("TUSDT");
            expect(await token.decimals()).to.equal(18);
        });
    });

    describe("Minting", function () {
        it("Should allow owner to mint tokens", async function () {
            const mintAmount = 1000;
            await token.mint(user1.address, mintAmount);
            
            const user1Balance = await token.balanceOf(user1.address);
            expect(user1Balance).to.equal(ethers.parseUnits(mintAmount.toString(), 18));
        });

        it("Should not allow non-owner to mint tokens", async function () {
            await expect(token.connect(user1).mint(user2.address, 1000))
                .to.be.revertedWith("Caller is not the owner");
        });

        it("Should emit Transfer event on mint", async function () {
            const mintAmount = 1000;
            await expect(token.mint(user1.address, mintAmount))
                .to.emit(token, "Transfer")
                .withArgs(ethers.ZeroAddress, user1.address, ethers.parseUnits(mintAmount.toString(), 18));
        });
    });

    describe("Faucet Functionality", function () {
        beforeEach(async function () {
            // Fund the faucet by transferring tokens to the contract
            const faucetFunding = ethers.parseUnits("10000", 18);
            await token.transfer(await token.getAddress(), faucetFunding);
        });

        it("Should allow users to claim from faucet", async function () {
            await token.connect(user1).faucet();
            
            const user1Balance = await token.balanceOf(user1.address);
            expect(user1Balance).to.equal(FAUCET_AMOUNT);
        });

        it("Should not allow claiming twice within cooldown period", async function () {
            await token.connect(user1).faucet();
            
            await expect(token.connect(user1).faucet())
                .to.be.revertedWith("Faucet: You can only claim once every 24 hours.");
        });

        it("Should allow claiming after cooldown period", async function () {
            await token.connect(user1).faucet();
            
            // Fast forward time by 24 hours + 1 second
            await ethers.provider.send("evm_increaseTime", [FAUCET_COOLDOWN + 1]);
            await ethers.provider.send("evm_mine");
            
            await token.connect(user1).faucet();
            
            const user1Balance = await token.balanceOf(user1.address);
            expect(user1Balance).to.equal(FAUCET_AMOUNT * 2n);
        });

        it("Should fail when faucet is empty", async function () {
            // Withdraw all faucet funds
            await token.withdrawFaucetFunds();
            
            await expect(token.connect(user1).faucet())
                .to.be.revertedWith("Faucet: The faucet is empty. Please ask the owner to refill it.");
        });

        it("Should allow different users to claim simultaneously", async function () {
            await token.connect(user1).faucet();
            await token.connect(user2).faucet();
            
            expect(await token.balanceOf(user1.address)).to.equal(FAUCET_AMOUNT);
            expect(await token.balanceOf(user2.address)).to.equal(FAUCET_AMOUNT);
        });
    });

    describe("Faucet Management", function () {
        beforeEach(async function () {
            // Fund the faucet
            const faucetFunding = ethers.parseUnits("10000", 18);
            await token.transfer(await token.getAddress(), faucetFunding);
        });

        it("Should allow owner to withdraw faucet funds", async function () {
            const contractBalance = await token.balanceOf(await token.getAddress());
            const ownerBalanceBefore = await token.balanceOf(owner.address);
            
            await token.withdrawFaucetFunds();
            
            const ownerBalanceAfter = await token.balanceOf(owner.address);
            expect(ownerBalanceAfter).to.equal(ownerBalanceBefore + contractBalance);
            expect(await token.balanceOf(await token.getAddress())).to.equal(0);
        });

        it("Should not allow non-owner to withdraw faucet funds", async function () {
            await expect(token.connect(user1).withdrawFaucetFunds())
                .to.be.revertedWith("Caller is not the owner");
        });

        it("Should fail to withdraw when faucet has no funds", async function () {
            await token.withdrawFaucetFunds(); // Withdraw all funds first
            
            await expect(token.withdrawFaucetFunds())
                .to.be.revertedWith("Faucet has no funds to withdraw.");
        });
    });

    describe("Standard ERC20 Functionality", function () {
        it("Should transfer tokens between accounts", async function () {
            const transferAmount = ethers.parseUnits("100", 18);
            
            await token.transfer(user1.address, transferAmount);
            expect(await token.balanceOf(user1.address)).to.equal(transferAmount);
            
            await token.connect(user1).transfer(user2.address, transferAmount);
            expect(await token.balanceOf(user2.address)).to.equal(transferAmount);
            expect(await token.balanceOf(user1.address)).to.equal(0);
        });

        it("Should handle allowances correctly", async function () {
            const allowanceAmount = ethers.parseUnits("500", 18);
            const transferAmount = ethers.parseUnits("200", 18);
            
            await token.approve(user1.address, allowanceAmount);
            expect(await token.allowance(owner.address, user1.address)).to.equal(allowanceAmount);
            
            await token.connect(user1).transferFrom(owner.address, user2.address, transferAmount);
            expect(await token.balanceOf(user2.address)).to.equal(transferAmount);
            expect(await token.allowance(owner.address, user1.address)).to.equal(allowanceAmount - transferAmount);
        });
    });

    describe("Edge Cases", function () {
        it("Should handle zero amount transfers", async function () {
            await expect(token.transfer(user1.address, 0))
                .to.not.be.reverted;
        });

        it("Should fail on insufficient balance transfers", async function () {
            const excessiveAmount = ethers.parseUnits("999999999", 18);
            await expect(token.connect(user1).transfer(user2.address, excessiveAmount))
                .to.be.reverted; // Just check it reverts, don't specify the exact error name
        });
    });
});
