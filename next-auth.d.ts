/* eslint-disable */
import type { DefaultSession } from 'next-auth'
import type { $Enums } from '@prisma/client'

declare module 'next-auth' {
  interface Session {
    user: (DefaultSession['user'] & {
      id: string
      roles: $Enums.RoleKey[]
      defaultRole: $Enums.RoleKey
    }) | null
  }

  interface User {
    roles?: $Enums.RoleKey[]
    defaultRole?: $Enums.RoleKey
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    roles?: $Enums.RoleKey[]
    defaultRole?: $Enums.RoleKey
  }
}
