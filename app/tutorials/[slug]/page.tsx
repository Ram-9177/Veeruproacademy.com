import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Clock, Tag, User } from 'lucide-react'

import { prisma } from '@/lib/db'
import { ContentStatus } from '@prisma/client'

export default async function TutorialPage({
  params,
}: {
  params: { slug: string }
}) {
  const lesson = await prisma.lesson.findUnique({
    where: { slug: params.slug },
    select: {
      id: true,
      slug: true,
      title: true,
      description: true,
      body: true,
      metadata: true,
      difficulty: true,
      estimatedMinutes: true,
      status: true,
      courseId: true,
      publishedAt: true,
    },
  })

  if (!lesson || lesson.courseId || lesson.status !== ContentStatus.PUBLISHED) {
    return (
      <main className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Tag className="w-8 h-8 text-gray-400" />
          </div>
          <h1 className="text-4xl font-bold text-white">Tutorial Not Found</h1>
          <p className="text-xl text-gray-400">The tutorial you&apos;re looking for doesn&apos;t exist.</p>
          <Link
            href="/tutorials"
            className="inline-block px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors"
          >
            Back to Tutorials
          </Link>
        </div>
      </main>
    )
  }

  const metadata = (lesson.metadata as Record<string, any>) || {}
  const tutorial = {
    id: lesson.id,
    slug: lesson.slug,
    title: lesson.title,
    description: lesson.description || metadata.description || '',
    image: {
      url: metadata.image?.url || metadata.imageUrl || '/images/education-grid.png',
      alt: metadata.image?.alt || lesson.title,
    },
    difficulty: metadata.difficulty || lesson.difficulty || 'Beginner',
    duration: metadata.duration || (lesson.estimatedMinutes ? `${lesson.estimatedMinutes} min` : '—'),
    category: metadata.category || 'General',
    tags: Array.isArray(metadata.tags) ? metadata.tags : [],
    author: metadata.author ? { name: metadata.author } : undefined,
    publishedAt: lesson.publishedAt ? lesson.publishedAt.toISOString() : undefined,
    content: metadata.content || lesson.body || '',
    codeSnippets: Array.isArray(metadata.codeSnippets) ? metadata.codeSnippets : [],
  }

  return (
    <main className="min-h-screen bg-gray-900">
      {/* Navigation */}
      <div className="sticky top-0 z-40 bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/tutorials" className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">Back to Tutorials</span>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main */}
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3 text-sm">
                {tutorial.category ? (
                  <span className="px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-semibold inline-flex items-center gap-2">
                    <Tag className="w-3 h-3" />
                    {tutorial.category}
                  </span>
                ) : null}
                {tutorial.difficulty ? (
                  <span className="px-3 py-1 rounded-full bg-gray-700 text-gray-200 text-xs font-semibold">
                    {tutorial.difficulty}
                  </span>
                ) : null}
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-white">{tutorial.title}</h1>
              <p className="text-lg text-gray-300 leading-relaxed">{tutorial.description}</p>

              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400">
                {tutorial.duration ? (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{tutorial.duration}</span>
                  </div>
                ) : null}
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>{tutorial.author?.name || 'Veeru Pro Academy'}</span>
                </div>
              </div>
            </div>

            <div className="relative aspect-video bg-black rounded-xl overflow-hidden border border-gray-700">
              <Image
                src={tutorial.image?.url || '/images/education-grid.png'}
                alt={tutorial.image?.alt || tutorial.title}
                fill
                sizes="(max-width: 1024px) 100vw, 1200px"
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-black/40" />
            </div>

            {tutorial.content ? (
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h2 className="text-xl font-bold text-white mb-4">Tutorial</h2>
                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{tutorial.content}</p>
              </div>
            ) : null}

            {Array.isArray(tutorial.codeSnippets) && tutorial.codeSnippets.length > 0 ? (
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h2 className="text-xl font-bold text-white mb-4">Code</h2>
                <div className="space-y-4">
                  {tutorial.codeSnippets.map((snippet, idx) => (
                    <div key={idx} className="bg-gray-900 rounded-lg border border-gray-700 overflow-hidden">
                      <div className="px-4 py-2 border-b border-gray-700 text-sm text-gray-300 flex items-center justify-between">
                        <span>{snippet.title || `Snippet ${idx + 1}`}</span>
                        <span className="text-gray-500">{snippet.language}</span>
                      </div>
                      <pre className="p-4 overflow-auto text-sm text-gray-200">
                        <code>{snippet.code}</code>
                      </pre>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-bold text-white mb-4">Tutorial Details</h3>
              <div className="space-y-3">
                {tutorial.duration ? (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Duration</span>
                    <span className="text-white font-medium">{tutorial.duration}</span>
                  </div>
                ) : null}
                {tutorial.difficulty ? (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Difficulty</span>
                    <span className="text-white font-medium">{tutorial.difficulty}</span>
                  </div>
                ) : null}
                {tutorial.category ? (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Category</span>
                    <span className="text-white font-medium">{tutorial.category}</span>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-center">
              <h3 className="text-lg font-bold text-white mb-2">Want More?</h3>
              <p className="text-blue-100 text-sm mb-4">Check out our comprehensive courses with projects and certificates</p>
              <Link
                href="/courses"
                className="inline-block px-4 py-2 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Explore Courses
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
