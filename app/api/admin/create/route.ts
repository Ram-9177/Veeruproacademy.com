import { NextResponse } from 'next/server'
import { RoleKey } from '@prisma/client'
import bcrypt from 'bcryptjs'

import { prisma, hasValidDatabaseUrl } from '@/lib/db'

export async function POST(req: Request) {
  try {
    if (!hasValidDatabaseUrl) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
    }

    const token = process.env.ADMIN_SETUP_TOKEN
    const provided = req.headers.get('x-admin-setup-token') || ''
    if (!token || provided !== token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const email: string = body?.email
    const password: string = body?.password

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
    }

    const normalizedEmail = email.toLowerCase().trim()
    if (!normalizedEmail) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 })
    }

    const existing = await prisma.user.findFirst({
      where: {
        email: {
          equals: normalizedEmail,
          mode: 'insensitive'
        }
      }
    })

    const passwordHash = await bcrypt.hash(password, 12)

    const adminRole = await prisma.role.upsert({
      where: { key: RoleKey.ADMIN },
      create: {
        key: RoleKey.ADMIN,
        name: 'Administrator',
        description: 'Full platform access with permission to manage users, content, and billing.'
      },
      update: {
        name: 'Administrator',
        description: 'Full platform access with permission to manage users, content, and billing.'
      }
    })

    const user = existing
      ? await prisma.user.update({
          where: { id: existing.id },
          data: {
            email: normalizedEmail,
            passwordHash,
            name: existing.name ?? 'Admin',
            emailVerifiedAt: existing.emailVerifiedAt ?? new Date(),
            status: 'ACTIVE',
            defaultRole: RoleKey.ADMIN
          }
        })
      : await prisma.user.create({
          data: {
            email: normalizedEmail,
            passwordHash,
            name: 'Admin',
            emailVerifiedAt: new Date(),
            status: 'ACTIVE',
            defaultRole: RoleKey.ADMIN
          }
        })

    await prisma.userRole.upsert({
      where: { userId_roleId: { userId: user.id, roleId: adminRole.id } },
      create: {
        userId: user.id,
        roleId: adminRole.id,
        isPrimary: true
      },
      update: {
        isPrimary: true
      }
    })

    return NextResponse.json({ success: true, id: user.id, repaired: Boolean(existing) })
  } catch (e: any) {
    console.error('Admin create error:', e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
