import { PrismaClient, RoleKey } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const email = process.env.ADMIN_EMAIL || 'admin@veerupro.ac'
  const password = process.env.ADMIN_PASSWORD || 'admin123'
  const hashedPassword = await bcrypt.hash(password, 10)

  // Ensure ADMIN role exists
  const adminRole = await prisma.role.upsert({
    where: { key: RoleKey.ADMIN },
    update: {},
    create: {
      key: RoleKey.ADMIN,
      name: 'Administrator',
      description: 'Full platform access',
    },
  })

  const admin = await prisma.user.upsert({
    where: { email },
    update: {
      passwordHash: hashedPassword,
      defaultRole: RoleKey.ADMIN,
      status: 'ACTIVE',
    },
    create: {
      email,
      name: 'Super Admin',
      passwordHash: hashedPassword,
      defaultRole: RoleKey.ADMIN,
      status: 'ACTIVE',
    },
  })

  // Assign ADMIN role
  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: admin.id,
        roleId: adminRole.id,
      },
    },
    update: {},
    create: {
      userId: admin.id,
      roleId: adminRole.id,
      isPrimary: true,
    },
  })

  console.log('✅ Admin user created:', admin.email)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

