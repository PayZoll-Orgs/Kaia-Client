# 📋 KAIAPAY MANUAL TESTING - QUICK REFERENCE

## 🎯 **ESSENTIAL CONTRACT ADDRESSES**
```
USDT Token:     0x8CCaC8CBE276a225B1Af2b85dEee8e12cFB48193
BulkPayroll:    0xE9bD986514a6d35B1B73BeA6F19804D3c7aed284  
InvoiceService: 0xc70DfAf8d864125D37237fc7B034ACAE1f3397d9
SplitBilling:   0x6892D8358bD3EE04a35Ad5844181BDED05dcdf2f
Your Address:   0xEEFfe4C8B285A3f55EEC9fB50C9c96F69f9B453e
```

## ⚡ **QUICK TESTING SEQUENCE**

### **1. USDT TOKEN (Start Here)**
```
Contract: 0x8CCaC8CBE276a225B1Af2b85dEee8e12cFB48193

🔸 faucet() → Get free TUSDT
🔸 mint(0xEEFfe4C8B285A3f55EEC9fB50C9c96F69f9B453e, 500000000000000000000) → Mint 500 TUSDT
🔸 transfer(0x1111111111111111111111111111111111111111, 100000000000000000000) → Send 100 TUSDT
🔸 approve(0xE9bD986514a6d35B1B73BeA6F19804D3c7aed284, 1000000000000000000000) → Approve BulkPayroll
```

### **2. BULK PAYROLL**
```
Contract: 0xE9bD986514a6d35B1B73BeA6F19804D3c7aed284

🔸 bulkTransfer(
   ["0x2222222222222222222222222222222222222222","0x3333333333333333333333333333333333333333"],
   ["50000000000000000000","75000000000000000000"]
) → Send to 2 addresses
```

### **3. INVOICE SERVICE**
```
Contract: 0xc70DfAf8d864125D37237fc7B034ACAE1f3397d9

🔸 listService(
   "Web Development", 
   "React app development", 
   "https://example.com/service.jpg", 
   200000000000000000000
) → Create 200 TUSDT service

🔸 updateServiceStatus(1, false) → Disable service
🔸 updateServiceStatus(1, true) → Re-enable service
🔸 updatePlatformFee(400) → Set 4% fee
```

### **4. SPLIT BILLING**
```
First: Approve USDT for SplitBilling
Contract: 0x8CCaC8CBE276a225B1Af2b85dEee8e12cFB48193
🔸 approve(0x6892D8358bD3EE04a35Ad5844181BDED05dcdf2f, 500000000000000000000)

Then: Contract: 0x6892D8358bD3EE04a35Ad5844181BDED05dcdf2f
🔸 createSplit(
   0xEEFfe4C8B285A3f55EEC9fB50C9c96F69f9B453e,
   ["0x5555555555555555555555555555555555555555"],
   ["80000000000000000000"],
   1758459600,
   "Dinner Split"
)

🔸 payForSomeone(1, 0x5555555555555555555555555555555555555555) → Pay for debtor
```

## 💡 **WEI CONVERSION CHEAT SHEET**
```
1 TUSDT    = 1000000000000000000
50 TUSDT   = 50000000000000000000  
100 TUSDT  = 100000000000000000000
200 TUSDT  = 200000000000000000000
500 TUSDT  = 500000000000000000000
1000 TUSDT = 1000000000000000000000
```

## 🔍 **VERIFICATION CHECKLIST**
- [ ] USDT balance increased after faucet/mint
- [ ] Transfer showed in recipient's balance  
- [ ] Bulk transfer distributed correctly
- [ ] Services created and visible
- [ ] Split bill created successfully
- [ ] Payment processed for split
- [ ] All transactions visible on KaiaScan

## 🚨 **TROUBLESHOOTING**
- **"Insufficient allowance"** → Run approve() first
- **"Cannot buy own service"** → This is correct behavior
- **"Faucet cooldown"** → Wait 24 hours or use mint()
- **Gas estimation failed** → Increase gas limit

## 🔗 **KaiaScan Links**
- Token: https://kairos.kaiascope.com/token/0x8CCaC8CBE276a225B1Af2b85dEee8e12cFB48193
- Explorer: https://kairos.kaiascope.com
- Your Address: https://kairos.kaiascope.com/address/0xEEFfe4C8B285A3f55EEC9fB50C9c96F69f9B453e
