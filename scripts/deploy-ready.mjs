#!/usr/bin/env node

/**
 * DEPLOYMENT READINESS SCRIPT
 * 
 * Final comprehensive check before production deployment
 */

import { execSync } from 'child_process'
import fs from 'fs'

// Colors for console output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

async function runDeploymentChecks() {
  log('\n🚀 FINAL DEPLOYMENT READINESS CHECK', 'bold')
  log('=' .repeat(60), 'cyan')
  
  let allPassed = true
  
  // 1. Run final validation
  log('\n📋 Step 1: Running Final Validation...', 'blue')
  try {
    execSync('node scripts/final-validation.mjs', { stdio: 'inherit' })
    log('✅ Final validation passed!', 'green')
  } catch (error) {
    log('❌ Final validation failed!', 'red')
    allPassed = false
  }
  
  // 2. Check TypeScript compilation
  log('\n🔧 Step 2: TypeScript Compilation Check...', 'blue')
  try {
    execSync('npx tsc --noEmit', { stdio: 'pipe' })
    log('✅ TypeScript compilation successful!', 'green')
  } catch (error) {
    log('❌ TypeScript compilation failed!', 'red')
    log('Please fix TypeScript errors before deployment', 'yellow')
    allPassed = false
  }
  
  // 3. Run linting
  log('\n🧹 Step 3: Code Linting...', 'blue')
  try {
    execSync('npm run lint', { stdio: 'pipe' })
    log('✅ Linting passed!', 'green')
  } catch (error) {
    log('⚠️  Linting warnings found (non-blocking)', 'yellow')
  }
  
  // 4. Test build process
  log('\n🏗️  Step 4: Production Build Test...', 'blue')
  try {
    log('Building application...', 'cyan')
    execSync('npm run build', { stdio: 'inherit' })
    log('✅ Production build successful!', 'green')
  } catch (error) {
    log('❌ Production build failed!', 'red')
    allPassed = false
  }
  
  // 5. Check environment variables
  log('\n🔐 Step 5: Environment Variables Check...', 'blue')
  const requiredEnvVars = [
    'DATABASE_URL',
    'NEXTAUTH_SECRET',
    'NEXTAUTH_URL'
  ]
  
  let envPassed = true
  for (const envVar of requiredEnvVars) {
    if (process.env[envVar]) {
      log(`✅ ${envVar}: Set`, 'green')
    } else {
      log(`❌ ${envVar}: Missing`, 'red')
      envPassed = false
    }
  }
  
  if (envPassed) {
    log('✅ All required environment variables are set!', 'green')
  } else {
    log('❌ Missing required environment variables!', 'red')
    allPassed = false
  }
  
  // 6. Security check
  log('\n🛡️  Step 6: Security Verification...', 'blue')
  
  // Check for common security issues
  const securityChecks = [
    {
      file: 'middleware.ts',
      pattern: /getToken|token/,
      name: 'Authentication middleware'
    },
    {
      file: 'lib/security.ts',
      pattern: /bcrypt|hashPassword/,
      name: 'Password hashing'
    },
    {
      file: 'app/api/auth/signup/route.ts',
      pattern: /rateLimit|RateLimiter/,
      name: 'Rate limiting'
    }
  ]
  
  let securityPassed = true
  for (const check of securityChecks) {
    try {
      const content = fs.readFileSync(check.file, 'utf8')
      if (check.pattern.test(content)) {
        log(`✅ ${check.name}: Implemented`, 'green')
      } else {
        log(`❌ ${check.name}: Missing`, 'red')
        securityPassed = false
      }
    } catch (error) {
      log(`❌ ${check.name}: File not found`, 'red')
      securityPassed = false
    }
  }
  
  if (securityPassed) {
    log('✅ Security checks passed!', 'green')
  } else {
    log('❌ Security issues found!', 'red')
    allPassed = false
  }
  
  // Final assessment
  log('\n' + '='.repeat(60), 'cyan')
  log('📊 DEPLOYMENT READINESS ASSESSMENT:', 'bold')
  
  if (allPassed) {
    log('\n🎉 DEPLOYMENT READY!', 'green')
    log('✅ All systems validated and ready for production', 'green')
    log('🚀 You can deploy with 100% confidence!', 'green')
    
    log('\n📋 DEPLOYMENT CHECKLIST:', 'bold')
    log('1. ✅ Code validation passed', 'green')
    log('2. ✅ TypeScript compilation successful', 'green')
    log('3. ✅ Production build working', 'green')
    log('4. ✅ Environment variables configured', 'green')
    log('5. ✅ Security measures in place', 'green')
    
    log('\n🎯 NEXT STEPS:', 'cyan')
    log('• Deploy to your hosting platform (Vercel/Netlify recommended)', 'cyan')
    log('• Set up production database', 'cyan')
    log('• Configure domain and SSL', 'cyan')
    log('• Run post-deployment tests', 'cyan')
    log('• Monitor application performance', 'cyan')
    
    return true
  } else {
    log('\n🚨 DEPLOYMENT NOT READY!', 'red')
    log('❌ Critical issues must be fixed before deployment', 'red')
    log('🛠️  Please address the failed checks above', 'red')
    
    return false
  }
}

// Run deployment checks
runDeploymentChecks().then(success => {
  process.exit(success ? 0 : 1)
}).catch(error => {
  log(`\n❌ Deployment check failed: ${error.message}`, 'red')
  process.exit(1)
})