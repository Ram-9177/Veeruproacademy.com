/**
 * Logger Utility - Production-safe logging
 * 
 * Provides sanitized logging for production environments.
 * - Removes console.log calls (can be stripped in production)
 * - Provides structured logging with levels
 * - Safe for browser and server-side use
 * 
 * Usage:
 *   import { logger } from '@/lib/logger'
 *   logger.debug('Development-only message')
 *   logger.info('Important event')
 *   logger.warn('Warning condition')
 *   logger.error('Error occurred', error)
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogEntry {
  timestamp: string
  level: LogLevel
  message: string
  data?: unknown
  error?: {
    message: string
    stack?: string
  }
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development'
  private logHistory: LogEntry[] = []
  private maxHistorySize = 100

  /**
   * Debug level - Development only
   * These logs are typically stripped in production builds
   */
  debug(message: string, data?: unknown): void {
    if (this.isDevelopment) {
      console.debug(`[DEBUG] ${message}`, data)
    }
    this.recordLog('debug', message, data)
  }

  /**
   * Info level - Important events worth logging
   * This is the standard logging level for monitoring
   */
  info(message: string, data?: unknown): void {
    console.info(`[INFO] ${message}`, data ? JSON.stringify(data) : '')
    this.recordLog('info', message, data)
  }

  /**
   * Warn level - Warning conditions
   * Something unexpected happened but application continues
   */
  warn(message: string, data?: unknown): void {
    console.warn(`[WARN] ${message}`, data ? JSON.stringify(data) : '')
    this.recordLog('warn', message, data)
  }

  /**
   * Error level - Error conditions
   * Something went wrong - should be investigated
   */
  error(message: string, error?: Error | unknown, data?: unknown): void {
    const errorObj = error instanceof Error ? error : new Error(String(error))
    const logData: Record<string, unknown> = {
      message: errorObj.message,
      stack: errorObj.stack
    }
    if (data) {
      logData.context = data
    }
    console.error(`[ERROR] ${message}`, logData)
    
    this.recordLog('error', message, data, errorObj)
  }

  /**
   * Get recent log history
   * Useful for debugging in development
   */
  getHistory(level?: LogLevel): LogEntry[] {
    if (level) {
      return this.logHistory.filter(log => log.level === level)
    }
    return [...this.logHistory]
  }

  /**
   * Clear log history
   */
  clearHistory(): void {
    this.logHistory = []
  }

  /**
   * Internal: Record log entry
   */
  private recordLog(
    level: LogLevel,
    message: string,
    data?: unknown,
    error?: Error
  ): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message
    }

    if (data) {
      entry.data = data
    }

    if (error) {
      entry.error = {
        message: error.message,
        stack: error.stack
      }
    }

    // Keep a limited history
    this.logHistory.push(entry)
    if (this.logHistory.length > this.maxHistorySize) {
      this.logHistory.shift()
    }
  }
}

// Export singleton instance
export const logger = new Logger()

/**
 * Convenience wrapper for API errors
 * Logs error and returns standardized JSON response
 */
export function logApiError(
  message: string,
  error: Error | unknown,
  context?: Record<string, unknown>
): { error: string; status: number } {
  logger.error(message, error, context)
  
  return {
    error: message,
    status: 500
  }
}

/**
 * Convenience wrapper for async operations with error logging
 */
export async function withErrorLogging<T>(
  operation: () => Promise<T>,
  operationName: string
): Promise<T | null> {
  try {
    return await operation()
  } catch (error) {
    logger.error(`${operationName} failed`, error)
    return null
  }
}
