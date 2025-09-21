# 🧪 KAIAPAY MANUAL TESTING GUIDE

## 📋 Complete Sequential Testing Flow for All Contracts

This guide provides step-by-step manual testing instructions with exact inputs to test all KaiaPay contracts on Kaia Testnet.

---

## 🏗️ **CONTRACT ADDRESSES**

| Contract | Address | KaiaScan Link |
|----------|---------|---------------|
| **USDT Token** | `0xd55B72640f3e31910A688a2Dc81876F053115B09` | [View Contract](https://kairos.kaiascope.com/address/0xd55B72640f3e31910A688a2Dc81876F053115B09) |
| **BulkPayroll** | `0xE9bD986514a6d35B1B73BeA6F19804D3c7aed284` | [View Contract](https://kairos.kaiascope.com/address/0xE9bD986514a6d35B1B73BeA6F19804D3c7aed284) |
| **InvoiceService** | `0xc70DfAf8d864125D37237fc7B034ACAE1f3397d9` | [View Contract](https://kairos.kaiascope.com/address/0xc70DfAf8d864125D37237fc7B034ACAE1f3397d9) |
| **SplitBilling** | `0x6892D8358bD3EE04a35Ad5844181BDED05dcdf2f` | [View Contract](https://kairos.kaiascope.com/address/0x6892D8358bD3EE04a35Ad5844181BDED05dcdf2f) |

---

## 🎯 **PHASE 1: USDT TOKEN TESTING**

### **Contract**: `0xd55B72640f3e31910A688a2Dc81876F053115B09`

#### **Step 1.1: Check Token Information**
- **Function**: `name()` 
- **Input**: None
- **Expected Output**: "Test USDT"

#### **Step 1.2: Check Symbol** 
- **Function**: `symbol()`
- **Input**: None  
- **Expected Output**: "TUSDT"

#### **Step 1.3: Check Decimals**
- **Function**: `decimals()`
- **Input**: None
- **Expected Output**: `18`

#### **Step 1.4: Check Your Balance**
- **Function**: `balanceOf(address)`
- **Input**: `0xEEFfe4C8B285A3f55EEC9fB50C9c96F69f9B453e` (your address)
- **Expected Output**: Large number (your current TUSDT balance)

#### **Step 1.5: Claim from Faucet** ⭐
- **Function**: `faucet()`
- **Input**: None
- **Gas Limit**: 100000
- **Expected**: Receive 1000 TUSDT (if not claimed in 24h)

#### **Step 1.6: Mint Tokens (Owner Only)** ⭐
- **Function**: `mint(address,uint256)`
- **Input 1**: `0xEEFfe4C8B285A3f55EEC9fB50C9c96F69f9B453e` (your address)
- **Input 2**: `500000000000000000000` (500 TUSDT in wei)
- **Gas Limit**: 100000
- **Expected**: +500 TUSDT to your balance

#### **Step 1.7: Transfer Tokens** ⭐
- **Function**: `transfer(address,uint256)`
- **Input 1**: `0x1111111111111111111111111111111111111111` (test recipient)
- **Input 2**: `100000000000000000000` (100 TUSDT in wei)
- **Gas Limit**: 100000
- **Expected**: Transfer 100 TUSDT to test address

#### **Step 1.8: Approve Spending** ⭐
- **Function**: `approve(address,uint256)`
- **Input 1**: `0xE9bD986514a6d35B1B73BeA6F19804D3c7aed284` (BulkPayroll contract)
- **Input 2**: `1000000000000000000000` (1000 TUSDT in wei)
- **Gas Limit**: 100000
- **Expected**: Allow BulkPayroll to spend 1000 TUSDT

---

## 🚀 **PHASE 2: BULK PAYROLL TESTING**

### **Contract**: `0xE9bD986514a6d35B1B73BeA6F19804D3c7aed284`

#### **Step 2.1: Check USDT Token Address**
- **Function**: `usdtToken()`
- **Input**: None
- **Expected Output**: `0xd55B72640f3e31910A688a2Dc81876F053115B09`

#### **Step 2.2: Check Max Recipients**
- **Function**: `MAX_RECIPIENTS()`
- **Input**: None
- **Expected Output**: `200`

#### **Step 2.3: Execute Bulk Transfer** ⭐
- **Function**: `bulkTransfer(address[],uint256[])`
- **Input 1** (recipients array): 
  ```
  ["0x2222222222222222222222222222222222222222","0x3333333333333333333333333333333333333333","0x4444444444444444444444444444444444444444"]
  ```
- **Input 2** (amounts array):
  ```
  ["50000000000000000000","75000000000000000000","100000000000000000000"]
  ```
- **Gas Limit**: 200000
- **Expected**: Transfer 50+75+100=225 TUSDT to 3 addresses

#### **Step 2.4: Check Failed Amount**
- **Function**: `getFailedAmount(address)`
- **Input**: `0xEEFfe4C8B285A3f55EEC9fB50C9c96F69f9B453e`
- **Expected Output**: `0` (no failed transfers)

---

## 📋 **PHASE 3: INVOICE SERVICE TESTING**

### **Contract**: `0xc70DfAf8d864125D37237fc7B034ACAE1f3397d9`

#### **Step 3.1: Check Contract Configuration**
- **Function**: `usdtToken()`
- **Expected Output**: `0xd55B72640f3e31910A688a2Dc81876F053115B09`

- **Function**: `platformFeeRate()`
- **Expected Output**: `300` (3%)

#### **Step 3.2: List a Service** ⭐
- **Function**: `listService(string,string,string,uint256)`
- **Input 1**: `"Premium Web Development"`
- **Input 2**: `"Full-stack React application with modern UI/UX design"`
- **Input 3**: `"https://example.com/web-dev-service.jpg"`
- **Input 4**: `200000000000000000000` (200 TUSDT in wei)
- **Gas Limit**: 150000
- **Expected**: Create service with ID 1 (or next available ID)

#### **Step 3.3: List Another Service** ⭐
- **Function**: `listService(string,string,string,uint256)`
- **Input 1**: `"Mobile App Development"`
- **Input 2**: `"Cross-platform mobile application with React Native"`
- **Input 3**: `"https://example.com/mobile-app.jpg"`
- **Input 4**: `300000000000000000000` (300 TUSDT in wei)
- **Gas Limit**: 150000

#### **Step 3.4: Check Service Details**
- **Function**: `getService(uint256)`
- **Input**: `1` (service ID from step 3.2)
- **Expected**: Service details with name, price, etc.

#### **Step 3.5: Update Service Status** ⭐
- **Function**: `updateServiceStatus(uint256,bool)`
- **Input 1**: `1` (service ID)
- **Input 2**: `false` (disable service)
- **Gas Limit**: 100000

#### **Step 3.6: Re-enable Service** ⭐
- **Function**: `updateServiceStatus(uint256,bool)`
- **Input 1**: `1` (service ID)
- **Input 2**: `true` (enable service)
- **Gas Limit**: 100000

#### **Step 3.7: Get Your Services**
- **Function**: `getSellerServices(address)`
- **Input**: `0xEEFfe4C8B285A3f55EEC9fB50C9c96F69f9B453e`
- **Expected**: Array of your service IDs

#### **Step 3.8: Update Platform Fee (Owner Only)** ⭐
- **Function**: `updatePlatformFee(uint256)`
- **Input**: `400` (4%)
- **Gas Limit**: 100000

---

## 🔄 **PHASE 4: SPLIT BILLING TESTING**

### **Contract**: `0x6892D8358bD3EE04a35Ad5844181BDED05dcdf2f`

#### **Step 4.1: Check USDT Token**
- **Function**: `usdtToken()`
- **Expected Output**: `0xd55B72640f3e31910A688a2Dc81876F053115B09`

#### **Step 4.2: Check Max Recipients**
- **Function**: `MAX_RECIPIENTS()`
- **Expected Output**: `100`

#### **Step 4.3: Approve USDT for Split Billing** ⭐
- **Go to USDT Contract**: `0xd55B72640f3e31910A688a2Dc81876F053115B09`
- **Function**: `approve(address,uint256)`
- **Input 1**: `0x6892D8358bD3EE04a35Ad5844181BDED05dcdf2f`
- **Input 2**: `500000000000000000000` (500 TUSDT in wei)
- **Gas Limit**: 100000

#### **Step 4.4: Create Split Bill** ⭐
- **Function**: `createSplit(address,address[],uint256[],uint256,string)`
- **Input 1** (payee): `0xEEFfe4C8B285A3f55EEC9fB50C9c96F69f9B453e` (your address)
- **Input 2** (debtors): 
  ```
  ["0x5555555555555555555555555555555555555555","0x6666666666666666666666666666666666666666","0x7777777777777777777777777777777777777777"]
  ```
- **Input 3** (amounts):
  ```
  ["80000000000000000000","120000000000000000000","60000000000000000000"]
  ```
- **Input 4** (deadline): `1758459600` (timestamp ~7 days from now)
- **Input 5** (description): `"Restaurant Dinner Split - Group Payment"`
- **Gas Limit**: 200000
- **Expected**: Create split with ID 1

#### **Step 4.5: Check Split Details**
- **Function**: `getSplit(uint256)`
- **Input**: `1` (split ID from step 4.4)
- **Expected**: Split details showing payee, debtors, amounts

#### **Step 4.6: Pay for Someone Else** ⭐
- **Function**: `payForSomeone(uint256,address)`
- **Input 1**: `1` (split ID)
- **Input 2**: `0x5555555555555555555555555555555555555555` (first debtor)
- **Gas Limit**: 150000
- **Expected**: Pay 80 TUSDT for the first debtor

#### **Step 4.7: Check Split Completion**
- **Function**: `getSplit(uint256)`
- **Input**: `1`
- **Expected**: Check if split shows partial payment

#### **Step 4.8: Create Split to Cancel** ⭐
- **Function**: `createSplit(address,address[],uint256[],uint256,string)`
- **Input 1**: `0xEEFfe4C8B285A3f55EEC9fB50C9c96F69f9B453e`
- **Input 2**: `["0x8888888888888888888888888888888888888888"]`
- **Input 3**: `["50000000000000000000"]`
- **Input 4**: `1758459600`
- **Input 5**: `"Test Split for Cancellation"`
- **Gas Limit**: 200000

#### **Step 4.9: Cancel Split** ⭐
- **Function**: `cancelSplit(uint256)`
- **Input**: `2` (split ID from step 4.8)
- **Gas Limit**: 100000
- **Expected**: Split gets cancelled

---

## 📊 **PHASE 5: FINAL VERIFICATION**

### **Step 5.1: Check Final USDT Balances**
- **Go to USDT Contract**: `0xd55B72640f3e31910A688a2Dc81876F053115B09`
- **Function**: `balanceOf(address)`
- **Check these addresses**:
  - Your address: `0xEEFfe4C8B285A3f55EEC9fB50C9c96F69f9B453e`
  - Test address: `0x1111111111111111111111111111111111111111`
  - Bulk recipients: `0x2222...`, `0x3333...`, `0x4444...`

### **Step 5.2: Verify Transaction History**
Visit KaiaScan for each contract and check:
- **Token Transfers** tab for USDT movements
- **Internal Transactions** for contract interactions
- **Events** logs for function calls

---

## 🎯 **QUICK REFERENCE: WEI CONVERSION**

| Amount | Wei Value | Usage |
|--------|-----------|--------|
| 1 TUSDT | `1000000000000000000` | Small transfers |
| 50 TUSDT | `50000000000000000000` | Split payments |
| 100 TUSDT | `100000000000000000000` | Medium transfers |
| 200 TUSDT | `200000000000000000000` | Service prices |
| 500 TUSDT | `500000000000000000000` | Large approvals |
| 1000 TUSDT | `1000000000000000000000` | Bulk operations |

---

## ⚠️ **IMPORTANT NOTES**

1. **Gas Limits**: Always set appropriate gas limits for transactions
2. **Approvals**: Remember to approve USDT spending before contract interactions
3. **Address Format**: Use full 42-character addresses (0x...)
4. **Array Format**: Use proper JSON array format for multiple inputs
5. **Wei Values**: All USDT amounts must be in wei (18 decimals)
6. **Sequence**: Follow the phases in order for best results

---

## 🔗 **KaiaScan Interface Guide**

### **How to Interact on KaiaScan:**

1. **Visit contract address** on KaiaScan
2. **Click "Contract" tab**
3. **Click "Write Contract"** (connect wallet first)
4. **Find the function** you want to test
5. **Enter inputs** exactly as specified above
6. **Set gas limit** as recommended
7. **Click "Write"** and confirm transaction
8. **Check "Read Contract"** for view functions

### **Verifying Results:**
- Check **"Transactions"** tab for your interactions
- Look at **"Token Transfers"** for USDT movements
- Use **"Events"** tab to see function call logs
- Compare balances before/after operations

**Follow this guide step by step to thoroughly test all KaiaPay contract functionality!** 🚀
