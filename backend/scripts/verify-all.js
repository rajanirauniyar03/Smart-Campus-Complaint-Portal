// In-process verification test
const { spawn } = require('child_process');
const path = require('path');

async function main() {
  console.log('Starting verification harness...');
  // Require server to boot DB and API in this process
  require('../server');

  // Require and run e2e test suite
  const { execSync } = require('child_process');
  
  // Wait 3 seconds for server to bind
  await new Promise(r => setTimeout(r, 3500));

  console.log('Server bound, executing tests...');
  require('./test-e2e');
}

main().catch(err => {
  console.error('Test harness failure:', err);
  process.exit(1);
});
