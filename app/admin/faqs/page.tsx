import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Plus } from 'lucide-react'

import { Button } from '@/app/components/Button'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { RoleKey } from '@prisma/client'
import { isAdminOrMentor } from '@/lib/auth-utils'

import { FAQsList } from './components/FAQsList'

export default async function FAQsPage() {
  const session = await auth()
  const roles = (session?.user as { roles?: RoleKey[] } | null)?.roles ?? []
  if (!session || !isAdminOrMentor(roles)) {
    redirect('/admin/dashboard')
  }

  const faqPages = await prisma.cmsPage.findMany({
    where: {
      slug: {
        startsWith: 'faq-'
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  const faqs = faqPages.map((page) => {
    const metadata = (page.metadata ?? {}) as Record<string, unknown>
    return {
      id: page.id,
      question: page.title,
      answer: page.description ?? '',
      category: typeof metadata.category === 'string' ? metadata.category : null,
      status: page.status,
      order: typeof metadata.order === 'number' ? metadata.order : 0
    }
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">FAQs</h1>
          <p className="text-neutral-600 mt-1">Manage frequently asked questions</p>
        </div>
        <Link href="/admin/faqs/new">
          <Button variant="primary" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New FAQ
          </Button>
        </Link>
      </div>

      <FAQsList faqs={faqs} />
    </div>
  )
}
