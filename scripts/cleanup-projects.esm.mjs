import pkg from '../node_modules/@prisma/client/index.js'
const { PrismaClient } = pkg
const prisma = new PrismaClient()
async function main() {
  const delProjects = await prisma.project.deleteMany({ where: { slug: { in: ['todo-list-app', 'weather-dashboard'] } } })
  console.log({ delProjects })
}
main().catch((e)=>{console.error(e);process.exit(1)}).finally(async()=>{await prisma.$disconnect()})
