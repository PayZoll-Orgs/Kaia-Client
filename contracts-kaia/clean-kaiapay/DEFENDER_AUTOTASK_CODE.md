# 🤖 Defender Autotask JavaScript Implementation

## 📋 Overview
This document provides the JavaScript code for OpenZeppelin Defender Autotasks to automate KaiaPay invoice processing.

## 🏗️ Autotask Architecture

```javascript
// Main Autotask Handler
exports.handler = async function(event) {
  // 1. Initialize Defender client
  // 2. Parse monitor event data  
  // 3. Determine required actions
  // 4. Execute contract functions
  // 5. Handle errors and logging
}
```

## 📝 Main Autotask Code

### Primary Invoice Processing Autotask

```javascript
const { Defender } = require('@openzeppelin/defender-sdk');
const { ethers } = require('ethers');

// Contract ABI fragments needed for the autotask
const INVOICE_ABI = [
  "function processInvoices(uint256[] calldata invoiceIds) external",
  "function refundExpiredInvoices(uint256[] calldata invoiceIds) external",
  "function getInvoicesNeedingProcessing() external view returns (tuple(uint256[] readyForRelease, uint256[] expiredForRefund))",
  "function invoices(uint256) external view returns (tuple(uint256 amount, address token, address merchant, address payer, uint256 deadline, uint8 status, bool fundedInEscrow))",
  "function emergencyPause() external",
  "event InvoiceCreated(uint256 indexed invoiceId, address indexed merchant, uint256 amount, address token, uint256 deadline)",
  "event InvoiceFunded(uint256 indexed invoiceId, address indexed payer)",
  "event PaymentReleased(uint256 indexed invoiceId, address indexed merchant, uint256 amount)",
  "event RefundProcessed(uint256 indexed invoiceId, address indexed payer, uint256 amount)"
];

const INVOICE_CONTRACT_ADDRESS = '0xF9f94692001602b5E4AEe778659814593B9315C4';

// Autotask configuration
const CONFIG = {
  maxBatchSize: 10,        // Maximum invoices to process in one transaction
  gasLimit: 500000,        // Gas limit per transaction
  maxRetries: 3,           // Maximum retry attempts
  emergencyThreshold: 50   // Emergency pause if more than X invoices fail
};

exports.handler = async function(event) {
  console.log('🤖 KaiaPay Invoice Autotask Started');
  console.log('Event payload:', JSON.stringify(event, null, 2));

  try {
    // Initialize Defender client
    const client = new Defender({
      apiKey: event.secrets.API_KEY,
      apiSecret: event.secrets.API_SECRET
    });

    // Get contract interface
    const contract = new ethers.Contract(
      INVOICE_CONTRACT_ADDRESS,
      INVOICE_ABI,
      client.relaySigner
    );

    // Determine trigger type
    const triggerType = determineTriggerType(event);
    console.log(`📋 Trigger type: ${triggerType}`);

    let result;
    switch (triggerType) {
      case 'MONITOR_EVENT':
        result = await handleMonitorEvent(contract, event);
        break;
      case 'SCHEDULED_CHECK':
        result = await handleScheduledCheck(contract);
        break;
      case 'MANUAL_TRIGGER':
        result = await handleManualTrigger(contract, event);
        break;
      default:
        throw new Error(`Unknown trigger type: ${triggerType}`);
    }

    console.log('✅ Autotask completed successfully:', result);
    return result;

  } catch (error) {
    console.error('❌ Autotask failed:', error);
    
    // Send alert for critical failures
    await sendAlert(event, error);
    
    throw error;
  }
};

// Determine what triggered this autotask
function determineTriggerType(event) {
  if (event.request?.body?.matchReasons) {
    return 'MONITOR_EVENT';
  } else if (event.request?.body?.trigger === 'schedule') {
    return 'SCHEDULED_CHECK';
  } else {
    return 'MANUAL_TRIGGER';
  }
}

// Handle events from the monitor
async function handleMonitorEvent(contract, event) {
  const payload = event.request.body;
  const matchReasons = payload.matchReasons || [];
  
  console.log(`📡 Processing ${matchReasons.length} monitor events`);

  for (const match of matchReasons) {
    const eventName = match.signature;
    const params = match.params || {};

    console.log(`🔔 Event: ${eventName}`, params);

    switch (eventName) {
      case 'InvoiceCreated(uint256,address,uint256,address,uint256)':
        await handleInvoiceCreated(contract, params);
        break;
      case 'InvoiceFunded(uint256,address)':
        await handleInvoiceFunded(contract, params);
        break;
      default:
        console.log(`ℹ️ Ignoring event: ${eventName}`);
    }
  }

  return { processed: matchReasons.length, type: 'monitor_event' };
}

// Handle scheduled periodic checks
async function handleScheduledCheck(contract) {
  console.log('⏰ Performing scheduled check for pending invoices');

  try {
    // Get invoices that need processing
    const needProcessing = await contract.getInvoicesNeedingProcessing();
    const readyForRelease = needProcessing.readyForRelease;
    const expiredForRefund = needProcessing.expiredForRefund;

    console.log(`📊 Found ${readyForRelease.length} invoices ready for release`);
    console.log(`📊 Found ${expiredForRefund.length} invoices expired for refund`);

    let totalProcessed = 0;

    // Process payments ready for release
    if (readyForRelease.length > 0) {
      const processed = await processInvoicesBatched(
        contract, 
        readyForRelease, 
        'processInvoices'
      );
      totalProcessed += processed;
    }

    // Process expired invoices for refund
    if (expiredForRefund.length > 0) {
      const processed = await processInvoicesBatched(
        contract, 
        expiredForRefund, 
        'refundExpiredInvoices'
      );
      totalProcessed += processed;
    }

    return {
      readyForRelease: readyForRelease.length,
      expiredForRefund: expiredForRefund.length,
      totalProcessed,
      type: 'scheduled_check'
    };

  } catch (error) {
    console.error('❌ Scheduled check failed:', error);
    throw error;
  }
}

// Handle manual triggers
async function handleManualTrigger(contract, event) {
  console.log('🔧 Processing manual trigger');
  
  const action = event.request?.body?.action || 'full_check';
  
  switch (action) {
    case 'emergency_pause':
      return await handleEmergencyPause(contract);
    case 'full_check':
      return await handleScheduledCheck(contract);
    default:
      throw new Error(`Unknown manual action: ${action}`);
  }
}

// Handle new invoice creation
async function handleInvoiceCreated(contract, params) {
  const invoiceId = params.invoiceId;
  console.log(`📝 New invoice created: ${invoiceId}`);
  
  // Log the creation for monitoring
  // Could add additional logic here if needed
}

// Handle invoice funding
async function handleInvoiceFunded(contract, params) {
  const invoiceId = params.invoiceId;
  console.log(`💰 Invoice funded: ${invoiceId}`);
  
  // Check if this invoice is ready for immediate processing
  try {
    const needProcessing = await contract.getInvoicesNeedingProcessing();
    const readyForRelease = needProcessing.readyForRelease;
    
    if (readyForRelease.includes(ethers.BigNumber.from(invoiceId))) {
      console.log(`⚡ Processing newly funded invoice immediately: ${invoiceId}`);
      await processInvoicesBatched(contract, [invoiceId], 'processInvoices');
    }
  } catch (error) {
    console.error(`❌ Failed to process newly funded invoice ${invoiceId}:`, error);
  }
}

// Process invoices in batches
async function processInvoicesBatched(contract, invoiceIds, functionName) {
  if (invoiceIds.length === 0) return 0;

  console.log(`🔄 Processing ${invoiceIds.length} invoices via ${functionName}`);

  let totalProcessed = 0;
  const batches = createBatches(invoiceIds, CONFIG.maxBatchSize);

  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];
    console.log(`📦 Processing batch ${i + 1}/${batches.length}: ${batch.length} invoices`);

    try {
      const tx = await contract[functionName](batch, {
        gasLimit: CONFIG.gasLimit
      });

      console.log(`📋 Transaction sent: ${tx.hash}`);
      
      // Wait for confirmation
      const receipt = await tx.wait();
      console.log(`✅ Batch ${i + 1} confirmed in block ${receipt.blockNumber}`);
      
      totalProcessed += batch.length;

    } catch (error) {
      console.error(`❌ Batch ${i + 1} failed:`, error);
      
      // Try to process individually for better error isolation
      const individualProcessed = await processIndividually(contract, batch, functionName);
      totalProcessed += individualProcessed;
    }

    // Small delay between batches
    await sleep(1000);
  }

  return totalProcessed;
}

// Process invoices individually (fallback for batch failures)
async function processIndividually(contract, invoiceIds, functionName) {
  console.log(`🔍 Processing ${invoiceIds.length} invoices individually`);
  
  let processed = 0;
  for (const invoiceId of invoiceIds) {
    try {
      const tx = await contract[functionName]([invoiceId], {
        gasLimit: CONFIG.gasLimit / 2 // Lower gas limit for individual
      });
      
      await tx.wait();
      console.log(`✅ Individual invoice ${invoiceId} processed`);
      processed++;
      
    } catch (error) {
      console.error(`❌ Individual invoice ${invoiceId} failed:`, error);
    }
    
    await sleep(500); // Small delay between individual transactions
  }
  
  return processed;
}

// Handle emergency pause
async function handleEmergencyPause(contract) {
  console.log('🚨 Emergency pause triggered');
  
  try {
    const tx = await contract.emergencyPause({
      gasLimit: 100000
    });
    
    await tx.wait();
    console.log('🛑 Contract successfully paused');
    
    return { action: 'emergency_pause', status: 'success' };
    
  } catch (error) {
    console.error('❌ Emergency pause failed:', error);
    throw error;
  }
}

// Utility functions
function createBatches(array, batchSize) {
  const batches = [];
  for (let i = 0; i < array.length; i += batchSize) {
    batches.push(array.slice(i, i + batchSize));
  }
  return batches;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Send alerts for critical failures
async function sendAlert(event, error) {
  console.log('📢 Sending failure alert');
  
  // This would integrate with your notification system
  // Could be email, Slack, Discord, etc.
  
  const alertData = {
    timestamp: new Date().toISOString(),
    error: error.message,
    event: event.request?.body || {},
    severity: 'HIGH'
  };
  
  console.log('🚨 Alert data:', JSON.stringify(alertData, null, 2));
}
```

## ⚙️ Configuration Templates

### Environment Variables (Secrets)
```javascript
// Required secrets in Defender
const REQUIRED_SECRETS = {
  API_KEY: 'Your Defender API Key',
  API_SECRET: 'Your Defender API Secret',
  ALERT_WEBHOOK: 'Optional webhook for alerts',
  SLACK_TOKEN: 'Optional Slack integration'
};
```

### Monitor Configuration
```json
{
  "name": "KaiaPay Invoice Monitor",
  "type": "BLOCK",
  "network": "kaia-testnet",
  "addresses": ["0xF9f94692001602b5E4AEe778659814593B9315C4"],
  "abi": "/* Contract ABI */",
  "alertThreshold": {
    "amount": 0,
    "windowSeconds": 0
  },
  "paused": false,
  "eventConditions": [
    {
      "eventSignature": "InvoiceCreated(uint256,address,uint256,address,uint256)",
      "expression": "value > 0"
    },
    {
      "eventSignature": "InvoiceFunded(uint256,address)",
      "expression": "true"
    }
  ]
}
```

## 🧪 Testing Utilities

### Test Autotask Locally
```javascript
// test-autotask.js
const autotask = require('./autotask');

async function testAutotask() {
  const mockEvent = {
    secrets: {
      API_KEY: 'test-key',
      API_SECRET: 'test-secret'
    },
    request: {
      body: {
        matchReasons: [
          {
            signature: 'InvoiceFunded(uint256,address)',
            params: { invoiceId: '1', payer: '0x123...' }
          }
        ]
      }
    }
  };

  try {
    const result = await autotask.handler(mockEvent);
    console.log('Test result:', result);
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testAutotask();
```

## 📊 Monitoring and Logging

### Key Metrics to Track
- ✅ Successful executions per hour
- ❌ Failed executions and reasons
- ⏱️ Average execution time
- 💰 Gas usage per transaction
- 📈 Number of invoices processed

### Log Levels
```javascript
const LOG_LEVELS = {
  ERROR: '❌',
  WARN: '⚠️',
  INFO: 'ℹ️',
  SUCCESS: '✅',
  DEBUG: '🔍'
};
```

---

## 🚀 Deployment Checklist

- [ ] Upload autotask code to Defender
- [ ] Configure required secrets
- [ ] Set up monitor with correct events
- [ ] Test with sample invoices
- [ ] Configure alerting
- [ ] Monitor initial executions

**Your Defender Autotask is ready to automate KaiaPay invoice processing! 🎉**
