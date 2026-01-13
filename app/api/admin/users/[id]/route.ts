import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { isAdmin } from '@/lib/auth-utils'
import { prisma } from '@/lib/db'

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user || !isAdmin(session.user.roles || [])) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params
    await prisma.user.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting user:', error)
    if (error?.code === 'P1001') {
      return NextResponse.json({ error: 'Database unreachable' }, { status: 503 })
    }
    if (error?.code === 'P2025') {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
