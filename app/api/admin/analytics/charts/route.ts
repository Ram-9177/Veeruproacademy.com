import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { startOfDay, subDays, format } from 'date-fns'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const session = await auth()
    
    // Check if user is admin
    if (!session?.user?.email || session.user.defaultRole !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const today = new Date()
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const d = subDays(today, 29 - i)
      return {
        date: startOfDay(d),
        label: format(d, 'MMM dd'),
        revenue: 0,
        users: 0,
        enrollments: 0
      }
    })

    const startDate = last30Days[0].date

    const [rawPayments, rawUsers, rawEnrollments] = await Promise.all([
      prisma.payment.findMany({
        where: { createdAt: { gte: startDate }, status: { in: ['CAPTURED', 'AUTHORIZED'] } }, // Adjust status as needed
        select: { createdAt: true, amountInPaise: true }
      }),
      prisma.user.findMany({
        where: { createdAt: { gte: startDate } },
        select: { createdAt: true }
      }),
      prisma.enrollment.findMany({
        where: { startedAt: { gte: startDate } },
        select: { startedAt: true }
      })
    ])

    // Aggregation Map
    const map = new Map<string, { revenue: number, users: number, enrollments: number }>()
    last30Days.forEach(d => {
      map.set(format(d.date, 'yyyy-MM-dd'), { revenue: 0, users: 0, enrollments: 0 })
    })

    // Fill Data
    rawPayments.forEach(p => {
      const key = format(p.createdAt, 'yyyy-MM-dd')
      if (map.has(key)) {
        map.get(key)!.revenue += (p.amountInPaise / 100)
      }
    })

    rawUsers.forEach(u => {
      const key = format(u.createdAt, 'yyyy-MM-dd')
      if (map.has(key)) {
        map.get(key)!.users += 1
      }
    })

    rawEnrollments.forEach(e => {
      const key = format(e.startedAt, 'yyyy-MM-dd')
      if (map.has(key)) {
        map.get(key)!.enrollments += 1
      }
    })

    // Transform back to array
    const chartData = last30Days.map(d => {
      const key = format(d.date, 'yyyy-MM-dd')
      const data = map.get(key) || { revenue: 0, users: 0, enrollments: 0 }
      return {
        date: d.label,
        revenue: data.revenue,
        users: data.users,
        enrollments: data.enrollments
      }
    })

    return NextResponse.json({ chartData })

  } catch (error) {
    console.error('Error fetching analytics charts:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
