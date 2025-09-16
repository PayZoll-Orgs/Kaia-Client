Hi Claude — this is a structured task assignment. Follow the checklist below carefully.
⚠️ Only implement tasks described here. All other context is for knowledge only.
⚠️ Stay up-to-date with Kaia SDK, ERC20 best practices, and meta-tx/fee delegation patterns.
🎯 Goal
Make the dApp fully functional so all payments (BulkPay and SplitBill — InvoicePay ignored for now) happen using the USDT token contract, with:
faucet onboarding,
Kaia fee delegation for gas only for the faucet transaction,
PayAnyone flow,
QR-pay flow,
profile save on first login,
and proper backend recording of profiles + transactions.
📌 Inputs You Must Work With
Frontend repo: [link/branch here]
Backend repo: [link here]
🔽 Paste the backend file(s) here so you can analyze exact schemas:
// paste User model + routes file here
// paste Transaction model + routes file here
Kaia SDK credentials + version (to check docs for login + fee delegation).
Contract addresses & ABIs:
USDT token → USDT_ADDRESS, USDT_ABI
BulkPay → BULKPAY_ADDRESS, BULKPAY_ABI
SplitBill → SPLITBILL_ADDRESS, SPLITBILL_ABI
(InvoicePay ignored for now)
RPC: Kaia testnet/mainnet endpoint.
Friend list API / storage (if already in backend).
🛠️ Tasks
1. Analyze contracts + SDK
Inspect ABIs to confirm flows:
USDT: balanceOf, transfer, approve, faucet (or mint).
BulkPay: does it transferFrom or require approve first?
SplitBill: how is bill splitting handled?
Inspect frontend to see how Kaia SDK login works. Document what the SDK returns (walletAddress, lineUserId, etc.).
Inspect backend files pasted above to confirm data schemas for users + transactions. Extract exact JSON shapes.
2. Profile Save (first login modal)
After Kaia SDK login → show modal requiring:
{
  "username": "required, unique",
  "displayName": "required",
  "pictureUrl": "optional",
  "statusMessage": "optional",
  "walletAddress": "required",
  "lineUserId": "required"   // from SDK
}
POST this to backend using the exact endpoint + schema from backend file.
Handle uniqueness errors (username already exists) gracefully.
3. Faucet + Balance
On Profile page:
Show live USDT balance (balanceOf).
Add Get USDT button calling faucet() (or faucet contract).
Refresh balance after tx.
If user tries a transaction with insufficient USDT → show modal:
"You don’t have enough USDT. Get some from the faucet in your Profile."
4. Fee Delegation(see teh feedelegation and feedelegationexample files)
Integrate Kaia gasless transaction flow:
Either SDK relayer (sendGasless) or meta-tx forwarder.
Ensure faucet + simple transfers work with sponsored gas.
UI should show when a transaction is gasless.
5. PayAnyone
Flow:
Pick friend from friend list → enter amount → confirm.
Validate balance ≥ amount.
transfer(recipient, amount) or approve + BulkPay (depending on ABI).
After tx mined: POST to backend transaction endpoint (check schema).
Save {txHash, from, to, amount, tokenAddress, type: "payAnyone", status} in the exact schema.
6. QR Pay (schema store for both qrpay and the payto anyone is same and same exact things to get stored in the backcened)
Add QR scanner (use jsQR or existing lib).
Extract wallet address (and optional amount).
Prefill PayAnyone form → confirm → send USDT.
Record transaction in backend as "qrPay".
7. SplitBill
Implement SplitBill flows according to contract ABI:
Create bill, split across addresses, settle.
Ensure contract calls succeed via USDT approve/transfer.
Log txs in backend with type: "splitBill".
8. UX + Error Handling
Insufficient USDT → actionable CTA to faucet.
Cancelled tx → toast: Transaction cancelled.
Amount formatting → always use token decimals.
9. Backend Integration
Use only endpoints + JSON shapes defined in backend repo.
Profiles saved on first login.
Transactions recorded on every transfer (PayAnyone, SplitBill, QRPay).
If QR-pay logging not present, extend backend minimally.
10. Deliverables
Frontend:
Profile modal + save,
Profile balance + faucet button,
PayAnyone UI + backend logging,
QR pay scanner + flow,
SplitBill integration.
Backend (if needed): extend for QR-pay or transaction logging.
Tests:
Manual checklist (login, faucet, pay, qr, split).
Simple Hardhat/ethers script to verify balances + tx.
PR with:
Summary of changes,
How to test locally,
Backend endpoints used.
✅ Acceptance Criteria
On first login: modal opens, profile saved with lineUserId.
Profile page: USDT balance + faucet works.
PayAnyone works, tx stored in backend.
QR-pay works (scan, pay, store).
SplitBill works with USDT + backend log.
Fee delegation integrated at least once.
Backend calls use exact schemas (from file).
📌 Notes to you (Claude)
Do not invent endpoint names or fields. Use the backend file pasted above.
If something is missing (e.g. no transaction model), stop and request clarification.
Keep PRs small per feature (profile modal, faucet, PayAnyone, QR).
Always format token amounts with correct decimals.