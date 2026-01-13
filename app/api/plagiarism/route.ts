import { NextResponse } from 'next/server'
import { computeSimilarity } from '@/lib/plagiarism'

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    const { textA = '', textB = '' } = body
    const result = computeSimilarity(String(textA || ''), String(textB || ''))
    return NextResponse.json({ ok: true, ...result })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || 'unknown error' }, { status: 500 })
  }
}

export function GET() {
  return NextResponse.json({ ok: true, message: 'POST { textA, textB } to compute similarity.' })
}
