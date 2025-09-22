const { ethers } = require("hardhat");
const fs = require('fs');

// Load deployed addresses
const deployedAddresses = JSON.parse(fs.readFileSync('./deployedAddresses.json', 'utf8'));

async function debugUSDYCollateral() {
    console.log("🔍 Starting USDY Collateral Debug Test...\n");
    
    const signers = await ethers.getSigners();
    const owner = signers[0];
    
    console.log("👤 Test Account:");
    console.log(`   Address: ${owner.address}\n`);

    // Connect to contracts
    const lendingProtocol = await ethers.getContractAt("EnhancedLendingProtocol", deployedAddresses.EnhancedLendingProtocol);
    const usdyToken = await ethers.getContractAt("IERC20", deployedAddresses.USDY);
    
    console.log("📋 Contract Addresses:");
    console.log(`   Enhanced Lending Protocol: ${deployedAddresses.EnhancedLendingProtocol}`);
    console.log(`   USDY Token: ${deployedAddresses.USDY}\n`);

    const collateralAmount = ethers.parseUnits("100", 18); // 100 USDY

    try {
        // Step 1: Check USDY balance
        console.log("💰 Step 1: Checking USDY Balance:");
        const usdyBalance = await usdyToken.balanceOf(owner.address);
        console.log(`   USDY Balance: ${ethers.formatUnits(usdyBalance, 18)}`);

        if (usdyBalance < collateralAmount) {
            console.log(`   ⚠️  Insufficient USDY balance for test\n`);
            return;
        }

        // Step 2: Check current allowance
        console.log("\n🔍 Step 2: Checking USDY Allowance:");
        const currentAllowance = await usdyToken.allowance(owner.address, deployedAddresses.EnhancedLendingProtocol);
        console.log(`   Current Allowance: ${ethers.formatUnits(currentAllowance, 18)}`);

        // Step 3: Approve USDY
        console.log("\n✅ Step 3: Approving USDY...");
        const approveTx = await usdyToken.approve(deployedAddresses.EnhancedLendingProtocol, collateralAmount);
        console.log(`   Approval TX Hash: ${approveTx.hash}`);
        await approveTx.wait();
        console.log(`   ✅ Approval confirmed`);

        // Verify approval
        const newAllowance = await usdyToken.allowance(owner.address, deployedAddresses.EnhancedLendingProtocol);
        console.log(`   New Allowance: ${ethers.formatUnits(newAllowance, 18)}`);

        // Step 4: Check current collateral balance
        console.log("\n📊 Step 4: Checking Current Collateral:");
        const currentCollateral = await lendingProtocol.collateralBalance(owner.address);
        console.log(`   Current Collateral: ${ethers.formatUnits(currentCollateral, 18)} USDY`);

        // Step 5: Attempt to deposit collateral with detailed error catching
        console.log("\n🔒 Step 5: Attempting Collateral Deposit...");
        
        try {
            // Estimate gas first
            const gasEstimate = await lendingProtocol.depositCollateral.estimateGas(collateralAmount);
            console.log(`   Gas Estimate: ${gasEstimate.toString()}`);

            // Execute transaction with higher gas limit
            const depositTx = await lendingProtocol.depositCollateral(collateralAmount, {
                gasLimit: gasEstimate * 2n // Double the estimated gas
            });
            console.log(`   Deposit TX Hash: ${depositTx.hash}`);
            
            const receipt = await depositTx.wait();
            console.log(`   ✅ Deposit confirmed in block ${receipt.blockNumber}`);

            // Check new collateral balance
            const newCollateral = await lendingProtocol.collateralBalance(owner.address);
            console.log(`   New Collateral: ${ethers.formatUnits(newCollateral, 18)} USDY`);

        } catch (error) {
            console.log(`   ❌ Deposit failed: ${error.message}`);
            
            // Try to get more detailed error info
            if (error.reason) {
                console.log(`   Reason: ${error.reason}`);
            }
            if (error.code) {
                console.log(`   Error Code: ${error.code}`);
            }
            if (error.data) {
                console.log(`   Error Data: ${error.data}`);
            }

            // Check if it's a contract-specific error
            try {
                const call = await lendingProtocol.depositCollateral.staticCall(collateralAmount);
                console.log(`   Static call succeeded: ${call}`);
            } catch (staticError) {
                console.log(`   Static call failed: ${staticError.message}`);
            }
        }

        // Step 6: Test borrower dashboard (if available)
        console.log("\n📋 Step 6: Checking Borrower Dashboard:");
        try {
            const dashboard = await lendingProtocol.getBorrowerDashboard(owner.address);
            console.log(`   Collateral Value: $${ethers.formatUnits(dashboard.collateralValue, 18)}`);
            console.log(`   Total Debt: $${ethers.formatUnits(dashboard.totalDebt, 18)}`);
            console.log(`   LTV: ${dashboard.ltv.toString()}%`);
            console.log(`   Health Factor: ${ethers.formatUnits(dashboard.healthFactor, 18)}`);
        } catch (error) {
            console.log(`   ⚠️  Dashboard unavailable: ${error.message}`);
        }

    } catch (error) {
        console.error("❌ Test failed:", error);
    }

    console.log("\n🏁 Debug test completed!");
}

debugUSDYCollateral()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Script failed:", error);
        process.exit(1);
    });