import { NextResponse } from 'next/server'
import { ZodError } from 'zod'
import { Prisma } from '@prisma/client'

export class APIError extends Error {
  public statusCode: number
  public code?: string
  public details?: unknown

  constructor(statusCode: number, message: string, code?: string, details?: unknown) {
    super(message)
    this.name = 'APIError'
    this.statusCode = statusCode
    this.code = code
    this.details = details
  }
}

// Predefined error types
export class BadRequestError extends APIError {
  constructor(message: string = 'Bad Request', details?: any) {
    super(400, message, 'BAD_REQUEST', details)
  }
}

export class UnauthorizedError extends APIError {
  constructor(message: string = 'Unauthorized') {
    super(401, message, 'UNAUTHORIZED')
  }
}

export class ForbiddenError extends APIError {
  constructor(message: string = 'Forbidden') {
    super(403, message, 'FORBIDDEN')
  }
}

export class NotFoundError extends APIError {
  constructor(message: string = 'Not Found') {
    super(404, message, 'NOT_FOUND')
  }
}

export class ConflictError extends APIError {
  constructor(message: string = 'Conflict') {
    super(409, message, 'CONFLICT')
  }
}

export class ValidationError extends APIError {
  constructor(message: string = 'Validation Error', details?: any) {
    super(422, message, 'VALIDATION_ERROR', details)
  }
}

export class RateLimitError extends APIError {
  constructor(message: string = 'Too Many Requests') {
    super(429, message, 'RATE_LIMIT_EXCEEDED')
  }
}

export class InternalServerError extends APIError {
  constructor(message: string = 'Internal Server Error') {
    super(500, message, 'INTERNAL_SERVER_ERROR')
  }
}

// Main error handler
export function handleAPIError(error: unknown): NextResponse {
  // Log error in development
  if (process.env.NODE_ENV === 'development') {
    console.error('API Error:', error)
  }

  // Handle known API errors
  if (error instanceof APIError) {
    return NextResponse.json(
      {
        error: error.message,
        code: error.code,
        details: error.details,
      },
      { status: error.statusCode }
    )
  }

  // Handle Zod validation errors
  if (error instanceof ZodError) {
    const formattedErrors: Record<string, string> = {}
    error.errors.forEach((err) => {
      const path = err.path.join('.')
      formattedErrors[path] = err.message
    })

    return NextResponse.json(
      {
        error: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: formattedErrors,
      },
      { status: 422 }
    )
  }

  // Handle Prisma errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        // Unique constraint violation
        return NextResponse.json(
          {
            error: 'A record with this value already exists',
            code: 'DUPLICATE_ENTRY',
            details: { field: error.meta?.target },
          },
          { status: 409 }
        )
      case 'P2025':
        // Record not found
        return NextResponse.json(
          {
            error: 'Record not found',
            code: 'NOT_FOUND',
          },
          { status: 404 }
        )
      case 'P2003':
        // Foreign key constraint violation
        return NextResponse.json(
          {
            error: 'Related record not found',
            code: 'FOREIGN_KEY_VIOLATION',
          },
          { status: 400 }
        )
      default:
        // Log unexpected Prisma errors
        console.error('Prisma error:', error)
        return NextResponse.json(
          {
            error: 'Database error',
            code: 'DATABASE_ERROR',
          },
          { status: 500 }
        )
    }
  }

  // Handle Prisma validation errors
  if (error instanceof Prisma.PrismaClientValidationError) {
    return NextResponse.json(
      {
        error: 'Invalid data provided',
        code: 'VALIDATION_ERROR',
      },
      { status: 400 }
    )
  }

  // Handle generic errors
  if (error instanceof Error) {
    // Don't expose internal error messages in production
    const message = process.env.NODE_ENV === 'development' 
      ? error.message 
      : 'Internal server error'

    return NextResponse.json(
      {
        error: message,
        code: 'INTERNAL_SERVER_ERROR',
      },
      { status: 500 }
    )
  }

  // Unknown error type
  console.error('Unknown error type:', error)
  return NextResponse.json(
    {
      error: 'An unexpected error occurred',
      code: 'UNKNOWN_ERROR',
    },
    { status: 500 }
  )
}

// Helper to create success responses
export function successResponse<T>(data: T, status: number = 200): NextResponse {
  return NextResponse.json({ success: true, data }, { status })
}

// Helper to create paginated responses
export function paginatedResponse<T>(
  data: T[],
  page: number,
  limit: number,
  total: number
): NextResponse {
  return NextResponse.json({
    success: true,
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasMore: page * limit < total,
    },
  })
}

// Async error wrapper for API routes
export function withErrorHandler<T extends any[], R>(
  handler: (..._args: T) => Promise<R>
) {
  return async (...args: T): Promise<R | NextResponse> => {
    try {
      return await handler(...args)
    } catch (error) {
      return handleAPIError(error)
    }
  }
}
