export const ROLE_KEYS = {
  STUDENT: 'STUDENT',
  MENTOR: 'MENTOR',
  ADMIN: 'ADMIN',
} as const

export type RoleKey = (typeof ROLE_KEYS)[keyof typeof ROLE_KEYS]

export const USER_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  SUSPENDED: 'SUSPENDED',
  PENDING: 'PENDING',
} as const

export type UserStatus = (typeof USER_STATUS)[keyof typeof USER_STATUS]
