import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const notifications = await prisma.notification.findMany({
      where: {
        userId: session.user.id
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10
    })

    const mappedNotifications = notifications.map(n => ({
      id: n.id,
      title: n.title,
      message: n.body,
      createdAt: n.createdAt,
      read: !!n.readAt
    }))

    return NextResponse.json(mappedNotifications)
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await req.json()

    // If id is provided, mark one as read. If not, mark all as read.
    if (id) {
      await prisma.notification.update({
        where: { id, userId: session.user.id },
        data: { readAt: new Date() }
      })
    } else {
      await prisma.notification.updateMany({
        where: { userId: session.user.id, readAt: null },
        data: { readAt: new Date() }
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating notifications:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
