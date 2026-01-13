/**
 * Comprehensive Error Handling System
 * Provides consistent error handling across the application
 */

import { NextResponse } from 'next/server'
import { ZodError } from 'zod'
import { Prisma } from '@prisma/client'

export interface ApiError {
  code: string
  message: string
  details?: any
  statusCode: number
}

export class AppError extends Error {
  public readonly code: string
  public readonly statusCode: number
  public readonly details?: any

  constructor(message: string, code: string, statusCode: number = 500, details?: any) {
    super(message)
    this.name = 'AppError'
    this.code = code
    this.statusCode = statusCode
    this.details = details

    // Maintains proper stack trace for where our error was thrown
    Error.captureStackTrace(this, AppError)
  }
}

/**
 * Common error codes
 */
export const ErrorCodes = {
  // Authentication & Authorization
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  
  // Validation
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_INPUT: 'INVALID_INPUT',
  MISSING_REQUIRED_FIELD: 'MISSING_REQUIRED_FIELD',
  
  // Resources
  NOT_FOUND: 'NOT_FOUND',
  ALREADY_EXISTS: 'ALREADY_EXISTS',
  RESOURCE_CONFLICT: 'RESOURCE_CONFLICT',
  
  // Rate Limiting
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  TOO_MANY_REQUESTS: 'TOO_MANY_REQUESTS',
  
  // Database
  DATABASE_ERROR: 'DATABASE_ERROR',
  CONNECTION_ERROR: 'CONNECTION_ERROR',
  CONSTRAINT_VIOLATION: 'CONSTRAINT_VIOLATION',
  
  // File Operations
  FILE_TOO_LARGE: 'FILE_TOO_LARGE',
  INVALID_FILE_TYPE: 'INVALID_FILE_TYPE',
  UPLOAD_FAILED: 'UPLOAD_FAILED',
  
  // Business Logic
  INSUFFICIENT_PERMISSIONS: 'INSUFFICIENT_PERMISSIONS',
  OPERATION_NOT_ALLOWED: 'OPERATION_NOT_ALLOWED',
  QUOTA_EXCEEDED: 'QUOTA_EXCEEDED',
  
  // External Services
  EXTERNAL_SERVICE_ERROR: 'EXTERNAL_SERVICE_ERROR',
  PAYMENT_FAILED: 'PAYMENT_FAILED',
  EMAIL_SEND_FAILED: 'EMAIL_SEND_FAILED',
  
  // Generic
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  BAD_REQUEST: 'BAD_REQUEST',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE'
} as const

/**
 * Pre-defined error creators
 */
export const createError = {
  unauthorized: (message = 'Authentication required') => 
    new AppError(message, ErrorCodes.UNAUTHORIZED, 401),
    
  forbidden: (message = 'Insufficient permissions') => 
    new AppError(message, ErrorCodes.FORBIDDEN, 403),
    
  notFound: (resource = 'Resource', id?: string) => 
    new AppError(
      `${resource}${id ? ` with ID ${id}` : ''} not found`, 
      ErrorCodes.NOT_FOUND, 
      404
    ),
    
  validation: (message: string, details?: any) => 
    new AppError(message, ErrorCodes.VALIDATION_ERROR, 400, details),
    
  conflict: (message: string) => 
    new AppError(message, ErrorCodes.RESOURCE_CONFLICT, 409),
    
  rateLimit: (message = 'Too many requests') => 
    new AppError(message, ErrorCodes.RATE_LIMIT_EXCEEDED, 429),
    
  internal: (message = 'Internal server error') => 
    new AppError(message, ErrorCodes.INTERNAL_SERVER_ERROR, 500),
    
  badRequest: (message: string) => 
    new AppError(message, ErrorCodes.BAD_REQUEST, 400),
    
  database: (message = 'Database operation failed') => 
    new AppError(message, ErrorCodes.DATABASE_ERROR, 500)
}

/**
 * Error handler for API routes
 */
export function handleApiError(error: unknown): NextResponse {
  console.error('API Error:', error)

  // Handle our custom AppError
  if (error instanceof AppError) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: error.code,
          message: error.message,
          details: error.details
        }
      },
      { status: error.statusCode }
    )
  }

  // Handle Zod validation errors
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: ErrorCodes.VALIDATION_ERROR,
          message: 'Validation failed',
          details: error.errors
        }
      },
      { status: 400 }
    )
  }

  // Handle Prisma errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        return NextResponse.json(
          {
            success: false,
            error: {
              code: ErrorCodes.ALREADY_EXISTS,
              message: 'Resource already exists',
              details: error.meta
            }
          },
          { status: 409 }
        )
      case 'P2025':
        return NextResponse.json(
          {
            success: false,
            error: {
              code: ErrorCodes.NOT_FOUND,
              message: 'Resource not found',
              details: error.meta
            }
          },
          { status: 404 }
        )
      default:
        return NextResponse.json(
          {
            success: false,
            error: {
              code: ErrorCodes.DATABASE_ERROR,
              message: 'Database operation failed'
            }
          },
          { status: 500 }
        )
    }
  }

  // Handle generic errors
  if (error instanceof Error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: ErrorCodes.INTERNAL_SERVER_ERROR,
          message: process.env.NODE_ENV === 'development' 
            ? error.message 
            : 'An unexpected error occurred'
        }
      },
      { status: 500 }
    )
  }

  // Fallback for unknown errors
  return NextResponse.json(
    {
      success: false,
      error: {
        code: ErrorCodes.INTERNAL_SERVER_ERROR,
        message: 'An unexpected error occurred'
      }
    },
    { status: 500 }
  )
}

/**
 * Async error wrapper for API routes
 */
export function withErrorHandler<T extends any[], R>(
  handler: (..._args: T) => Promise<R>
) {
  return async (...args: T): Promise<R | NextResponse> => {
    try {
      return await handler(...args)
    } catch (error) {
      return handleApiError(error)
    }
  }
}

/**
 * Error logging utility
 */
export function logError(error: unknown, context?: string) {
  const timestamp = new Date().toISOString()
  const contextStr = context ? `[${context}] ` : ''
  
  if (error instanceof AppError) {
    console.error(`${timestamp} ${contextStr}AppError:`, {
      code: error.code,
      message: error.message,
      statusCode: error.statusCode,
      details: error.details,
      stack: error.stack
    })
  } else if (error instanceof Error) {
    console.error(`${timestamp} ${contextStr}Error:`, {
      name: error.name,
      message: error.message,
      stack: error.stack
    })
  } else {
    console.error(`${timestamp} ${contextStr}Unknown error:`, error)
  }
}

/**
 * Validation helper
 */
export function validateRequired<T>(
  value: T | null | undefined,
  fieldName: string
): T {
  if (value === null || value === undefined || value === '') {
    throw createError.validation(`${fieldName} is required`)
  }
  return value
}

/**
 * Safe async operation wrapper
 */
export async function safeAsync<T>(
  operation: () => Promise<T>
): Promise<{ success: true; data: T } | { success: false; error: AppError }> {
  try {
    const data = await operation()
    return { success: true, data }
  } catch (error) {
    if (error instanceof AppError) {
      return { success: false, error }
    }
    
    const appError = new AppError(
      error instanceof Error ? error.message : 'Operation failed',
      ErrorCodes.INTERNAL_SERVER_ERROR
    )
    
    return { success: false, error: appError }
  }
}

/**
 * Error boundary for React components
 */
export class ErrorBoundary extends Error {
  constructor(
    message: string,
    public readonly _originalError?: Error,
    public readonly _errorInfo?: any
  ) {
    super(message)
    this.name = 'ErrorBoundary'
  }
}

/**
 * HTTP status code utilities
 */
export const HttpStatus = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503
} as const

/**
 * Success response helper
 */
export function successResponse<T>(
  data: T,
  message?: string,
  statusCode: number = HttpStatus.OK
): NextResponse {
  return NextResponse.json(
    {
      success: true,
      data,
      message
    },
    { status: statusCode }
  )
}

/**
 * Error response helper
 */
export function errorResponse(
  message: string,
  code: string = ErrorCodes.INTERNAL_SERVER_ERROR,
  statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR,
  details?: any
): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error: {
        code,
        message,
        details
      }
    },
    { status: statusCode }
  )
}