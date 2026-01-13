import { NextResponse } from 'next/server'
import { RoleKey, ProductType } from '@prisma/client'
import type { Prisma } from '@prisma/client'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { parseUnlockMetadata } from '@/src/modules/projects/helpers'

export const dynamic = 'force-dynamic' as const

export async function GET(request: Request) {
  try {
    const session = await auth()
    const roles = (session?.user as { roles?: RoleKey[] } | null)?.roles ?? []

    if (!session?.user || !roles.includes(RoleKey.ADMIN)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const statusParam = searchParams.get('status') ?? 'pending'
    const limit = Number(searchParams.get('limit') ?? '50')

    const where: any = {
      itemType: ProductType.PROJECT,
    }

    if (statusParam && statusParam !== 'all') {
      where.metadata = {
        path: ['status'],
        equals: statusParam,
      }
    }

    const unlocks = await prisma.savedItem.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: Number.isFinite(limit) ? Math.min(Math.max(limit, 1), 200) : 50,
    })

    const projectIds = unlocks.map((unlock) => unlock.itemId)
    const userIds = unlocks.map((unlock) => unlock.userId)

    const projectSelect: Prisma.ProjectSelect = {
      id: true,
      slug: true,
      title: true,
      price: true,
      thumbnail: true,
      driveUrl: true,
    }

    const userSelect: Prisma.UserSelect = {
      id: true,
      name: true,
      email: true,
    }

    const [projects, users] = await Promise.all([
      projectIds.length
        ? prisma.project.findMany({
            where: { id: { in: projectIds } },
            select: projectSelect,
          })
        : Promise.resolve([]),
      userIds.length
        ? prisma.user.findMany({
            where: { id: { in: userIds } },
            select: userSelect,
          })
        : Promise.resolve([]),
    ])

    const projectMap = new Map(projects.map((project) => [project.id, project]))
    const userMap = new Map(users.map((user) => [user.id, user]))

    const data = unlocks.map((unlock) => {
      const metadata = parseUnlockMetadata(unlock.metadata)
      return {
        id: unlock.id,
        user: userMap.get(unlock.userId) ?? null,
        project: projectMap.get(unlock.itemId) ?? null,
        metadata,
        createdAt: unlock.createdAt.toISOString(),
      }
    })

    return NextResponse.json({
      success: true,
      data,
      count: data.length,
    })
  } catch (error) {
    console.error('[api/admin/project-unlocks] Failed to fetch unlocks', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch project unlocks' },
      { status: 500 }
    )
  }
}
