import { redirect } from 'next/navigation'
import { ProductType, RoleKey } from '@prisma/client'

import { getServerSession } from '@/lib/auth-server'
import { prisma } from '@/lib/db'
import { AdminStateMessage } from '../../components/AdminStateMessage'
import { parseUnlockMetadata } from '@/src/modules/projects/helpers'
import { ProjectUnlocksTable } from './components/ProjectUnlocksTable'
import type { UnlockTableEntry } from './components/ProjectUnlocksTable'


export const dynamic = 'force-dynamic'
export default async function ProjectUnlocksPage() {
  const session = await getServerSession()
  const roles = (session?.user as { roles?: RoleKey[] } | null)?.roles ?? []

  if (!session?.user || !roles.includes(RoleKey.ADMIN)) {
    redirect('/admin/dashboard')
  }

  let unlocks: Awaited<ReturnType<typeof prisma.savedItem.findMany>> = []
  let databaseUnavailable = false

  try {
    unlocks = await prisma.savedItem.findMany({
      where: { itemType: ProductType.PROJECT },
      orderBy: { createdAt: 'desc' },
      take: 200,
    })
  } catch (error) {
    databaseUnavailable = true
    console.error('[admin-project-unlocks] Failed to fetch saved items', error)
  }

  if (databaseUnavailable) {
    return (
      <AdminStateMessage
        tone="warning"
        title="Database connection required"
        description="Connect your Prisma database to review project unlock submissions."
      />
    )
  }

  const projectIds = unlocks.map((unlock) => unlock.itemId)
  const userIds = unlocks.map((unlock) => unlock.userId)

  const [projects, users] = await Promise.all([
    projectIds.length
      ? prisma.project.findMany({
          where: { id: { in: projectIds } },
          select: {
            id: true,
            slug: true,
            title: true,
            thumbnail: true,
            driveUrl: true,
          },
        })
      : Promise.resolve([]),
    userIds.length
      ? prisma.user.findMany({
          where: { id: { in: userIds } },
          select: {
            id: true,
            name: true,
            email: true,
          },
        })
      : Promise.resolve([]),
  ])

  const projectMap = new Map(projects.map((project) => [project.id, project]))
  const userMap = new Map(users.map((user) => [user.id, user]))

  const data: UnlockTableEntry[] = unlocks.map((unlock) => {
    const metadata = parseUnlockMetadata(unlock.metadata)
    return {
      id: unlock.id,
      createdAt: unlock.createdAt.toISOString(),
      metadata,
      project: projectMap.get(unlock.itemId) ?? null,
      user: userMap.get(unlock.userId) ?? null,
    }
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900">Project unlock moderation</h1>
        <p className="mt-1 text-neutral-600">Review and action payment proofs submitted by learners.</p>
      </div>
      <ProjectUnlocksTable initialUnlocks={data} />
    </div>
  )
}
