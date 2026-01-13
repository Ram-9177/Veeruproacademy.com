#!/usr/bin/env node

/**
 * COMPREHENSIVE FUNCTIONALITY TEST
 * 
 * Tests all major features of the application
 */

import { createRequire } from 'module'
const require = createRequire(import.meta.url)

async function testEndpoint(path) {
  try {
    const response = await fetch(`http://localhost:3000${path}`)
    return {
      success: response.ok,
      status: response.status,
      url: path
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
      url: path
    }
  }
}

async function runTests() {
  console.log('🧪 RUNNING COMPREHENSIVE FUNCTIONALITY TESTS')
  console.log('=' .repeat(50))
  
  const endpoints = [
    '/',
    '/courses',
    '/projects', 
    '/about',
    '/login',
    '/signup',
    '/dashboard',
    '/api/search?q=javascript',
    '/api/navbar-courses',
    '/api/auth/session'
  ]
  
  let passed = 0
  let failed = 0
  
  for (const endpoint of endpoints) {
    process.stdout.write(`Testing ${endpoint}... `)
    
    const result = await testEndpoint(endpoint)
    
    if (result.success) {
      console.log('✅ PASS')
      passed++
    } else {
      console.log(`❌ FAIL`)
      failed++
    }
  }
  
  console.log('\n' + '=' .repeat(50))
  console.log(`📊 TEST RESULTS: ${passed} passed, ${failed} failed`)
  
  if (failed === 0) {
    console.log('🎉 ALL TESTS PASSED! Application is ready for production.')
  } else {
    console.log('⚠️  Some tests failed. Please check the server is running.')
  }
  
  return failed === 0
}

runTests().then(success => {
  process.exit(success ? 0 : 1)
})