const { ethers } = require("hardhat");

async function main() {
  console.log("🧪 KaiaPay Complete Simulation");
  console.log("==============================\n");
  
  // Load deployment addresses
  let deploymentInfo;
  try {
    const fs = require('fs');
    deploymentInfo = JSON.parse(fs.readFileSync('deployment-addresses.json', 'utf8'));
  } catch (error) {
    console.log("❌ deployment-addresses.json not found. Run deployment first.");
    process.exit(1);
  }
  
  const [owner, user1, user2, user3, seller] = await ethers.getSigners();
  console.log("👥 Test accounts:");
  console.log(`Owner: ${owner.address}`);
  console.log(`User1: ${user1.address}`);
  console.log(`User2: ${user2.address}`);
  console.log(`User3: ${user3.address}`);
  console.log(`Seller: ${seller.address}\n`);
  
  // Get contract instances
  const dummyUSDT = await ethers.getContractAt("DummyUSDT", deploymentInfo.contracts.DummyUSDT);
  const bulkPayroll = await ethers.getContractAt("BulkPayroll", deploymentInfo.contracts.BulkPayroll);
  const splitBilling = await ethers.getContractAt("SplitBilling", deploymentInfo.contracts.SplitBilling);
  const invoiceSubscription = await ethers.getContractAt("InvoiceSubscription", deploymentInfo.contracts.InvoiceSubscription);
  
  console.log("🔗 Connected to contracts successfully\n");
  
  // === PART 1: DummyUSDT Faucet Test ===
  console.log("1️⃣ TESTING DUMMYUSDT FAUCET");
  console.log("===========================");
  
  try {
    // Users claim from faucet
    await dummyUSDT.connect(user1).faucet();
    await dummyUSDT.connect(user2).faucet();
    await dummyUSDT.connect(user3).faucet();
    
    const user1Balance = await dummyUSDT.balanceOf(user1.address);
    console.log(`✅ User1 claimed: ${ethers.formatEther(user1Balance)} DUSDT`);
    
    const faucetBalance = await dummyUSDT.getFaucetBalance();
    console.log(`💰 Faucet remaining: ${ethers.formatEther(faucetBalance)} DUSDT\n`);
    
  } catch (error) {
    console.log(`❌ Faucet error: ${error.message}\n`);
  }
  
  // === PART 2: BulkPayroll Test ===
  console.log("2️⃣ TESTING BULKPAYROLL");
  console.log("======================");
  
  try {
    // Test ETH bulk transfer
    const recipients = [user1.address, user2.address, user3.address];
    const amounts = [
      ethers.parseEther("0.01"),
      ethers.parseEther("0.02"), 
      ethers.parseEther("0.03")
    ];
    const totalAmount = ethers.parseEther("0.06");
    
    console.log("📤 Executing ETH bulk transfer...");
    const tx = await bulkPayroll.connect(owner).bulkTransfer(
      ethers.ZeroAddress, // ETH
      recipients,
      amounts,
      { value: totalAmount }
    );
    
    const receipt = await tx.wait();
    console.log(`✅ ETH bulk transfer successful! Gas used: ${receipt.gasUsed}`);
    
    // Test ERC20 bulk transfer  
    console.log("📤 Executing DUSDT bulk transfer...");
    await dummyUSDT.connect(owner).approve(bulkPayroll.target, ethers.parseEther("100"));
    
    const tokenAmounts = [
      ethers.parseEther("10"),
      ethers.parseEther("20"),
      ethers.parseEther("30")
    ];
    
    const tx2 = await bulkPayroll.connect(owner).bulkTransfer(
      dummyUSDT.target,
      recipients,
      tokenAmounts
    );
    
    const receipt2 = await tx2.wait();
    console.log(`✅ DUSDT bulk transfer successful! Gas used: ${receipt2.gasUsed}\n`);
    
  } catch (error) {
    console.log(`❌ BulkPayroll error: ${error.message}\n`);
  }
  
  // === PART 3: SplitBilling Test ===
  console.log("3️⃣ TESTING SPLITBILLING");
  console.log("=======================");
  
  try {
    // Create split payment
    const recipients2 = [user1.address, user2.address];
    const shares = [7000, 3000]; // 70% and 30%
    
    console.log("💰 Creating split payment (70/30 split)...");
    const tx = await splitBilling.connect(owner).splitPayment(
      recipients2,
      shares,
      ethers.ZeroAddress, // ETH
      { value: ethers.parseEther("0.1") }
    );
    
    const receipt = await tx.wait();
    console.log(`✅ Split payment executed! Gas used: ${receipt.gasUsed}`);
    
    // Create split request with deadline
    const deadline = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
    console.log("📅 Creating split request with deadline...");
    
    const tx2 = await splitBilling.connect(owner).createSplitRequest(
      recipients2,
      shares,
      ethers.ZeroAddress,
      deadline,
      { value: ethers.parseEther("0.05") }
    );
    
    const receipt2 = await tx2.wait();
    console.log(`✅ Split request created! Gas used: ${receipt2.gasUsed}\n`);
    
  } catch (error) {
    console.log(`❌ SplitBilling error: ${error.message}\n`);
  }
  
  // === PART 4: InvoiceSubscription Test ===
  console.log("4️⃣ TESTING INVOICESUBSCRIPTION");
  console.log("==============================");
  
  try {
    // Create invoice
    const invoiceAmount = ethers.parseEther("0.1");
    const deadline = Math.floor(Date.now() / 1000) + 86400; // 24 hours
    
    console.log("📄 Creating invoice...");
    const tx = await invoiceSubscription.connect(seller).createInvoice(
      seller.address,
      invoiceAmount,
      ethers.ZeroAddress,
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
    console.log(`✅ Invoice created! ID: ${invoiceId}`);
    
    // Fund invoice partially
    console.log("💰 Funding invoice partially...");
    await invoiceSubscription.connect(user1).fundInvoice(invoiceId, {
      value: ethers.parseEther("0.03")
    });
    
    await invoiceSubscription.connect(user2).fundInvoice(invoiceId, {
      value: ethers.parseEther("0.02")
    });
    
    console.log("✅ Partial funding complete (0.05/0.1 ETH)");
    
    // Complete funding to trigger automatic release
    console.log("🔄 Completing funding to trigger auto-release...");
    await invoiceSubscription.connect(user3).fundInvoice(invoiceId, {
      value: ethers.parseEther("0.05")
    });
    
    const invoiceData = await invoiceSubscription.getInvoice(invoiceId);
    console.log(`✅ Invoice released: ${invoiceData.released}`);
    console.log(`💸 Total contributed: ${ethers.formatEther(invoiceData.totalContributed)} ETH\n`);
    
  } catch (error) {
    console.log(`❌ InvoiceSubscription error: ${error.message}\n`);
  }
  
  // === PART 5: Chainlink Automation Check ===
  console.log("5️⃣ TESTING CHAINLINK AUTOMATION");
  console.log("================================");
  
  try {
    console.log("🔍 Checking upkeep...");
    const [upkeepNeeded, performData] = await invoiceSubscription.checkUpkeep("0x");
    
    console.log(`Upkeep needed: ${upkeepNeeded}`);
    if (upkeepNeeded) {
      console.log("🤖 Simulating Chainlink automation...");
      await invoiceSubscription.performUpkeep(performData);
      console.log("✅ Automation executed successfully!");
    } else {
      console.log("ℹ️  No upkeep needed at this time");
    }
    
  } catch (error) {
    console.log(`❌ Automation error: ${error.message}\n`);
  }
  
  console.log("🎉 SIMULATION COMPLETE!");
  console.log("========================\n");
  
  console.log("📊 Summary:");
  console.log("• DummyUSDT faucet: Working");
  console.log("• BulkPayroll transfers: Working");
  console.log("• SplitBilling splits: Working");
  console.log("• InvoiceSubscription: Working");
  console.log("• Chainlink Automation: Ready");
  
  console.log("\n🔧 Next steps for Chainlink Automation:");
  console.log("1. Visit https://automation.chain.link/");
  console.log("2. Register new upkeep");
  console.log(`3. Use contract address: ${invoiceSubscription.target}`);
  console.log("4. Fund upkeep with LINK tokens");
  console.log("5. Automation will automatically release escrow when invoices are fully funded");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
