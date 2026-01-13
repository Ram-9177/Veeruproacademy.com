import { requireAdmin } from '@/lib/auth-server'
import { prisma } from '@/lib/db'
import { VersionHistoryList } from './components/VersionHistoryList'
import { AdminStateMessage } from '@/app/admin/components/AdminStateMessage'
import { ContentType } from '@prisma/client'

export default async function VersionHistoryPage({
  params,
}: {
  params: { type: string; id: string }
}) {
  await requireAdmin()

  const contentType = params.type.toUpperCase() as ContentType

  let versions = [] as Array<{
    id: string
    version: number
    changeNote: string | null
    createdAt: Date
    user: { name: string | null; email: string | null } | null
    data: unknown
  }>
  let databaseUnavailable = false

  try {
    // First fetch versions (many DB setups store createdBy as a string FK)
    const raw = await prisma.contentVersion.findMany({
      where: {
        contentType,
        contentId: params.id
      },
      orderBy: { version: 'desc' }
    })

    // Collect user ids referenced by createdBy and fetch user info in one query
    const userIds = Array.from(new Set(raw.map((r) => r.createdBy).filter(Boolean) as string[]))
    const users = userIds.length
      ? await prisma.user.findMany({
          where: { id: { in: userIds } },
          select: { id: true, name: true, email: true }
        })
      : []

    const userMap = new Map(users.map((u) => [u.id, { name: u.name, email: u.email }]))

    // Map DB shape to UI shape (UI expects `.user`)
    versions = raw.map((v) => ({
      id: v.id,
      version: v.version,
      changeNote: v.changeNote,
      createdAt: v.createdAt,
      user: v.createdBy ? userMap.get(v.createdBy) ?? null : null,
      data: v.data
    }))
  } catch (error) {
    databaseUnavailable = true
    console.error('[admin-version-history] Failed to load versions', error)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900">Version History</h1>
        <p className="text-neutral-600 mt-1">View and restore previous versions</p>
      </div>

      {databaseUnavailable ? (
        <AdminStateMessage
          tone="warning"
          title="Version history unavailable"
          description="We couldn't fetch version history. Verify the database connection and run pending Prisma migrations."
        />
      ) : (
        <VersionHistoryList versions={versions} contentType={contentType} contentId={params.id} />
      )}
    </div>
  )
}

