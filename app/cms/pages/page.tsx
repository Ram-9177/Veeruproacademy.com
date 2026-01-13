import { Suspense } from 'react'
import Link from 'next/link'

import { requireAdmin } from '@/lib/auth-server'
import { prisma } from '@/lib/db'
import { extractPageContent } from '@/lib/cms-pages'
import { CmsPagesList } from './components/CmsPagesList'
import { LoadingSpinner } from '@/app/components/LoadingSpinner'

export const metadata = {
  title: 'CMS Pages | Admin',
  description: 'Manage CMS pages',
}

async function getPages() {
  const pages = await prisma.cmsPage.findMany({
    orderBy: { updatedAt: 'desc' },
    include: {
      author: {
        select: {
          name: true,
          email: true,
        },
      },
      versions: {
        orderBy: { version: 'desc' },
        take: 1,
      },
    },
  })

  return pages.map((page) => ({
    ...page,
    content: extractPageContent(page.versions),
  }))
}


export const dynamic = 'force-dynamic'
export default async function CmsPagesPage() {
  await requireAdmin()
  const pages = await getPages()

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">CMS Pages</h1>
            <p className="text-gray-400 mt-1">Manage your content pages</p>
          </div>
          <Link
            href="/cms/pages/new"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
          >
            Create Page
          </Link>
        </div>

        <Suspense fallback={<LoadingSpinner />}>
          <CmsPagesList initialPages={pages} />
        </Suspense>
      </div>
    </div>
  )
}
