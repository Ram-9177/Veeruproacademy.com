import { z } from 'zod'

// Course Schemas
export const createCourseSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100, 'Title must be less than 100 characters'),
  slug: z.string().min(3).max(100).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(1000),
  thumbnail: z.string().url('Must be a valid URL').optional(),
  level: z.enum(['Beginner', 'Intermediate', 'Advanced']),
  duration: z.string().optional(),
  price: z.number().min(0).max(100000).default(0),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED', 'SCHEDULED']).default('DRAFT'),
  order: z.number().int().min(0).default(0),
  metadata: z.record(z.any()).optional(),
})

export const updateCourseSchema = createCourseSchema.partial()

// Lesson Schemas
export const createLessonSchema = z.object({
  title: z.string().min(3).max(200),
  slug: z.string().min(3).max(100).regex(/^[a-z0-9-]+$/),
  courseId: z.string().cuid().optional(),
  moduleId: z.string().cuid().optional(),
  description: z.string().min(10).max(1000).optional(),
  body: z.string().optional(),
  youtubeUrl: z.string().url().optional(),
  estimatedMinutes: z.number().int().min(1).max(300).optional(),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  order: z.number().int().min(0).default(0),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED', 'SCHEDULED']).default('DRAFT'),
  metadata: z.record(z.any()).optional(),
})

export const updateLessonSchema = createLessonSchema.partial()

// Project Schemas
export const createProjectSchema = z.object({
  title: z.string().min(3).max(200),
  slug: z.string().min(3).max(100).regex(/^[a-z0-9-]+$/),
  description: z.string().min(10).max(1000).optional(),
  thumbnail: z.string().url().optional(),
  level: z.enum(['Beginner', 'Intermediate', 'Advanced']).optional(),
  category: z.string().max(50).optional(),
  price: z.number().min(0).max(100000).default(0),
  tools: z.array(z.string()).default([]),
  includes: z.array(z.string()).default([]),
  driveUrl: z.string().url().optional(),
  upiId: z.string().max(100).optional(),
  formUrl: z.string().url().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED', 'SCHEDULED']).default('DRAFT'),
  featured: z.boolean().default(false),
  order: z.number().int().min(0).default(0),
  metadata: z.record(z.any()).optional(),
})

export const updateProjectSchema = createProjectSchema.partial()

// User Schemas
export const createUserSchema = z.object({
  email: z.string().email('Must be a valid email'),
  name: z.string().min(2).max(100).optional(),
  password: z.string().min(8, 'Password must be at least 8 characters').max(100),
  role: z.enum(['SUPER_ADMIN', 'CONTENT_EDITOR', 'SUPPORT', 'VIEWER']).default('VIEWER'),
  status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']).default('ACTIVE'),
})

export const updateUserSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  role: z.enum(['SUPER_ADMIN', 'CONTENT_EDITOR', 'SUPPORT', 'VIEWER']).optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']).optional(),
  avatar: z.string().url().optional(),
})

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(8),
  newPassword: z.string().min(8, 'Password must be at least 8 characters').max(100),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

// Media Schemas
export const uploadMediaSchema = z.object({
  file: z.instanceof(File),
  alt: z.string().max(200).optional(),
  metadata: z.record(z.any()).optional(),
})

// FAQ Schemas
export const createFAQSchema = z.object({
  question: z.string().min(10).max(500),
  answer: z.string().min(10).max(5000),
  category: z.string().max(50).optional(),
  order: z.number().int().min(0).default(0),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'),
})

export const updateFAQSchema = createFAQSchema.partial()

// Testimonial Schemas
export const createTestimonialSchema = z.object({
  name: z.string().min(2).max(100),
  role: z.string().max(100).optional(),
  quote: z.string().min(10).max(1000),
  avatar: z.string().url().optional(),
  highlight: z.string().max(200).optional(),
  rating: z.number().int().min(1).max(5).default(5),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'),
  order: z.number().int().min(0).default(0),
})

export const updateTestimonialSchema = createTestimonialSchema.partial()

// Analytics Schemas
export const trackEventSchema = z.object({
  eventType: z.string().min(1).max(100),
  contentType: z.enum(['COURSE', 'LESSON', 'PROJECT', 'FAQ', 'TESTIMONIAL', 'SANDBOX_TEMPLATE']).optional(),
  contentId: z.string().cuid().optional(),
  userId: z.string().cuid().optional(),
  sessionId: z.string().optional(),
  metadata: z.record(z.any()).optional(),
})

// Search/Filter Schemas
export const searchSchema = z.object({
  query: z.string().max(200).optional(),
  level: z.enum(['All', 'Beginner', 'Intermediate', 'Advanced']).optional(),
  language: z.enum(['All', 'JavaScript', 'TypeScript', 'Python', 'UI/UX', 'Data', 'AI']).optional(),
  status: z.enum(['All', 'DRAFT', 'PUBLISHED', 'ARCHIVED', 'SCHEDULED']).optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
})

// Helper function to validate and parse
export function validateSchema<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; error: z.ZodError } {
  const result = schema.safeParse(data)
  if (result.success) {
    return { success: true, data: result.data }
  }
  return { success: false, error: result.error }
}

// Helper to format Zod errors
export function formatZodError(error: z.ZodError): Record<string, string> {
  const formatted: Record<string, string> = {}
  error.errors.forEach((err) => {
    const path = err.path.join('.')
    formatted[path] = err.message
  })
  return formatted
}
