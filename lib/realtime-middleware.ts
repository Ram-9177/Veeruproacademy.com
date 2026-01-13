// Prisma Middleware for Automatic Realtime Broadcasting
// This middleware automatically broadcasts database changes to connected clients

import { onDatabaseChange } from './enhanced-realtime'

// Define which models should trigger realtime broadcasts
const MONITORED_MODELS = [
  'Course',
  'Lesson',
  'Project',
  'User',
  'Enrollment',
  'Payment',
  'Testimonial',
  'Content'
] as const

type MonitoredModel = typeof MONITORED_MODELS[number]

// Middleware to automatically broadcast database changes
export const realtimeMiddleware = async (params: any, next: any) => {
  const { model, action } = params

  // Only monitor specified models
  if (!model || !MONITORED_MODELS.includes(model as MonitoredModel)) {
    return next(params)
  }

  const monitoredModel = model as MonitoredModel

  try {
    // For create operations
    if (action === 'create') {
      const result = await next(params)

      // Broadcast the creation
      await onDatabaseChange(
        monitoredModel.toLowerCase(),
        'CREATE',
        result
      )

      return result
    }

    // For update operations
    if (action === 'update' || action === 'updateMany') {
      const result = await next(params)

      // For single updates, broadcast the change
      if (action === 'update' && result) {
        await onDatabaseChange(
          monitoredModel.toLowerCase(),
          'UPDATE',
          result
        )
      }

      return result
    }

    // For delete operations
    if (action === 'delete' || action === 'deleteMany') {
      // Get the data before deletion for the broadcast
      let deletedData: any = null

      if (action === 'delete') {
        try {
          // Try to find the record before deletion
          const findOperation = { ...params, action: 'findUnique' } as any
          deletedData = await next(findOperation)
        } catch (error) {
          // If we can't find it, continue with deletion
        }
      }

      const result = await next(params)

      // Broadcast the deletion
      if (action === 'delete' && deletedData) {
        await onDatabaseChange(
          monitoredModel.toLowerCase(),
          'DELETE',
          deletedData
        )
      }

      return result
    }

    // For other operations, just proceed normally
    return next(params)

  } catch (error) {
    console.error('Realtime middleware error:', error)
    // Continue with the operation even if broadcasting fails
    return next(params)
  }
}

// Helper function to get entity title for broadcasting
export function getEntityTitle(model: MonitoredModel, data: any): string {
  switch (model) {
    case 'Course':
      return data.title || data.name || `Course ${data.id}`
    case 'Lesson':
      return data.title || `Lesson ${data.id}`
    case 'Project':
      return data.title || data.name || `Project ${data.id}`
    case 'User':
      return data.name || data.email || `User ${data.id}`
    case 'Enrollment':
      return `Enrollment ${data.id}`
    case 'Payment':
      return `Payment ${data.id}`
    case 'Testimonial':
      return data.title || `Testimonial ${data.id}`
    case 'Content':
      return data.title || `Content ${data.id}`
    default:
      return `${model} ${data.id}`
  }
}