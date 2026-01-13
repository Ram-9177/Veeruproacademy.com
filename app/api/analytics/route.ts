import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    const payload = await request.json().catch(() => [])
    console.log('analytics batch received', Array.isArray(payload) ? payload.length : 0)
    return NextResponse.json({ ok: true })
  } catch {
    return new NextResponse('Bad Request', { status: 400 })
  }
}
