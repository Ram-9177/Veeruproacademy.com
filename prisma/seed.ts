import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Hash admin password
  const hashedPassword = await bcrypt.hash('Admin@123456', 10);

  // Create or update admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@veerupro.ac' },
    update: {
passwordHash: hashedPassword,     
    },
    create: {
      email: 'admin@veerupro.ac',
      name: 'Admin',
passwordHash: hashedPassword,     
    },
  });

    // Ensure ADMIN role exists
  const adminRole = await prisma.role.upsert({
    where: { key: 'ADMIN' },
    create: { key: 'ADMIN', name: 'Administrator', description: 'Full platform access' },
    update: {}
  });

  // Assign ADMIN role to the admin user
  await prisma.userRole.create({
    data: {
      userId: admin.id,
      roleId: adminRole.id,
      isPrimary: true
    }
  }).catch(() => {}); // Ignore if role already assigned

  console.log('Admin user created/updated:', admin);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
