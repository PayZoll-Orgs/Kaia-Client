# Updated LINE DApp Wallet Integration - Auto-Creation Flow

## 🔄 Flow Changes Summary

### Previous Flow (Manual)
1. User logs in via LINE
2. User manually clicks "Connect Wallet"
3. User selects network (testnet/mainnet)
4. Wallet connects and saves to backend

### **New Flow (Automatic)**
1. User logs in via LINE
2. **System automatically creates Kaia testnet wallet**
3. **No network selection** - always testnet for development
4. **No user interaction required** - wallet ready immediately
5. Wallet details saved to backend using LINE user ID

## 🎯 Key Changes Made

### 1. Wallet Service Updates (`wallet-service.ts`)
- Added `autoCreateWallet()` method for automatic wallet creation
- Enhanced `getWalletByLineUserId()` with multi-strategy retrieval
- Fixed testnet configuration (Kaia Chain ID: 1001)
- Removed network selection - always uses testnet

### 2. Auth Context Updates (`AuthContext.tsx`)
- Auto-creates wallet during login process
- Added `autoCreateWallet` action to context
- Enhanced initialization to check for existing wallets
- Automatic backend sync after wallet creation

### 3. UI Component Updates (`WalletConnect.tsx`)
- Changed "Connect Wallet" to "Setup Wallet"
- Updated messaging to reflect automatic creation
- Enhanced error handling for auto-creation

### 4. DappPortal Integration (`dappportal-api.ts`)
- **NEW**: Service to check DappPortal API for wallet retrieval
- Multi-source wallet lookup strategy
- Fallback mechanisms for reliable wallet access

### 5. Portfolio Page Updates (`PortfolioPage.tsx`)
- Real-time wallet data display
- Testnet indicators and warnings
- Automatic QR code generation for wallet address

## 🔍 Wallet Retrieval Strategy

The system now uses a comprehensive approach to find user wallets:

```typescript
// Priority order for finding wallets:
1. DappPortal API (if available)
   └── getUserWallet(lineUserId)
   
2. Backend Database
   └── getWalletByLineUserId(lineUserId)
   
3. SDK Current Session
   └── kaia_accounts request
   
4. Auto-Create New Wallet
   └── kaia_requestAccounts (creates if needed)
```

## 🏗️ Implementation Details

### Automatic Wallet Creation
```typescript
// In AuthContext after successful login:
const walletAddress = await walletService.autoCreateWallet();
const backendResult = await backendService.syncWalletData(
  user.userId, 
  walletAddress, 
  walletType
);
```

### Enhanced Wallet Retrieval
```typescript
// Multi-source lookup:
const walletInfo = await enhancedRetrieval.getWalletByLineUserId(lineUserId);
// Returns: { address, walletType, source: 'dappportal' | 'backend' | 'none' }
```

### Testnet Configuration
```typescript
const KAIA_TESTNET_CONFIG = {
  chainId: '0x3e9', // 1001 in decimal
  chainName: 'Kairos Testnet',
  rpcUrls: ['https://public-en-kairos.node.kaia.io'],
  // Always testnet - no user selection needed
};
```

## 🔧 Backend Requirements

Your backend should handle these scenarios:

### 1. Wallet Auto-Creation Sync
```json
POST /api/wallet/save
{
  "lineUserId": "U1234567890abcdef",
  "walletAddress": "0x742d35cc6634c0532925a3b8d...",
  "walletType": "Liff",
  "network": "testnet",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "isActive": true
}
```

### 2. Wallet Lookup by LINE User ID
```json
GET /api/wallet/get?lineUserId=U1234567890abcdef
{
  "success": true,
  "data": {
    "walletAddress": "0x742d35cc6634c0532925a3b8d...",
    "walletType": "Liff",
    "network": "testnet"
  }
}
```

## 🧪 Testing the New Flow

### Test Scenarios:
1. **New User**: Login → Auto wallet creation → Backend sync
2. **Existing User**: Login → Find existing wallet → Connect
3. **DappPortal API**: Test wallet retrieval via LINE user ID
4. **Fallback**: Test backend retrieval when DappPortal unavailable
5. **Error Handling**: Test wallet creation failures

### Debug Points:
- Check browser console for wallet creation logs
- Verify backend receives wallet data
- Confirm testnet connection (Chain ID: 1001)
- Test balance retrieval and display

## 🚀 Deployment Checklist

- [ ] Backend API endpoints implemented
- [ ] DappPortal SDK URL configured
- [ ] Environment variables set
- [ ] Testnet RPC endpoints accessible
- [ ] Error logging and monitoring setup

## 📋 Next Steps

1. **Test Integration**: Verify auto-creation works with real LINE login
2. **Backend Setup**: Implement the required API endpoints
3. **DappPortal Verification**: Confirm actual API capabilities
4. **Error Handling**: Test edge cases and failures
5. **Production Ready**: Add monitoring and logging

## 🔍 Verification Needed

### DappPortal API Capabilities
The integration includes hypothetical DappPortal API methods that need verification:

- `getUserWallet(lineUserId)` - Does this exist?
- Wallet creation via API - Is this supported?
- Authentication requirements - API keys needed?

### Recommended Approach
1. Start with backend database as primary storage
2. Use SDK for wallet operations
3. Add DappPortal API integration once verified
4. Test thoroughly in testnet environment

This updated flow provides a seamless user experience where wallets are automatically created and managed without user intervention, while maintaining robust fallback mechanisms for reliability.
