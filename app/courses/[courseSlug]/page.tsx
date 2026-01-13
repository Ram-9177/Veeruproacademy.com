import { notFound, redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { 
  BookOpen, 
  Clock, 
  Star, 
  CheckCircle2, 
  Zap,
  ArrowLeft,
  Share2,
  Bookmark,
  Play,
  Users,
  Award
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { EnrollButton } from '@/app/components/EnrollButton'

export const dynamic = 'force-dynamic'
export const revalidate = 0

async function getCourse(slug: string) {
  try {
    // Try exact match first
    let course = await prisma.course.findUnique({
      where: { slug },
      include: {
        modules: {
          orderBy: { order: 'asc' },
          include: {
            lessons: {
              orderBy: { order: 'asc' }
            }
          }
        },
        instructor: true,
        _count: {
          select: {
            lessons: true,
            enrollments: true
          }
        }
      }
    })

    // Fallback: normalize common variations (spaces -> hyphens, lowercase)
    if (!course) {
      const normalizedSlug = decodeURIComponent(slug)
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '-')

      if (normalizedSlug && normalizedSlug !== slug) {
        course = await prisma.course.findUnique({
          where: { slug: normalizedSlug },
          include: {
            modules: {
              orderBy: { order: 'asc' },
              include: { lessons: { orderBy: { order: 'asc' } } }
            },
            instructor: true,
            _count: { select: { lessons: true, enrollments: true } }
          }
        })
        
        if (course) {
          return { course, shouldRedirect: true, normalizedSlug }
        }
      }
    }
    
    return { course, shouldRedirect: false, normalizedSlug: null }
  } catch (error) {
    console.error('[CourseDetailPage] Error fetching course:', error)
    return { course: null, shouldRedirect: false, normalizedSlug: null }
  }
}

export default async function CourseDetailPage({ params }: { params: { courseSlug: string } }) {
  const rawSlug = params.courseSlug
  const { course, shouldRedirect, normalizedSlug } = await getCourse(rawSlug)
  
  if (shouldRedirect && normalizedSlug) {
    redirect(`/courses/${normalizedSlug}`)
  }

  if (!course) {
    notFound()
  }

  // Parse metadata safely
  const metadata = (course.metadata as any) || {}
  const tools = metadata.tools || []
  const whatYouWillLearn = metadata.whatYouWillLearn || []
  const difficulty = course.level || 'Beginner'
  
  // Helper for colors
  const getDifficultyColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner': return 'bg-green-500/20 text-green-300 border-green-500/30'
      case 'intermediate': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
      case 'advanced': return 'bg-red-500/20 text-red-300 border-red-500/30'
      default: return 'bg-blue-500/20 text-blue-300 border-blue-500/30'
    }
  }

  // Calculate stats
  const projectCount = metadata.projects || 0
  const duration = course.duration || 'Flexible'



  const originalPrice = metadata.originalPrice || 0
  const isHighlight = metadata.highlight || false

  return (
    <main className="min-h-screen bg-gray-900">
      {/* Navigation */}
      <div className="sticky top-0 z-40 bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link
            href="/courses"
            className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">Back to Courses</span>
          </Link>
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-lg hover:bg-gray-700 transition-colors">
              <Bookmark className="h-5 w-5 text-gray-400 hover:text-white" />
            </button>
            <button className="p-2 rounded-lg hover:bg-gray-700 transition-colors">
              <Share2 className="h-5 w-5 text-gray-400 hover:text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div className="space-y-6">
              <div className="flex items-start gap-4 flex-wrap">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getDifficultyColor(difficulty)}`}>
                  {difficulty}
                </span>
                {isHighlight && (
                  <div className="px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30">
                    <span className="text-xs font-semibold text-blue-300">Featured Course</span>
                  </div>
                )}
                {!course.price && (
                  <div className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30">
                    <span className="text-xs font-semibold text-emerald-300">FREE</span>
                  </div>
                )}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight text-white">
                {course.title}
              </h1>
              <p className="text-lg leading-relaxed max-w-2xl text-gray-300">
                {course.description}
              </p>
              
              {/* Quick Stats */}
              <div className="flex items-center gap-6 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>{course._count.enrollments} students</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span>4.8 rating</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  <span>Certificate included</span>
                </div>
              </div>
            </div>

            {/* Thumbnail */}
            {course.thumbnail && (
              <div className="relative rounded-2xl overflow-hidden border border-gray-700 shadow-2xl aspect-video group">
                <Image
                  src={course.thumbnail}
                  alt={course.title}
                  width={800}
                  height={450}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <button className="w-16 h-16 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110">
                    <Play className="w-6 h-6 text-white ml-1" />
                  </button>
                </div>
              </div>
            )}

            {/* Course Info Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="rounded-xl border border-gray-700 bg-gray-800 p-4 space-y-2 hover:bg-gray-700 transition-colors">
                <Clock className="h-5 w-5 text-blue-400" />
                <p className="text-sm text-gray-400">Duration</p>
                <p className="font-bold text-white">{duration}</p>
              </div>
              <div className="rounded-xl border border-gray-700 bg-gray-800 p-4 space-y-2 hover:bg-gray-700 transition-colors">
                <BookOpen className="h-5 w-5 text-emerald-400" />
                <p className="text-sm text-gray-400">Lessons</p>
                <p className="font-bold text-white">{course._count.lessons}</p>
              </div>
              <div className="rounded-xl border border-gray-700 bg-gray-800 p-4 space-y-2 hover:bg-gray-700 transition-colors">
                <Zap className="h-5 w-5 text-purple-400" />
                <p className="text-sm text-gray-400">Projects</p>
                <p className="font-bold text-white">{projectCount}</p>
              </div>
              <div className="rounded-xl border border-gray-700 bg-gray-800 p-4 space-y-2 hover:bg-gray-700 transition-colors">
                <Star className="h-5 w-5 text-yellow-400" />
                <p className="text-sm text-gray-400">Level</p>
                <p className="font-bold text-white">{difficulty}</p>
              </div>
            </div>

            {/* Curriculum */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Course Curriculum</h2>
              <div className="rounded-xl border border-gray-700 bg-gray-800 p-6 space-y-4">
                {course.modules.length > 0 ? (
                  course.modules.map((module, i) => (
                    <div key={module.id} className="flex items-start gap-4 pb-4 border-b border-gray-700 last:pb-0 last:border-0">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold text-white">
                        {i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-white">
                          {module.title}
                        </h4>
                        <p className="text-sm mt-1 text-gray-400">
                          {module.lessons.length} lessons
                        </p>
                        {module.lessons.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {module.lessons.slice(0, 3).map((lesson) => (
                              <span key={lesson.id} className="text-xs px-2 py-1 bg-gray-700 rounded text-gray-300">
                                {lesson.title}
                              </span>
                            ))}
                            {module.lessons.length > 3 && (
                              <span className="text-xs px-2 py-1 bg-gray-700 rounded text-gray-400">
                                +{module.lessons.length - 3} more
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-400">Coming soon...</div>
                )}
              </div>
            </div>

            {/* What You'll Learn */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">What You&apos;ll Learn</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {whatYouWillLearn.map((item: string, idx: number) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors">
                    <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <p className="text-white">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Tools & Tech */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Tools & Technologies</h2>
              <div className="flex flex-wrap gap-3">
                {tools.map((tool: string) => (
                  <div
                    key={tool}
                    className="inline-flex items-center rounded-full border border-blue-600 bg-blue-600/20 px-4 py-2 text-sm font-medium text-blue-300 hover:bg-blue-600/30 transition-colors"
                  >
                    {tool}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:sticky lg:top-24 space-y-6">
            {/* Price Card */}
            <div className="rounded-2xl border border-gray-700 bg-gray-800 p-6 space-y-6">
              <div className="space-y-3">
                {course.price > 0 ? (
                  <>
                    {originalPrice > course.price && (
                      <p className="text-lg line-through text-gray-400">
                        ₹{originalPrice.toLocaleString('en-IN')}
                      </p>
                    )}
                    <p className="text-4xl font-bold text-white">
                      ₹{course.price.toLocaleString('en-IN')}
                    </p>
                    <p className="text-sm text-gray-400">Lifetime access</p>
                  </>
                ) : (
                  <>
                    <p className="text-4xl font-bold text-emerald-400">FREE</p>
                    <p className="text-sm text-gray-400">Learn now</p>
                  </>
                )}
              </div>

              <div className="space-y-3">
                <EnrollButton
                  courseId={course.id}
                  courseSlug={course.slug}
                  courseName={course.title}
                  price={course.price}
                  className="w-full text-lg font-bold"
                />
                <p className="text-xs text-center text-gray-400">
                  30-day money-back guarantee
                </p>
              </div>

              {/* Features */}
              <div className="space-y-3 pt-4 border-t border-gray-700">
                {[
                  'Lifetime access to materials',
                  'Download resources',
                  'Certificate of completion',
                  '24/7 support access',
                  'Mobile and desktop access',
                  'Regular content updates'
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                    <span className="text-sm text-white">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Instructor Info */}
            <div className="rounded-2xl border border-gray-700 bg-gray-800 p-6 space-y-4">
              <h3 className="font-bold text-white">Course Instructor</h3>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center text-lg font-bold text-white">
                  {(course.instructor?.name || 'V').charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-white">
                    {course.instructor?.name || 'Veeru Pro'}
                  </p>
                  <p className="text-sm text-gray-400">
                    Expert Instructor
                  </p>
                </div>
              </div>
              <p className="text-sm leading-relaxed text-gray-400">
                With years of experience in teaching and industry expertise, dedicated to making learning accessible to everyone.
              </p>
            </div>

            {/* CTA */}
            <Link
              href="/courses"
              className="block px-6 py-3 rounded-xl text-center border border-gray-600 font-semibold hover:bg-gray-800 transition-colors text-white"
            >
              Explore More Courses
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
