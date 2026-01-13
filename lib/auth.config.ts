import type { NextAuthConfig } from 'next-auth'

export const authConfig = {
  pages: {
    signIn: '/login',
    error: '/login'
  },
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7 days (reduced from 30 days)
    updateAge: 24 * 60 * 60, // Update session every 24 hours
  },
  jwt: {
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  // cookies: { ... } // Removed to let NextAuth handle prefixes automatically based on protocol
} satisfies Partial<NextAuthConfig>
