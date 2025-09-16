const fs = require('fs');
const path = require('path');

/**
 * Script to extract and organize contract ABIs for frontend integration
 * This script creates a clean ABIs directory with all contract ABIs
 */
async function main() {
    console.log("📦 Extracting contract ABIs for frontend integration...");
    
    const contractsDir = path.join(__dirname, '../artifacts/contracts');
    const abisDir = path.join(__dirname, '../abis');
    
    // Create ABIs directory if it doesn't exist
    if (!fs.existsSync(abisDir)) {
        fs.mkdirSync(abisDir, { recursive: true });
    }
    
    // Contract mappings
    const contracts = {
        'USDT': {
            path: 'USDT.sol/MyDummyTokenWithFaucet.json',
            name: 'MyDummyTokenWithFaucet'
        },
        'BulkPayroll': {
            path: 'bulkPay.sol/BulkPayroll.json',
            name: 'BulkPayroll'
        },
        'InvoiceService': {
            path: 'invoicePay.sol/InvoiceSubscriptionService.json',
            name: 'InvoiceSubscriptionService'
        },
        'SplitBilling': {
            path: 'splitbill.sol/SplitBilling.json',
            name: 'SplitBilling'
        }
    };
    
    const extractedABIs = {};
    
    // Extract ABIs
    Object.entries(contracts).forEach(([key, config]) => {
        const contractPath = path.join(contractsDir, config.path);
        
        if (fs.existsSync(contractPath)) {
            const contractData = JSON.parse(fs.readFileSync(contractPath, 'utf8'));
            
            // Extract just the ABI
            const abiData = {
                contractName: config.name,
                abi: contractData.abi,
                bytecode: contractData.bytecode,
                deployedBytecode: contractData.deployedBytecode
            };
            
            // Save individual ABI file
            const abiFileName = `${key}.json`;
            fs.writeFileSync(
                path.join(abisDir, abiFileName),
                JSON.stringify(abiData, null, 2)
            );
            
            extractedABIs[key] = abiData;
            console.log(`✅ Extracted ABI for ${config.name} -> ${abiFileName}`);
        } else {
            console.log(`⚠️  Contract artifact not found: ${contractPath}`);
        }
    });
    
    // Create combined ABIs file
    const combinedABIs = {
        metadata: {
            network: "kaia-testnet",
            chainId: 1001,
            extractedAt: new Date().toISOString(),
            compiler: "hardhat",
            solidity: "0.8.28"
        },
        contracts: extractedABIs
    };
    
    fs.writeFileSync(
        path.join(abisDir, 'combined-abis.json'),
        JSON.stringify(combinedABIs, null, 2)
    );
    console.log("✅ Created combined ABIs file");
    
    // Create TypeScript interfaces
    const tsInterfaces = generateTypeScriptInterfaces(extractedABIs);
    fs.writeFileSync(
        path.join(abisDir, 'contract-types.ts'),
        tsInterfaces
    );
    console.log("✅ Generated TypeScript interfaces");
    
    // Create JavaScript import helper
    const jsHelper = generateJavaScriptHelper(extractedABIs);
    fs.writeFileSync(
        path.join(abisDir, 'contract-helper.js'),
        jsHelper
    );
    console.log("✅ Generated JavaScript helper");
    
    // Load deployment data if available
    const deploymentPath = path.join(__dirname, '../deployed-contracts.json');
    let deploymentData = null;
    
    if (fs.existsSync(deploymentPath)) {
        deploymentData = JSON.parse(fs.readFileSync(deploymentPath, 'utf8'));
        
        // Create frontend config with addresses
        const frontendConfig = {
            network: {
                name: "Kaia Testnet",
                chainId: 1001,
                rpcUrl: "https://public-en-kairos.node.kaia.io",
                explorerUrl: "https://kairos.kaiascope.com"
            },
            contracts: {},
            deployedAt: deploymentData.deployedAt,
            deployer: deploymentData.deployer
        };
        
        // Add contract addresses
        Object.entries(deploymentData.contracts).forEach(([name, address]) => {
            if (extractedABIs[name]) {
                frontendConfig.contracts[name] = {
                    address: address,
                    abi: extractedABIs[name].abi
                };
            }
        });
        
        fs.writeFileSync(
            path.join(abisDir, 'frontend-config.json'),
            JSON.stringify(frontendConfig, null, 2)
        );
        console.log("✅ Created frontend configuration with contract addresses");
    }
    
    // Create README for ABIs directory
    const abiReadme = `# Contract ABIs

This directory contains all the Application Binary Interfaces (ABIs) for the KaiaPay smart contracts.

## Files

- \`USDT.json\` - MyDummyTokenWithFaucet ABI (KIP7 token with faucet)
- \`BulkPayroll.json\` - BulkPayroll contract ABI
- \`InvoiceService.json\` - InvoiceSubscriptionService contract ABI  
- \`SplitBilling.json\` - SplitBilling contract ABI
- \`combined-abis.json\` - All ABIs in a single file
- \`contract-types.ts\` - TypeScript interface definitions
- \`contract-helper.js\` - JavaScript helper functions
- \`frontend-config.json\` - Complete frontend configuration (includes addresses)

## Usage

### JavaScript/React

\`\`\`javascript
import { ethers } from 'ethers';
import USDTAbi from './abis/USDT.json';
import frontendConfig from './abis/frontend-config.json';

// Setup contract
const contract = new ethers.Contract(
  frontendConfig.contracts.USDT.address,
  USDTAbi.abi,
  signer
);
\`\`\`

### TypeScript

\`\`\`typescript
import { ethers } from 'ethers';
import { MyDummyTokenWithFaucet } from './abis/contract-types';
import USDTAbi from './abis/USDT.json';

const contract = new ethers.Contract(
  contractAddress,
  USDTAbi.abi,
  signer
) as MyDummyTokenWithFaucet;
\`\`\`

## Network Configuration

Use the network configuration from \`frontend-config.json\`:

\`\`\`javascript
const kaiaTestnet = {
  chainId: '0x3e9', // 1001 in hex
  chainName: 'Kaia Testnet',
  nativeCurrency: { name: 'KAIA', symbol: 'KAIA', decimals: 18 },
  rpcUrls: ['https://public-en-kairos.node.kaia.io'],
  blockExplorerUrls: ['https://kairos.kaiascope.com']
};
\`\`\`
`;
    
    fs.writeFileSync(path.join(abisDir, 'README.md'), abiReadme);
    console.log("✅ Created ABIs README");
    
    // Summary
    console.log("\n" + "=".repeat(60));
    console.log("📦 ABI EXTRACTION COMPLETED");
    console.log("=".repeat(60));
    console.log(`Total contracts processed: ${Object.keys(extractedABIs).length}`);
    console.log(`ABIs directory: ${abisDir}`);
    console.log("Files created:");
    console.log("- Individual ABI files for each contract");
    console.log("- Combined ABIs file");
    console.log("- TypeScript interfaces");
    console.log("- JavaScript helper");
    console.log("- Frontend configuration");
    console.log("- Documentation");
    
    if (deploymentData) {
        console.log("\n✅ Contract addresses included in frontend config");
    } else {
        console.log("\n⚠️  No deployment data found. Deploy contracts first to include addresses.");
    }
}

function generateTypeScriptInterfaces(abis) {
    let interfaces = `// Generated TypeScript interfaces for KaiaPay contracts
// Auto-generated on ${new Date().toISOString()}

import { ethers } from 'ethers';

`;

    Object.entries(abis).forEach(([contractName, data]) => {
        interfaces += `// ${data.contractName} Interface\n`;
        interfaces += `export interface ${data.contractName} extends ethers.Contract {\n`;
        
        // Extract function signatures from ABI
        data.abi.forEach(item => {
            if (item.type === 'function') {
                const inputs = item.inputs.map(input => `${input.name}: ${getSolidityTypeScriptType(input.type)}`).join(', ');
                const outputs = item.outputs && item.outputs.length > 0 
                    ? `: Promise<${item.outputs.length === 1 ? getSolidityTypeScriptType(item.outputs[0].type) : 'any[]'}>`
                    : ': Promise<ethers.ContractTransactionResponse>';
                
                interfaces += `  ${item.name}(${inputs})${outputs};\n`;
            }
        });
        
        interfaces += `}\n\n`;
    });

    return interfaces;
}

function generateJavaScriptHelper(abis) {
    return `// JavaScript helper for KaiaPay contracts
// Auto-generated on ${new Date().toISOString()}

const { ethers } = require('ethers');

// Contract ABIs
const CONTRACT_ABIS = ${JSON.stringify(Object.fromEntries(Object.entries(abis).map(([key, data]) => [key, data.abi])), null, 2)};

// Helper functions
class KaiaPayHelper {
  constructor(provider, contractAddresses) {
    this.provider = provider;
    this.addresses = contractAddresses;
    this.contracts = {};
  }

  // Initialize all contracts
  async initializeContracts(signer) {
    this.contracts.USDT = new ethers.Contract(this.addresses.USDT, CONTRACT_ABIS.USDT, signer);
    this.contracts.BulkPayroll = new ethers.Contract(this.addresses.BulkPayroll, CONTRACT_ABIS.BulkPayroll, signer);
    this.contracts.InvoiceService = new ethers.Contract(this.addresses.InvoiceService, CONTRACT_ABIS.InvoiceService, signer);
    this.contracts.SplitBilling = new ethers.Contract(this.addresses.SplitBilling, CONTRACT_ABIS.SplitBilling, signer);
  }

  // Utility functions
  formatEther(value) {
    return ethers.formatEther(value);
  }

  parseEther(value) {
    return ethers.parseEther(value.toString());
  }

  // USDT Token helpers
  async claimFromFaucet() {
    const tx = await this.contracts.USDT.faucet();
    return await tx.wait();
  }

  async getUSDTBalance(address) {
    const balance = await this.contracts.USDT.balanceOf(address);
    return this.formatEther(balance);
  }

  // Split billing helpers
  async createETHSplit(payee, debtors, amounts, daysUntilDue, description) {
    const deadline = Math.floor(Date.now() / 1000) + (daysUntilDue * 24 * 60 * 60);
    const amountsWei = amounts.map(amount => this.parseEther(amount));
    
    const tx = await this.contracts.SplitBilling.createSplit(
      payee, debtors, amountsWei, ethers.ZeroAddress, deadline, description
    );
    return await tx.wait();
  }

  async payETHShare(splitId) {
    const signer = this.contracts.SplitBilling.runner;
    const owedAmount = await this.contracts.SplitBilling.getOwedAmount(splitId, await signer.getAddress());
    
    const tx = await this.contracts.SplitBilling.payShare(splitId, { value: owedAmount });
    return await tx.wait();
  }
}

module.exports = { 
  CONTRACT_ABIS, 
  KaiaPayHelper,
  // Kaia network configuration
  KAIA_TESTNET: {
    chainId: 1001,
    name: 'Kaia Testnet',
    rpcUrl: 'https://public-en-kairos.node.kaia.io',
    explorerUrl: 'https://kairos.kaiascope.com'
  }
};
`;
}

function getSolidityTypeScriptType(solidityType) {
    if (solidityType.startsWith('uint') || solidityType.startsWith('int')) {
        return 'bigint';
    }
    if (solidityType === 'address') {
        return 'string';
    }
    if (solidityType === 'bool') {
        return 'boolean';
    }
    if (solidityType === 'string') {
        return 'string';
    }
    if (solidityType === 'bytes32' || solidityType.startsWith('bytes')) {
        return 'string';
    }
    if (solidityType.includes('[]')) {
        const baseType = getSolidityTypeScriptType(solidityType.replace('[]', ''));
        return `${baseType}[]`;
    }
    return 'any';
}

if (require.main === module) {
    main()
        .then(() => process.exit(0))
        .catch((error) => {
            console.error(error);
            process.exit(1);
        });
}

module.exports = { main };
