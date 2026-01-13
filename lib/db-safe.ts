/**
 * Safe Prisma wrapper with built-in error handling
 * Provides consistent error handling across all database operations
 */

import { prisma } from './db'
import { logger } from './logger'

interface QueryResult<T> {
  success: boolean
  data?: T
  error?: string
  errorCode?: string
}

/**
 * Execute a Prisma query with error handling
 */
export async function safeQuery<T>(
  operation: (_client: typeof prisma) => Promise<T>,
  operationName: string
): Promise<QueryResult<T>> {
  try {
    const data = await operation(prisma)
    return { success: true, data }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    logger.error(`[DB Operation: ${operationName}] Failed:`, { 
      error: errorMessage,
      stack: error instanceof Error ? error.stack : undefined
    })
    
    return {
      success: false,
      error: errorMessage,
      errorCode: error instanceof Error && (error as any).code ? (error as any).code : 'UNKNOWN_ERROR'
    }
  }
}

/**
 * Execute multiple Prisma queries in parallel with error handling
 */
export async function safeQueryParallel<T extends Record<string, any>>(
  queries: Record<keyof T, Promise<any>>,
  operationName: string
): Promise<QueryResult<T>> {
  try {
    const results = await Promise.all(Object.values(queries))
    const data = Object.keys(queries).reduce((acc, key, index) => {
      acc[key as keyof T] = results[index]
      return acc
    }, {} as T)
    
    return { success: true, data }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    logger.error(`[DB Operation: ${operationName}] Failed:`, { 
      error: errorMessage,
      stack: error instanceof Error ? error.stack : undefined
    })
    
    return {
      success: false,
      error: errorMessage,
      errorCode: error instanceof Error && (error as any).code ? (error as any).code : 'UNKNOWN_ERROR'
    }
  }
}

/**
 * Check database connection health
 */
export async function checkDatabaseHealth(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`
    logger.info('[DB] Database connection healthy')
    return true
  } catch (error) {
    logger.error('[DB] Database connection check failed:', error)
    return false
  }
}

const dbSafe = {
  safeQuery,
  safeQueryParallel,
  checkDatabaseHealth
}

export default dbSafe
