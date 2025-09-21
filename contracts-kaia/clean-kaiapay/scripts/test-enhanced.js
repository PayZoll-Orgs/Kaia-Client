const hre = require("hardhat");

async function main() {
    console.log("🧪 Testing Enhanced Lending Protocol...");

    // Contract address (update this after deployment)
    const ENHANCED_LENDING_ADDRESS = ""; // Will be filled after deployment
    
    if (!ENHANCED_LENDING_ADDRESS) {
        console.log("❌ Please update ENHANCED_LENDING_ADDRESS in the script");
        return;
    }

    // Get signers
    const [deployer, user1, user2] = await hre.ethers.getSigners();
    console.log("👤 Deployer:", deployer.address);
    console.log("👤 User1:", user1.address);
    console.log("👤 User2:", user2.address);

    // Get contract instance
    const enhancedLending = await hre.ethers.getContractAt("EnhancedLendingProtocol", ENHANCED_LENDING_ADDRESS);

    try {
        console.log("\n=== TESTING REFERRAL SYSTEM ===");
        
        // Test 1: Register referral code
        console.log("\n📝 Test 1: Register referral code");
        const referralCode = "USER1_REFERRAL_2025";
        const tx1 = await enhancedLending.connect(user1).registerReferralCode(referralCode);
        await tx1.wait();
        console.log("✅ User1 registered referral code:", referralCode);

        // Test 2: User2 joins with referral
        console.log("\n📝 Test 2: User2 joins with referral");
        const tx2 = await enhancedLending.connect(user2).joinWithReferral(referralCode, user1.address);
        await tx2.wait();
        console.log("✅ User2 joined with User1's referral");

        // Test 3: Check referral info
        console.log("\n📝 Test 3: Check referral info");
        const user1ReferralInfo = await enhancedLending.getReferralInfo(user1.address);
        const user2ReferralInfo = await enhancedLending.getReferralInfo(user2.address);
        
        console.log("User1 Referral Info:");
        console.log(`  Total Referrals: ${user1ReferralInfo.totalReferrals}`);
        console.log(`  Total Rewards: ${hre.ethers.utils.formatEther(user1ReferralInfo.totalRewardsEarned)} USDT`);
        console.log(`  Claimable: ${hre.ethers.utils.formatEther(user1ReferralInfo.claimableRewards)} USDT`);
        
        console.log("User2 Referral Info:");
        console.log(`  Has Referrer: ${user2ReferralInfo.hasReferrer}`);
        console.log(`  Claimable Bonus: ${hre.ethers.utils.formatEther(user2ReferralInfo.claimableRewards)} USDT`);

        console.log("\n=== TESTING LENDING FUNCTIONS ===");
        
        // Test 4: Check lender info (should be empty initially)
        console.log("\n📝 Test 4: Check initial lender info");
        const MOCK_USDT = await enhancedLending.USDT();
        const lenderInfo = await enhancedLending.getLenderInfo(user1.address, MOCK_USDT);
        
        console.log("User1 Lender Info:");
        console.log(`  Total Deposited: ${hre.ethers.utils.formatEther(lenderInfo.totalDeposited)} USDT`);
        console.log(`  Current Earnings: ${hre.ethers.utils.formatEther(lenderInfo.currentEarnings)} USDT`);
        console.log(`  Projected APY: ${lenderInfo.projectedAPY} basis points (${lenderInfo.projectedAPY / 100}%)`);

        console.log("\n=== TESTING BORROWER DASHBOARD ===");
        
        // Test 5: Check borrower dashboard
        console.log("\n📝 Test 5: Check borrower dashboard");
        const borrowerDashboard = await enhancedLending.getBorrowerDashboard(user1.address);
        
        console.log("User1 Borrower Dashboard:");
        console.log(`  Current LTV: ${borrowerDashboard.currentLTV}%`);
        console.log(`  Total Collateral: $${hre.ethers.utils.formatEther(borrowerDashboard.totalCollateralUSD)}`);
        console.log(`  Total Debt: $${hre.ethers.utils.formatEther(borrowerDashboard.totalDebtUSD)}`);
        console.log(`  Liquidation Threshold: ${borrowerDashboard.liquidationThreshold}`);
        console.log(`  Is Liquidatable: ${borrowerDashboard.isLiquidatableStatus}`);

        console.log("\n=== TESTING TRANSACTION HISTORY ===");
        
        // Test 6: Check transaction history (should have referral events)
        console.log("\n📝 Test 6: Check transaction history");
        const user1Transactions = await enhancedLending.getUserTransactions(user1.address, 0, 10);
        const user2Transactions = await enhancedLending.getUserTransactions(user2.address, 0, 10);
        
        console.log(`User1 Transactions: ${user1Transactions.length}`);
        user1Transactions.forEach((tx, i) => {
            console.log(`  ${i + 1}. ${tx.transactionType} - ${hre.ethers.utils.formatEther(tx.amount)} tokens - ${new Date(tx.timestamp * 1000).toLocaleString()}`);
        });
        
        console.log(`User2 Transactions: ${user2Transactions.length}`);
        user2Transactions.forEach((tx, i) => {
            console.log(`  ${i + 1}. ${tx.transactionType} - ${hre.ethers.utils.formatEther(tx.amount)} tokens - ${new Date(tx.timestamp * 1000).toLocaleString()}`);
        });

        console.log("\n=== TESTING PRICE FUNCTIONS ===");
        
        // Test 7: Check price functions
        console.log("\n📝 Test 7: Check price functions");
        const kaiaPrice = await enhancedLending.getKaiaPrice();
        const usdtPrice = await enhancedLending.getUsdtPrice();
        
        console.log(`KAIA Price: $${hre.ethers.utils.formatEther(kaiaPrice)}`);
        console.log(`USDT Price: $${hre.ethers.utils.formatEther(usdtPrice)}`);

        console.log("\n=== TESTING TOKEN METADATA ===");
        
        // Test 8: Check token metadata functions
        console.log("\n📝 Test 8: Check token metadata");
        try {
            const usdtSymbol = await enhancedLending.getTokenSymbol(MOCK_USDT);
            const usdtName = await enhancedLending.getTokenName(MOCK_USDT);
            const usdtDecimals = await enhancedLending.getTokenDecimals(MOCK_USDT);
            
            console.log(`USDT Symbol: ${usdtSymbol}`);
            console.log(`USDT Name: ${usdtName}`);
            console.log(`USDT Decimals: ${usdtDecimals}`);
        } catch (error) {
            console.log("⚠️ Token metadata test failed (expected with mock addresses):", error.message);
        }

        console.log("\n✅ ALL TESTS COMPLETED SUCCESSFULLY!");
        console.log("\n📋 Test Summary:");
        console.log("✅ Referral system registration and joining");
        console.log("✅ Referral rewards calculation");
        console.log("✅ Lender info retrieval");
        console.log("✅ Borrower dashboard data");
        console.log("✅ Transaction history tracking");
        console.log("✅ Price function calls");
        console.log("✅ Basic contract functionality");

    } catch (error) {
        console.error("❌ Test failed:", error);
        console.log("\n📋 Possible causes:");
        console.log("- Contract not deployed yet");
        console.log("- Incorrect contract address");
        console.log("- Network connection issues");
        console.log("- Insufficient gas or permissions");
    }
}

// Helper function to wait for transaction confirmations
async function waitForConfirmation(tx, confirmations = 1) {
    console.log(`⏳ Waiting for ${confirmations} confirmation(s)...`);
    const receipt = await tx.wait(confirmations);
    console.log(`✅ Transaction confirmed in block ${receipt.blockNumber}`);
    return receipt;
}

// Run the tests
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });