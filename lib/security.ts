/**
 * SECURITY UTILITIES AND CONFIGURATIONS
 * 
 * Comprehensive security implementation for production deployment
 */

import bcrypt from 'bcryptjs'

// Production configuration
const PRODUCTION_DOMAIN = 'https://www.veeruproacademy.com'
const DEVELOPMENT_DOMAIN = 'http://localhost:3000'

// Rate limiting configuration
interface RateLimitConfig {
  windowMs: number
  maxRequests: number
  message: string
}

const RATE_LIMITS: Record<string, RateLimitConfig> = {
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5, // 5 attempts per window
    message: 'Too many authentication attempts. Please try again later.'
  },
  signup: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 3, // 3 signups per hour
    message: 'Too many signup attempts. Please try again later.'
  },
  api: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 100, // 100 requests per minute
    message: 'Too many API requests. Please slow down.'
  },
  admin: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 30, // 30 admin requests per minute
    message: 'Too many admin requests. Please slow down.'
  }
}

// In-memory rate limit store (use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

/**
 * Rate limiting class
 */
class RateLimiter {
  constructor(private _config: RateLimitConfig) {}

  check(clientIP: string): { allowed: boolean; remaining: number; resetTime: number } {
    const key = `${this._config.windowMs}:${clientIP}`
    const now = Date.now()
    const record = rateLimitStore.get(key)
    
    if (!record || now > record.resetTime) {
      // Reset or create new record
      const newRecord = {
        count: 1,
        resetTime: now + this._config.windowMs
      }
      rateLimitStore.set(key, newRecord)
      return {
        allowed: true,
        remaining: this._config.maxRequests - 1,
        resetTime: newRecord.resetTime
      }
    }
    
    if (record.count >= this._config.maxRequests) {
      // Rate limit exceeded
      return {
        allowed: false,
        remaining: 0,
        resetTime: record.resetTime
      }
    }
    
    // Increment counter
    record.count++
    return {
      allowed: true,
      remaining: this._config.maxRequests - record.count,
      resetTime: record.resetTime
    }
  }
}

// Rate limiter instances
export const signupRateLimiter = new RateLimiter(RATE_LIMITS.signup)
export const authRateLimiter = new RateLimiter(RATE_LIMITS.auth)
export const apiRateLimiter = new RateLimiter(RATE_LIMITS.api)
export const adminRateLimiter = new RateLimiter(RATE_LIMITS.admin)

/**
 * Password hashing with bcrypt
 */
export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 12)
}

/**
 * Password verification
 */
export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash)
}

/**
 * Email validation
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email) && email.length <= 254
}

/**
 * Input sanitization
 */
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim()
    .slice(0, 1000) // Limit length
}

/**
 * Input sanitization utilities
 */
export const sanitize = {
  /**
   * Sanitize string input to prevent XSS
   */
  string: (input: unknown): string => {
    if (typeof input !== 'string') return ''
    return input
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .trim()
      .slice(0, 1000) // Limit length
  },

  /**
   * Sanitize email input
   */
  email: (input: unknown): string => {
    if (typeof input !== 'string') return ''
    const email = input.toLowerCase().trim()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email) ? email : ''
  },

  /**
   * Sanitize numeric input
   */
  number: (input: unknown, min = 0, max = Number.MAX_SAFE_INTEGER): number => {
    const num = Number(input)
    if (isNaN(num)) return min
    return Math.max(min, Math.min(max, num))
  },

  /**
   * Sanitize boolean input
   */
  boolean: (input: unknown): boolean => {
    if (typeof input === 'boolean') return input
    if (typeof input === 'string') {
      return input.toLowerCase() === 'true'
    }
    return false
  }
}

/**
 * Password validation with enhanced security requirements
 */
export interface PasswordValidation {
  isValid: boolean
  errors: string[]
  strength: 'weak' | 'medium' | 'strong' | 'very-strong'
  score: number
}

export const validatePassword = (password: string): PasswordValidation => {
  const errors: string[] = []
  let score = 0
  
  // Length requirements (increased from 8 to 12)
  if (password.length < 12) {
    errors.push('Password must be at least 12 characters long')
  } else if (password.length >= 12) {
    score += 2
  }
  
  if (password.length > 128) {
    errors.push('Password must be less than 128 characters')
  }
  
  // Character requirements
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  } else {
    score += 1
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  } else {
    score += 1
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number')
  } else {
    score += 1
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character (!@#$%^&*(),.?":{}|<>)')
  } else {
    score += 1
  }
  
  // Advanced requirements
  if (password.length >= 16) {
    score += 1
  }
  
  if (/[!@#$%^&*(),.?":{}|<>].*[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    score += 1 // Multiple special characters
  }
  
  if (/\d.*\d.*\d/.test(password)) {
    score += 1 // Multiple numbers
  }
  
  // Check for common weak patterns
  const weakPatterns = [
    /(.)\1{2,}/, // Repeated characters (aaa, 111)
    /123|234|345|456|567|678|789|890/, // Sequential numbers
    /abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz/i, // Sequential letters
    /qwerty|asdf|zxcv|qaz|wsx|edc/i, // Keyboard patterns
  ]
  
  for (const pattern of weakPatterns) {
    if (pattern.test(password)) {
      errors.push('Password contains common weak patterns')
      score = Math.max(0, score - 2)
      break
    }
  }
  
  // Check against expanded common passwords list
  const commonPasswords = [
    'password', '123456', '123456789', 'qwerty', 'abc123',
    'password123', 'admin', 'letmein', 'welcome', 'monkey',
    'dragon', 'master', 'shadow', 'superman', 'michael',
    'football', 'baseball', 'liverpool', 'jordan', 'harley',
    'robert', 'matthew', 'daniel', 'andrew', 'joshua',
    'anthony', 'william', 'david', 'charles', 'thomas',
    'christopher', 'daniel', 'matthew', 'anthony', 'mark',
    'donald', 'steven', 'paul', 'andrew', 'joshua',
    'kenneth', 'john', 'robert', 'michael', 'william',
    'password1', 'password12', 'password123', 'password1234',
    '12345678', '1234567890', 'qwertyuiop', 'asdfghjkl',
    'zxcvbnm', '1qaz2wsx', 'qazwsx', 'qwertyui', 'asdfgh',
    'zxcvbn', 'admin123', 'administrator', 'root', 'toor',
    'pass', 'test', 'guest', 'info', 'adm', 'mysql',
    'user', 'administrator', 'oracle', 'ftp', 'pi',
    'puppet', 'ansible', 'ec2-user', 'vagrant', 'azureuser'
  ]
  
  if (commonPasswords.includes(password.toLowerCase())) {
    errors.push('Password is too common. Please choose a more unique password')
    score = 0
  }
  
  // Check for personal information patterns (basic)
  const personalPatterns = [
    /admin/i, /user/i, /test/i, /demo/i, /temp/i,
    /company/i, /organization/i, /website/i, /email/i
  ]
  
  for (const pattern of personalPatterns) {
    if (pattern.test(password)) {
      errors.push('Password should not contain common words or personal information')
      score = Math.max(0, score - 1)
      break
    }
  }
  
  // Determine strength based on score
  let strength: 'weak' | 'medium' | 'strong' | 'very-strong' = 'weak'
  if (score >= 8) strength = 'very-strong'
  else if (score >= 6) strength = 'strong'
  else if (score >= 4) strength = 'medium'
  
  return {
    isValid: errors.length === 0 && score >= 4,
    errors,
    strength,
    score
  }
}

/**
 * CORS configuration
 * In production, this should be set to your actual domain
 */
export const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_SITE_URL || 
    (process.env.NODE_ENV === 'production' ? PRODUCTION_DOMAIN : DEVELOPMENT_DOMAIN),
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400'
}

/**
 * Security headers
 */
export const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
}

/**
 * Content Security Policy
 */
export const cspHeader = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Next.js requires unsafe-inline and unsafe-eval
  "style-src 'self' 'unsafe-inline'", // Tailwind requires unsafe-inline
  "img-src 'self' data: https:",
  "font-src 'self' data:",
  "connect-src 'self' https:",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'"
].join('; ')

/**
 * Environment validation
 */
export const validateEnvironment = (): { valid: boolean; errors: string[] } => {
  const errors: string[] = []
  
  // Required environment variables
  const required = [
    'DATABASE_URL',
    'NEXTAUTH_SECRET',
    'NEXTAUTH_URL'
  ]
  
  for (const env of required) {
    if (!process.env[env]) {
      errors.push(`Missing required environment variable: ${env}`)
    }
  }
  
  // Validate NEXTAUTH_SECRET strength
  const secret = process.env.NEXTAUTH_SECRET
  if (secret && secret.length < 32) {
    errors.push('NEXTAUTH_SECRET should be at least 32 characters long')
  }
  
  // Validate DATABASE_URL format
  const dbUrl = process.env.DATABASE_URL
  if (dbUrl) {
    try {
      new URL(dbUrl)
    } catch {
      errors.push('DATABASE_URL is not a valid URL')
    }
    
    if (process.env.NODE_ENV === 'production' && dbUrl.includes('localhost')) {
      errors.push('Production environment should not use localhost DATABASE_URL')
    }
  }
  
  return {
    valid: errors.length === 0,
    errors
  }
}

/**
 * Audit logging
 */
export interface AuditLog {
  userId?: string
  action: string
  resource: string
  details?: Record<string, any>
  ip?: string
  userAgent?: string
  timestamp: Date
}

export const auditLog = async (log: Omit<AuditLog, 'timestamp'>): Promise<void> => {
  try {
    // In production, this should write to a secure audit log service
    console.log('[AUDIT]', {
      ...log,
      timestamp: new Date().toISOString()
    })
    
    // TODO: Implement database audit logging
    // await prisma.auditLog.create({ data: { ...log, timestamp: new Date() } })
  } catch (error) {
    console.error('[AUDIT] Failed to log audit event:', error)
  }
}

/**
 * Clean up rate limit store periodically
 */
setInterval(() => {
  const now = Date.now()
  const entries = Array.from(rateLimitStore.entries())
  for (const [key, record] of entries) {
    if (now > record.resetTime) {
      rateLimitStore.delete(key)
    }
  }
}, 5 * 60 * 1000) // Clean up every 5 minutes