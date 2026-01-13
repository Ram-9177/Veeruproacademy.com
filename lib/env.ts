import { z } from 'zod'

const isProduction = process.env.NODE_ENV === 'production'

const getNonEmptyEnv = (key: string): string | undefined => {
  const value = process.env[key]
  const trimmed = typeof value === 'string' ? value.trim() : ''
  return trimmed.length > 0 ? trimmed : undefined
}

const resolvedNextAuthSecret =
  getNonEmptyEnv('NEXTAUTH_SECRET') ||
  getNonEmptyEnv('AUTH_SECRET') ||
  (isProduction ? undefined : 'dev-secret-please-change-in-production')

const resolvedNextAuthUrl =
  // In production, require NEXTAUTH_URL explicitly (no AUTH_URL / VERCEL_URL / localhost fallbacks).
  (isProduction
    ? getNonEmptyEnv('NEXTAUTH_URL')
    : getNonEmptyEnv('NEXTAUTH_URL') ||
      getNonEmptyEnv('AUTH_URL') ||
      (getNonEmptyEnv('VERCEL_URL') ? `https://${getNonEmptyEnv('VERCEL_URL')}` : undefined) ||
      'http://localhost:3000')

const envSchema = z.object({
  // Core - Always required in production
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  DATABASE_URL: z.string().url('Database URL must be a valid URL').min(1, 'DATABASE_URL is required'),
  // Auth.js / NextAuth support (both NEXTAUTH_* and AUTH_*). We resolve to a single value.
  NEXTAUTH_SECRET: z
    .string()
    .min(32, 'NEXTAUTH_SECRET/AUTH_SECRET must be at least 32 characters')
    .min(1, 'NEXTAUTH_SECRET/AUTH_SECRET is required'),
  NEXTAUTH_URL: z
    .string()
    .url('NEXTAUTH_URL must be a valid URL')
    .min(1, 'NEXTAUTH_URL is required'),
  
  // OAuth providers are optional; the provider is enabled only when both are present.
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  
  // Email Service - Optional, but both required if either is set
  RESEND_API_KEY: z.string().optional(),
  RESEND_FROM_EMAIL: z.string().email('RESEND_FROM_EMAIL must be a valid email').optional(),
  
  // Payment - Optional, but both required if either is set
  RAZORPAY_KEY_ID: z.string().optional(),
  RAZORPAY_KEY_SECRET: z.string().optional(),
  
  // Cache - Optional
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
  
  // File Upload - Optional
  UPLOADTHING_SECRET: z.string().optional(),
  UPLOADTHING_APP_ID: z.string().optional(),
  
  // YouTube API - Optional (should be server-side only)
  NEXT_PUBLIC_YT_API_KEY: z.string().optional(),
})

const envInput = {
  ...process.env,
  DATABASE_URL: getNonEmptyEnv('DATABASE_URL'),
  NEXTAUTH_SECRET: resolvedNextAuthSecret,
  NEXTAUTH_URL: resolvedNextAuthUrl,
}

const formatEnvErrors = (error: z.ZodError): string => {
  const fieldErrors = error.flatten().fieldErrors
  const parts = Object.entries(fieldErrors)
    .filter(([, messages]) => (messages ?? []).length > 0)
    .map(([field, messages]) => `${field}: ${(messages ?? []).join(', ')}`)
  return parts.length > 0 ? parts.join(' | ') : 'Unknown validation error'
}

let resolvedEnv: z.infer<typeof envSchema>

if (isProduction) {
  // Fail fast in production. No fallbacks.
  try {
    resolvedEnv = envSchema.parse(envInput)
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Invalid environment configuration (production): ${formatEnvErrors(error)}`)
    }
    throw error
  }
} else {
  const parsed = envSchema.safeParse(envInput)

  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors
    console.error('❌ Invalid environment configuration:')
    Object.entries(errors).forEach(([field, messages]) => {
      console.error(`  - ${field}: ${messages?.join(', ')}`)
    })

    // In development/test, warn but continue with defaults.
    console.warn('⚠️  Using development defaults for missing variables')
  }

  resolvedEnv =
    parsed.success
      ? parsed.data
      : ({
          NODE_ENV: (process.env.NODE_ENV as 'development' | 'test' | 'production' | undefined) ?? 'development',
          DATABASE_URL: getNonEmptyEnv('DATABASE_URL') || 'postgresql://localhost/veeru',
          NEXTAUTH_SECRET: resolvedNextAuthSecret || 'dev-secret-please-change-in-production',
          NEXTAUTH_URL: resolvedNextAuthUrl || 'http://localhost:3000',
        } as const)
}

export const env = resolvedEnv
