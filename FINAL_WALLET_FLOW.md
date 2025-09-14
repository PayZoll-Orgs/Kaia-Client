# Final LINE DApp Wallet Flow - Signup vs Login

## ✅ **LINE User ID Behavior: CONSTANT**

**Great news!** The LINE Dapp ID (User ID) **remains constant** across all login sessions:
- ✅ Same user = Same LINE User ID forever
- ✅ Never changes across login/logout cycles  
- ✅ Perfect for reliable wallet mapping

## 🔄 **Updated Flow: Signup vs Login**

### 📝 **Signup Flow (New User)**
```
1. User signs up via LINE
2. Get LINE User ID (e.g., "U1234567890abcdef")
3. Check Backend: Does this user ID have a wallet? → NO
4. Create new wallet on Kaia testnet via SDK
5. Save wallet details to backend:
   - LINE User ID: "U1234567890abcdef"
   - Wallet Address: "0x742d35cc6634c0532925a3b8d..."
   - Wallet Type: "Liff"
   - Network: "testnet"
6. User ready with wallet!
```

### 🔐 **Login Flow (Existing User)**
```
1. User logs in via LINE
2. Get LINE User ID (same as signup: "U1234567890abcdef")
3. Check Backend: Does this user ID have a wallet? → YES
4. Found existing wallet: "0x742d35cc6634c0532925a3b8d..."
5. Connect to existing wallet via SDK
6. User ready with their existing wallet!
```

### ⚠️ **Edge Case: Login but No Wallet Found**
```
1. User logs in via LINE (maybe they signed up before wallet feature)
2. Get LINE User ID: "U1234567890abcdef"
3. Check Backend: Does this user ID have a wallet? → NO
4. Treat as first-time wallet setup:
   - Create new wallet via SDK
   - Save to backend with their LINE User ID
5. User ready with new wallet!
```

## 🏗️ **Implementation Details**

### **Backend Check Strategy**
```javascript
// On every login/signup:
const handleWalletSetupForUser = async (lineUserId) => {
  // Step 1: Check backend for existing wallet
  const backendWallet = await backend.getWalletByLineUserId(lineUserId);
  
  if (backendWallet.exists) {
    // Existing user - connect to their wallet
    console.log('🔍 Found existing wallet:', backendWallet.address);
    await connectToExistingWallet(backendWallet.address);
  } else {
    // New user or no wallet yet - create new one
    console.log('🆕 Creating new wallet for user');
    await createAndSaveNewWallet(lineUserId);
  }
};
```

### **Database Schema**
```sql
CREATE TABLE user_wallets (
  line_user_id VARCHAR(255) PRIMARY KEY,  -- Constant LINE User ID
  wallet_address VARCHAR(255) NOT NULL,   -- Kaia testnet address
  wallet_type VARCHAR(50),                -- "Liff", "Web", etc.
  network VARCHAR(20) DEFAULT 'testnet',  -- Always testnet for now
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Example data:
-- line_user_id: "U1234567890abcdef"
-- wallet_address: "0x742d35cc6634c0532925a3b8d..."
-- wallet_type: "Liff"
-- network: "testnet"
```

## 🔧 **Backend API Requirements**

### **1. Check/Get Wallet**
```http
GET /api/wallet/get?lineUserId=U1234567890abcdef

Response:
{
  "success": true,
  "data": {
    "walletAddress": "0x742d35cc6634c0532925a3b8d...",
    "walletType": "Liff",
    "network": "testnet",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}

// OR if no wallet found:
{
  "success": false,
  "error": "No wallet found for user",
  "data": null
}
```

### **2. Save New Wallet**
```http
POST /api/wallet/save

Body:
{
  "lineUserId": "U1234567890abcdef",
  "walletAddress": "0x742d35cc6634c0532925a3b8d...",
  "walletType": "Liff",
  "network": "testnet"
}

Response:
{
  "success": true,
  "message": "Wallet saved successfully",
  "data": {
    "walletAddress": "0x742d35cc6634c0532925a3b8d...",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

## 🎯 **Key Benefits of This Approach**

### ✅ **Reliable User Experience**
- Same wallet every time for same user
- No wallet confusion or loss
- Seamless across devices and sessions

### ✅ **Efficient Resource Usage**
- Only create wallet when needed
- No duplicate wallets per user
- Clean database with one-to-one mapping

### ✅ **Simple Implementation**
- Clear signup vs login distinction
- Fallback handling for edge cases
- Minimal backend requirements

## 📊 **Flow Comparison**

| Scenario | Backend Check | Action | Result |
|----------|---------------|--------|---------|
| **New Signup** | No wallet found | Create new wallet | New wallet created & saved |
| **Existing Login** | Wallet found | Connect to existing | User gets their wallet back |
| **Edge Case Login** | No wallet found | Create new wallet | Treat as first-time setup |

## 🚀 **Implementation Status**

### ✅ **Completed:**
- LINE User ID persistence confirmed
- Auth context updated with backend check
- Signup vs login flow differentiation
- Edge case handling

### 🔧 **Next Steps:**
1. **Backend Implementation**: Create the 2 API endpoints
2. **Testing**: Test signup → logout → login flow
3. **Edge Case Testing**: Test users without wallets
4. **Production**: Deploy and monitor

## 🎉 **Final Architecture**

```
LINE Authentication → Get Constant User ID → Backend Check
                                                    ↓
                                            Wallet Exists?
                                           ↙️            ↘️
                                      YES                 NO
                                       ↓                   ↓
                                Connect to            Create New
                                Existing              Wallet &
                                Wallet                Save to Backend
                                       ↓                   ↓
                                    User Ready ← ← ← ← ← ← ↓
```

This approach gives you:
- **🔒 Reliable**: Same wallet always for same user
- **⚡ Efficient**: Only create when needed  
- **🎯 Simple**: Clear logic flow
- **🛡️ Safe**: Testnet-only for development

Perfect for your use case! 🎯
