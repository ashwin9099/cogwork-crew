#!/usr/bin/env node

/**
 * Fixed Test Runner
 * Tests the corrected version with proper Supabase mocking
 */

const { execSync } = require('child_process');

console.log('🔧 Running Fixed Tests with Supabase Mocking...\n');

const tests = [
  {
    name: 'Employee Hooks (Fixed)',
    command: 'npx vitest run src/test/hooks/useEmployees.fixed.test.ts --reporter=verbose',
    description: 'Tests CRUD hooks with proper Supabase mocking'
  },
  {
    name: 'Employee Table Component (Fixed)',
    command: 'npx vitest run src/test/components/EmployeeTable.fixed.test.tsx --reporter=verbose',
    description: 'Tests UI component with mocked data loading'
  }
];

async function runTest(test) {
  console.log(`\n📋 ${test.name}`);
  console.log(`📝 ${test.description}`);
  console.log('─'.repeat(60));
  
  try {
    const output = execSync(test.command, { 
      encoding: 'utf8',
      stdio: 'pipe',
      timeout: 30000 // 30 second timeout
    });
    
    console.log('✅ PASSED');
    console.log(output);
    return true;
  } catch (error) {
    console.log('❌ FAILED');
    console.log(error.stdout || error.message);
    return false;
  }
}

async function runAllTests() {
  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    const success = await runTest(test);
    if (success) {
      passed++;
    } else {
      failed++;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 Fixed Test Results');
  console.log('─'.repeat(60));
  console.log(`✅ Passed: ${passed}/${tests.length}`);
  console.log(`❌ Failed: ${failed}/${tests.length}`);

  if (failed === 0) {
    console.log('\n🎉 All fixed tests passed! The Supabase mocking is working correctly.');
  } else {
    console.log('\n⚠️  Some tests still failing. Check the output above for details.');
  }

  return failed === 0;
}

runAllTests().then(success => {
  process.exit(success ? 0 : 1);
}).catch(error => {
  console.error('Error running tests:', error);
  process.exit(1);
});
