import { RoleKey } from '@prisma/client'

export function getRedirectUrlForRole(roles: RoleKey[]): string {
  // Check if user has admin role
  if (roles.includes(RoleKey.ADMIN)) {
    return '/admin/hub'
  }
  
  // Check if user has mentor role
  if (roles.includes(RoleKey.MENTOR)) {
    return '/dashboard' // Mentors go to regular dashboard for now
  }
  
  // Default to student dashboard
  return '/dashboard'
}

export function isAdmin(roles: RoleKey[]): boolean {
  return roles.includes(RoleKey.ADMIN)
}

export function isMentor(roles: RoleKey[]): boolean {
  return roles.includes(RoleKey.MENTOR)
}

export function isStudent(roles: RoleKey[]): boolean {
  return roles.includes(RoleKey.STUDENT)
}

export function isAdminOrMentor(roles: RoleKey[]): boolean {
  return roles.includes(RoleKey.ADMIN) || roles.includes(RoleKey.MENTOR)
}
