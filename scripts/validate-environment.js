#!/usr/bin/env node

/**
 * ENVIRONMENT VALIDATION SCRIPT
 * 
 * Validates all required environment variables and configurations
 * before production deployment
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

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

function validateEnvironment() {
  log('\n🔍 VALIDATING PRODUCTION ENVIRONMENT...', 'blue')
  log('=' .repeat(50), 'blue')
  
  const errors = []
  const warnings = []
  
  // Check if .env files exist
  const envFiles = ['.env', '.env.local', '.env.production']
  let hasEnvFile = false
  
  for (const file of envFiles) {
    if (fs.existsSync(file)) {
      log(`✅ Found environment file: ${file}`, 'green')
      hasEnvFile = true
      break
    }
  }
  
  if (!hasEnvFile) {
    errors.push('No environment file found (.env, .env.local, or .env.production)')
  }
  
  // Required environment variables
  const requiredVars = [
    {
      name: 'DATABASE_URL',
      description: 'PostgreSQL database connection string',
      validator: (value) => {
        if (!value) return 'Missing DATABASE_URL'
        try {
          new URL(value)
          if (process.env.NODE_ENV === 'production' && value.includes('localhost')) {
            return 'Production should not use localhost DATABASE_URL'
          }
          if (value.includes('your-') || value.includes('example')) {
            return 'DATABASE_URL appears to be a placeholder'
          }
          return null
        } catch {
          return 'DATABASE_URL is not a valid URL'
        }
      }
    },
    {
      name: 'NEXTAUTH_SECRET',
      description: 'NextAuth.js secret for JWT signing',
      validator: (value) => {
        if (!value) return 'Missing NEXTAUTH_SECRET'
        if (value.length < 32) return 'NEXTAUTH_SECRET should be at least 32 characters'
        if (value === 'dev-secret-please-change-in-production') {
          return 'NEXTAUTH_SECRET is using default development value'
        }
        return null
      }
    },
    {
      name: 'NEXTAUTH_URL',
      description: 'NextAuth.js canonical URL',
      validator: (value) => {
        if (!value) return 'Missing NEXTAUTH_URL'
        try {
          new URL(value)
          if (process.env.NODE_ENV === 'production' && value.includes('localhost')) {
            return 'Production should not use localhost NEXTAUTH_URL'
          }
          return null
        } catch {
          return 'NEXTAUTH_URL is not a valid URL'
        }
      }
    },
    {
      name: 'NEXT_PUBLIC_SITE_URL',
      description: 'Public site URL for client-side usage',
      validator: (value) => {
        if (!value) return 'Missing NEXT_PUBLIC_SITE_URL'
        try {
          new URL(value)
          return null
        } catch {
          return 'NEXT_PUBLIC_SITE_URL is not a valid URL'
        }
      }
    }
  ]
  
  // Optional but recommended variables
  const optionalVars = [
    {
      name: 'SMTP_HOST',
      description: 'Email server host for notifications'
    },
    {
      name: 'SMTP_PORT',
      description: 'Email server port'
    },
    {
      name: 'SMTP_USER',
      description: 'Email server username'
    },
    {
      name: 'SMTP_PASS',
      description: 'Email server password'
    },
    {
      name: 'RAZORPAY_KEY_ID',
      description: 'Razorpay payment gateway key ID'
    },
    {
      name: 'RAZORPAY_KEY_SECRET',
      description: 'Razorpay payment gateway secret'
    }
  ]
  
  log('\n📋 CHECKING REQUIRED ENVIRONMENT VARIABLES:', 'bold')
  
  for (const envVar of requiredVars) {
    const value = process.env[envVar.name]
    const error = envVar.validator(value)
    
    if (error) {
      log(`❌ ${envVar.name}: ${error}`, 'red')
      errors.push(`${envVar.name}: ${error}`)
    } else {
      log(`✅ ${envVar.name}: Valid`, 'green')
    }
  }
  
  log('\n📋 CHECKING OPTIONAL ENVIRONMENT VARIABLES:', 'bold')
  
  for (const envVar of optionalVars) {
    const value = process.env[envVar.name]
    
    if (value) {
      log(`✅ ${envVar.name}: Set`, 'green')
    } else {
      log(`⚠️  ${envVar.name}: Not set (${envVar.description})`, 'yellow')
      warnings.push(`${envVar.name}: Not set - ${envVar.description}`)
    }
  }
  
  // Check Node.js version
  log('\n🔧 CHECKING SYSTEM REQUIREMENTS:', 'bold')
  
  const nodeVersion = process.version
  const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0])
  
  if (majorVersion >= 18) {
    log(`✅ Node.js version: ${nodeVersion} (supported)`, 'green')
  } else {
    log(`❌ Node.js version: ${nodeVersion} (requires Node.js 18+)`, 'red')
    errors.push(`Node.js version ${nodeVersion} is not supported. Requires Node.js 18+`)
  }
  
  // Check if package.json exists and has required scripts
  if (fs.existsSync('package.json')) {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'))
    
    const requiredScripts = ['build', 'start', 'dev']
    const missingScripts = requiredScripts.filter(script => !packageJson.scripts[script])
    
    if (missingScripts.length === 0) {
      log('✅ Package.json scripts: All required scripts present', 'green')
    } else {
      log(`❌ Package.json scripts: Missing ${missingScripts.join(', ')}`, 'red')
      errors.push(`Missing required npm scripts: ${missingScripts.join(', ')}`)
    }
  } else {
    log('❌ Package.json: Not found', 'red')
    errors.push('package.json file not found')
  }
  
  // Check if Prisma schema exists
  if (fs.existsSync('prisma/schema.prisma')) {
    log('✅ Prisma schema: Found', 'green')
  } else {
    log('❌ Prisma schema: Not found', 'red')
    errors.push('Prisma schema file not found at prisma/schema.prisma')
  }
  
  // Check if Next.js config exists
  const nextConfigFiles = ['next.config.js', 'next.config.mjs', 'next.config.ts']
  const hasNextConfig = nextConfigFiles.some(file => fs.existsSync(file))
  
  if (hasNextConfig) {
    log('✅ Next.js config: Found', 'green')
  } else {
    log('⚠️  Next.js config: Not found (using defaults)', 'yellow')
    warnings.push('No Next.js config file found - using default configuration')
  }
  
  // Security checks
  log('\n🔒 SECURITY VALIDATION:', 'bold')
  
  // Check if security middleware exists
  if (fs.existsSync('middleware.ts') || fs.existsSync('middleware.js')) {
    log('✅ Security middleware: Found', 'green')
  } else {
    log('❌ Security middleware: Not found', 'red')
    errors.push('Security middleware not found')
  }
  
  // Check if security utilities exist
  if (fs.existsSync('lib/security.ts') || fs.existsSync('lib/security.js')) {
    log('✅ Security utilities: Found', 'green')
  } else {
    log('❌ Security utilities: Not found', 'red')
    errors.push('Security utilities not found')
  }
  
  // Production-specific checks
  if (process.env.NODE_ENV === 'production') {
    log('\n🚀 PRODUCTION-SPECIFIC CHECKS:', 'bold')
    
    // Check for development dependencies in production
    if (fs.existsSync('node_modules/.bin/nodemon')) {
      log('⚠️  Development tools detected in production', 'yellow')
      warnings.push('Development tools detected - consider using --production flag for npm install')
    }
    
    // Check for source maps in production
    if (fs.existsSync('.next')) {
      const nextDir = fs.readdirSync('.next')
      const hasSourceMaps = nextDir.some(file => file.includes('.map'))
      
      if (hasSourceMaps) {
        log('⚠️  Source maps detected in production build', 'yellow')
        warnings.push('Source maps detected - consider disabling for production')
      }
    }
  }
  
  // Summary
  log('\n' + '='.repeat(50), 'blue')
  log('📊 VALIDATION SUMMARY:', 'bold')
  
  if (errors.length === 0) {
    log(`✅ Environment validation passed! (${warnings.length} warnings)`, 'green')
    
    if (warnings.length > 0) {
      log('\n⚠️  WARNINGS:', 'yellow')
      warnings.forEach(warning => log(`   • ${warning}`, 'yellow'))
    }
    
    log('\n🚀 Ready for production deployment!', 'green')
    return true
  } else {
    log(`❌ Environment validation failed! (${errors.length} errors, ${warnings.length} warnings)`, 'red')
    
    log('\n❌ ERRORS (must fix before deployment):', 'red')
    errors.forEach(error => log(`   • ${error}`, 'red'))
    
    if (warnings.length > 0) {
      log('\n⚠️  WARNINGS:', 'yellow')
      warnings.forEach(warning => log(`   • ${warning}`, 'yellow'))
    }
    
    log('\n🛠️  Please fix the errors above before deploying to production.', 'red')
    return false
  }
}

// Run validation
if (import.meta.url === `file://${process.argv[1]}`) {
  const isValid = validateEnvironment()
  process.exit(isValid ? 0 : 1)
}

export { validateEnvironment }