# Contract ABIs

This directory contains all the Application Binary Interfaces (ABIs) for the KaiaPay smart contracts.

## Files

- `USDT.json` - MyDummyTokenWithFaucet ABI (KIP7 token with faucet)
- `BulkPayroll.json` - BulkPayroll contract ABI
- `InvoiceService.json` - InvoiceSubscriptionService contract ABI  
- `SplitBilling.json` - SplitBilling contract ABI
- `combined-abis.json` - All ABIs in a single file
- `contract-types.ts` - TypeScript interface definitions
- `contract-helper.js` - JavaScript helper functions
- `frontend-config.json` - Complete frontend configuration (includes addresses)

## Usage

### JavaScript/React

```javascript
import { ethers } from 'ethers';
import USDTAbi from './abis/USDT.json';
import frontendConfig from './abis/frontend-config.json';

// Setup contract
const contract = new ethers.Contract(
  frontendConfig.contracts.USDT.address,
  USDTAbi.abi,
  signer
);
```

### TypeScript

```typescript
import { ethers } from 'ethers';
import { MyDummyTokenWithFaucet } from './abis/contract-types';
import USDTAbi from './abis/USDT.json';

const contract = new ethers.Contract(
  contractAddress,
  USDTAbi.abi,
  signer
) as MyDummyTokenWithFaucet;
```

## Network Configuration

Use the network configuration from `frontend-config.json`:

```javascript
const kaiaTestnet = {
  chainId: '0x3e9', // 1001 in hex
  chainName: 'Kaia Testnet',
  nativeCurrency: { name: 'KAIA', symbol: 'KAIA', decimals: 18 },
  rpcUrls: ['https://public-en-kairos.node.kaia.io'],
  blockExplorerUrls: ['https://kairos.kaiascope.com']
};
```
