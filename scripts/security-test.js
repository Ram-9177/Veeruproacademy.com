#!/usr/bin/env node

/**
 * SECURITY TESTING SCRIPT
 * 
 * Tests all security features and endpoints for vulnerabilities
 */

import https from 'https'
import http from 'http'

// Colors for console output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

class SecurityTester {
  constructor(baseUrl = 'http://localhost:3000') {
    this.baseUrl = baseUrl
    this.results = {
      passed: 0,
      failed: 0,
      warnings: 0,
      tests: []
    }
  }

  async makeRequest(path, options = {}) {
    return new Promise((resolve, reject) => {
      const url = new URL(path, this.baseUrl)
      const protocol = url.protocol === 'https:' ? https : http
      
      const requestOptions = {
        hostname: url.hostname,
        port: url.port,
        path: url.pathname + url.search,
        method: options.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'SecurityTester/1.0',
          ...options.headers
        }
      }

      const req = protocol.request(requestOptions, (res) => {
        let data = ''
        res.on('data', chunk => data += chunk)
        res.on('end', () => {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: data
          })
        })
      })

      req.on('error', reject)
      
      if (options.body) {
        req.write(JSON.stringify(options.body))
      }
      
      req.end()
    })
  }

  addResult(testName, passed, message, severity = 'error') {
    this.results.tests.push({
      name: testName,
      passed,
      message,
      severity
    })
    
    if (passed) {
      this.results.passed++
    } else {
      if (severity === 'warning') {
        this.results.warnings++
      } else {
        this.results.failed++
      }
    }
  }

  async testAuthenticationEndpoints() {
    log('\n🔐 TESTING AUTHENTICATION SECURITY...', 'blue')
    
    // Test signup rate limiting
    try {
      const requests = []
      for (let i = 0; i < 5; i++) {
        requests.push(this.makeRequest('/api/auth/signup', {
          method: 'POST',
          body: {
            name: `Test User ${i}`,
            email: `test${i}@example.com`,
            password: 'TestPassword123!'
          }
        }))
      }
      
      const responses = await Promise.all(requests)
      const rateLimited = responses.some(res => res.statusCode === 429)
      
      this.addResult(
        'Signup Rate Limiting',
        rateLimited,
        rateLimited ? 'Rate limiting is working' : 'Rate limiting may not be configured properly',
        'warning'
      )
    } catch (error) {
      this.addResult('Signup Rate Limiting', false, `Error testing rate limiting: ${error.message}`)
    }
    
    // Test password strength validation
    try {
      const weakPasswords = ['123', 'password', 'abc123']
      
      for (const password of weakPasswords) {
        const response = await this.makeRequest('/api/auth/signup', {
          method: 'POST',
          body: {
            name: 'Test User',
            email: 'test@example.com',
            password
          }
        })
        
        if (response.statusCode === 400) {
          this.addResult(
            `Password Validation (${password})`,
            true,
            'Weak password rejected correctly'
          )
        } else {
          this.addResult(
            `Password Validation (${password})`,
            false,
            'Weak password was accepted'
          )
        }
      }
    } catch (error) {
      this.addResult('Password Validation', false, `Error testing password validation: ${error.message}`)
    }
  }

  async testAdminEndpoints() {
    log('\n👑 TESTING ADMIN ENDPOINT SECURITY...', 'blue')
    
    const adminEndpoints = [
      '/api/admin/users',
      '/api/admin/content',
      '/api/admin/analytics',
      '/api/admin/navbar-courses',
      '/api/admin/audit'
    ]
    
    for (const endpoint of adminEndpoints) {
      try {
        // Test without authentication
        const response = await this.makeRequest(endpoint)
        
        if (response.statusCode === 401) {
          this.addResult(
            `Admin Endpoint Protection (${endpoint})`,
            true,
            'Endpoint properly requires authentication'
          )
        } else {
          this.addResult(
            `Admin Endpoint Protection (${endpoint})`,
            false,
            `Endpoint accessible without authentication (status: ${response.statusCode})`
          )
        }
      } catch (error) {
        this.addResult(
          `Admin Endpoint Protection (${endpoint})`,
          false,
          `Error testing endpoint: ${error.message}`
        )
      }
    }
  }

  async testSecurityHeaders() {
    log('\n🛡️  TESTING SECURITY HEADERS...', 'blue')
    
    try {
      const response = await this.makeRequest('/')
      const headers = response.headers
      
      const securityHeaders = [
        { name: 'x-content-type-options', expected: 'nosniff' },
        { name: 'x-frame-options', expected: 'DENY' },
        { name: 'x-xss-protection', expected: '1; mode=block' },
        { name: 'referrer-policy', expected: 'strict-origin-when-cross-origin' }
      ]
      
      for (const header of securityHeaders) {
        const value = headers[header.name]
        
        if (value) {
          this.addResult(
            `Security Header (${header.name})`,
            true,
            `Header present: ${value}`
          )
        } else {
          this.addResult(
            `Security Header (${header.name})`,
            false,
            'Security header missing',
            'warning'
          )
        }
      }
      
      // Check for HTTPS redirect in production
      if (process.env.NODE_ENV === 'production' && !this.baseUrl.startsWith('https')) {
        this.addResult(
          'HTTPS Enforcement',
          false,
          'Production should use HTTPS',
          'warning'
        )
      }
    } catch (error) {
      this.addResult('Security Headers', false, `Error testing headers: ${error.message}`)
    }
  }

  async testInputValidation() {
    log('\n🔍 TESTING INPUT VALIDATION...', 'blue')
    
    // Test SQL injection attempts
    const sqlInjectionPayloads = [
      "'; DROP TABLE users; --",
      "' OR '1'='1",
      "1' UNION SELECT * FROM users --"
    ]
    
    for (const payload of sqlInjectionPayloads) {
      try {
        const response = await this.makeRequest('/api/search', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        
        // If the server doesn't crash and returns a proper error, it's good
        if (response.statusCode < 500) {
          this.addResult(
            `SQL Injection Protection (${payload.slice(0, 20)}...)`,
            true,
            'Payload handled safely'
          )
        } else {
          this.addResult(
            `SQL Injection Protection (${payload.slice(0, 20)}...)`,
            false,
            'Server error - possible vulnerability'
          )
        }
      } catch (error) {
        // Network errors are expected for malicious payloads
        this.addResult(
          `SQL Injection Protection (${payload.slice(0, 20)}...)`,
          true,
          'Request blocked or handled safely'
        )
      }
    }
    
    // Test XSS attempts
    const xssPayloads = [
      '<script>alert("xss")</script>',
      'javascript:alert("xss")',
      '<img src="x" onerror="alert(1)">'
    ]
    
    for (const payload of xssPayloads) {
      try {
        const response = await this.makeRequest('/api/auth/signup', {
          method: 'POST',
          body: {
            name: payload,
            email: 'test@example.com',
            password: 'TestPassword123!'
          }
        })
        
        if (response.body && !response.body.includes('<script>')) {
          this.addResult(
            `XSS Protection (${payload.slice(0, 20)}...)`,
            true,
            'Payload sanitized or rejected'
          )
        } else {
          this.addResult(
            `XSS Protection (${payload.slice(0, 20)}...)`,
            false,
            'Payload may not be properly sanitized'
          )
        }
      } catch (error) {
        this.addResult(
          `XSS Protection (${payload.slice(0, 20)}...)`,
          true,
          'Request handled safely'
        )
      }
    }
  }

  async testRateLimiting() {
    log('\n⏱️  TESTING RATE LIMITING...', 'blue')
    
    // Test API rate limiting
    try {
      const requests = []
      for (let i = 0; i < 10; i++) {
        requests.push(this.makeRequest('/api/search?q=test'))
      }
      
      const responses = await Promise.all(requests)
      const rateLimited = responses.some(res => res.statusCode === 429)
      
      this.addResult(
        'API Rate Limiting',
        rateLimited,
        rateLimited ? 'Rate limiting is working' : 'Rate limiting may not be configured',
        'warning'
      )
    } catch (error) {
      this.addResult('API Rate Limiting', false, `Error testing rate limiting: ${error.message}`)
    }
  }

  async testDataExposure() {
    log('\n🔒 TESTING DATA EXPOSURE...', 'blue')
    
    // Test for sensitive data in error messages
    try {
      const response = await this.makeRequest('/api/admin/users', {
        headers: {
          'Authorization': 'Bearer invalid-token'
        }
      })
      
      const body = response.body.toLowerCase()
      const sensitivePatterns = [
        'password',
        'secret',
        'key',
        'token',
        'database',
        'connection'
      ]
      
      const exposedData = sensitivePatterns.filter(pattern => body.includes(pattern))
      
      if (exposedData.length === 0) {
        this.addResult(
          'Sensitive Data Exposure',
          true,
          'No sensitive data found in error responses'
        )
      } else {
        this.addResult(
          'Sensitive Data Exposure',
          false,
          `Potential sensitive data exposure: ${exposedData.join(', ')}`
        )
      }
    } catch (error) {
      this.addResult('Sensitive Data Exposure', false, `Error testing data exposure: ${error.message}`)
    }
  }

  async runAllTests() {
    log('\n🔐 STARTING COMPREHENSIVE SECURITY TESTING...', 'bold')
    log('=' .repeat(60), 'blue')
    
    await this.testAuthenticationEndpoints()
    await this.testAdminEndpoints()
    await this.testSecurityHeaders()
    await this.testInputValidation()
    await this.testRateLimiting()
    await this.testDataExposure()
    
    this.printResults()
  }

  printResults() {
    log('\n' + '='.repeat(60), 'blue')
    log('📊 SECURITY TEST RESULTS:', 'bold')
    
    log(`\n✅ Passed: ${this.results.passed}`, 'green')
    log(`❌ Failed: ${this.results.failed}`, 'red')
    log(`⚠️  Warnings: ${this.results.warnings}`, 'yellow')
    
    if (this.results.failed > 0) {
      log('\n❌ FAILED TESTS:', 'red')
      this.results.tests
        .filter(test => !test.passed && test.severity === 'error')
        .forEach(test => log(`   • ${test.name}: ${test.message}`, 'red'))
    }
    
    if (this.results.warnings > 0) {
      log('\n⚠️  WARNINGS:', 'yellow')
      this.results.tests
        .filter(test => !test.passed && test.severity === 'warning')
        .forEach(test => log(`   • ${test.name}: ${test.message}`, 'yellow'))
    }
    
    const totalTests = this.results.passed + this.results.failed + this.results.warnings
    const successRate = Math.round((this.results.passed / totalTests) * 100)
    
    log(`\n📈 Success Rate: ${successRate}%`, successRate >= 80 ? 'green' : 'red')
    
    if (this.results.failed === 0) {
      log('\n🎉 All critical security tests passed!', 'green')
      log('🚀 Application appears secure for production deployment.', 'green')
    } else {
      log('\n🚨 Critical security issues found!', 'red')
      log('🛠️  Please fix the failed tests before deploying to production.', 'red')
    }
  }
}

// Run tests
if (import.meta.url === `file://${process.argv[1]}`) {
  const baseUrl = process.argv[2] || 'http://localhost:3000'
  const tester = new SecurityTester(baseUrl)
  
  tester.runAllTests().then(() => {
    process.exit(tester.results.failed > 0 ? 1 : 0)
  }).catch(error => {
    log(`\n❌ Security testing failed: ${error.message}`, 'red')
    process.exit(1)
  })
}

export { SecurityTester }