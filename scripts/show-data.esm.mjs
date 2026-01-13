import pkg from '../node_modules/@prisma/client/index.js'
const { PrismaClient } = pkg
const prisma = new PrismaClient()

async function main() {
  console.log('Courses:', await prisma.course.findMany({ select: { slug: true, title: true } }))
  console.log('Projects:', await prisma.project.findMany({ select: { slug: true, title: true } }))
  console.log('Users:', await prisma.user.findMany({ select: { email: true, name: true } }))
}

main().catch(console.error).finally(async () => {
  await prisma.$disconnect()
})
