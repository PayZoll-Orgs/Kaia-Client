const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SplitBilling Contract - Simple Test", function () {
  let splitBilling;
  let dummyUSDT;
  let creator, payee, debtor1, debtor2;

  beforeEach(async function () {
    // Get signers
    [creator, payee, debtor1, debtor2] = await ethers.getSigners();

    // Deploy DummyUSDT
    const DummyUSDTFactory = await ethers.getContractFactory("DummyUSDT");
    dummyUSDT = await DummyUSDTFactory.deploy(1000000); // 1M tokens
    await dummyUSDT.waitForDeployment();

    // Deploy SplitBilling
    const SplitBillingFactory = await ethers.getContractFactory("SplitBilling");
    splitBilling = await SplitBillingFactory.deploy();
    await splitBilling.waitForDeployment();

    // Get some tokens for testing
    await dummyUSDT.connect(debtor1).faucet();
    await dummyUSDT.connect(debtor2).faucet();
    
    // Wait a bit to ensure transactions are mined
    await new Promise(resolve => setTimeout(resolve, 100));
  });

  it("Should create and complete a simple split", async function () {
    console.log("=== Creating Split ===");
    
    const debtors = [debtor1.address, debtor2.address];
    const amounts = [ethers.parseEther("100"), ethers.parseEther("150")];
    const deadline = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
    
    // Create split
    const createTx = await splitBilling.connect(creator).createSplit(
      payee.address,
      debtors,
      amounts,
      await dummyUSDT.getAddress(),
      deadline,
      "Test Split"
    );
    await createTx.wait();
    
    console.log("Split created successfully");
    
    // Check split details
    const splitDetails = await splitBilling.getSplitDetails(1);
    expect(splitDetails.totalAmount).to.equal(ethers.parseEther("250"));
    expect(splitDetails.totalPaid).to.equal(0);
    
    console.log("=== Making Payments ===");
    
    // Approve tokens
    await dummyUSDT.connect(debtor1).approve(
      await splitBilling.getAddress(),
      ethers.parseEther("100")
    );
    await dummyUSDT.connect(debtor2).approve(
      await splitBilling.getAddress(),
      ethers.parseEther("150")
    );
    
    // Get initial balance
    const payeeInitialBalance = await dummyUSDT.balanceOf(payee.address);
    console.log("Payee initial balance:", ethers.formatEther(payeeInitialBalance));
    
    // First payment
    const payment1Tx = await splitBilling.connect(debtor1).payShare(1);
    const receipt1 = await payment1Tx.wait();
    console.log("First payment made, gas used:", receipt1.gasUsed.toString());
    
    // Check intermediate state
    const afterPayment1 = await splitBilling.getSplitDetails(1);
    expect(afterPayment1.totalPaid).to.equal(ethers.parseEther("100"));
    console.log("After payment 1, total paid:", ethers.formatEther(afterPayment1.totalPaid));
    
    // Second payment (should complete the split)
    console.log("Making second payment...");
    const payment2Tx = await splitBilling.connect(debtor2).payShare(1);
    const receipt2 = await payment2Tx.wait();
    console.log("Second payment made, gas used:", receipt2.gasUsed.toString());
    
    // Check if SplitCompleted event was emitted
    const completedEvent = receipt2.logs.find(log => {
      try {
        const parsed = splitBilling.interface.parseLog(log);
        return parsed && parsed.name === 'SplitCompleted';
      } catch {
        return false;
      }
    });
    
    if (completedEvent) {
      console.log("✅ SplitCompleted event found!");
    } else {
      console.log("❌ SplitCompleted event NOT found");
      console.log("All events in receipt:");
      receipt2.logs.forEach((log, index) => {
        try {
          const parsed = splitBilling.interface.parseLog(log);
          console.log(`  ${index}: ${parsed ? parsed.name : 'Unknown'}`);
        } catch {
          console.log(`  ${index}: Unparseable log`);
        }
      });
    }
    
    // Check final state
    const finalDetails = await splitBilling.getSplitDetails(1);
    expect(finalDetails.totalPaid).to.equal(ethers.parseEther("250"));
    
    const payeeFinalBalance = await dummyUSDT.balanceOf(payee.address);
    console.log("Payee final balance:", ethers.formatEther(payeeFinalBalance));
    
    // Should have received the full amount
    expect(payeeFinalBalance).to.equal(payeeInitialBalance + ethers.parseEther("250"));
    
    console.log("=== Test Complete ===");
  });

  it("Should check contract balance after payments", async function () {
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
      "Test Split"
    );
    
    // Approve and pay
    await dummyUSDT.connect(debtor1).approve(
      await splitBilling.getAddress(),
      ethers.parseEther("100")
    );
    
    const contractBalanceBefore = await dummyUSDT.balanceOf(await splitBilling.getAddress());
    console.log("Contract balance before payment:", ethers.formatEther(contractBalanceBefore));
    
    await splitBilling.connect(debtor1).payShare(1);
    
    const contractBalanceAfter = await dummyUSDT.balanceOf(await splitBilling.getAddress());
    console.log("Contract balance after payment:", ethers.formatEther(contractBalanceAfter));
    
    // Contract should have 0 balance since funds are immediately transferred
    expect(contractBalanceAfter).to.equal(0);
  });
});
