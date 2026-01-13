import { HeroSection } from './sections/HeroSection'
import { FeatureGrid } from './sections/FeatureGrid'
import { PopularCourses } from './sections/PopularCourses'
import { Testimonials } from './sections/Testimonials'
import { Newsletter } from './sections/Newsletter'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  try {
    const [courses, stats, testimonials] = await Promise.all([
      prisma.course.findMany({
        where: { status: 'PUBLISHED' },
        take: 3,
        orderBy: { enrollments: { _count: 'desc' } },
        include: {
          _count: {
            select: { lessons: true, enrollments: true }
          }
        }
      }).catch(error => {
        console.error('[HomePage] Error fetching courses:', error)
        return []
      }),
      Promise.all([
        prisma.course.count({ where: { status: 'PUBLISHED' } }).catch(e => {
          console.error('[HomePage] Error counting courses:', e)
          return 0
        }),
        prisma.user.count({ where: { defaultRole: 'STUDENT' } }).catch(e => {
          console.error('[HomePage] Error counting students:', e)
          return 0
        }),
        prisma.project.count({ where: { status: 'PUBLISHED' } }).catch(e => {
          console.error('[HomePage] Error counting projects:', e)
          return 0
        })
      ]).then(([courses, students, projects]) => ({ courses, students, projects })),
      prisma.testimonial.findMany({
        where: { status: 'PUBLISHED' },
        orderBy: { order: 'asc' },
        take: 3
      }).catch(error => {
        console.error('[HomePage] Error fetching testimonials:', error)
        return []
      })
    ])

    // Map Prisma data to Component props
    const displayCourses = courses.map(course => {
      // ... existing mapping code ...
      const metadata = (course.metadata as any) || {}
      let language = metadata.language
      
      // Better inference
      if (!language) {
        const titleLower = course.title.toLowerCase()
        if (titleLower.includes('react')) language = 'React'
        else if (titleLower.includes('python')) language = 'Python'
        else if (titleLower.includes('node') || titleLower.includes('js') || titleLower.includes('script')) language = 'JavaScript'
        else if (titleLower.includes('design') || titleLower.includes('ui')) language = 'UI/UX'
        else if (titleLower.includes('data')) language = 'Data'
        else language = 'Code'
      }

      return {
        slug: course.slug,
        title: course.title,
        description: course.description,
        level: course.level || 'Beginner',
        thumbnail: course.thumbnail,
        duration: course.duration,
        price: course.price,
        lessons: course._count.lessons,
        students: course._count.enrollments,
        originalPrice: (metadata.originalPrice as number) || undefined,
        language
      }
    })

    return (
      <main className="min-h-screen bg-gray-900">
        <HeroSection stats={stats} />
        <FeatureGrid studentCount={stats.students} />
        <PopularCourses courses={displayCourses} />
        <Testimonials testimonials={testimonials} />
        <Newsletter />
      </main>
    )
  } catch (error) {
    console.error('[HomePage] Unhandled error in server component:', error)
    
    // Return a minimal working page with fallback data
    return (
      <main className="min-h-screen bg-gray-900">
        <HeroSection stats={{ courses: 0, students: 0, projects: 0 }} />
        <FeatureGrid studentCount={0} />
        <PopularCourses courses={[]} />
        <Testimonials testimonials={[]} />
        <Newsletter />
      </main>
    )
  }
}