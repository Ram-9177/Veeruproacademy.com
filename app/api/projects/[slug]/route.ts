import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getProjectBySlug } from '@/src/modules/projects/service'

export const dynamic = 'force-dynamic' as const

// GET /api/projects/[slug] - Fetch single project by slug
export async function GET(
  _request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await auth()
    const userId = session?.user?.id ?? null

    const project = await getProjectBySlug(params.slug, { userId })

    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: project,
    })
  } catch (error) {
    console.error(`[api/projects/${params.slug}] Failed to fetch project`, error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch project' },
      { status: 500 }
    )
  }
}
