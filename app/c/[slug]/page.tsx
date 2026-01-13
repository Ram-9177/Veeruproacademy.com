import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { CmsStatus } from '@prisma/client'

import { prisma } from '@/lib/db'
import { extractPageContent } from '@/lib/cms-pages'

export const revalidate = 30 // ISR: revalidate every 30 seconds

interface PageProps {
  params: { slug: string }
}

async function getPublishedPage(slug: string) {
  try {
    return await prisma.cmsPage.findFirst({
      where: {
        slug,
        status: CmsStatus.PUBLISHED,
        isPublished: true,
      },
      include: {
        versions: {
          orderBy: { version: 'desc' },
          take: 1,
        },
      },
    })
  } catch (error) {
    console.error('[getPublishedPage] Error fetching page:', error)
    return null
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const page = await getPublishedPage(params.slug)

    if (!page) {
      return {
        title: 'Page Not Found',
      }
    }

    const description = page.description || (page.versions[0]?.data as any)?.content?.substring(0, 150)

    return {
      title: page.title,
      description,
      openGraph: {
        title: page.title,
        description,
        type: 'article',
        publishedTime: page.publishedAt?.toISOString(),
        modifiedTime: page.updatedAt.toISOString(),
      },
    }
  } catch (error) {
    console.error('[generateMetadata] Error generating metadata:', error)
    return {
      title: 'Page Not Found',
    }
  }
}

export default async function CmsPublicPage({ params }: PageProps) {
  try {
    const page = await getPublishedPage(params.slug)

    if (!page) {
      notFound()
    }

    const content = extractPageContent(page.versions)

    return (
      <div className="min-h-screen bg-gray-950 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <article>
            <header className="mb-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{page.title}</h1>
              {page.description && (
                <p className="text-xl text-gray-400">{page.description}</p>
              )}
              {page.publishedAt && (
                <p className="text-sm text-gray-500 mt-4">
                  Published on {new Date(page.publishedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              )}
            </header>

            <div
              className="prose prose-invert prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </article>
        </div>
      </div>
    )
  } catch (error) {
    console.error('[CmsPublicPage] Unhandled error:', error)
    notFound()
  }
}
