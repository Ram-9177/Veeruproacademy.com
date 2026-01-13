import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      where: { 
        status: 'PUBLISHED'
      },
      orderBy: { order: 'asc' },
      take: 5,
      select: {
        id: true,
        slug: true,
        title: true,
        metadata: true,
        order: true
      }
    })

    const formattedCourses = courses.map(course => {
      // Infer icon from metadata or title
      const meta = (course.metadata as any) || {}
      let icon = '🎓'
      const titleLower = course.title.toLowerCase()
      
      // Infer language and short title
      let language = meta.language
      let shortTitle = course.title

      if (!language) {
         if (titleLower.includes('python')) language = 'Python'
         else if (titleLower.includes('java') && !titleLower.includes('script')) language = 'Java'
         else if (titleLower.includes('javascript') || titleLower.includes('js')) language = 'JavaScript'
         else if (titleLower.includes('react')) language = 'React'
         else if (titleLower.includes('html')) language = 'HTML'
         else if (titleLower.includes('css')) language = 'CSS'
         else if (titleLower.includes('node')) language = 'Node.js'
         else if (titleLower.includes('design') || titleLower.includes('ui')) language = 'UI/UX'
         else if (titleLower.includes('data')) language = 'Data'
      }

      if (language) {
        shortTitle = language
      } else {
        // Fallback short titles
        if (titleLower.includes('web')) shortTitle = 'Web Dev'
        else if (titleLower.includes('full stack')) shortTitle = 'Full Stack'
        else if (titleLower.includes('finance')) shortTitle = 'Finance'
        else if (titleLower.includes('marketing')) shortTitle = 'Marketing'
      }

      if (meta.language) {
        if (meta.language === 'React') icon = '⚛️'
        else if (meta.language === 'Python') icon = '🐍'
        else if (meta.language === 'JavaScript') icon = '📜'
        else if (meta.language === 'AI') icon = '🤖'
        else if (meta.language === 'Java') icon = '☕'
        else if (meta.language === 'HTML') icon = '🌐'
        else if (meta.language === 'CSS') icon = '🎨'
      } else {
        if (titleLower.includes('web')) icon = '🌐'
        else if (titleLower.includes('design') || titleLower.includes('ui')) icon = '🎨'
        else if (titleLower.includes('data')) icon = '📊'
        else if (titleLower.includes('game')) icon = '🎮'
        else if (titleLower.includes('mobile') || titleLower.includes('app')) icon = '📱'
      }

      return {
        id: course.id,
        slug: course.slug,
        title: course.title,
        shortTitle,
        language,
        icon,
        order: course.order,
        visible: true
      }
    })
    
    return NextResponse.json({ courses: formattedCourses })
  } catch (error) {
    console.error('Error fetching navbar courses:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}