// 🔧 CORRECTED BULK PAYMENT FRONTEND IMPLEMENTATION
// This file contains the exact fixes needed for BulkPaymentModal.tsx

// =========================
// 1. CONTRACT ADDRESSES FIX
// =========================

// ❌ WRONG - Current frontend addresses:
// const BULK_PAYROLL_ADDRESS = '0xE9bD986514a6d35B1B73BeA6F19804D3c7aed284';
// const USDT_ADDRESS = '0xd55B72640f3e31910A688a2Dc81876F053115B09'; // ✅ This one is correct

// ✅ CORRECT - Updated addresses:
const BULK_PAYROLL_ADDRESS = '0x850Ee5aAA4e55668573D5Ce5f055c113Fe7bd0d4'; // ✅ NEWLY DEPLOYED
const USDT_ADDRESS = '0xd55B72640f3e31910A688a2Dc81876F053115B09'; // ✅ CORRECT FAUCET USDT

// =========================
// 2. CORRECT ABI FIX
// =========================

// ❌ WRONG - Current frontend ABI (missing token parameter):
/*
const bulkPayrollABI = [
  {
    "inputs": [
      { "internalType": "address[]", "name": "recipients", "type": "address[]" },
      { "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }
    ],
    "name": "bulkTransfer",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];
*/

// ✅ CORRECT - Updated ABI (includes token parameter):
const bulkPayrollABI = [
  {
    "inputs": [
      { "internalType": "address", "name": "token", "type": "address" },
      { "internalType": "address[]", "name": "recipients", "type": "address[]" },
      { "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }
    ],
    "name": "bulkTransfer",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  }
];

// =========================
// 3. FUNCTION CALL FIX
// =========================

// ❌ WRONG - Current frontend function call:
/*
const callData = bulkPayrollContract.interface.encodeFunctionData('bulkTransfer', [
  contractRecipients,
  contractAmounts
]);
*/

// ✅ CORRECT - Updated function call (includes USDT token address):
const callData = bulkPayrollContract.interface.encodeFunctionData('bulkTransfer', [
  USDT_ADDRESS,      // ✅ ADD THIS: Token address parameter
  contractRecipients,
  contractAmounts
]);

// =========================
// 4. COMPLETE CORRECTED FUNCTION
// =========================

const handleExecuteBulkPayment = async () => {
  if (!wallet.address || !user?.userId) {
    setError('Wallet not connected');
    return;
  }

  setCurrentStep('processing');
  setError(null);

  try {
    console.log('💰 Executing bulk payment...', {
      recipientCount: recipients.length,
      totalAmount,
      from: wallet.address
    });

    // Contract parameters for BulkPayroll.bulkTransfer
    const recipientAddresses = recipients.map(r => r.address);
    const amounts = recipients.map(r => {
      // Convert to wei (18 decimals for USDT)
      const amountInWei = Math.round(parseFloat(r.amount) * Math.pow(10, 18));
      return amountInWei.toString();
    });

    console.log('📊 Contract call parameters:', {
      contract: BULK_PAYROLL_ADDRESS,
      usdtToken: USDT_ADDRESS,
      recipients: recipientAddresses,
      amounts: amounts,
      totalAmountWei: amounts.reduce((sum, amount) => sum + BigInt(amount), BigInt(0)).toString()
    });

    // Import wallet service dynamically
    const { WalletService } = await import('../lib/wallet-service');
    const walletService = WalletService.getInstance();

    // Step 1: Approve USDT spending for BulkPayroll contract
    console.log('🔓 Approving USDT spending for BulkPayroll contract...');
    const totalAmountWei = amounts.reduce((sum, amount) => sum + BigInt(amount), BigInt(0));
    
    // ERC20 approve function selector: 0x095ea7b3
    const approveSelector = '095ea7b3';
    const paddedSpenderAddress = BULK_PAYROLL_ADDRESS.slice(2).padStart(64, '0');
    const paddedAmount = totalAmountWei.toString(16).padStart(64, '0');
    const approveData = '0x' + approveSelector + paddedSpenderAddress + paddedAmount;

    console.log('📝 Approve transaction data:', {
      selector: approveSelector,
      spender: BULK_PAYROLL_ADDRESS,
      amount: totalAmountWei.toString(),
      data: approveData
    });

    const approveTx = await walletService.sendTransaction(
      USDT_ADDRESS,
      '0x0',
      '0x15f90', // Gas limit for approval
      approveData
    );

    console.log('✅ USDT approval successful:', approveTx);

    // Step 2: Execute bulk transfer using CORRECTED contract call
    console.log('📦 Executing bulk transfer...');
    
    // Prepare recipients and amounts arrays (exactly like the working script)
    const contractRecipients = recipients.map(r => r.address);
    const contractAmounts = recipients.map(r => {
      // Convert amount to wei (18 decimals for USDT)
      const amountInWei = BigInt(Math.floor(parseFloat(r.amount) * 1e18));
      return amountInWei.toString();
    });
    
    console.log('📊 Transaction summary:', {
      recipientCount: recipients.length,
      totalAmount: totalAmount,
      recipients: contractRecipients,
      amounts: contractAmounts.map(a => (BigInt(a) / BigInt(10**18)).toString() + ' USDT')
    });

    // Use ethers.js contract interface to call bulkTransfer (CORRECTED VERSION)
    const { ethers } = await import('ethers');
    const provider = new ethers.JsonRpcProvider(CONFIG.RPC_URL);
    
    // ✅ CORRECTED BulkPayroll contract ABI for bulkTransfer function
    const bulkPayrollABI = [
      {
        "inputs": [
          { "internalType": "address", "name": "token", "type": "address" },
          { "internalType": "address[]", "name": "recipients", "type": "address[]" },
          { "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }
        ],
        "name": "bulkTransfer",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
      }
    ];
    
    const bulkPayrollContract = new ethers.Contract(BULK_PAYROLL_ADDRESS, bulkPayrollABI, provider);
    
    // ✅ CORRECTED: Encode the function call data with TOKEN parameter
    const callData = bulkPayrollContract.interface.encodeFunctionData('bulkTransfer', [
      USDT_ADDRESS,      // ✅ TOKEN ADDRESS (this was missing!)
      contractRecipients,
      contractAmounts
    ]);
    
    console.log('📦 Using CORRECTED ethers.js encoding for bulkTransfer(address, address[], uint256[])');
    console.log('✅ Method signature now matches deployed contract exactly');

    const bulkTx = await walletService.sendTransaction(
      BULK_PAYROLL_ADDRESS,
      '0x0',
      '0x30d40', // Gas limit for bulk transfer (~200000)
      callData // Properly encoded function call with token parameter
    );

    console.log('✅ Bulk payment transaction sent:', bulkTx);

    // [Rest of the function remains the same - backend recording logic]
    // ...

  } catch (error) {
    console.error('❌ Bulk payment failed:', error);
    setError(error instanceof Error ? error.message : 'Bulk payment failed');
    setCurrentStep('review');
  }
};

// =========================
// 5. CONFIG FILE UPDATE NEEDED
// =========================

// Update /src/lib/config.ts:
// Change this line:
// BULK_PAYROLL_ADDRESS: '0xE9bD986514a6d35B1B73BeA6F19804D3c7aed284',
// To:
// BULK_PAYROLL_ADDRESS: '0x850Ee5aAA4e55668573D5Ce5f055c113Fe7bd0d4',

export {
  BULK_PAYROLL_ADDRESS,
  USDT_ADDRESS,
  bulkPayrollABI,
  handleExecuteBulkPayment
};