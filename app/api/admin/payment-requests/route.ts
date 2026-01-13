import { NextResponse } from 'next/server'
import { ActivityType, ContentType, ProductType, RoleKey, type Prisma } from '@prisma/client'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { parseUnlockMetadata } from '@/src/modules/projects/helpers'
import type { ProjectUnlockMetadata } from '@/src/modules/projects/types'

export const dynamic = 'force-dynamic'

type AdminStatus = 'pending' | 'approved' | 'rejected'

const ADMIN_STATUSES: AdminStatus[] = ['pending', 'approved', 'rejected']

export type PaymentRequestDto = {
  id: string
  orderId: string
  userEmail: string | null
  userName: string | null
  amount: number
  screenshotUrl: string | null
  status: Exclude<AdminStatus, 'pending'> | 'pending'
  submittedAt: string | null
  itemType: 'PROJECT' | 'COURSE'
  project: {
    id: string
    slug: string
    title: string
  } | null
  course: {
    id: string
    slug: string
    title: string
  } | null
  notes?: string | null
}

function mapMetadata(metadata: ProjectUnlockMetadata | null) {
  if (!metadata) {
    return {
      status: 'pending' as AdminStatus,
      submittedAt: null as string | null,
      screenshotUrl: null as string | null,
      notes: null as string | null,
    }
  }

  return {
    status: (metadata.status as AdminStatus) ?? 'pending',
    submittedAt: metadata.submittedAt ?? null,
    screenshotUrl: metadata.proofUrl ?? null,
    notes: metadata.notes ?? null,
  }
}

function toDto(args: {
  savedItem: {
    id: string
    userId: string
    itemId: string
    itemType: ProductType
    metadata: unknown | null
  }
  user: { name: string | null; email: string | null } | null
  project: { id: string; slug: string; title: string; price: number } | null
  course: { id: string; slug: string; title: string; price: number } | null
}): PaymentRequestDto {
  const raw = parseUnlockMetadata(args.savedItem.metadata as Prisma.JsonValue | null)
  const m = mapMetadata(raw)

  const itemType = args.savedItem.itemType
  const amount = itemType === ProductType.COURSE ? args.course?.price ?? 0 : args.project?.price ?? 0

  return {
    id: args.savedItem.id,
    orderId: args.savedItem.id,
    userEmail: args.user?.email ?? null,
    userName: args.user?.name ?? null,
    amount,
    screenshotUrl: m.screenshotUrl,
    status: m.status,
    submittedAt: m.submittedAt,
    itemType: itemType === ProductType.COURSE ? 'COURSE' : 'PROJECT',
    project: args.project
      ? {
          id: args.project.id,
          slug: args.project.slug,
          title: args.project.title,
        }
      : null,
    course: args.course
      ? {
          id: args.course.id,
          slug: args.course.slug,
          title: args.course.title,
        }
      : null,
    notes: m.notes ?? null,
  }
}

export async function GET() {
  try {
    const session = await auth()
    const roles = (session?.user as { roles?: RoleKey[] } | null)?.roles ?? []

    if (!session?.user || !roles.includes(RoleKey.ADMIN)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const savedItems = await prisma.savedItem.findMany({
      where: {
        itemType: {
          in: [ProductType.PROJECT, ProductType.COURSE],
        },
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    const projectIds = Array.from(
      new Set(savedItems.filter((s) => s.itemType === ProductType.PROJECT).map((s) => s.itemId)),
    )
    const courseIds = Array.from(
      new Set(savedItems.filter((s) => s.itemType === ProductType.COURSE).map((s) => s.itemId)),
    )

    const [projects, courses] = await Promise.all([
      projectIds.length
        ? prisma.project.findMany({
            where: { id: { in: projectIds } },
            select: { id: true, slug: true, title: true, price: true },
          })
        : Promise.resolve([]),
      courseIds.length
        ? prisma.course.findMany({
            where: { id: { in: courseIds } },
            select: { id: true, slug: true, title: true, price: true },
          })
        : Promise.resolve([]),
    ])

    const projectMap = new Map(projects.map((p) => [p.id, p]))
    const courseMap = new Map(courses.map((c) => [c.id, c]))

    const filtered = savedItems.filter((item) => {
      const metadata = parseUnlockMetadata(item.metadata as Prisma.JsonValue | null)
      if (!metadata) return false
      return ADMIN_STATUSES.includes(metadata.status as AdminStatus)
    })

    const data: PaymentRequestDto[] = filtered.map((savedItem) =>
      toDto({
        savedItem,
        user: savedItem.user,
        project: savedItem.itemType === ProductType.PROJECT ? projectMap.get(savedItem.itemId) ?? null : null,
        course: savedItem.itemType === ProductType.COURSE ? courseMap.get(savedItem.itemId) ?? null : null,
      }),
    )

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('[api/admin/payment-requests] Failed to list payment requests', error)
    return NextResponse.json(
      { success: false, error: 'Unable to load payment requests' },
      { status: 500 },
    )
  }
}

type PatchBody = {
  id: string
  status: Exclude<AdminStatus, 'pending'>
  adminNotes?: string | null
}

export async function PATCH(request: Request) {
  try {
    const session = await auth()
    const roles = (session?.user as { roles?: RoleKey[] } | null)?.roles ?? []

    if (!session?.user || !roles.includes(RoleKey.ADMIN)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = (await request.json()) as PatchBody | null

    if (!body?.id || !body.status || !['approved', 'rejected'].includes(body.status)) {
      return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 })
    }

    const savedItem = await prisma.savedItem.findUnique({
      where: { id: body.id },
    })

    if (!savedItem) {
      return NextResponse.json({ success: false, error: 'Payment request not found' }, { status: 404 })
    }

    const previousMetadata =
      parseUnlockMetadata(savedItem.metadata as Prisma.JsonValue | null) ?? ({} as ProjectUnlockMetadata)

    const nowIso = new Date().toISOString()

    const nextMetadata: ProjectUnlockMetadata = {
      ...previousMetadata,
      status: body.status,
      notes: body.adminNotes ?? previousMetadata.notes,
      proofUrl: previousMetadata.proofUrl,
      submittedAt: previousMetadata.submittedAt ?? nowIso,
      verifiedAt: nowIso,
      verifierId: session.user.id,
      source: previousMetadata.source ?? 'manual',
    }

    const updated = await prisma.savedItem.update({
      where: { id: savedItem.id },
      data: { metadata: nextMetadata as Prisma.InputJsonValue },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    })

    const [project, course] = await Promise.all([
      savedItem.itemType === ProductType.PROJECT
        ? prisma.project.findUnique({
            where: { id: savedItem.itemId },
            select: { id: true, slug: true, title: true, price: true },
          })
        : Promise.resolve(null),
      savedItem.itemType === ProductType.COURSE
        ? prisma.course.findUnique({
            where: { id: savedItem.itemId },
            select: { id: true, slug: true, title: true, price: true },
          })
        : Promise.resolve(null),
    ])

    if (savedItem.itemType === ProductType.COURSE && body.status === 'approved') {
      await prisma.enrollment.upsert({
        where: {
          userId_courseId: {
            userId: savedItem.userId,
            courseId: savedItem.itemId,
          },
        },
        update: {},
        create: {
          userId: savedItem.userId,
          courseId: savedItem.itemId,
          status: 'ACTIVE',
          startedAt: new Date(),
        },
      })

      await prisma.courseProgress.upsert({
        where: {
          userId_courseId: {
            userId: savedItem.userId,
            courseId: savedItem.itemId,
          },
        },
        update: {},
        create: {
          userId: savedItem.userId,
          courseId: savedItem.itemId,
          completedLessons: 0,
          totalLessons: 0,
          progressPercent: 0,
        },
      })
    }

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: ActivityType.PAYMENT as any,
        contentType: savedItem.itemType === ProductType.COURSE ? ContentType.COURSE : ContentType.PROJECT,
        contentId: savedItem.itemId,
        details: {
          kind: 'payment_request',
          paymentRequestId: savedItem.id,
          status: body.status,
          previous: previousMetadata,
          next: nextMetadata,
          adminNotes: body.adminNotes ?? null,
        } as Prisma.InputJsonValue,
      },
    })

    const dto = toDto({
      savedItem: updated,
      user: updated.user,
      project,
      course,
    })

    return NextResponse.json({ success: true, data: dto })
  } catch (error) {
    console.error('[api/admin/payment-requests] Failed to update payment request', error)
    return NextResponse.json(
      { success: false, error: 'Unable to update payment request' },
      { status: 500 },
    )
  }
}
