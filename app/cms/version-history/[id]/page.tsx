import { notFound } from 'next/navigation'

import { requireAdmin } from '@/lib/auth-server'
import { prisma } from '@/lib/db'
import { VersionHistory } from './components/VersionHistory'

export const metadata = {
  title: 'Version History | CMS',
  description: 'View page version history',
}

async function getPageWithVersions(id: string) {
  const page = await prisma.cmsPage.findUnique({
    where: { id },
    include: {
      versions: {
        orderBy: { version: 'desc' }
      }
    }
  })

  if (!page) return page

  // Map createdBy -> user info to preserve previous API shape
  const userIds = Array.from(new Set((page.versions || []).map((v: any) => v.createdBy).filter(Boolean)))
  const users = userIds.length
    ? await prisma.user.findMany({ where: { id: { in: userIds } }, select: { id: true, name: true, email: true } })
    : []

  const userMap = new Map(users.map(u => [u.id, { name: u.name, email: u.email }]))

  ;(page as any).versions = (page.versions || []).map((v: any) => ({
    ...v,
    user: v.createdBy ? userMap.get(v.createdBy) ?? null : null
  }))

  return page
}

export default async function VersionHistoryPage({ params }: { params: { id: string } }) {
  await requireAdmin()

  const page = await getPageWithVersions(params.id)

  if (!page) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
  <VersionHistory page={page as any} />
      </div>
    </div>
  )
}
