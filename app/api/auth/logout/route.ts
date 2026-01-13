import { NextRequest, NextResponse } from 'next/server'

import { signOut } from '@/lib/auth'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    // Get redirect URL from request body or default to login
    const body = await req.json().catch(() => ({}))
    const redirectTo = body.redirectTo || '/login'
    
    const response = await signOut({ redirectTo })
    const json = NextResponse.json({ success: true, redirectTo })

    if (response && typeof response === 'object' && 'headers' in response) {
      (response as Response).headers.forEach((value, key) => {
        if (key.toLowerCase() === 'set-cookie') {
          json.headers.append(key, value)
        }
      })
    }

    return json
  } catch (error) {
    console.error('[api/auth/logout] Failed to logout', error)
    return NextResponse.json({ success: false, error: 'Unable to logout' }, { status: 500 })
  }
}
