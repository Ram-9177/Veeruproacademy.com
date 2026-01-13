
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('Force publishing all courses and lessons...')

  // Publish all courses
  const coursesUpdate = await prisma.course.updateMany({
    data: {
      status: 'PUBLISHED',
      publishedAt: new Date(),
    }
  })
  console.log(`Updated ${coursesUpdate.count} courses to PUBLISHED`)

  // Publish all lessons
  const lessonsUpdate = await prisma.lesson.updateMany({
    data: {
      status: 'PUBLISHED',
      publishedAt: new Date(),
    }
  })
  console.log(`Updated ${lessonsUpdate.count} lessons to PUBLISHED`)

  // Publish all modules
  // Note: Module model doesn't have status, but let's confirm in schema.
  // Schema check: module does not have status.

  console.log('Done!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
