import pkg from '../node_modules/@prisma/client/index.js'
const { PrismaClient } = pkg
const prisma = new PrismaClient()

async function main() {
  const delCourses = await prisma.course.deleteMany({
    where: {
      OR: [
        { slug: { startsWith: 'playwright-course' } },
        { slug: 'test-python' }
      ]
    }
  })

  const delUsers = await prisma.user.deleteMany({
    where: {
      OR: [
        { email: { contains: 'example.com' } },
        { email: { startsWith: 'comp_student' } },
        { name: { contains: 'Comprehensive Student' } }
      ],
      NOT: {
        email: { in: ['admin@veerupro.ac', 'admin@veerupro.com', 'sriram.polakam@gmail.com'] }
      }
    }
  })

  console.log({ delCourses, delUsers })
}

main().catch((e) => { console.error(e); process.exit(1) }).finally(async () => {
  await prisma.$disconnect()
})
