import { auth } from '@/lib/auth'
import { RoleKey } from '@prisma/client'

/**
 * Server-side authentication utilities
 * These functions are designed to work in server components and API routes
 */

export interface ServerSession {
  user: {
    id: string
    email: string
    name: string
    roles: RoleKey[]
    defaultRole: RoleKey
  }
}

/**
 * Get server session with proper typing
 */
export async function getServerSession(): Promise<ServerSession | null> {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return null
    }

    return {
      user: {
        id: session.user.id,
        email: session.user.email || '',
        name: session.user.name || '',
        roles: (session.user as any).roles || [],
        defaultRole: (session.user as any).defaultRole || 'STUDENT'
      }
    }
  } catch (error) {
    console.error('Error getting server session:', error)
    return null
  }
}

/**
 * Check if user has specific role
 */
export function hasRole(userRoles: RoleKey[], requiredRole: RoleKey | RoleKey[]): boolean {
  if (!Array.isArray(userRoles)) return false
  
  const required = Array.isArray(requiredRole) ? requiredRole : [requiredRole]
  return required.some(role => userRoles.includes(role))
}

/**
 * Check if user is admin
 */
export function isServerAdmin(userRoles: RoleKey[]): boolean {
  return hasRole(userRoles, 'ADMIN')
}

/**
 * Check if user is mentor
 */
export function isServerMentor(userRoles: RoleKey[]): boolean {
  return hasRole(userRoles, 'MENTOR')
}

/**
 * Check if user is student
 */
export function isServerStudent(userRoles: RoleKey[]): boolean {
  return hasRole(userRoles, 'STUDENT')
}

/**
 * Get user's highest role priority
 */
export function getHighestRole(userRoles: RoleKey[]): RoleKey {
  if (userRoles.includes('ADMIN')) return 'ADMIN'
  if (userRoles.includes('MENTOR')) return 'MENTOR'
  return 'STUDENT'
}

/**
 * Require authentication - throws error if not authenticated
 */
export async function requireAuth(): Promise<ServerSession> {
  const session = await getServerSession()
  
  if (!session) {
    throw new Error('Authentication required')
  }
  
  return session
}

/**
 * Require specific role - throws error if user doesn't have required role
 */
export async function requireRole(requiredRole: RoleKey | RoleKey[]): Promise<ServerSession> {
  const session = await requireAuth()
  
  if (!hasRole(session.user.roles, requiredRole)) {
    const roleNames = Array.isArray(requiredRole) ? requiredRole.join(' or ') : requiredRole
    throw new Error(`${roleNames} role required`)
  }
  
  return session
}

/**
 * Require admin role
 */
export async function requireAdmin(): Promise<ServerSession> {
  return requireRole('ADMIN')
}

/**
 * Require mentor or admin role
 */
export async function requireMentorOrAdmin(): Promise<ServerSession> {
  return requireRole(['ADMIN', 'MENTOR'])
}

/**
 * Get user permissions based on roles
 */
export function getUserPermissions(userRoles: RoleKey[]): {
  canManageUsers: boolean
  canManageCourses: boolean
  canManageContent: boolean
  canViewAnalytics: boolean
  canAccessAdmin: boolean
  canMentor: boolean
} {
  const isAdmin = hasRole(userRoles, 'ADMIN')
  const isMentor = hasRole(userRoles, 'MENTOR')
  
  return {
    canManageUsers: isAdmin,
    canManageCourses: isAdmin || isMentor,
    canManageContent: isAdmin || isMentor,
    canViewAnalytics: isAdmin,
    canAccessAdmin: isAdmin || isMentor,
    canMentor: isAdmin || isMentor
  }
}