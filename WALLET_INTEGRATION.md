# LINE DApp Wallet Integration - Kaia Testnet

## Overview

This document outlines the complete integration of LINE's DappPortal wallet functionality with your app, configured for Kaia testnet development and testing.

## Integration Components

### 1. Wallet Service (`src/lib/wallet-service.ts`)
- **Purpose**: Handles all wallet operations using LINE's DappPortal SDK
- **Features**:
  - Kaia testnet configuration (Chain ID: 1001)
  - Wallet connection/disconnection
  - Balance retrieval (KAIA and ERC20 tokens)
  - Transaction signing and sending
  - Message signing for authentication

### 2. Backend Integration Service (`src/lib/wallet-backend.ts`)
- **Purpose**: Manages wallet data persistence using LINE user ID
- **Features**:
  - Save wallet details to backend after creation
  - Retrieve wallet data by LINE user ID
  - Sync wallet data on connection
  - Update and manage wallet records

### 3. Extended Auth Context (`src/contexts/AuthContext.tsx`)
- **Purpose**: Unified authentication and wallet state management
- **Features**:
  - Combined LINE auth and wallet state
  - Automatic backend sync on wallet connection
  - Wallet actions integrated with auth flow

### 4. Wallet UI Component (`src/components/WalletConnect.tsx`)
- **Purpose**: User interface for wallet interactions
- **Features**:
  - Connect/disconnect wallet
  - Display wallet address and balances
  - Testnet indicators and warnings
  - Compact and full display modes

### 5. Updated Portfolio Page (`src/components/tabs/PortfolioPage.tsx`)
- **Purpose**: Displays real wallet data in the portfolio
- **Features**:
  - Real-time wallet balance display
  - Testnet asset information
  - QR code for wallet address
  - Integrated wallet management

## Configuration

### Environment Variables
Add these to your `.env.local`:

```env
# DappPortal SDK (if needed)
NEXT_PUBLIC_DAPP_PORTAL_SDK_URL=https://sdk.dappportal.io/v1/sdk.js

# Backend API
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
```

### Kaia Testnet Configuration
- **Network**: Kairos Testnet
- **Chain ID**: 1001
- **RPC URL**: https://public-en-kairos.node.kaia.io
- **Explorer**: https://kairos.kaiascan.io/
- **USDT Contract**: 0xd077a400968890eacc75cdc901f0356c943e4fdb

## Workflow

### 1. User Authentication Flow
1. User signs up/logs in via LINE
2. LINE provides user ID (Dapp ID)
3. Auth context stores user information
4. **AUTOMATIC WALLET CREATION**: System immediately creates Kaia testnet wallet

### 2. Automatic Wallet Creation Flow
1. User completes LINE authentication
2. System checks if user already has a wallet (DappPortal API → Backend Database)
3. If no wallet exists: DappPortal SDK automatically creates wallet on Kaia testnet
4. Wallet address and type are obtained automatically
5. Backend service saves wallet details with LINE user ID
6. **No user interaction required** - wallet is ready immediately

### 3. Data Persistence & Retrieval Flow
```
LINE User ID → Multiple Sources
├── DappPortal API (Primary)
│   ├── Wallet Address
│   ├── Wallet Type
│   └── Network Info
├── Backend Database (Backup)
│   ├── Wallet Address
│   ├── Wallet Type
│   ├── Network (testnet/mainnet)
│   ├── Creation timestamp
│   └── Active status
└── SDK Current Session
    ├── Connected Accounts
    └── Wallet Type
```

### 4. Wallet Retrieval Strategy
1. **DappPortal API**: Check if DappPortal provides wallet lookup by LINE user ID
2. **Backend Database**: Fallback to stored wallet data
3. **SDK Session**: Use currently connected wallet if available
4. **Auto-Create**: If none found, create new wallet automatically

## Backend API Endpoints

Your backend should implement these endpoints:

### POST `/api/wallet/save`
Save new wallet details
```json
{
  "lineUserId": "string",
  "walletAddress": "string", 
  "walletType": "string",
  "network": "testnet",
  "createdAt": "ISO string",
  "isActive": true
}
```

### GET `/api/wallet/get?lineUserId={id}`
Get wallet by LINE user ID

### GET `/api/wallet/user?lineUserId={id}`
Get all wallets for a user

### PUT `/api/wallet/update`
Update wallet details

### DELETE `/api/wallet/delete`
Delete/deactivate wallet

## Security Considerations

1. **Testnet Only**: All transactions are on Kaia testnet
2. **No Private Keys**: SDK manages private keys securely
3. **User Consent**: Wallet connection requires user approval
4. **Backend Validation**: Validate LINE user ID on backend
5. **Rate Limiting**: Implement API rate limiting

## Testing

### Prerequisites
1. LINE Developer account
2. LIFF app configured
3. Kaia testnet tokens for testing
4. Backend API running

### Test Scenarios
1. **Wallet Connection**: Test with different wallet types
2. **Balance Display**: Verify KAIA and USDT balances
3. **Backend Sync**: Confirm data saves to backend
4. **Reconnection**: Test wallet reconnection flow
5. **Error Handling**: Test network errors and failures

## Deployment Notes

1. **SDK Loading**: DappPortal SDK loads asynchronously
2. **Network Detection**: App verifies testnet connection
3. **Fallback Handling**: Graceful degradation if SDK fails
4. **Backend Dependency**: App works without backend (limited functionality)

## Future Enhancements

1. **Mainnet Support**: Add mainnet configuration
2. **Multi-Wallet**: Support multiple wallets per user
3. **Transaction History**: Track and display transactions
4. **Token Management**: Add/remove custom tokens
5. **Advanced Features**: DeFi integrations, NFT support

## Troubleshooting

### Common Issues

1. **SDK Not Loading**: Check CDN URL and network
2. **Wallet Not Connecting**: Verify testnet configuration
3. **Backend Errors**: Check API endpoints and CORS
4. **Balance Not Updating**: Refresh wallet data manually

### Debug Tools

1. Browser console for wallet operations
2. Network tab for API calls
3. Kaia testnet explorer for transactions
4. Backend logs for data persistence

## Support

- **LINE DappPortal Docs**: https://docs.dappportal.io/
- **Kaia Documentation**: https://docs.kaia.io/
- **Testnet Faucet**: Get testnet tokens for development
