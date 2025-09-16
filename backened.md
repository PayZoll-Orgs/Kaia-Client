# PayZoll Backend API Documentation

## Base URL
```
https://kaia-server.onrender.com/
```

## Database Schema

### User Schema
```javascript
{
  userId: String (required, unique),        // Your app user ID
  displayName: String (required),           // User's display name
  pictureUrl: String (optional),            // Profile picture URL
  statusMessage: String (optional),         // User status message
  walletAddress: String (required),         // Crypto wallet address
  lineUserId: String (required)             // LINE user ID for notifications
}
```

### P2P Transaction Schema
```javascript
{
  senderId: String (required),              // Sender's userId
  receiverId: String (required),            // Receiver's userId
  amount: Number (required),                // Transaction amount
  transactionHash: String (required),       // Blockchain transaction hash
  status: String (required),                // Transaction status
  createdAt: Date (auto)                    // Transaction timestamp
}
```

### Bulk Payment Schema
```javascript
{
  senderId: String (required),              // Sender's userId
  receiverIds: [String] (required),         // Array of receiver userIds
  amounts: [Number] (required),             // Array of amounts (same order as receiverIds)
  transactionHash: String (required),       // Blockchain transaction hash
  status: String (required),                // Transaction status
  createdAt: Date (auto)                    // Transaction timestamp
}
```

### Split Payment Schema
```javascript
{
  payeeId: String (required),               // Who created the split (restaurant, etc.)
  contributorIds: [String] (required),      // Array of people who need to pay
  amounts: [Number] (required),             // Array of amounts each contributor owes
  transactionHash: String (required),       // Blockchain transaction hash
  status: [                                 // Payment status for each contributor
    {
      contributorId: String (required),
      paid: Boolean (required, default: false)
    }
  ],
  createdAt: Date (auto)                    // Transaction timestamp
}
```

---

## Authentication Routes (`/api/auth`)

### 1. Add User
**POST** `/api/auth/addUser`

**Request Body:**
```json
{
  "userId": "sarthak123",
  "displayName": "Sarthak Patel",
  "pictureUrl": "https://profile.line-scdn.net/sarthak",
  "statusMessage": "Hello from PayZoll!",
  "walletAddress": "0x742d35cc6e1f23c6d8b3c8f9f1e4a5b6c7d8e9f0",
  "lineUserId": "U4af4980629abc123def456789012345f"
}
```

**Success Response (201):**
```json
{
  "_id": "64f1234567890abcdef123456",
  "userId": "sarthak123",
  "displayName": "Sarthak Patel",
  "pictureUrl": "https://profile.line-scdn.net/sarthak",
  "statusMessage": "Hello from PayZoll!",
  "walletAddress": "0x742d35cc6e1f23c6d8b3c8f9f1e4a5b6c7d8e9f0",
  "lineUserId": "U4af4980629abc123def456789012345f"
}
```

**Error Response (400):**
```json
{
  "error": "User already exists"
}
```

### 2. Get User by ID
**GET** `/api/auth/getUser/:userId`

**URL Example:**
```
http://localhost:5000/api/auth/getUser/sarthak123
```

**Success Response (200):**
```json
{
  "_id": "64f1234567890abcdef123456",
  "userId": "sarthak123",
  "displayName": "Sarthak Patel",
  "pictureUrl": "https://profile.line-scdn.net/sarthak",
  "statusMessage": "Hello from PayZoll!",
  "walletAddress": "0x742d35cc6e1f23c6d8b3c8f9f1e4a5b6c7d8e9f0",
  "lineUserId": "U4af4980629abc123def456789012345f"
}
```

**Error Response (404):**
```json
{
  "error": "User not found"
}
```

### 3. Search Users
**GET** `/api/auth/searchUsers?query=sar`

**Query Parameters:**
- `query` (required): Search term for userId

**URL Example:**
```
http://localhost:5000/api/auth/searchUsers?query=sar
```

**Success Response (200):**
```json
[
  {
    "_id": "64f1234567890abcdef123456",
    "userId": "sarthak123",
    "displayName": "Sarthak Patel",
    "walletAddress": "0x742d35cc6e1f23c6d8b3c8f9f1e4a5b6c7d8e9f0"
  },
  {
    "_id": "64f1234567890abcdef123457",
    "userId": "sarika456",
    "displayName": "Sarika Sharma",
    "walletAddress": "0x842d35cc6e1f23c6d8b3c8f9f1e4a5b6c7d8e9f1"
  }
]
```

### 4. Get All Users
**GET** `/api/auth/getAllUsers`

**Success Response (200):**
```json
[
  {
    "_id": "64f1234567890abcdef123456",
    "userId": "sarthak123",
    "displayName": "Sarthak Patel",
    "walletAddress": "0x742d35cc6e1f23c6d8b3c8f9f1e4a5b6c7d8e9f0"
  }
]
```

---

## P2P Transaction Routes (`/api/p2p`)

### 1. Record P2P Transaction
**POST** `/api/p2p/recordP2PTxn`

**Request Body:**
```json
{
  "senderId": "sarthak123",
  "receiverId": "alice456",
  "amount": 100.50,
  "transactionHash": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
  "status": "completed"
}
```

**Success Response (201):**
```json
{
  "_id": "64f1234567890abcdef123456",
  "senderId": "sarthak123",
  "receiverId": "alice456",
  "amount": 100.50,
  "transactionHash": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
  "status": "completed",
  "createdAt": "2023-09-16T10:30:00.000Z"
}
```

**Features:**
- ✅ Sends LINE push notification to both sender and receiver
- ✅ Includes sender/receiver names in notifications

### 2. Get P2P Transactions
**GET** `/api/p2p/getP2PTxns/:userId`

**URL Example:**
```
http://localhost:5000/api/p2p/getP2PTxns/sarthak123
```

**Success Response (200):**
```json
[
  {
    "_id": "64f1234567890abcdef123456",
    "senderId": "sarthak123",
    "receiverId": "alice456",
    "amount": 100.50,
    "transactionHash": "0x1234567890abcdef...",
    "status": "completed",
    "createdAt": "2023-09-16T10:30:00.000Z"
  }
]
```

---

## Bulk Payment Routes (`/api/bulk`)

### 1. Record Bulk Transaction
**POST** `/api/bulk/recordBulkTxn`

**Request Body:**
```json
{
  "senderId": "sarthak123",
  "receiverIds": ["alice456", "bob789", "charlie101"],
  "amounts": [100.50, 75.25, 200.00],
  "transactionHash": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
  "status": "completed"
}
```

**Success Response (201):**
```json
{
  "_id": "64f1234567890abcdef123456",
  "senderId": "sarthak123",
  "receiverIds": ["alice456", "bob789", "charlie101"],
  "amounts": [100.50, 75.25, 200.00],
  "transactionHash": "0x1234567890abcdef...",
  "status": "completed",
  "createdAt": "2023-09-16T10:30:00.000Z"
}
```

**Important:** `receiverIds` and `amounts` arrays must have the same length and order.

### 2. Update Bulk Transaction Status
**PUT** `/api/bulk/updateBulkTxnStatus/:id`

**URL Example:**
```
http://localhost:5000/api/bulk/updateBulkTxnStatus/64f1234567890abcdef123456
```

**Request Body:**
```json
{
  "status": "completed"
}
```

**Success Response (200):**
```json
{
  "_id": "64f1234567890abcdef123456",
  "senderId": "sarthak123",
  "receiverIds": ["alice456", "bob789"],
  "amounts": [100.50, 75.25],
  "status": "completed",
  "createdAt": "2023-09-16T10:30:00.000Z"
}
```

### 3. Get Bulk Transactions
**GET** `/api/bulk/getBulkTxns/:userId`

**URL Example:**
```
http://localhost:5000/api/bulk/getBulkTxns/sarthak123
```

**Success Response (200):**
```json
[
  {
    "_id": "64f1234567890abcdef123456",
    "senderId": "sarthak123",
    "receiverIds": ["alice456", "bob789"],
    "amounts": [100.50, 75.25],
    "status": "completed",
    "createdAt": "2023-09-16T10:30:00.000Z"
  }
]
```

**Note:** Returns transactions where user is either sender or receiver.

---

## Split Payment Routes (`/api/split`)

### 1. Record Split Transaction
**POST** `/api/split/recordSplitTxn`

**Request Body:**
```json
{
  "payeeId": "restaurant123",
  "contributorIds": ["alice456", "bob789", "charlie101"],
  "amounts": [33.33, 33.33, 33.34],
  "transactionHash": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
  "status": [
    {"contributorId": "alice456", "paid": false},
    {"contributorId": "bob789", "paid": false},
    {"contributorId": "charlie101", "paid": false}
  ]
}
```

**Success Response (201):**
```json
{
  "_id": "64f1234567890abcdef123456",
  "payeeId": "restaurant123",
  "contributorIds": ["alice456", "bob789", "charlie101"],
  "amounts": [33.33, 33.33, 33.34],
  "transactionHash": "0x1234567890abcdef...",
  "status": [
    {"contributorId": "alice456", "paid": false},
    {"contributorId": "bob789", "paid": false},
    {"contributorId": "charlie101", "paid": false}
  ],
  "createdAt": "2023-09-16T10:30:00.000Z"
}
```

### 2. Update Split Payment Status
**PUT** `/api/split/updateSplitTxnStatus/:id`

**URL Example:**
```
http://localhost:5000/api/split/updateSplitTxnStatus/64f1234567890abcdef123456
```

**Request Body:**
```json
{
  "contributorId": "alice456",
  "paid": true
}
```

**Success Response (200):**
```json
{
  "_id": "64f1234567890abcdef123456",
  "payeeId": "restaurant123",
  "contributorIds": ["alice456", "bob789", "charlie101"],
  "amounts": [33.33, 33.33, 33.34],
  "status": [
    {"contributorId": "alice456", "paid": true},
    {"contributorId": "bob789", "paid": false},
    {"contributorId": "charlie101", "paid": false}
  ],
  "createdAt": "2023-09-16T10:30:00.000Z"
}
```

### 3. Get Split Transactions by User
**GET** `/api/split/getSplitTxns/:userId`

**URL Example:**
```
http://localhost:5000/api/split/getSplitTxns/alice456
```

### 4. Get Split Transaction by ID
**GET** `/api/split/getSplitTxnById/:id`

**URL Example:**
```
http://localhost:5000/api/split/getSplitTxnById/64f1234567890abcdef123456
```

### 5. Get Split Transaction by Hash
**GET** `/api/split/getSplitTxnByHash/:hash`

**URL Example:**
```
http://localhost:5000/api/split/getSplitTxnByHash/0x1234567890abcdef...
```

---

## Transaction History Routes (`/api/history`)

### 1. Get Complete Transaction History
**GET** `/api/history/getUserTxnHistory/:userId`

**URL Example:**
```
http://localhost:5000/api/history/getUserTxnHistory/sarthak123
```

**Success Response (200):**
```json
{
  "summary": {
    "totalTransactions": 15,
    "p2pCount": 8,
    "bulkCount": 4,
    "splitCount": 3,
    "sentTransactions": 7,
    "receivedTransactions": 8
  },
  "transactions": [
    {
      "_id": "64f1234567890abcdef123456",
      "transactionType": "P2P",
      "userRole": "sender",
      "amount": 100.50,
      "senderId": "sarthak123",
      "receiverId": "alice456",
      "status": "completed",
      "createdAt": "2023-09-16T10:30:00.000Z"
    },
    {
      "_id": "64f1234567890abcdef123457",
      "transactionType": "Bulk Transfer",
      "userRole": "sender",
      "totalAmount": 375.75,
      "userAmount": 375.75,
      "receiverIds": ["alice456", "bob789"],
      "amounts": [200.00, 175.75],
      "status": "completed",
      "createdAt": "2023-09-16T09:15:00.000Z"
    },
    {
      "_id": "64f1234567890abcdef123458",
      "transactionType": "Split Payment",
      "userRole": "contributor",
      "totalAmount": 100.00,
      "userAmount": 33.33,
      "userPaymentStatus": true,
      "payeeId": "restaurant123",
      "createdAt": "2023-09-16T08:45:00.000Z"
    }
  ]
}
```

### 2. Get Transaction History by Type
**GET** `/api/history/getTxnHistoryByType/:userId/:type`

**Valid Types:** `p2p`, `bulk`, `split`

**URL Examples:**
```
http://localhost:5000/api/history/getTxnHistoryByType/sarthak123/p2p
http://localhost:5000/api/history/getTxnHistoryByType/sarthak123/bulk
http://localhost:5000/api/history/getTxnHistoryByType/sarthak123/split
```

**Success Response (200):**
```json
{
  "transactionType": "P2P",
  "count": 5,
  "transactions": [
    {
      "_id": "64f1234567890abcdef123456",
      "transactionType": "P2P",
      "userRole": "sender",
      "senderId": "sarthak123",
      "receiverId": "alice456",
      "amount": 100.50,
      "status": "completed",
      "createdAt": "2023-09-16T10:30:00.000Z"
    }
  ]
}
```

---

## Status Codes

### Success Codes
- **200** - OK (GET requests)
- **201** - Created (POST requests)

### Error Codes
- **400** - Bad Request (validation errors, missing data)
- **404** - Not Found (user/transaction not found)
- **500** - Internal Server Error

---

## Transaction Status Values

### Common Status Values
- `"pending"` - Transaction initiated but not confirmed
- `"processing"` - Transaction being processed
- `"completed"` - Transaction successfully completed
- `"failed"` - Transaction failed
- `"cancelled"` - Transaction cancelled
- `"partial"` - Some transfers completed (bulk payments)

---

## LINE Push Notifications

### Automatic Notifications
The backend automatically sends LINE push notifications for:

1. **P2P Transactions**: Both sender and receiver get notified
2. **Bulk Transfers**: Sender and all receivers get notified
3. **Split Payments**: Payee and all contributors get notified

### Message Examples

**P2P Sender:**
```
💸 You sent $100.50 to Alice Smith via PayZoll Pay
Status: completed
Hash: 0x1234567...
```

**P2P Receiver:**
```
💰 You received $100.50 from John Doe via PayZoll Pay
Status: completed
Hash: 0x1234567...
```

---

## Development Notes

### Environment Variables Required
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/PayZoll
LINE_CHANNEL_ACCESS_TOKEN=your_line_channel_access_token
PORT=5000
```

### Dependencies
```json
{
  "express": "^4.18.2",
  "mongoose": "^7.5.0",
  "dotenv": "^16.3.1",
  "cors": "^2.8.5",
  "axios": "^1.5.0",
  "uuid": "^9.0.0"
}
```

### MongoDB Collections
- `users` - User profiles and LINE IDs
- `p2p` - P2P transactions
- `bulk` - Bulk payment transactions
- `split` - Split payment transactions

---

## Frontend Integration Tips

### Error Handling
Always check response status codes and handle errors:
```javascript
try {
  const response = await fetch('/api/auth/addUser', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error);
  }
  
  const user = await response.json();
  return user;
} catch (error) {
  console.error('Error adding user:', error.message);
}
```

### State Management
Consider using React Context or Redux to manage:
- Current user data
- Transaction history
- Loading states
- Error states

### Real-time Updates
For real-time transaction updates, consider implementing WebSocket connections or polling the transaction history endpoints.

---

**Last Updated:** September 16, 2025
**Version:** 1.0.0