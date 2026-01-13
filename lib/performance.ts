/**
 * Performance Monitoring and Optimization System
 * Provides comprehensive performance tracking and optimization utilities
 */

import { NextRequest, NextResponse } from 'next/server'

export interface PerformanceMetrics {
  requestId: string
  method: string
  url: string
  startTime: number
  endTime?: number
  duration?: number
  statusCode?: number
  userAgent?: string
  ip?: string
  memoryUsage?: NodeJS.MemoryUsage
  cpuUsage?: NodeJS.CpuUsage
}

export interface DatabaseMetrics {
  query: string
  duration: number
  timestamp: number
  success: boolean
  error?: string
}

export interface CacheMetrics {
  key: string
  hit: boolean
  duration: number
  timestamp: number
}

// In-memory storage for metrics (use Redis in production)
const performanceStore = new Map<string, PerformanceMetrics>()
const databaseMetrics: DatabaseMetrics[] = []
const cacheMetrics: CacheMetrics[] = []

/**
 * Performance monitoring class
 */
export class PerformanceMonitor {
  private static instance: PerformanceMonitor
  private metricsBuffer: PerformanceMetrics[] = []
  private readonly maxBufferSize = 1000

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor()
    }
    return PerformanceMonitor.instance
  }

  /**
   * Start tracking a request
   */
  startRequest(req: NextRequest): string {
    const requestId = this.generateRequestId()
    const startTime = performance.now()

    const metrics: PerformanceMetrics = {
      requestId,
      method: req.method,
      url: req.url,
      startTime,
      userAgent: req.headers.get('user-agent') || undefined,
      ip: req.headers.get('x-forwarded-for') || req.ip || undefined,
      memoryUsage: process.memoryUsage(),
      cpuUsage: process.cpuUsage()
    }

    performanceStore.set(requestId, metrics)
    return requestId
  }

  /**
   * End tracking a request
   */
  endRequest(requestId: string, response: NextResponse): void {
    const metrics = performanceStore.get(requestId)
    if (!metrics) return

    const endTime = performance.now()
    const duration = endTime - metrics.startTime

    metrics.endTime = endTime
    metrics.duration = duration
    metrics.statusCode = response.status

    // Add to buffer for batch processing
    this.metricsBuffer.push(metrics)

    // Clean up if buffer is full
    if (this.metricsBuffer.length > this.maxBufferSize) {
      this.flushMetrics()
    }

    // Remove from active tracking
    performanceStore.delete(requestId)

    // Log slow requests
    if (duration > 1000) { // > 1 second
      console.warn(`[PERFORMANCE] Slow request detected:`, {
        requestId,
        method: metrics.method,
        url: metrics.url,
        duration: `${duration.toFixed(2)}ms`,
        statusCode: metrics.statusCode
      })
    }
  }

  /**
   * Track database query performance
   */
  trackDatabaseQuery(query: string, duration: number, success: boolean, error?: string): void {
    const metric: DatabaseMetrics = {
      query: this.sanitizeQuery(query),
      duration,
      timestamp: Date.now(),
      success,
      error
    }

    databaseMetrics.push(metric)

    // Keep only last 1000 queries
    if (databaseMetrics.length > 1000) {
      databaseMetrics.splice(0, 100)
    }

    // Log slow queries
    if (duration > 500) { // > 500ms
      console.warn(`[PERFORMANCE] Slow database query:`, {
        query: metric.query,
        duration: `${duration.toFixed(2)}ms`,
        success
      })
    }
  }

  /**
   * Track cache performance
   */
  trackCacheOperation(key: string, hit: boolean, duration: number): void {
    const metric: CacheMetrics = {
      key,
      hit,
      duration,
      timestamp: Date.now()
    }

    cacheMetrics.push(metric)

    // Keep only last 1000 cache operations
    if (cacheMetrics.length > 1000) {
      cacheMetrics.splice(0, 100)
    }
  }

  /**
   * Get performance analytics
   */
  getAnalytics(timeRange: number = 3600000): { // Default 1 hour
    requests: {
      total: number
      averageDuration: number
      slowRequests: number
      errorRate: number
      requestsPerMinute: number
    }
    database: {
      totalQueries: number
      averageDuration: number
      slowQueries: number
      errorRate: number
    }
    cache: {
      totalOperations: number
      hitRate: number
      averageDuration: number
    }
    memory: NodeJS.MemoryUsage | null
  } {
    const now = Date.now()
    const cutoff = now - timeRange

    // Filter recent metrics
    const recentRequests = this.metricsBuffer.filter(m => 
      m.endTime && m.endTime > cutoff
    )
    const recentDbMetrics = databaseMetrics.filter(m => m.timestamp > cutoff)
    const recentCacheMetrics = cacheMetrics.filter(m => m.timestamp > cutoff)

    // Request analytics
    const totalRequests = recentRequests.length
    const averageRequestDuration = totalRequests > 0 
      ? recentRequests.reduce((sum, m) => sum + (m.duration || 0), 0) / totalRequests
      : 0
    const slowRequests = recentRequests.filter(m => (m.duration || 0) > 1000).length
    const errorRequests = recentRequests.filter(m => 
      m.statusCode && m.statusCode >= 400
    ).length
    const requestsPerMinute = totalRequests / (timeRange / 60000)

    // Database analytics
    const totalDbQueries = recentDbMetrics.length
    const averageDbDuration = totalDbQueries > 0
      ? recentDbMetrics.reduce((sum, m) => sum + m.duration, 0) / totalDbQueries
      : 0
    const slowDbQueries = recentDbMetrics.filter(m => m.duration > 500).length
    const dbErrors = recentDbMetrics.filter(m => !m.success).length

    // Cache analytics
    const totalCacheOps = recentCacheMetrics.length
    const cacheHits = recentCacheMetrics.filter(m => m.hit).length
    const hitRate = totalCacheOps > 0 ? (cacheHits / totalCacheOps) * 100 : 0
    const averageCacheDuration = totalCacheOps > 0
      ? recentCacheMetrics.reduce((sum, m) => sum + m.duration, 0) / totalCacheOps
      : 0

    return {
      requests: {
        total: totalRequests,
        averageDuration: Math.round(averageRequestDuration * 100) / 100,
        slowRequests,
        errorRate: totalRequests > 0 ? (errorRequests / totalRequests) * 100 : 0,
        requestsPerMinute: Math.round(requestsPerMinute * 100) / 100
      },
      database: {
        totalQueries: totalDbQueries,
        averageDuration: Math.round(averageDbDuration * 100) / 100,
        slowQueries: slowDbQueries,
        errorRate: totalDbQueries > 0 ? (dbErrors / totalDbQueries) * 100 : 0
      },
      cache: {
        totalOperations: totalCacheOps,
        hitRate: Math.round(hitRate * 100) / 100,
        averageDuration: Math.round(averageCacheDuration * 100) / 100
      },
      memory: process.memoryUsage()
    }
  }

  /**
   * Generate unique request ID
   */
  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Sanitize SQL query for logging
   */
  private sanitizeQuery(query: string): string {
    return query
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 200) // Limit length
  }

  /**
   * Flush metrics buffer
   */
  private flushMetrics(): void {
    // In production, send to monitoring service
    console.log(`[PERFORMANCE] Flushing ${this.metricsBuffer.length} metrics`)
    this.metricsBuffer = []
  }
}

/**
 * Performance middleware wrapper
 */
export function withPerformanceMonitoring<T extends any[], R>(
  handler: (..._args: T) => Promise<R>
) {
  return async (...args: T): Promise<R> => {
    const startTime = performance.now()

    try {
      const result = await handler(...args)
      const duration = performance.now() - startTime

      // Log if slow
      if (duration > 1000) {
        console.warn(`[PERFORMANCE] Slow operation: ${duration.toFixed(2)}ms`)
      }

      return result
    } catch (error) {
      const duration = performance.now() - startTime
      console.error(`[PERFORMANCE] Operation failed after ${duration.toFixed(2)}ms:`, error)
      throw error
    }
  }
}

/**
 * Database query wrapper with performance tracking
 */
export async function trackDatabaseQuery<T>(
  queryName: string,
  operation: () => Promise<T>
): Promise<T> {
  const monitor = PerformanceMonitor.getInstance()
  const startTime = performance.now()

  try {
    const result = await operation()
    const duration = performance.now() - startTime
    monitor.trackDatabaseQuery(queryName, duration, true)
    return result
  } catch (error) {
    const duration = performance.now() - startTime
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    monitor.trackDatabaseQuery(queryName, duration, false, errorMessage)
    throw error
  }
}

/**
 * Cache operation wrapper with performance tracking
 */
export async function trackCacheOperation<T>(
  key: string,
  operation: () => Promise<{ hit: boolean; data: T }>
): Promise<T> {
  const monitor = PerformanceMonitor.getInstance()
  const startTime = performance.now()

  try {
    const result = await operation()
    const duration = performance.now() - startTime
    monitor.trackCacheOperation(key, result.hit, duration)
    return result.data
  } catch (error) {
    const duration = performance.now() - startTime
    monitor.trackCacheOperation(key, false, duration)
    throw error
  }
}

/**
 * Memory usage utilities
 */
export function getMemoryUsage(): {
  used: string
  total: string
  percentage: number
} {
  const usage = process.memoryUsage()
  const totalMemory = usage.heapTotal
  const usedMemory = usage.heapUsed
  const percentage = (usedMemory / totalMemory) * 100

  return {
    used: formatBytes(usedMemory),
    total: formatBytes(totalMemory),
    percentage: Math.round(percentage * 100) / 100
  }
}

/**
 * Format bytes to human readable string
 */
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * Performance optimization utilities
 */
export const optimize = {
  /**
   * Debounce function calls
   */
  debounce<T extends (..._args: any[]) => any>(
    func: T,
    wait: number
  ): (..._args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout
    return (...args: Parameters<T>) => {
      clearTimeout(timeout)
      timeout = setTimeout(() => func(...args), wait)
    }
  },

  /**
   * Throttle function calls
   */
  throttle<T extends (..._args: any[]) => any>(
    func: T,
    limit: number
  ): (..._args: Parameters<T>) => void {
    let inThrottle: boolean
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args)
        inThrottle = true
        setTimeout(() => inThrottle = false, limit)
      }
    }
  },

  /**
   * Memoize function results
   */
  memoize<T extends (..._args: any[]) => any>(
    func: T,
    maxSize: number = 100
  ): T {
    const cache = new Map()
    
    return ((..._args: Parameters<T>) => {
      const key = JSON.stringify(_args)
      
      if (cache.has(key)) {
        return cache.get(key)
      }
      
      const result = func(..._args)
      
      // Limit cache size
      if (cache.size >= maxSize) {
        const firstKey = cache.keys().next().value
        cache.delete(firstKey)
      }
      
      cache.set(key, result)
      return result
    }) as T
  }
}

// Export singleton instance
export const performanceMonitor = PerformanceMonitor.getInstance()