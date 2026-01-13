import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testRealtimeMonitoring() {
  console.log('🧪 Testing realtime monitoring functionality...')

  try {
    // Test 1: Check if demo data exists
    console.log('\n📊 Checking demo data...')
    
    const userCount = await prisma.user.count()
    const courseCount = await prisma.course.count()
    const projectCount = await prisma.project.count()
    const eventCount = await prisma.realtimeEvent.count()
    
    console.log(`   👥 Users: ${userCount}`)
    console.log(`   📚 Courses: ${courseCount}`)
    console.log(`   🚀 Projects: ${projectCount}`)
    console.log(`   ⚡ Realtime Events: ${eventCount}`)

    // Test 2: Create a new realtime event
    console.log('\n⚡ Creating test realtime event...')
    
    const testEvent = await prisma.realtimeEvent.create({
      data: {
        channel: 'test_activity',
        type: 'test_event',
        entity: 'test',
        payload: {
          message: 'This is a test event for realtime monitoring',
          timestamp: new Date().toISOString(),
          testId: Math.random().toString(36).substr(2, 9)
        }
      }
    })
    
    console.log(`   ✅ Created test event with ID: ${testEvent.id}`)

    // Test 3: Fetch recent events (like the API would)
    console.log('\n📋 Fetching recent events...')
    
    const recentEvents = await prisma.realtimeEvent.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5
    })
    
    console.log(`   📊 Found ${recentEvents.length} recent events:`)
    recentEvents.forEach((event, index) => {
      console.log(`   ${index + 1}. [${event.type}] ${event.channel} - ${new Date(event.createdAt).toLocaleTimeString()}`)
    })

    // Test 4: Test the monitoring API endpoint
    console.log('\n🌐 Testing monitoring API endpoint...')
    
    try {
      const response = await fetch('http://localhost:3000/api/admin/realtime-monitoring', {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      if (response.status === 401) {
        console.log('   ⚠️  API requires authentication (expected)')
      } else if (response.ok) {
        const data = await response.json()
        console.log('   ✅ API response received:', {
          totalUsers: data.totalUsers,
          totalCourses: data.totalCourses,
          totalProjects: data.totalProjects,
          recentActivities: data.recentActivities?.length || 0
        })
      } else {
        console.log(`   ❌ API returned status: ${response.status}`)
      }
    } catch (apiError) {
      console.log('   ⚠️  API test failed (server might not be running):', apiError.message)
    }

    console.log('\n✅ Realtime monitoring test completed!')
    console.log('\n📝 Next steps:')
    console.log('   1. Login to admin panel: http://localhost:3000/admin/login')
    console.log('   2. Use credentials: admin@veerupro.com / VeeruPro2024!')
    console.log('   3. Navigate to: http://localhost:3000/admin/realtime')
    console.log('   4. View the live realtime monitoring dashboard')

  } catch (error) {
    console.error('❌ Test failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the test
testRealtimeMonitoring()