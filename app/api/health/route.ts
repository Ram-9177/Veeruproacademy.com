import { NextResponse } from 'next/server'
import { checkDatabaseConnection } from '@/lib/db'
import { getEnvironment } from '@/lib/neon-config'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Health check endpoint for monitoring database connectivity
 * GET /api/health
 */
export async function GET() {
  try {
    const env = getEnvironment()
    const dbHealth = await checkDatabaseConnection()
    
    const health = {
      status: dbHealth.connected ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      environment: env.environment,
      checks: {
        database: {
          connected: dbHealth.connected,
          latency: dbHealth.latency,
          error: dbHealth.error
        },
        application: {
          version: '0.1.0', // Set explicitly since npm_package_version is unreliable in production
          nodeVersion: process.version,
          platform: process.platform
        }
      }
    }

    // Return 503 if database is not connected
    const status = dbHealth.connected ? 200 : 503

    return NextResponse.json(health, { 
      status,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'X-Health-Status': health.status
      }
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    
    return NextResponse.json(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
        error: errorMessage
      },
      { status: 500 }
    )
  }
}
