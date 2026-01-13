#!/usr/bin/env node
// Minimal health-check script for env + schema readiness.
import fs from 'fs'
import path from 'path'

const errors = []
const warnings = []
const isProd = process.env.NODE_ENV === 'production'

const pushErr = (msg) => {
  errors.push(msg)
  console.error('ERROR:', msg)
}

const pushWarn = (msg) => {
  warnings.push(msg)
  console.warn('WARN:', msg)
}

const requireEnv = (key) => {
  const value = process.env[key]
  if (!value || !value.trim()) {
    if (isProd) pushErr(`Missing required env: ${key}`)
    else pushWarn(`Env not set: ${key} (dev fallback may apply)`) 
  }
}

const requireEnvPair = (a, b) => {
  const hasA = Boolean(process.env[a]?.trim())
  const hasB = Boolean(process.env[b]?.trim())
  if (hasA !== hasB) {
    const msg = `Env pair must be set together: ${a} + ${b}`
    if (isProd) pushErr(msg)
    else pushWarn(msg)
  }
}

// Core env vars
requireEnv('DATABASE_URL')
requireEnv('NEXTAUTH_SECRET')
requireEnv('NEXTAUTH_URL')

// Optional paired envs
requireEnvPair('UPLOADTHING_SECRET', 'UPLOADTHING_APP_ID')
requireEnvPair('GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET')
requireEnvPair('RESEND_API_KEY', 'RESEND_FROM_EMAIL')

// Prisma schema sanity check
const schemaPath = path.join(process.cwd(), 'prisma', 'schema.prisma')
if (!fs.existsSync(schemaPath)) {
  pushErr('prisma/schema.prisma missing')
} else {
  console.log('OK: prisma/schema.prisma found')
}

if (errors.length) {
  console.error(`\nHealth check failed with ${errors.length} error(s)`) 
  process.exit(1)
}

if (warnings.length) {
  console.warn(`\nHealth check completed with ${warnings.length} warning(s)`) 
}

console.log('\nHealth check passed')
process.exit(0)
