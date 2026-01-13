#!/usr/bin/env node

/**
 * PRODUCTION SETUP SCRIPT
 * 
 * This script prepares the application for production by:
 * 1. Setting up the database schema
 * 2. Creating default admin user
 * 3. Seeding initial data
 * 4. Verifying all systems
 */

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function setupDatabase() {
  console.log('🔄 Setting up database...')
  
  try {
    // Test database connection
    await prisma.$connect()
    console.log('✅ Database connection successful')
    
    // Create core roles
    const roles = [
      { key: 'ADMIN', name: 'Administrator', description: 'Full platform access' },
      { key: 'MENTOR', name: 'Mentor', description: 'Can mentor students and review assignments' },
      { key: 'STUDENT', name: 'Student', description: 'Default role for learners' }
    ]
    
    for (const role of roles) {
      await prisma.role.upsert({
        where: { key: role.key },
        create: role,
        update: { name: role.name, description: role.description }
      })
    }
    console.log('✅ Core roles created')
    
    // Create default admin user
    const adminEmail = 'admin@veerupro.com'
    const adminPassword = 'VeeruPro2024!'
    
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail }
    })
    
    if (!existingAdmin) {
      const passwordHash = await bcrypt.hash(adminPassword, 12)
      
      const adminUser = await prisma.user.create({
        data: {
          name: 'Veeru Pro Admin',
          email: adminEmail,
          passwordHash,
          status: 'ACTIVE',
          defaultRole: 'ADMIN',
          emailVerifiedAt: new Date()
        }
      })
      
      // Assign admin role
      const adminRole = await prisma.role.findUnique({ where: { key: 'ADMIN' } })
      await prisma.userRole.create({
        data: {
          userId: adminUser.id,
          roleId: adminRole.id,
          isPrimary: true
        }
      })
      
      console.log('✅ Default admin user created')
      console.log(`   Email: ${adminEmail}`)
      console.log(`   Password: ${adminPassword}`)
      console.log('   🚨 CHANGE THIS PASSWORD IMMEDIATELY IN PRODUCTION!')
    } else {
      console.log('✅ Admin user already exists')
    }
    
    // Create course categories
    const categories = [
      { slug: 'web-development', name: 'Web Development', description: 'Frontend and backend web technologies' },
      { slug: 'programming', name: 'Programming', description: 'Core programming languages and concepts' },
      { slug: 'data-science', name: 'Data Science', description: 'Data analysis and machine learning' },
      { slug: 'mobile-development', name: 'Mobile Development', description: 'iOS and Android app development' }
    ]
    
    for (const category of categories) {
      await prisma.courseCategory.upsert({
        where: { slug: category.slug },
        create: category,
        update: { name: category.name, description: category.description }
      })
    }
    console.log('✅ Course categories created')
    
    console.log('🎉 Database setup completed successfully!')
    
  } catch (error) {
    console.error('❌ Database setup failed:', error)
    throw error
  }
}

async function verifySetup() {
  console.log('🔄 Verifying setup...')
  
  try {
    // Check roles
    const roleCount = await prisma.role.count()
    console.log(`✅ Roles: ${roleCount} found`)
    
    // Check admin user
    const adminCount = await prisma.user.count({
      where: { 
        roles: {
          some: {
            role: { key: 'ADMIN' }
          }
        }
      }
    })
    console.log(`✅ Admin users: ${adminCount} found`)
    
    // Check categories
    const categoryCount = await prisma.courseCategory.count()
    console.log(`✅ Categories: ${categoryCount} found`)
    
    console.log('🎉 Setup verification completed!')
    
  } catch (error) {
    console.error('❌ Setup verification failed:', error)
    throw error
  }
}

async function main() {
  console.log('🚀 Starting production setup...')
  console.log('=====================================')
  
  try {
    await setupDatabase()
    await verifySetup()
    
    console.log('=====================================')
    console.log('🎉 PRODUCTION SETUP COMPLETED!')
    console.log('=====================================')
    console.log('')
    console.log('Next steps:')
    console.log('1. Change the default admin password')
    console.log('2. Configure your domain in environment variables')
    console.log('3. Set up your payment gateway (if needed)')
    console.log('4. Deploy to your hosting platform')
    console.log('')
    
  } catch (error) {
    console.error('❌ Production setup failed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()