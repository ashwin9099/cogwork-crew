#!/usr/bin/env node

/**
 * Test Runner Script for Verto Employee Management System
 * 
 * This script provides a comprehensive test suite covering:
 * - CRUD operations for employee management
 * - Business logic validation
 * - Component integration tests
 * - Authentication flow tests
 * - Error handling and edge cases
 */

import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

interface TestSuite {
  name: string
  command: string
  description: string
}

const testSuites: TestSuite[] = [
  {
    name: 'CRUD Operations',
    command: 'vitest run src/test/hooks/useEmployees.test.ts',
    description: 'Tests for Create, Read, Update, Delete operations'
  },
  {
    name: 'Business Logic',
    command: 'vitest run src/test/business/employee-validation.test.ts',
    description: 'Tests for validation rules and business logic'
  },
  {
    name: 'Component Integration',
    command: 'vitest run src/test/components/EmployeeTable.test.tsx',
    description: 'Tests for UI components and user interactions'
  },
  {
    name: 'Authentication',
    command: 'vitest run src/test/auth/AuthProvider.test.tsx',
    description: 'Tests for authentication and authorization'
  }
]

async function runTestSuite(suite: TestSuite): Promise<void> {
  console.log(`\n🧪 Running ${suite.name} Tests`)
  console.log(`📝 ${suite.description}`)
  console.log('─'.repeat(50))

  try {
    const { stdout, stderr } = await execAsync(suite.command)
    
    if (stdout) {
      console.log(stdout)
    }
    
    if (stderr) {
      console.error(stderr)
    }
    
    console.log(`✅ ${suite.name} tests completed successfully`)
  } catch (error: any) {
    console.error(`❌ ${suite.name} tests failed:`)
    console.error(error.stdout || error.message)
    throw error
  }
}

async function runAllTests(): Promise<void> {
  console.log('🚀 Starting Verto Employee Management Test Suite')
  console.log('=' .repeat(60))

  let passedSuites = 0
  let failedSuites = 0

  for (const suite of testSuites) {
    try {
      await runTestSuite(suite)
      passedSuites++
    } catch (error) {
      failedSuites++
      console.error(`\n❌ Test suite "${suite.name}" failed`)
    }
  }

  console.log('\n' + '='.repeat(60))
  console.log('📊 Test Results Summary')
  console.log('─'.repeat(60))
  console.log(`✅ Passed: ${passedSuites}/${testSuites.length} test suites`)
  console.log(`❌ Failed: ${failedSuites}/${testSuites.length} test suites`)

  if (failedSuites > 0) {
    console.log('\n⚠️  Some tests failed. Please review the output above.')
    process.exit(1)
  } else {
    console.log('\n🎉 All tests passed successfully!')
    process.exit(0)
  }
}

// Run specific test suite if provided as argument
const testSuiteName = process.argv[2]

if (testSuiteName) {
  const suite = testSuites.find(s => 
    s.name.toLowerCase().includes(testSuiteName.toLowerCase())
  )
  
  if (suite) {
    runTestSuite(suite).catch(() => process.exit(1))
  } else {
    console.error(`❌ Test suite "${testSuiteName}" not found`)
    console.log('\nAvailable test suites:')
    testSuites.forEach(s => console.log(`  - ${s.name}`))
    process.exit(1)
  }
} else {
  runAllTests().catch(() => process.exit(1))
}

export { testSuites, runTestSuite, runAllTests }
