import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch user project submissions. Some schemas may not include a projectSubmission model.
    const submissions = [] as any[]
    const projectSubmissionModel = (prisma as any).projectSubmission
    if (projectSubmissionModel && typeof projectSubmissionModel.findMany === 'function') {
      const rows = await projectSubmissionModel.findMany({
        where: { userId: session.user.id },
        include: {
          project: {
            select: {
              id: true,
              title: true,
              description: true,
              courseSlug: true
            }
          }
        },
        orderBy: { submittedAt: 'desc' }
      })
      submissions.push(...rows)
    }

    // Transform to match frontend interface
    const userProjects = submissions.map((submission: any) => ({
      id: submission.project?.id,
      title: submission.project?.title,
      description: submission.project?.description,
      status: submission.status as 'in-progress' | 'completed' | 'submitted',
      courseSlug: submission.project?.courseSlug,
      submittedAt: submission.submittedAt?.toISOString?.(),
      grade: submission.grade
    }))

    return NextResponse.json(userProjects)
  } catch (error) {
    console.error('Error fetching user projects:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}