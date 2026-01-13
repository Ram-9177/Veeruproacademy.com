/**
 * Neon Database Configuration for Vercel Serverless Deployment
 * Optimized for Neon's serverless Postgres with proper connection pooling
 */

export interface NeonConfig {
  connectionString: string
  maxConnections: number
  connectionTimeout: number
  idleTimeout: number
  allowExit: boolean
}

/**
 * Get environment-specific configuration
 */
export function getEnvironment() {
  // VERCEL_ENV is set by Vercel: 'production', 'preview', or 'development'
  const vercelEnv = process.env.VERCEL_ENV
  const nodeEnv = process.env.NODE_ENV
  
  return {
    isProduction: vercelEnv === 'production' || nodeEnv === 'production',
    isPreview: vercelEnv === 'preview',
    isDevelopment: vercelEnv === 'development' || nodeEnv === 'development',
    isVercel: Boolean(process.env.VERCEL),
    environment: vercelEnv || nodeEnv || 'development'
  }
}

/**
 * Get Neon database configuration optimized for Vercel serverless
 */
export function getNeonConfig(): NeonConfig {
  const env = getEnvironment()
  const connectionString = process.env.DATABASE_URL || ''

  // Serverless-optimized connection pooling
  // Neon handles connection pooling at the proxy level when using -pooler endpoints
  const config: NeonConfig = {
    connectionString,
    // Prisma creates its own connection pool; limit based on environment
    maxConnections: env.isProduction ? 10 : 5,
    // Shorter timeouts for serverless to fail fast
    connectionTimeout: 10000, // 10 seconds
    idleTimeout: 30000, // 30 seconds
    // Allow Prisma to exit cleanly in serverless
    allowExit: true
  }

  return config
}

/**
 * Validate DATABASE_URL for Neon compatibility
 */
export function validateNeonConnectionString(url: string): {
  isValid: boolean
  isNeon: boolean
  isPooled: boolean
  warnings: string[]
} {
  const warnings: string[] = []
  
  if (!url) {
    return { isValid: false, isNeon: false, isPooled: false, warnings: ['DATABASE_URL is empty'] }
  }

  // Parse URL to check for Neon domains
  let isNeon = false
  let isPooled = false
  
  try {
    const parsedUrl = new URL(url)
    const hostname = parsedUrl.hostname
    
    // Check if hostname is a Neon domain
    isNeon = hostname.includes('.neon.tech') || 
             hostname.includes('.neon.postgres') ||
             hostname.includes('neon.tech')
    
    // Check if using pooled connection
    isPooled = hostname.includes('-pooler') || 
               parsedUrl.searchParams.get('pooler') === 'true'
  } catch (error) {
    warnings.push('Invalid DATABASE_URL format')
    return { isValid: false, isNeon: false, isPooled: false, warnings }
  }
  
  if (isNeon && !isPooled && getEnvironment().isVercel) {
    warnings.push(
      'For Vercel deployment, use Neon pooled connection string (hostname ends with -pooler or has ?pooler=true)'
    )
  }

  if (url.includes('localhost') && getEnvironment().isProduction) {
    warnings.push('Production environment is using localhost DATABASE_URL')
    return { isValid: false, isNeon: false, isPooled: false, warnings }
  }

  return { 
    isValid: true, 
    isNeon, 
    isPooled,
    warnings 
  }
}

/**
 * Get Prisma datasource configuration for Neon
 */
export function getPrismaDatasourceConfig() {
  const config = getNeonConfig()
  
  return {
    url: config.connectionString,
    // Direct connection for migrations (if DIRECT_URL is set)
    directUrl: process.env.DIRECT_URL,
  }
}
