import { spawnSync } from 'node:child_process'

function run(cmd, args, envOverrides = {}) {
  const result = spawnSync(cmd, args, {
    stdio: 'inherit',
    env: { ...process.env, ...envOverrides }
  })

  if (result.error) {
    console.error(`[vercel-build] Failed to run ${cmd}:`, result.error)
    process.exit(1)
  }

  if (typeof result.status === 'number' && result.status !== 0) {
    process.exit(result.status)
  }
}

const schema = './prisma/schema.prisma'
const databaseUrl = process.env.DATABASE_URL || ''
const directUrl = process.env.DIRECT_URL || ''
const isVercel = Boolean(process.env.VERCEL)

console.log('[vercel-build] Environment check:')
console.log(`  - NODE_ENV: ${process.env.NODE_ENV}`)
console.log(`  - VERCEL: ${process.env.VERCEL || 'false'}`)
console.log(`  - DATABASE_URL: ${databaseUrl ? '✓ Set' : '✗ Missing'}`)
console.log(`  - DIRECT_URL: ${directUrl ? '✓ Set' : '✗ Missing (will fallback to DATABASE_URL)'}`)

// Prisma schema validation requires DIRECT_URL to be present (because datasource uses directUrl).
// For client generation we can safely fall back to DATABASE_URL (this does NOT run migrations).
const directForGenerate = directUrl || databaseUrl
if (!directForGenerate) {
  console.error('[vercel-build] ❌ ERROR: Neither DATABASE_URL nor DIRECT_URL is set!')
  console.error('[vercel-build] Please set at least DATABASE_URL in your Vercel environment variables.')
  process.exit(1)
}

if (!directUrl && databaseUrl) {
  console.warn('[vercel-build] ⚠️  WARNING: DIRECT_URL not set, using DATABASE_URL as fallback.')
  console.warn('[vercel-build] For production with connection pooling (like Neon), set both:')
  console.warn('[vercel-build]   - DATABASE_URL: pooled connection string')
  console.warn('[vercel-build]   - DIRECT_URL: direct connection string (for migrations)')
}

console.log('[vercel-build] Running prisma generate...')
run('npx', ['prisma', 'generate', '--schema', schema], {
  DIRECT_URL: directForGenerate
})
console.log('[vercel-build] ✓ Prisma client generated')

// Migrations must run against DIRECT_URL (non-pooled).
if (isVercel) {
  console.log('[vercel-build] Running on Vercel, checking migrations...')
  
  if (!directUrl) {
    console.error('[vercel-build] ❌ ERROR: DIRECT_URL is required on Vercel to run prisma migrate deploy')
    console.error('[vercel-build] For Neon database:')
    console.error('[vercel-build]   1. Get your connection string from Neon dashboard')
    console.error('[vercel-build]   2. Set DATABASE_URL to the pooled connection (ends with -pooler)')
    console.error('[vercel-build]   3. Set DIRECT_URL to the direct connection (no -pooler suffix)')
    console.error('[vercel-build] Then redeploy on Vercel.')
    process.exit(1)
  }

 // console.log('[vercel-build] Running prisma migrate deploy...')
 // run('npx', ['prisma', 'migrate', 'deploy', '--schema', schema], {
 // DIRECT_URL: directUrl 
//     })
//    console.log('[vercel-build] ✓ Database migrations deployed')
} else {
  // Local/non-vercel: run migrations only if DIRECT_URL is explicitly provided.
  if (directUrl) {
    console.log('[vercel-build] Running prisma migrate deploy locally...')
    run('npx', ['prisma', 'migrate', 'deploy', '--schema', schema], {
      DIRECT_URL: directUrl
    })
    console.log('[vercel-build] ✓ Database migrations deployed')
  } else {
    console.log('[vercel-build] Not on Vercel and DIRECT_URL not set; skipping prisma migrate deploy')
    console.log('[vercel-build] To run migrations locally, set DIRECT_URL and run:')
    console.log('[vercel-build]   npx prisma migrate deploy')
  }
}
