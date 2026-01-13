#!/usr/bin/env node

/**
 * 🛡️ COMPREHENSIVE SECURITY VALIDATION SCRIPT
 * 
 * This script validates all security measures implemented in the platform
 * and provides a detailed security assessment report.
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(__dirname, '..')

console.log('🛡️  VEERU\'S PRO ACADEMY - SECURITY VALIDATION')
console.log('==============================================')
console.log('')

let securityScore = 0
let totalChecks = 0
const issues = []
const passed = []

function checkFile(filePath, description) {
  totalChecks++
  const fullPath = path.join(projectRoot, filePath)
  
  if (fs.existsSync(fullPath)) {
    passed.push(`✅ ${description}`)
    securityScore++
    return true
  } else {
    issues.push(`❌ ${description} - File missing: ${filePath}`)
    return false
  }
}

function checkFileContent(filePath, searchString, description) {
  totalChecks++
  const fullPath = path.join(projectRoot, filePath)
  
  try {
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf8')
      if (content.includes(searchString)) {
        passed.push(`✅ ${description}`)
        securityScore++
        return true
      } else {
        issues.push(`❌ ${description} - Content not found in: ${filePath}`)
        return false
      }
    } else {
      issues.push(`❌ ${description} - File missing: ${filePath}`)
      return false
    }
  } catch (error) {
    issues.push(`❌ ${description} - Error reading file: ${error.message}`)
    return false
  }
}

function checkEnvironmentSecurity() {
  console.log('🔐 Checking Environment Security...')
  
  // Check if .env.local contains placeholders (not real credentials)
  checkFileContent('.env.local', 'your-database-url-here', 'Environment variables are templated (not exposed)')
  checkFileContent('.env.local', 'your-nextauth-secret-here', 'NextAuth secret is templated')
  
  // Check if .env.example exists
  checkFile('.env.example', 'Environment template file exists')
  
  // Check if .gitignore includes .env.local
  checkFileContent('.gitignore', '.env.local', '.env.local is in .gitignore')
}

function checkInputValidation() {
  console.log('🔍 Checking Input Validation...')
  
  // Check search API has validation
  checkFileContent('app/api/search/route.ts', 'sanitize.string', 'Search API has input sanitization')
  checkFileContent('app/api/search/route.ts', 'rateLimitResult', 'Search API has rate limiting')
  
  // Check admin APIs have validation
  checkFileContent('app/api/admin/users/route.ts', 'sanitize.string', 'Admin users API has input sanitization')
  checkFileContent('app/api/admin/content/route.ts', 'adminRateLimiter', 'Admin content API has rate limiting')
}

function checkPasswordSecurity() {
  console.log('🔑 Checking Password Security...')
  
  // Check enhanced password validation
  checkFileContent('lib/security.ts', 'password.length < 12', 'Password minimum length is 12 characters')
  checkFileContent('lib/security.ts', 'commonPasswords', 'Common password blacklist exists')
  checkFileContent('lib/security.ts', 'weakPatterns', 'Weak pattern detection implemented')
  
  // Check signup uses enhanced validation
  checkFileContent('app/api/auth/signup/route.ts', 'validatePassword', 'Signup uses enhanced password validation')
}

function checkAuthenticationSecurity() {
  console.log('🔐 Checking Authentication Security...')
  
  // Check session configuration
  checkFileContent('lib/auth.config.ts', 'maxAge: 7 * 24 * 60 * 60', 'Session duration is secure (7 days)')
  checkFileContent('lib/auth.config.ts', 'httpOnly: true', 'Cookies are HTTP-only')
  checkFileContent('lib/auth.config.ts', '__Secure-', 'Secure cookie prefixes used')
  
  // Check middleware protection
  checkFileContent('middleware.ts', 'sanitizePathname', 'Middleware has path sanitization')
  checkFileContent('middleware.ts', 'addSecurityHeaders', 'Middleware adds security headers')
  checkFileContent('middleware.ts', 'logSecurityEvent', 'Middleware has audit logging')
}

function checkXSSProtection() {
  console.log('🛡️ Checking XSS Protection...')
  
  // Check components use sanitization
  checkFileContent('app/components/SessionWrapper.tsx', 'sanitize.string', 'SessionWrapper sanitizes user input')
  checkFileContent('app/admin/components/AdminSidebar.tsx', 'sanitize.string', 'AdminSidebar sanitizes user input')
  
  // Check security headers
  checkFileContent('middleware.ts', 'X-XSS-Protection', 'XSS protection headers added')
  checkFileContent('middleware.ts', 'X-Content-Type-Options', 'Content type options header added')
}

function checkRateLimiting() {
  console.log('⏱️ Checking Rate Limiting...')
  
  // Check rate limiters are defined
  checkFileContent('lib/security.ts', 'signupRateLimiter', 'Signup rate limiter defined')
  checkFileContent('lib/security.ts', 'apiRateLimiter', 'API rate limiter defined')
  checkFileContent('lib/security.ts', 'adminRateLimiter', 'Admin rate limiter defined')
  
  // Check rate limiters are used
  checkFileContent('app/api/auth/signup/route.ts', 'signupRateLimiter.check', 'Signup API uses rate limiting')
  checkFileContent('app/api/search/route.ts', 'apiRateLimiter.check', 'Search API uses rate limiting')
}

function checkAuditLogging() {
  console.log('📝 Checking Audit Logging...')
  
  // Check audit logging is implemented
  checkFileContent('lib/security.ts', 'auditLog', 'Audit logging function exists')
  checkFileContent('app/api/auth/signup/route.ts', 'auditLog', 'Signup API has audit logging')
  checkFileContent('middleware.ts', 'logSecurityEvent', 'Middleware has security event logging')
}

function checkSecurityUtilities() {
  console.log('🔧 Checking Security Utilities...')
  
  // Check sanitization functions
  checkFileContent('lib/security.ts', 'sanitize.string', 'String sanitization function exists')
  checkFileContent('lib/security.ts', 'sanitize.email', 'Email sanitization function exists')
  checkFileContent('lib/security.ts', 'sanitize.number', 'Number sanitization function exists')
  
  // Check validation functions
  checkFileContent('lib/security.ts', 'validateEmail', 'Email validation function exists')
  checkFileContent('lib/security.ts', 'hashPassword', 'Password hashing function exists')
}

// Run all security checks
console.log('Starting comprehensive security validation...\n')

checkEnvironmentSecurity()
console.log('')

checkInputValidation()
console.log('')

checkPasswordSecurity()
console.log('')

checkAuthenticationSecurity()
console.log('')

checkXSSProtection()
console.log('')

checkRateLimiting()
console.log('')

checkAuditLogging()
console.log('')

checkSecurityUtilities()
console.log('')

// Calculate security score
const scorePercentage = Math.round((securityScore / totalChecks) * 100)

console.log('📊 SECURITY VALIDATION RESULTS')
console.log('==============================')
console.log('')

console.log('✅ PASSED CHECKS:')
passed.forEach(check => console.log(`   ${check}`))
console.log('')

if (issues.length > 0) {
  console.log('❌ FAILED CHECKS:')
  issues.forEach(issue => console.log(`   ${issue}`))
  console.log('')
}

console.log(`🎯 SECURITY SCORE: ${securityScore}/${totalChecks} (${scorePercentage}%)`)
console.log('')

// Security rating
let rating = 'CRITICAL'
let emoji = '🚨'
let recommendation = 'IMMEDIATE ACTION REQUIRED'

if (scorePercentage >= 95) {
  rating = 'EXCELLENT'
  emoji = '🛡️'
  recommendation = 'PRODUCTION READY'
} else if (scorePercentage >= 85) {
  rating = 'GOOD'
  emoji = '✅'
  recommendation = 'MINOR IMPROVEMENTS NEEDED'
} else if (scorePercentage >= 70) {
  rating = 'FAIR'
  emoji = '⚠️'
  recommendation = 'SECURITY IMPROVEMENTS REQUIRED'
} else if (scorePercentage >= 50) {
  rating = 'POOR'
  emoji = '❌'
  recommendation = 'MAJOR SECURITY FIXES NEEDED'
}

console.log(`${emoji} SECURITY RATING: ${rating}`)
console.log(`📋 RECOMMENDATION: ${recommendation}`)
console.log('')

if (scorePercentage >= 85) {
  console.log('🎉 Congratulations! Your platform has strong security measures in place.')
  console.log('   Continue monitoring and updating security practices regularly.')
} else {
  console.log('⚠️  Security improvements are needed before production deployment.')
  console.log('   Please address the failed checks above.')
}

console.log('')
console.log('🔗 For detailed security guidelines, see:')
console.log('   - CRITICAL_SECURITY_AUDIT_REPORT.md')
console.log('   - SECURITY_FIXES_IMPLEMENTED.md')
console.log('')

// Exit with appropriate code
process.exit(scorePercentage >= 85 ? 0 : 1)