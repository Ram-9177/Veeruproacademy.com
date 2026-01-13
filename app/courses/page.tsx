import { prisma } from '@/lib/db'
import { CourseCatalog } from './components/CourseCatalog'

export const dynamic = 'force-dynamic'
export const revalidate = 0

async function getCourses() {
  try {
    const courses = await prisma.course.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { order: 'asc' },
      include: {
        _count: {
          select: { lessons: true }
        }
      }
    })
    return courses
  } catch (error) {
    console.error('[CoursesPage] Failed to fetch courses:', error)
    return []
  }
}

export default async function CoursesPage() {
  const courses = await getCourses()

  // Map Prisma data to CatalogCourse interface
  const catalogCourses = courses.map(course => {
    const metadata = (course.metadata as any) || {}
    
    // Infer language safely
    let language = metadata.language
    if (!language) {
      const titleLower = course.title.toLowerCase()
      if (titleLower.includes('python')) language = 'Python'
      else if (titleLower.includes('script')) language = 'JavaScript'
      else if (titleLower.includes('react')) language = 'React'
      else if (titleLower.includes('css') || titleLower.includes('ui')) language = 'UI/UX'
      else if (titleLower.includes('data')) language = 'Data'
      else if (titleLower.includes('ai')) language = 'AI'
      else language = 'Code'
    }

    return {
      slug: course.slug,
      title: course.title,
      description: course.description,
      level: course.level || 'Beginner',
      language,
      thumbnail: course.thumbnail,
      duration: course.duration,
      price: course.price,
      originalPrice: (metadata.originalPrice as number) || undefined,
      lessons: course._count.lessons
    }
  })

  return <CourseCatalog courses={catalogCourses} />
}