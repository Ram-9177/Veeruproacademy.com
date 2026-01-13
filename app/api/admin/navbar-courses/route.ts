import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { isAdmin } from '@/lib/auth-utils'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const session = await auth()
    // SECURITY: Proper role checking with auth-utils
    if (!session?.user || !isAdmin(session.user.roles || [])) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // SECURITY: Replace in-memory storage with database queries
    const navbarCourses = await prisma.course.findMany({
      where: {
        status: 'PUBLISHED'
      },
      select: {
        id: true,
        slug: true,
        title: true,
        metadata: true
      },
      orderBy: {
        createdAt: 'asc'
      },
      take: 10
    })

    const formattedCourses = navbarCourses.map((course, index) => ({
      id: course.id,
      slug: course.slug,
      title: course.title,
      icon: (course.metadata as any)?.icon || '📚',
      order: (course.metadata as any)?.navbarOrder ?? index,
      visible: (course.metadata as any)?.showInNavbar ?? true
    }))

    return NextResponse.json({ courses: formattedCourses })
  } catch (error: any) {
    console.error('Error fetching navbar courses:', error)
    if (error?.code === 'P1001') {
      return NextResponse.json({ courses: [], warning: 'Database unreachable; showing empty list.' }, { status: 200 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    // SECURITY: Proper role checking with auth-utils
    if (!session?.user || !isAdmin(session.user.roles || [])) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { slug, title, icon, order = 0, visible = true } = body

    // SECURITY: Input validation
    if (!slug || !title || typeof slug !== 'string' || typeof title !== 'string') {
      return NextResponse.json({ error: 'Slug and title are required and must be strings' }, { status: 400 })
    }

    if (slug.length > 100 || title.length > 200) {
      return NextResponse.json({ error: 'Slug or title too long' }, { status: 400 })
    }

    // SECURITY: Replace in-memory storage with database operations
    const newCourse = await prisma.course.create({
      data: {
        slug,
        title,
        description: `Course: ${title}`,
        level: 'BEGINNER',
        price: 0, // Free course
        status: 'PUBLISHED',
        metadata: {
          icon: icon || '📚',
          navbarOrder: order,
          showInNavbar: visible,
          estimatedHours: 10
        }
      }
    })

    return NextResponse.json({ 
      success: true, 
      course: {
        id: newCourse.id,
        slug: newCourse.slug,
        title: newCourse.title,
        icon: (newCourse.metadata as any)?.icon || '📚',
        order: (newCourse.metadata as any)?.navbarOrder || 0,
        visible: (newCourse.metadata as any)?.showInNavbar || true
      }
    })
  } catch (error) {
    console.error('Error creating navbar course:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth()
    // SECURITY: Proper role checking with auth-utils
    if (!session?.user || !isAdmin(session.user.roles || [])) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, slug, title, icon, order, visible } = body

    // SECURITY: Input validation
    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'Valid course ID is required' }, { status: 400 })
    }

    if (slug && (typeof slug !== 'string' || slug.length > 100)) {
      return NextResponse.json({ error: 'Invalid slug format' }, { status: 400 })
    }

    if (title && (typeof title !== 'string' || title.length > 200)) {
      return NextResponse.json({ error: 'Invalid title format' }, { status: 400 })
    }

    const current = await prisma.course.findUnique({
      where: { id },
      select: { metadata: true, slug: true, title: true }
    })
    if (!current) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    const mergedMetadata: Record<string, any> = {
      ...(current.metadata as any),
    }
    if (icon !== undefined) mergedMetadata.icon = icon
    if (order !== undefined) mergedMetadata.navbarOrder = order
    if (visible !== undefined) mergedMetadata.showInNavbar = visible

    const updatedCourse = await prisma.course.update({
      where: { id },
      data: {
        ...(slug && { slug }),
        ...(title && { title }),
        metadata: mergedMetadata
      }
    })

    return NextResponse.json({
      success: true,
      course: {
        id: updatedCourse.id,
        slug: updatedCourse.slug,
        title: updatedCourse.title,
        icon: (updatedCourse.metadata as any)?.icon || '📚',
        order: (updatedCourse.metadata as any)?.navbarOrder || 0,
        visible: (updatedCourse.metadata as any)?.showInNavbar ?? true
      }
    })
  } catch (error: any) {
    console.error('Error updating navbar course:', error)
    if (error?.code === 'P2025') {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
