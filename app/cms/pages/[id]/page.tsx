import { notFound } from 'next/navigation'

import { requireAdmin } from '@/lib/auth-server'
import { prisma } from '@/lib/db'
import { extractPageContent } from '@/lib/cms-pages'
import { CmsPageEditor } from './components/CmsPageEditor'

export const metadata = {
  title: 'Edit Page | CMS',
  description: 'Edit CMS page',
}

async function getPageData(id: string) {
  const page = await prisma.cmsPage.findUnique({
    where: { id },
    include: {
      versions: {
        orderBy: { version: 'desc' },
        take: 1,
      },
    },
  })

  if (!page) return null

  return {
    ...page,
    content: extractPageContent(page.versions),
  }
}

export default async function CmsPageEditorPage({ params }: { params: { id: string } }) {
  await requireAdmin()

  const page = await getPageData(params.id)

  if (!page) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <CmsPageEditor page={page} isNew={false} />
    </div>
  )
}
