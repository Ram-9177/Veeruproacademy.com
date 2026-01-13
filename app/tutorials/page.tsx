import Image from 'next/image'
import Link from 'next/link'
import { Play, User, ArrowRight, Video, BookOpen } from 'lucide-react'

import { prisma } from '@/lib/db'
import { ContentStatus } from '@prisma/client'

export const dynamic = 'force-dynamic'

type TutorialSummary = {
  id: string
  slug: string
  title: string
  description: string
  image?: { url: string; alt?: string }
  difficulty?: string
  duration?: string
  category?: string
  tags?: string[]
  author?: { name?: string }
}

function normalizeTutorial(lesson: any): TutorialSummary {
  const metadata = (lesson.metadata as Record<string, any>) || {}
  const tags = Array.isArray(metadata.tags) ? metadata.tags : []
  const imageUrl = metadata.image?.url || metadata.imageUrl || '/images/education-grid.png'
  const imageAlt = metadata.image?.alt || lesson.title
  const duration = metadata.duration || (lesson.estimatedMinutes ? `${lesson.estimatedMinutes} min` : '—')

  return {
    id: lesson.id,
    slug: lesson.slug,
    title: lesson.title,
    description: lesson.description || metadata.description || '',
    image: { url: imageUrl, alt: imageAlt },
    difficulty: metadata.difficulty || lesson.difficulty || 'Beginner',
    duration,
    category: metadata.category || 'General',
    tags,
    author: metadata.author ? { name: metadata.author } : undefined,
  }
}

export default async function TutorialsPage() {
  const lessons = await prisma.lesson.findMany({
    where: {
      courseId: null,
      status: ContentStatus.PUBLISHED,
    },
    orderBy: { publishedAt: 'desc' },
  })

  const tutorials = lessons.map(normalizeTutorial)
  const tutorialCount = tutorials.length

  return (
    <main className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <section className="w3-section bg-blue-600">
        <div className="w3-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full text-sm font-semibold mb-6">
            <Video className="w-4 h-4" />
            Video Tutorials
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Learn with Video Tutorials
          </h1>
          <p className="text-xl text-white/80 mb-8 max-w-3xl mx-auto">
            Watch comprehensive video tutorials and master programming skills. Each tutorial is a complete, 
            focused lesson designed to teach you specific technologies from scratch.
          </p>
          <div className="flex flex-wrap justify-center gap-8 text-white">
            <div className="text-center">
              <div className="text-3xl font-bold">{tutorialCount}</div>
              <div className="text-white/80">Tutorials</div>
            </div>
          </div>
        </div>
      </section>

      {/* Tutorials Grid */}
      <section className="w3-section bg-gray-900 py-16">
        <div className="w3-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Featured Video Tutorials</h2>
            <p className="text-gray-400 text-lg">
              Comprehensive video lessons covering the most important programming topics
            </p>
          </div>

          {tutorialCount === 0 ? (
            <div className="w3-card text-center py-14">
              <h3 className="text-xl font-bold text-white mb-2">No tutorials yet</h3>
              <p className="text-gray-400">Tutorials will appear here once they are published.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {tutorials.map((tutorial) => (
                <Link
                  key={tutorial.id}
                  href={`/tutorials/${tutorial.slug}`}
                  className="group bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-blue-500 transition-all duration-300 hover:transform hover:scale-105"
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-video overflow-hidden">
                    <Image
                      src={tutorial.image?.url || '/images/education-grid.png'}
                      alt={tutorial.image?.alt || tutorial.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 1200px"
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                      priority={tutorial.slug === tutorials[0]?.slug}
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                        <Play className="w-6 h-6 text-white ml-1" />
                      </div>
                    </div>

                    {/* Duration Badge */}
                    {tutorial.duration ? (
                      <div className="absolute bottom-3 right-3 bg-black/80 text-white px-2 py-1 rounded text-sm font-medium">
                        {tutorial.duration}
                      </div>
                    ) : null}

                    {/* Difficulty Badge */}
                    {tutorial.difficulty ? (
                      <div className="absolute top-3 left-3 px-2 py-1 rounded text-xs font-semibold bg-blue-600/80 text-white">
                        {tutorial.difficulty}
                      </div>
                    ) : null}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-blue-400 text-sm font-medium">{tutorial.category}</span>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                      {tutorial.title}
                    </h3>

                    <p className="text-gray-400 mb-4 line-clamp-2">{tutorial.description}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        {tutorial.author?.name ? (
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            <span>{tutorial.author.name}</span>
                          </div>
                        ) : null}
                      </div>

                      <div className="flex items-center gap-1 text-blue-400 group-hover:text-blue-300 transition-colors">
                        <span className="text-sm font-medium">Open</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="w3-section bg-gray-800 py-16">
        <div className="w3-container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Want More Comprehensive Learning?
          </h2>
          <p className="text-gray-400 text-lg mb-8">
            Check out our full courses with projects, exercises, and certificates
          </p>
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
          >
            <BookOpen className="w-5 h-5" />
            Explore Full Courses
          </Link>
        </div>
      </section>
    </main>
  )
}
