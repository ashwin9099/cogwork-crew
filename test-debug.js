#!/usr/bin/env node

/**
 * Debug Test Runner
 * Run this to test individual components and identify issues
 */

const { execSync } = require('child_process');

console.log('🔍 Running Debug Tests...\n');

const tests = [
  {
    name: 'Mock Server Test',
    command: 'npx vitest run src/test/mocks/server.test.ts --reporter=verbose'
  },
  {
    name: 'Simple Component Test',
    command: 'npx vitest run src/test/components/EmployeeTable.simple.test.tsx --reporter=verbose'
  },
  {
    name: 'Improved Component Test',
    command: 'npx vitest run src/test/components/EmployeeTable.improved.test.tsx --reporter=verbose'
  },
  {
    name: 'Original Component Test (Problematic)',
    command: 'npx vitest run src/test/components/EmployeeTable.test.tsx --reporter=verbose'
  }
];

for (const test of tests) {
  console.log(`\n📋 Running: ${test.name}`);
  console.log('─'.repeat(50));
  
  try {
    const output = execSync(test.command, { 
      encoding: 'utf8',
      stdio: 'pipe'
    });
    console.log('✅ PASSED');
    console.log(output);
  } catch (error) {
    console.log('❌ FAILED');
    console.log(error.stdout || error.message);
  }
}

console.log('\n🏁 Debug tests completed!');
