import type { Course } from '@/app/types/course'

// Map a Prisma Course record (with optional relations) to the Course shape used by the frontend
export function mapDbCourse(course: any): Course {
  const modules = Array.isArray(course?.modules)
    ? course.modules.map((mod: any) => ({
        name: mod.title || mod.name || mod.slug || 'Module',
        meta: mod.description || mod.meta || '',
        lessons: Array.isArray(mod?.lessons) ? mod.lessons.map((lesson: any) => lesson.title || lesson.slug || 'Lesson') : [],
      }))
    : []

  const metadata = (course?.metadata && typeof course.metadata === 'object') ? course.metadata : {}

  return {
    id: course.id,
    slug: course.slug,
    title: course.title,
    level: course.level || 'Beginner',
    difficulty: course.level || course.difficulty || 'Beginner',
    language: course.language || metadata.language || 'JavaScript',
    tags: metadata.tags || [],
    description: course.description || '',
    thumbnail: course.thumbnail || metadata.thumbnail || '/placeholder.png',
    duration: course.duration || metadata.duration || 'Self paced',
    lessons: course.lessons?.length || metadata.lessonsCount || modules.reduce((sum: number, m: any) => sum + (m.lessons?.length || 0), 0) || 0,
    projects: metadata.projects || metadata.projectsCount || 0,
    tools: metadata.tools || [],
    highlight: Boolean(metadata.highlight),
    price: typeof course.price === 'number' ? course.price : 0,
    originalPrice: metadata.originalPrice,
    whatYouWillLearn: metadata.whatYouWillLearn || [],
    modules,
    instructor: course.instructor
      ? {
          name: course.instructor.name || 'Instructor',
          role: course.instructor.role || 'Instructor',
          avatarUrl: course.instructor.avatarUrl || undefined,
          bio: course.instructor.bio || undefined,
        }
      : undefined,
    paymentFeatures: metadata.paymentFeatures || [],
    paymentMethods: metadata.paymentMethods || [],
  }
}
