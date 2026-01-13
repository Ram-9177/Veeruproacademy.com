/**
 * Rate Limiting Utility
 * 
 * Simple in-memory rate limiting for sensitive operations.
 * Prevents brute force attacks on login, OTP, and sensitive API endpoints.
 * 
 * Usage:
 *   import { rateLimit } from '@/lib/rate-limit'
 *   
 *   const isAllowed = rateLimit('login:user@example.com', { 
 *     max: 5, 
 *     windowMs: 15 * 60 * 1000  // 15 minutes
 *   })
 *   
 *   if (!isAllowed) {
 *     return NextResponse.json({ error: 'Too many attempts' }, { status: 429 })
 *   }
 */

interface RateLimitConfig {
  max: number           // Maximum number of requests
  windowMs: number      // Time window in milliseconds
}

interface RateLimitEntry {
  count: number
  resetTime: number
}

// In-memory store for rate limit data
// In production, consider using Redis for distributed rate limiting
const rateLimitStore = new Map<string, RateLimitEntry>()

/**
 * Check if an action is rate-limited
 * @param key - Unique identifier (e.g., 'login:user@email.com')
 * @param config - Rate limit configuration
 * @returns true if request is allowed, false if rate limited
 */
export function rateLimit(
  key: string,
  config: RateLimitConfig = {
    max: 10,
    windowMs: 60 * 1000 // 1 minute
  }
): boolean {
  const now = Date.now()
  const entry = rateLimitStore.get(key)

  // No entry or window expired - allow request and create new entry
  if (!entry || now > entry.resetTime) {
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + config.windowMs
    })
    return true
  }

  // Check if limit exceeded
  if (entry.count >= config.max) {
    return false
  }

  // Increment counter
  entry.count++
  return true
}

/**
 * Get remaining attempts for a key
 * @param key - Unique identifier
 * @param config - Rate limit configuration
 * @returns Number of remaining attempts
 */
export function getRateLimitRemaining(
  key: string,
  config: RateLimitConfig = {
    max: 10,
    windowMs: 60 * 1000
  }
): number {
  const now = Date.now()
  const entry = rateLimitStore.get(key)

  if (!entry || now > entry.resetTime) {
    return config.max
  }

  return Math.max(0, config.max - entry.count)
}

/**
 * Get reset time for a key
 * @param key - Unique identifier
 * @returns Unix timestamp when rate limit resets, or null if no limit set
 */
export function getRateLimitResetTime(key: string): number | null {
  const entry = rateLimitStore.get(key)
  return entry?.resetTime ?? null
}

/**
 * Reset rate limit for a key (admin use)
 * @param key - Unique identifier
 */
export function resetRateLimit(key: string): void {
  rateLimitStore.delete(key)
}

/**
 * Clear all rate limits (admin use, dangerous!)
 */
export function clearAllRateLimits(): void {
  rateLimitStore.clear()
}

/**
 * Get statistics about current rate limits
 */
export function getRateLimitStats(): {
  totalKeys: number
  activeWindows: number
  expiredWindows: number
} {
  const now = Date.now()
  let activeWindows = 0
  let expiredWindows = 0

  rateLimitStore.forEach((entry) => {
    if (now > entry.resetTime) {
      expiredWindows++
    } else {
      activeWindows++
    }
  })

  return {
    totalKeys: rateLimitStore.size,
    activeWindows,
    expiredWindows
  }
}

/**
 * Cleanup expired entries (run periodically)
 */
export function cleanupExpiredEntries(): number {
  const now = Date.now()
  let removed = 0
  const keysToDelete: string[] = []

  rateLimitStore.forEach((entry, key) => {
    if (now > entry.resetTime) {
      keysToDelete.push(key)
    }
  })

  keysToDelete.forEach(key => {
    rateLimitStore.delete(key)
    removed++
  })

  return removed
}

/**
 * Common rate limit configurations
 */
export const RateLimitConfigs = {
  // Login attempts: 5 attempts per 15 minutes
  LOGIN: {
    max: 5,
    windowMs: 15 * 60 * 1000
  },

  // OTP verification: 3 attempts per 5 minutes
  OTP_VERIFY: {
    max: 3,
    windowMs: 5 * 60 * 1000
  },

  // OTP request: 3 requests per hour
  OTP_REQUEST: {
    max: 3,
    windowMs: 60 * 60 * 1000
  },

  // Password reset: 3 attempts per hour
  PASSWORD_RESET: {
    max: 3,
    windowMs: 60 * 60 * 1000
  },

  // API endpoint: 100 requests per minute
  API_GENERAL: {
    max: 100,
    windowMs: 60 * 1000
  },

  // API endpoint (stricter): 20 requests per minute
  API_STRICT: {
    max: 20,
    windowMs: 60 * 1000
  }
}

/**
 * Cleanup expired entries every 5 minutes (optional)
 * Call this in a background job or cron task
 */
let cleanupInterval: NodeJS.Timeout | null = null

export function startCleanupInterval(): void {
  if (cleanupInterval) return
  cleanupInterval = setInterval(() => {
    cleanupExpiredEntries()
  }, 5 * 60 * 1000) // Every 5 minutes
}

export function stopCleanupInterval(): void {
  if (cleanupInterval) {
    clearInterval(cleanupInterval)
    cleanupInterval = null
  }
}
