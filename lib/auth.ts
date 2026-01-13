import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'

import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { RoleKey } from '@prisma/client'
import bcrypt from 'bcryptjs'

import { authConfig } from '@/lib/auth.config'
import { prisma, hasValidDatabaseUrl } from '@/lib/db'
import { env } from '@/lib/env'

const CORE_ROLES: Array<{ key: RoleKey; name: string; description: string }> = [
  {
    key: RoleKey.ADMIN,
    name: 'Administrator',
    description: 'Full platform access with permission to manage users, content, and billing.'
  },
  {
    key: RoleKey.MENTOR,
    name: 'Mentor',
    description: 'Mentors can review assignments, track mentees, and access mentor tooling.'
  },
  {
    key: RoleKey.STUDENT,
    name: 'Student',
    description: 'Default role with access to enrolled courses, projects, and community features.'
  }
]

// Lazy initialization - only run when needed, not on module import
let rolesInitialized = false

async function ensureCoreRoles() {
  if (rolesInitialized) return
  if (!hasValidDatabaseUrl) return
  
  try {
    for (const role of CORE_ROLES) {
      await prisma.role.upsert({
        where: { key: role.key },
        create: role,
        update: {
          name: role.name,
          description: role.description
        }
      })
    }
    rolesInitialized = true
  } catch (error) {
    console.error('[auth] Failed to initialize core roles:', error)
    // Don't throw - allow app to continue without DB
  }
}

async function ensureUserHasDefaultRole(userId: string) {
  try {
    await ensureCoreRoles()

    const roles = await prisma.userRole.findMany({
      where: { userId },
      include: { role: true }
    })

    if (roles.length > 0) {
      return roles.map((assignment) => assignment.role.key)
    }

    const studentRole = await prisma.role.findUnique({ where: { key: RoleKey.STUDENT } })
    if (!studentRole) {
      console.error('[auth] Student role missing. Unable to assign default role.')
      return [RoleKey.STUDENT] // Return default even if DB fails
    }

    await prisma.userRole.create({
      data: {
        userId,
        roleId: studentRole.id,
        isPrimary: true
      }
    })

    await prisma.user.update({
      where: { id: userId },
      data: { defaultRole: RoleKey.STUDENT }
    })

    return [RoleKey.STUDENT]
  } catch (error) {
    console.error('[auth] Error in ensureUserHasDefaultRole:', error)
    return [RoleKey.STUDENT] // Return default even if DB fails
  }
}

async function getUserRoleKeys(userId: string) {
  try {
    const assignments = await prisma.userRole.findMany({
      where: { userId },
      include: { role: true }
    })
    return assignments.map((assignment) => assignment.role.key)
  } catch (error) {
    console.error('[auth] Error getting user roles:', error)
    return [RoleKey.STUDENT] // Return default if DB fails
  }
}

// CREDENTIALS AUTHENTICATION ENABLED
// Secure email/password authentication with proper password hashing and validation
const credentialsProvider = CredentialsProvider({
  id: 'credentials',
  name: 'Credentials',
  credentials: {
    email: { label: 'Email', type: 'email' },
    password: { label: 'Password', type: 'password' }
  },
  async authorize(credentials) {
    const email = credentials?.email?.toString().toLowerCase().trim()
    const password = credentials?.password?.toString()

    // IMPORTANT: For invalid credentials, return null (do NOT throw).
    // Throwing here is treated as a configuration/server error by Auth.js/NextAuth.
    if (!email || !password) return null

    if (!hasValidDatabaseUrl) {
      console.error('[auth] DATABASE_URL is missing/invalid; refusing credentials sign-in')
      throw new Error('Authentication service is not configured')
    }

    try {
      // Find user by email
      const user = await prisma.user.findFirst({
        where: {
          email: {
            equals: email,
            mode: 'insensitive'
          }
        },
        include: {
          roles: {
            include: { role: true }
          }
        }
      })

      if (!user) return null

      // Check if user is active
      if (user.status !== 'ACTIVE') return null

      // Verify password
      if (!user.passwordHash) return null

      const isValidPassword = await bcrypt.compare(password, user.passwordHash)
      if (!isValidPassword) return null

      // Get user roles
      const roleKeys = await getUserRoleKeys(user.id)

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        roles: roleKeys,
        defaultRole: user.defaultRole ?? RoleKey.STUDENT
      }
    } catch (error) {
      console.error('[auth] Credentials authorization error:', error)
      throw error
    }
  }
})


const googleProvider =
  env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET
    ? GoogleProvider({
        clientId: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET
      })
    : null



export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  secret: env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV !== 'production',
  trustHost: true,
  adapter: PrismaAdapter(prisma),
  providers: [credentialsProvider, ...(googleProvider ? [googleProvider] : [])],
  events: {
    async createUser({ user }) {
      await ensureUserHasDefaultRole(user.id!)
    },
    async linkAccount({ user }) {
      if (user.email) {
        await prisma.user.update({
          where: { id: user.id! },
          data: {
            emailVerifiedAt: new Date(),
            status: 'ACTIVE'
          }
        })
      }
      await ensureUserHasDefaultRole(user.id!)
    }
  },
  callbacks: {
    async signIn({ user }) {
      // Mock users removed - direct login disabled
      if (!user?.id) return false

      if (!hasValidDatabaseUrl) {
        console.error('[auth] DATABASE_URL is missing/invalid; refusing sign-in')
        return false
      }

      await ensureUserHasDefaultRole(user.id)
      await prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() }
      })

      return true
    },
    async jwt({ token, user, trigger }) {
      // Mock users removed - direct login disabled
      
      if (user?.id) {
        token.id = user.id
        const roleKeys = (user as any).roles ?? (await ensureUserHasDefaultRole(user.id))
        token.roles = roleKeys
        token.defaultRole = (user as any).defaultRole ?? roleKeys[0] ?? RoleKey.STUDENT
        return token
      }

      if ((!token.roles || trigger === 'update') && token.sub) {
        // Fetch roles from database for OAuth users
        const roleKeys = await getUserRoleKeys(token.sub)
        token.roles = roleKeys
        if (!token.defaultRole) {
          const userRecord = await prisma.user.findUnique({
            where: { id: token.sub },
            select: { defaultRole: true }
          })
          token.defaultRole = userRecord?.defaultRole ?? roleKeys[0] ?? RoleKey.STUDENT
        }
      }

      return token
    },
    async session({ session, token }) {
      if (session.user) {
        const tokenId = (token.id as string | undefined) ?? (token.sub as string | undefined)
        if (tokenId) {
          session.user.id = tokenId
        }
        session.user.roles = (token.roles as RoleKey[]) ?? []
        session.user.defaultRole = (token.defaultRole as RoleKey) ?? RoleKey.STUDENT
      }
      return session
    }
  }
})

export function userHasRole(roles: RoleKey[] | undefined, required: RoleKey | RoleKey[]) {
  if (!roles?.length) return false
  const requiredRoles = Array.isArray(required) ? required : [required]
  return requiredRoles.some((role) => roles.includes(role))
}
