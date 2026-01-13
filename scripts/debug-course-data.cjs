
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const slug = 'complete-web-development-mastery'
  console.log(`Checking data for course slug: ${slug}`)

  // 1. Check Course
  const course = await prisma.course.findUnique({
    where: { slug },
    select: { id: true, title: true, status: true }
  })
  
  if (!course) {
    console.log('❌ Course NOT found in database!')
    return
  }
  console.log('✅ Course found:', course)

  // 2. Check Lessons
  const lessons = await prisma.lesson.findMany({
    where: { courseId: course.id },
    select: { id: true, title: true, status: true, order: true }
  })

  console.log(`Found ${lessons.length} lessons linked to this course:`)
  console.log(JSON.stringify(lessons, null, 2))

  if (lessons.length === 0) {
    console.log('⚠️  No lessons found for this course. This is why the page says "no lessons available".')
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
