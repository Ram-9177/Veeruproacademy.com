import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export default async function DynamicPage({ params }: { params: { slug: string } }) {
  try {
    const page = await prisma.cmsPage.findUnique({
      where: { slug: params.slug },
    }).catch(error => {
      console.error('[DynamicPage] Error fetching page:', error)
      return null
    })

    // Check if page exists and is published (or visible)
    // Schema has isPublished boolean and status enum.
    if (!page || !page.isPublished) return notFound()

    // Extract content from blocks. Assuming blocks is { content: string } based on creation logic.
    // Cast blocks to any to access properties safely.
    const blocks = page.blocks as any
    const htmlContent = blocks?.content || '<p>No content available.</p>'

    return (
      <main className="min-h-screen py-16 px-4 max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">{page.title}</h1>
        <div className="prose prose-lg max-w-none dark:prose-invert" dangerouslySetInnerHTML={{ __html: htmlContent }} />
      </main>
    )
  } catch (error) {
    console.error('[DynamicPage] Unhandled error:', error)
    return notFound()
  }
}
