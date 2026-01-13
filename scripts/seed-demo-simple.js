import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function seedDemoData() {
  console.log('🌱 Starting demo data seeding process...')
  console.log('📊 Database URL configured:', process.env.DATABASE_URL ? 'Yes' : 'No')

  try {
    console.log('🔗 Connecting to database...')
    // Create demo users
    const demoUsers = [
      {
        name: 'John Smith',
        email: 'john.smith@example.com',
        passwordHash: await bcrypt.hash('demo123', 10),
        status: 'ACTIVE',
        defaultRole: 'STUDENT'
      },
      {
        name: 'Sarah Johnson',
        email: 'sarah.johnson@example.com',
        passwordHash: await bcrypt.hash('demo123', 10),
        status: 'ACTIVE',
        defaultRole: 'STUDENT'
      },
      {
        name: 'Mike Chen',
        email: 'mike.chen@example.com',
        passwordHash: await bcrypt.hash('demo123', 10),
        status: 'ACTIVE',
        defaultRole: 'MENTOR'
      },
      {
        name: 'Emily Davis',
        email: 'emily.davis@example.com',
        passwordHash: await bcrypt.hash('demo123', 10),
        status: 'ACTIVE',
        defaultRole: 'STUDENT'
      }
    ]

    console.log('👥 Creating demo users...')
    for (const userData of demoUsers) {
      const existingUser = await prisma.user.findUnique({
        where: { email: userData.email }
      })

      if (!existingUser) {
        await prisma.user.create({
          data: userData
        })
        console.log(`   ✅ Created user: ${userData.email}`)
      }
    }

    // Create comprehensive React course
    console.log('📚 Creating comprehensive React course...')
    
    const reactCourse = await prisma.course.upsert({
      where: { slug: 'complete-react-mastery' },
      update: {},
      create: {
        title: 'Complete React Mastery 2024',
        slug: 'complete-react-mastery',
        description: 'Master React from basics to advanced concepts with hands-on projects, real-world examples, and interactive coding exercises.',
        thumbnail: '/course-thumbnails/react-mastery.jpg',
        level: 'Beginner',
        duration: '40 hours',
        price: 0, // FREE
        status: 'PUBLISHED',
        metadata: {
          language: 'JavaScript',
          category: 'Frontend Development',
          tags: ['React', 'JavaScript', 'Frontend', 'Web Development', 'Components', 'Hooks'],
          objectives: [
            'Master React fundamentals and advanced concepts',
            'Build real-world applications with React',
            'Understand component lifecycle and state management',
            'Work with React Hooks and Context API',
            'Implement routing and navigation',
            'Deploy React applications to production'
          ],
          prerequisites: [
            'Basic HTML, CSS, and JavaScript knowledge',
            'Understanding of ES6+ features',
            'Familiarity with npm/yarn package manager'
          ]
        }
      }
    })

    // Create course modules and lessons
    console.log('📖 Creating course modules and lessons...')
    
    const modules = [
      {
        title: 'React Fundamentals',
        description: 'Learn the core concepts of React',
        order: 1,
        lessons: [
          {
            title: 'Introduction to React',
            slug: 'introduction-to-react',
            body: 'React is a powerful JavaScript library for building user interfaces...',
            estimatedMinutes: 15,
            order: 1,
            status: 'PUBLISHED'
          },
          {
            title: 'Setting Up Development Environment',
            slug: 'setting-up-development-environment',
            body: 'Let\'s get your machine ready for React development...',
            estimatedMinutes: 20,
            order: 2,
            status: 'PUBLISHED'
          },
          {
            title: 'Your First React Component',
            slug: 'your-first-react-component',
            body: 'Let\'s dive into creating React components and understand how they work!',
            estimatedMinutes: 25,
            order: 3,
            status: 'PUBLISHED'
          }
        ]
      },
      {
        title: 'Props and State',
        description: 'Understanding data flow in React',
        order: 2,
        lessons: [
          {
            title: 'Understanding Props',
            slug: 'understanding-props',
            body: 'Props (short for "properties") are how we pass data from parent components to child components in React.',
            estimatedMinutes: 30,
            order: 1,
            status: 'PUBLISHED'
          }
        ]
      }
    ]

    for (const moduleData of modules) {
      const module = await prisma.module.upsert({
        where: {
          courseId_slug: {
            courseId: reactCourse.id,
            slug: moduleData.title.toLowerCase().replace(/\s+/g, '-')
          }
        },
        update: {},
        create: {
          title: moduleData.title,
          description: moduleData.description,
          order: moduleData.order,
          courseId: reactCourse.id,
          slug: moduleData.title.toLowerCase().replace(/\s+/g, '-')
        }
      })

      for (const lessonData of moduleData.lessons) {
        await prisma.lesson.upsert({
          where: { slug: lessonData.slug },
          update: {},
          create: {
            ...lessonData,
            courseId: reactCourse.id,
            moduleId: module.id
          }
        })
      }
    }

    // Create demo projects
    console.log('🚀 Creating demo projects...')
    
    const projects = [
      {
        title: 'Todo List App',
        slug: 'todo-list-app',
        description: 'Build a fully functional todo list with React hooks and local storage',
        thumbnail: '/project-thumbnails/todo-app.jpg',
        level: 'Beginner',
        category: 'Frontend Development',
        tools: ['React', 'JavaScript', 'CSS', 'Local Storage'],
        status: 'PUBLISHED',
        price: 0,
        metadata: {
          difficulty: 'Beginner',
          estimatedTime: '2-3 hours',
          technologies: ['React', 'JavaScript', 'CSS', 'Local Storage'],
          isPaid: false
        }
      },
      {
        title: 'Weather Dashboard',
        slug: 'weather-dashboard',
        description: 'Create a weather dashboard with API integration and responsive design',
        thumbnail: '/project-thumbnails/weather-dashboard.jpg',
        level: 'Intermediate',
        category: 'Frontend Development',
        tools: ['React', 'API Integration', 'CSS Grid', 'Responsive Design'],
        status: 'PUBLISHED',
        price: 0,
        metadata: {
          difficulty: 'Intermediate',
          estimatedTime: '4-5 hours',
          technologies: ['React', 'API Integration', 'CSS Grid', 'Responsive Design'],
          isPaid: false
        }
      }
    ]

    for (const projectData of projects) {
      await prisma.project.upsert({
        where: { slug: projectData.slug },
        update: {},
        create: projectData
      })
    }

    // Create realtime events for demo
    console.log('⚡ Creating realtime demo events...')
    
    const realtimeEvents = [
      {
        channel: 'user_activity',
        type: 'user_login',
        entity: 'user',
        payload: JSON.stringify({
          userId: 'demo-user-1',
          userName: 'John Smith',
          timestamp: new Date().toISOString(),
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })
      },
      {
        channel: 'course_activity',
        type: 'course_enrollment',
        entity: 'enrollment',
        payload: JSON.stringify({
          userId: 'demo-user-2',
          userName: 'Sarah Johnson',
          courseId: reactCourse.id,
          courseName: 'Complete React Mastery 2024',
          timestamp: new Date().toISOString()
        })
      },
      {
        channel: 'lesson_activity',
        type: 'lesson_completed',
        entity: 'progress',
        payload: JSON.stringify({
          userId: 'demo-user-1',
          userName: 'John Smith',
          lessonId: 'intro-to-react',
          lessonTitle: 'Introduction to React',
          courseId: reactCourse.id,
          courseName: 'Complete React Mastery 2024',
          completionTime: 15,
          timestamp: new Date().toISOString()
        })
      },
      {
        channel: 'project_activity',
        type: 'project_started',
        entity: 'project',
        payload: JSON.stringify({
          userId: 'demo-user-3',
          userName: 'Mike Chen',
          projectId: 'todo-list-app',
          projectTitle: 'Todo List App',
          timestamp: new Date().toISOString()
        })
      }
    ]

    for (const event of realtimeEvents) {
      await prisma.realtimeEvent.create({
        data: event
      })
    }

    console.log('✅ Demo data seeding completed successfully!')
    console.log('\n📊 Demo Data Summary:')
    console.log('   👥 4 Demo Users Created')
    console.log('   📚 1 Complete React Course with 4 Lessons')
    console.log('   🚀 2 Interactive Projects')
    console.log('   ⚡ 4 Realtime Activity Events')
    console.log('\n🔐 Demo Login Credentials:')
    console.log('   📧 john.smith@example.com / demo123')
    console.log('   📧 sarah.johnson@example.com / demo123')
    console.log('   📧 mike.chen@example.com / demo123 (Mentor)')
    console.log('   📧 emily.davis@example.com / demo123')

  } catch (error) {
    console.error('❌ Error seeding demo data:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run if this is the main module
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('🌱 Starting demo data seeding...')
  seedDemoData()
    .then(() => {
      console.log('🎉 Demo data seeding completed!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('💥 Demo data seeding failed:', error)
      process.exit(1)
    })
}

export { seedDemoData }