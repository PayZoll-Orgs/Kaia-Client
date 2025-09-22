const { ethers } = require("hardhat");
const fs = require('fs');
const path = require('path');

/**
 * EXTRACT ENHANCED LENDING PROTOCOL METHOD IDs
 * 
 * This script extracts all function signatures and method IDs from the Enhanced Lending Protocol ABI
 */

async function main() {
  console.log("\n🔍 === EXTRACTING ENHANCED LENDING PROTOCOL METHOD IDs ===");
  
  // Load the Enhanced Lending Protocol ABI
  const abiPath = path.join(__dirname, 'artifacts', 'contracts', 'EnhancedLendingProtocol.sol', 'EnhancedLendingProtocol.json');
  const artifact = JSON.parse(fs.readFileSync(abiPath, 'utf8'));
  
  // Create contract interface to get method IDs
  const iface = new ethers.Interface(artifact.abi);
  
  console.log("\n📋 === FUNCTION SIGNATURES AND METHOD IDs ===");
  
  const methodIds = {};
  const viewFunctions = {};
  const writeFunctions = {};
  
  // Extract function signatures and method IDs
  artifact.abi.forEach(item => {
    if (item.type === 'function') {
      try {
        const fragment = iface.getFunction(item.name);
        const methodId = iface.getFunction(item.name).selector;
        const signature = fragment.format('full');
        
        console.log(`\n📝 ${item.name}:`);
        console.log(`   Signature: ${signature}`);
        console.log(`   Method ID: ${methodId}`);
        console.log(`   State: ${item.stateMutability}`);
        
        // Categorize functions
        if (item.stateMutability === 'view' || item.stateMutability === 'pure') {
          viewFunctions[item.name.toUpperCase()] = methodId;
        } else {
          writeFunctions[item.name.toUpperCase()] = methodId;
        }
        
        methodIds[item.name.toUpperCase()] = methodId;
      } catch (error) {
        console.log(`⚠️  Could not process function ${item.name}: ${error.message}`);
      }
    }
  });
  
  console.log("\n\n🏦 === CATEGORIZED METHOD IDs ===");
  
  console.log("\n📊 VIEW FUNCTIONS (Read-only):");
  Object.entries(viewFunctions).forEach(([name, id]) => {
    console.log(`   ${name}: '${id}',`);
  });
  
  console.log("\n💰 WRITE FUNCTIONS (State-changing):");
  Object.entries(writeFunctions).forEach(([name, id]) => {
    console.log(`   ${name}: '${id}',`);
  });
  
  // Generate TypeScript config
  const configContent = `
// Enhanced Lending Protocol Method IDs - Generated from ABI
export const ENHANCED_LENDING_METHODS = {
  // 📊 VIEW FUNCTIONS (Read-only)
  VIEW: {
${Object.entries(viewFunctions).map(([name, id]) => `    ${name}: '${id}',`).join('\n')}
  },
  
  // 💰 WRITE FUNCTIONS (State-changing) 
  WRITE: {
${Object.entries(writeFunctions).map(([name, id]) => `    ${name}: '${id}',`).join('\n')}
  },
  
  // 🔄 ALL METHODS (Combined)
  ALL: {
${Object.entries(methodIds).map(([name, id]) => `    ${name}: '${id}',`).join('\n')}
  }
} as const;
`;
  
  // Save to file
  const outputPath = path.join(__dirname, 'enhanced-lending-method-ids.ts');
  fs.writeFileSync(outputPath, configContent);
  
  console.log(`\n✅ Method IDs extracted and saved to: ${outputPath}`);
  
  return {
    total: Object.keys(methodIds).length,
    viewFunctions: Object.keys(viewFunctions).length,
    writeFunctions: Object.keys(writeFunctions).length,
    methodIds
  };
}

if (require.main === module) {
  main()
    .then((result) => {
      console.log(`\n🎯 Successfully extracted ${result.total} method IDs (${result.viewFunctions} view, ${result.writeFunctions} write)`);
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Method extraction failed:", error);
      process.exit(1);
    });
}

module.exports = main;