const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SplitBilling - Clean Test", function () {
  let splitBilling;
  let dummyUSDT;
  let owner, creator, payee, debtor1, debtor2;

  beforeEach(async function () {
    // Deploy fresh contracts for each test
    [owner, creator, payee, debtor1, debtor2] = await ethers.getSigners();

    const DummyUSDTFactory = await ethers.getContractFactory("DummyUSDT");
    dummyUSDT = await DummyUSDTFactory.deploy(1000000);
    await dummyUSDT.waitForDeployment();

    const SplitBillingFactory = await ethers.getContractFactory("SplitBilling");
    splitBilling = await SplitBillingFactory.deploy();
    await splitBilling.waitForDeployment();

    // Get test tokens
    await dummyUSDT.connect(debtor1).faucet();
    await dummyUSDT.connect(debtor2).faucet();
  });

  it("Should deploy and set constants correctly", async function () {
    expect(await splitBilling.MAX_RECIPIENTS()).to.equal(20);
    expect(await splitBilling.splitCounter()).to.equal(0);
  });

  it("Should create split successfully", async function () {
    const debtors = [debtor1.address];
    const amounts = [ethers.parseEther("100")];
    const deadline = Math.floor(Date.now() / 1000) + 3600;

    await splitBilling.connect(creator).createSplit(
      payee.address,
      debtors,
      amounts,
      await dummyUSDT.getAddress(),
      deadline,
      "Test"
    );

    expect(await splitBilling.splitCounter()).to.equal(1);
  });

  it("Should pay share successfully", async function () {
    // Create split
    const debtors = [debtor1.address];
    const amounts = [ethers.parseEther("100")];
    const deadline = Math.floor(Date.now() / 1000) + 3600;

    await splitBilling.connect(creator).createSplit(
      payee.address,
      debtors,
      amounts,
      await dummyUSDT.getAddress(),
      deadline,
      "Test"
    );

    // Pay share
    await dummyUSDT.connect(debtor1).approve(
      await splitBilling.getAddress(),
      ethers.parseEther("100")
    );
    
    await splitBilling.connect(debtor1).payShare(1);
    
    expect(await splitBilling.hasPaid(1, debtor1.address)).to.be.true;
  });

  it("Should handle ETH payments", async function () {
    const debtors = [debtor1.address];
    const amounts = [ethers.parseEther("1")];
    const deadline = Math.floor(Date.now() / 1000) + 3600;

    await splitBilling.connect(creator).createSplit(
      payee.address,
      debtors,
      amounts,
      ethers.ZeroAddress, // ETH
      deadline,
      "ETH Test"
    );

    const payeeBalanceBefore = await ethers.provider.getBalance(payee.address);
    
    await splitBilling.connect(debtor1).payShare(1, {
      value: ethers.parseEther("1")
    });

    const payeeBalanceAfter = await ethers.provider.getBalance(payee.address);
    expect(payeeBalanceAfter).to.be.gt(payeeBalanceBefore);
  });

  it("Should cancel split", async function () {
    const debtors = [debtor1.address];
    const amounts = [ethers.parseEther("100")];
    const deadline = Math.floor(Date.now() / 1000) + 3600;

    await splitBilling.connect(creator).createSplit(
      payee.address,
      debtors,
      amounts,
      await dummyUSDT.getAddress(),
      deadline,
      "Test"
    );

    await splitBilling.connect(creator).cancelSplit(1);
    
    const details = await splitBilling.getSplitDetails(1);
    expect(details.cancelled).to.be.true;
  });
});
