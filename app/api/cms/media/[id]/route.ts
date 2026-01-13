import { NextRequest, NextResponse } from 'next/server'
import { RoleKey } from '@prisma/client'

import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'
import { utApi } from '@/app/api/uploadthing/core'
import { isAdminOrMentor } from '@/lib/auth-utils'

function ensureAdminOrMentor(session: any): session is { user: { id: string; roles?: RoleKey[] } } {
  const roles = (session?.user as { roles?: RoleKey[] } | null)?.roles ?? []
  return Boolean(session?.user && isAdminOrMentor(roles))
}

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth()
    if (!ensureAdminOrMentor(session)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const media = await prisma.media.findUnique({ where: { id: params.id } })
    if (!media) {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: media })
  } catch (error) {
    console.error(`[api/cms/media/${params.id}] Failed to fetch media`, error)
    return NextResponse.json({ success: false, error: 'Unable to fetch media' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth()
    if (!ensureAdminOrMentor(session)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const media = await prisma.media.findUnique({
      where: { id: params.id },
    })

    if (!media) {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })
    }

    // Extract file key from URL for UploadThing deletion
    try {
      const urlParts = media.url.split('/')
      const fileKey = urlParts[urlParts.length - 1]
      if (fileKey) {
        await utApi.deleteFiles([fileKey])
      }
    } catch (err) {
      console.warn('[api/cms/media] Failed to delete from UploadThing', err)
    }

    await prisma.media.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(`[api/cms/media/${params.id}] Failed to delete media`, error)
    return NextResponse.json({ success: false, error: 'Unable to delete media' }, { status: 500 })
  }
}
