# 🚀 **DEPLOYMENT SETUP GUIDE**

## ⚠️ **IMPORTANT: Private Key Setup Required**

Before deploying, you need to set up your private key properly.

### **Step 1: Get Your Private Key**

1. **From MetaMask:**
   - Open MetaMask
   - Click the account menu (3 dots)
   - Account Details → Export Private Key
   - Enter your password
   - Copy the private key (starts with 0x...)

2. **From Other Wallets:**
   - Most wallets have "Export Private Key" option
   - Make sure it's in hex format (starts with 0x)

### **Step 2: Set Up Environment**

1. **Edit the .env file in this directory:**
   ```bash
   # Replace this line:
   PRIVATE_KEY=your_private_key_here
   
   # With your actual private key:
   PRIVATE_KEY=0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef
   ```

2. **Get Test KAIA Tokens:**
   - Visit: https://kairos.wallet.klaytn.foundation/
   - Connect your wallet
   - Request test KAIA tokens
   - You need at least 0.1 KAIA for deployment

### **Step 3: Deploy Contracts**

After setting up your private key:

```bash
# Option 1: Use the deployment script
./deploy.sh

# Option 2: Deploy manually
npm run deploy:kairos
```

### **Step 4: Chainlink Setup**

After successful deployment, you'll get contract addresses. Use these for Chainlink Automation setup:

1. **InvoiceSubscription Contract Address** - This is what you need for Chainlink
2. Visit: https://automation.chain.link/
3. Register new upkeep with the contract address

---

## 🔒 **Security Notes**

- ⚠️ **NEVER commit your private key to version control**
- ⚠️ **Use only test accounts on testnet**
- ⚠️ **The .env file is gitignored for security**

---

## 📝 **Quick Commands Reference**

```bash
# Compile contracts
npm run compile

# Test contracts
npm run test

# Deploy all contracts
npm run deploy:kairos

# Deploy individual contracts
npm run deploy:usdt
npm run deploy:bulk
npm run deploy:split
npm run deploy:invoice

# Run simulation (after deployment)
npm run simulate
```

---

## 🆘 **Common Issues**

1. **"Private key too short"** - Make sure your private key starts with 0x and is 64 characters long
2. **"Insufficient funds"** - Get test KAIA from the faucet
3. **"Network error"** - Check your internet connection and RPC URL

---

**Ready to deploy? Set your private key in .env file and run `./deploy.sh`**
