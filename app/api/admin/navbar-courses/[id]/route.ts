import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { isAdmin } from '@/lib/auth-utils'
import { prisma } from '@/lib/db'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    // SECURITY: Proper role checking with auth-utils
    if (!session?.user || !isAdmin(session.user.roles || [])) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // SECURITY: Input validation
    if (!params.id || typeof params.id !== 'string') {
      return NextResponse.json({ error: 'Valid course ID is required' }, { status: 400 })
    }

    // SECURITY: Replace in-memory storage with database operations
    await prisma.course.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting navbar course:', error)
    if (error?.code === 'P2025') {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}