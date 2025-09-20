#!/bin/bash
# Setup script for KaiaPay deployment

echo "🚀 KaiaPay Deployment Setup"
echo "=========================="

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
fi

# Check if private key is set
if grep -q "your_private_key_here" .env; then
    echo ""
    echo "⚠️  IMPORTANT: You need to add your private key to deploy!"
    echo ""
    echo "1. Open .env file in this directory"
    echo "2. Replace 'your_private_key_here' with your actual private key"
    echo "3. Make sure your wallet has KAIA tokens for gas fees"
    echo ""
    echo "Get test KAIA from: https://kairos.wallet.klaytn.foundation/"
    echo ""
    echo "After setting up your private key, run:"
    echo "npm run deploy:kairos"
    exit 1
fi

echo "✅ Environment configured!"
echo "🚀 Starting deployment..."

# Compile contracts
echo "📦 Compiling contracts..."
npm run compile

if [ $? -ne 0 ]; then
    echo "❌ Compilation failed!"
    exit 1
fi

echo "✅ Contracts compiled successfully!"
echo "🚀 Deploying to Kaia Testnet..."

# Deploy contracts
npm run deploy:kairos

echo "🎉 Deployment complete!"
