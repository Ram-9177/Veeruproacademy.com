// Database initialization module with Neon PostgreSQL support.
// Centralized Prisma client and connection health utilities.

import { PrismaClient } from '@prisma/client'
import { getEnvironment, validateNeonConnectionString } from './neon-config'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Check if we have a valid DATABASE_URL
export const hasValidDatabaseUrl = (() => {
  const url = process.env.DATABASE_URL
  const env = getEnvironment()

  const isBuildTime =
    process.env.NEXT_PHASE === 'phase-production-build' ||
    process.env.npm_lifecycle_event === 'build' ||
    process.env.CI === 'true' ||
    process.env.VERCEL === '1'

  if (isBuildTime) {
    return Boolean(url)
  }

  if (!url) {
    console.error('[db] DATABASE_URL is required but not set')
    return false
  }

  const validation = validateNeonConnectionString(url)
  if (!validation.isValid) {
    console.error('[db] Invalid DATABASE_URL:', validation.warnings.join(', '))
    return false
  }

  if (validation.warnings.length > 0) {
    console.warn('[db] DATABASE_URL warnings:', validation.warnings.join(', '))
  }

  if (env.isProduction && url.includes('localhost')) {
    console.error('[db] Production environment is using localhost DATABASE_URL')
    return false
  }

  return true
})()

function createPrismaClient(): PrismaClient {
  const env = getEnvironment()

  if (!hasValidDatabaseUrl) {
    const message = '[db] DATABASE_URL missing/invalid; Prisma client cannot be initialized'
    if (env.isProduction) {
      throw new Error(message)
    }
    console.warn(message)
  }

  const client = new PrismaClient({
    log: env.isDevelopment ? ['query', 'error', 'warn'] : ['error'],
    errorFormat: 'minimal',
  })

  client.$on('error', (error) => {
    console.error('[prisma:error]', error)
  })

  return client
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

export default prisma

export async function checkDatabaseConnection(): Promise<{
  connected: boolean
  latency?: number
  error?: string
}> {
  try {
    const start = Date.now()
    await prisma.$queryRaw`SELECT 1`
    return { connected: true, latency: Date.now() - start }
  } catch (error) {
    return {
      connected: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}
