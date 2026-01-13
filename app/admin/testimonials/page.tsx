import { requireMentorOrAdmin } from '@/lib/auth-server'
import { prisma } from '@/lib/db'
import { TestimonialsList } from './components/TestimonialsList'
import { Button } from '@/app/components/Button'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { CmsStatus } from '@prisma/client'
import { AdminStateMessage } from '../components/AdminStateMessage'


export const dynamic = 'force-dynamic'
export default async function TestimonialsPage() {
  await requireMentorOrAdmin()

  type TestimonialRecord = {
    id: string
    name: string
    role: string | null
    quote: string
    avatarUrl: string | null
    highlight: string | null
    rating: number
    status: CmsStatus
    order: number
  }

  let testimonials: TestimonialRecord[] = []
  let databaseUnavailable = false

  try {
    testimonials = await prisma.testimonial.findMany({
      orderBy: { order: 'asc' }
    })
  } catch (error) {
    databaseUnavailable = true
    console.error('[admin-testimonials] Failed to load testimonials', error)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Testimonials</h1>
          <p className="text-neutral-600 mt-1">Manage student testimonials and reviews</p>
        </div>
        <Link href="/admin/testimonials/new">
          <Button variant="primary" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Testimonial
          </Button>
        </Link>
      </div>
      {databaseUnavailable ? (
        <AdminStateMessage
          tone="warning"
          title="Testimonials unavailable"
          description="We couldn't fetch testimonials from the database. Confirm your DATABASE_URL and run Prisma migrations."
        />
      ) : (
        <TestimonialsList testimonials={testimonials} />
      )}
    </div>
  )
}
