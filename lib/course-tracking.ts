/**
 * COURSE TRACKING SYSTEM
 * 
 * Comprehensive tracking for courses, lessons, and user progress
 */

import { prisma } from '@/lib/db'

export interface CourseProgress {
  courseId: string
  userId: string
  completedLessons: number
  totalLessons: number
  progressPercent: number
  lastViewedLessonId?: string
  enrolledAt: Date
  completedAt?: Date
}

export interface LessonProgress {
  lessonId: string
  userId: string
  completed: boolean
  completedAt?: Date
  timeSpent?: number
  notesCount: number
}

/**
 * Enroll user in a course
 */
export async function enrollUserInCourse(userId: string, courseId: string) {
  try {
    // SECURITY: Input validation
    if (!userId || !courseId || typeof userId !== 'string' || typeof courseId !== 'string') {
      return { success: false, message: 'Valid userId and courseId are required' }
    }

    if (userId.length > 50 || courseId.length > 50) {
      return { success: false, message: 'Invalid userId or courseId format' }
    }
    // SECURITY: Use database transaction for data consistency
    const result = await prisma.$transaction(async (tx) => {
      // Check if already enrolled
      const existingEnrollment = await tx.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId,
            courseId
          }
        }
      })

      if (existingEnrollment) {
        throw new Error('Already enrolled in this course')
      }

      // Verify course exists and is available
      const course = await tx.course.findUnique({
        where: { id: courseId },
        include: { lessons: true }
      })

      if (!course) {
        throw new Error('Course not found')
      }

      if (course.status !== 'PUBLISHED') {
        throw new Error('Course is not available for enrollment')
      }

      // Create enrollment
      const enrollment = await tx.enrollment.create({
        data: {
          userId,
          courseId,
          status: 'ACTIVE',
          startedAt: new Date()
        }
      })

      // Initialize course progress
      await tx.courseProgress.create({
        data: {
          userId,
          courseId,
          completedLessons: 0,
          totalLessons: course.lessons.length,
          progressPercent: 0
        }
      })

      // Log activity
      await tx.activityLog.create({
        data: {
          userId,
          type: 'COURSE_PROGRESS',
          message: `Enrolled in course: ${course.title}`,
          data: { courseId, action: 'enrolled' }
        }
      })

      return { enrollment, course }
    })

    return { success: true, enrollment: result.enrollment }
  } catch (error: any) {
    console.error('Error enrolling user in course:', error)
    return { 
      success: false, 
      message: error?.message || 'Failed to enroll in course' 
    }
  }
}

/**
 * Mark lesson as completed
 */
export async function markLessonCompleted(userId: string, lessonId: string) {
  try {
    // SECURITY: Input validation
    if (!userId || !lessonId || typeof userId !== 'string' || typeof lessonId !== 'string') {
      return { success: false, message: 'Valid userId and lessonId are required' }
    }

    if (userId.length > 50 || lessonId.length > 50) {
      return { success: false, message: 'Invalid userId or lessonId format' }
    }
    // Get lesson and course info
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { course: true }
    })

    if (!lesson || !lesson.courseId) {
      return { success: false, message: 'Lesson not found' }
    }

    // Check if user is enrolled
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId: lesson.courseId
        }
      }
    })

    if (!enrollment) {
      return { success: false, message: 'Not enrolled in this course' }
    }

    // Mark lesson as completed
    const lessonProgress = await prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId,
          lessonId
        }
      },
      create: {
        userId,
        lessonId,
        completed: true,
        completedAt: new Date()
      },
      update: {
        completed: true,
        completedAt: new Date()
      }
    })

    // Update course progress
    await updateCourseProgress(userId, lesson.courseId)

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId,
        type: 'LESSON_COMPLETED',
        message: `Completed lesson: ${lesson.title}`,
        data: { lessonId, courseId: lesson.courseId }
      }
    })

    return { success: true, lessonProgress }
  } catch (error) {
    console.error('Error marking lesson as completed:', error)
    return { success: false, message: 'Failed to mark lesson as completed' }
  }
}

/**
 * Update course progress based on completed lessons
 */
export async function updateCourseProgress(userId: string, courseId: string) {
  try {
    // Get all lessons for the course
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: { lessons: true }
    })

    if (!course) {
      return { success: false, message: 'Course not found' }
    }

    // Count completed lessons
    const completedLessons = await prisma.lessonProgress.count({
      where: {
        userId,
        lessonId: { in: course.lessons.map(l => l.id) },
        completed: true
      }
    })

    const totalLessons = course.lessons.length
    const progressPercent = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0

    // Update course progress
    const courseProgress = await prisma.courseProgress.upsert({
      where: {
        userId_courseId: {
          userId,
          courseId
        }
      },
      create: {
        userId,
        courseId,
        completedLessons,
        totalLessons,
        progressPercent
      },
      update: {
        completedLessons,
        totalLessons,
        progressPercent,
        updatedAt: new Date()
      }
    })

    // Check if course is completed
    if (progressPercent === 100) {
      await prisma.enrollment.update({
        where: {
          userId_courseId: {
            userId,
            courseId
          }
        },
        data: {
          status: 'COMPLETED',
          completedAt: new Date()
        }
      })

      // Generate certificate
      await generateCertificate(userId, courseId)

      // Log completion
      await prisma.activityLog.create({
        data: {
          userId,
          type: 'COURSE_PROGRESS',
          message: `Completed course: ${course.title}`,
          data: { courseId, action: 'completed' }
        }
      })
    }

    return { success: true, courseProgress }
  } catch (error) {
    console.error('Error updating course progress:', error)
    return { success: false, message: 'Failed to update course progress' }
  }
}

/**
 * Generate certificate for completed course
 */
export async function generateCertificate(userId: string, courseId: string) {
  try {
    // SECURITY: Input validation
    if (!userId || !courseId || typeof userId !== 'string' || typeof courseId !== 'string') {
      return { success: false, message: 'Valid userId and courseId are required' }
    }

    const user = await prisma.user.findUnique({ where: { id: userId } })
    const course = await prisma.course.findUnique({ where: { id: courseId } })

    if (!user || !course) {
      return { success: false, message: 'User or course not found' }
    }

    // SECURITY: Verify course completion before issuing certificate
    const courseProgress = await prisma.courseProgress.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId
        }
      }
    })

    if (!courseProgress || courseProgress.progressPercent < 100) {
      return { success: false, message: 'Course must be 100% completed to receive certificate' }
    }

    // Check if certificate already exists
    const existingCertificate = await prisma.certificate.findFirst({
      where: { userId, courseId }
    })

    if (existingCertificate) {
      return { success: true, certificate: existingCertificate }
    }

    // Generate unique certificate number with verification hash
    const certificateNumber = `VP-${Date.now()}-${userId.slice(-4).toUpperCase()}`
    const verificationHash = await generateCertificateHash(certificateNumber, userId, courseId)

    const certificate = await prisma.certificate.create({
      data: {
        userId,
        courseId,
        certificateNumber,
        issuedAt: new Date(),
        metadata: {
          courseName: course.title,
          userName: user.name,
          completionDate: new Date().toISOString(),
          issuer: 'Veeru\'s Pro Academy',
          verificationHash
        }
      }
    })

    // Log certificate issuance
    await prisma.activityLog.create({
      data: {
        userId,
        type: 'CERTIFICATE_ISSUED',
        message: `Certificate issued for course: ${course.title}`,
        data: { courseId, certificateNumber, verificationHash }
      }
    })

    return { success: true, certificate }
  } catch (error) {
    console.error('Error generating certificate:', error)
    return { success: false, message: 'Failed to generate certificate' }
  }
}

/**
 * Generate certificate verification hash
 */
async function generateCertificateHash(certificateNumber: string, userId: string, courseId: string): Promise<string> {
  const crypto = await import('crypto')
  const data = `${certificateNumber}-${userId}-${courseId}-${process.env.NEXTAUTH_SECRET}`
  return crypto.createHash('sha256').update(data).digest('hex')
}

/**
 * Verify certificate authenticity
 */
export async function verifyCertificate(certificateNumber: string): Promise<{ valid: boolean; certificate?: any; message: string }> {
  try {
    // SECURITY: Input validation
    if (!certificateNumber || typeof certificateNumber !== 'string') {
      return { valid: false, message: 'Valid certificate number is required' }
    }

    const certificate = await prisma.certificate.findUnique({
      where: { certificateNumber },
      include: {
        user: {
          select: { name: true, email: true }
        },
        course: {
          select: { title: true, slug: true }
        }
      }
    })

    if (!certificate) {
      return { valid: false, message: 'Certificate not found' }
    }

    // Verify hash
    const expectedHash = await generateCertificateHash(
      certificate.certificateNumber,
      certificate.userId,
      certificate.courseId
    )

    const storedHash = (certificate.metadata as any)?.verificationHash

    if (storedHash !== expectedHash) {
      return { valid: false, message: 'Certificate verification failed - invalid hash' }
    }

    return {
      valid: true,
      certificate: {
        certificateNumber: certificate.certificateNumber,
        userName: certificate.user.name,
        courseName: certificate.course.title,
        issuedAt: certificate.issuedAt,
        metadata: certificate.metadata
      },
      message: 'Certificate is valid and authentic'
    }
  } catch (error) {
    console.error('Error verifying certificate:', error)
    return { valid: false, message: 'Certificate verification failed' }
  }
}

/**
 * Get user's course progress
 */
export async function getUserCourseProgress(userId: string, courseId?: string) {
  try {
    const where = courseId ? { userId, courseId } : { userId }

    const progress = await prisma.courseProgress.findMany({
      where,
      include: {
        course: {
          select: {
            id: true,
            title: true,
            thumbnail: true,
            slug: true
          }
        }
      },
      orderBy: { updatedAt: 'desc' }
    })

    return { success: true, progress }
  } catch (error) {
    console.error('Error getting user course progress:', error)
    return { success: false, message: 'Failed to get course progress' }
  }
}

/**
 * Get user's lesson progress for a course
 */
export async function getUserLessonProgress(userId: string, courseId: string) {
  try {
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        lessons: {
          include: {
            progress: {
              where: { userId }
            }
          },
          orderBy: { order: 'asc' }
        }
      }
    })

    if (!course) {
      return { success: false, message: 'Course not found' }
    }

    const lessonsWithProgress = course.lessons.map(lesson => ({
      id: lesson.id,
      title: lesson.title,
      slug: lesson.slug,
      order: lesson.order,
      estimatedMinutes: lesson.estimatedMinutes,
      completed: lesson.progress[0]?.completed || false,
      completedAt: lesson.progress[0]?.completedAt || null
    }))

    return { success: true, lessons: lessonsWithProgress }
  } catch (error) {
    console.error('Error getting user lesson progress:', error)
    return { success: false, message: 'Failed to get lesson progress' }
  }
}

/**
 * Get user's certificates
 */
export async function getUserCertificates(userId: string) {
  try {
    const certificates = await prisma.certificate.findMany({
      where: { userId },
      include: {
        course: {
          select: {
            title: true,
            thumbnail: true
          }
        }
      },
      orderBy: { issuedAt: 'desc' }
    })

    return { success: true, certificates }
  } catch (error) {
    console.error('Error getting user certificates:', error)
    return { success: false, message: 'Failed to get certificates' }
  }
}

/**
 * Get analytics for admin dashboard
 */
export async function getCourseAnalytics() {
  try {
    const totalUsers = await prisma.user.count()
    const totalCourses = await prisma.course.count({ where: { status: 'PUBLISHED' } })
    const totalEnrollments = await prisma.enrollment.count()
    const completedCourses = await prisma.enrollment.count({ where: { status: 'COMPLETED' } })
    const certificatesIssued = await prisma.certificate.count()

    // Popular courses
    const popularCourses = await prisma.course.findMany({
      where: { status: 'PUBLISHED' },
      include: {
        _count: {
          select: { enrollments: true }
        }
      },
      orderBy: {
        enrollments: {
          _count: 'desc'
        }
      },
      take: 5
    })

    // Recent activities
    const recentActivities = await prisma.activityLog.findMany({
      include: {
        user: {
          select: { name: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    })

    return {
      success: true,
      analytics: {
        totalUsers,
        totalCourses,
        totalEnrollments,
        completedCourses,
        certificatesIssued,
        completionRate: totalEnrollments > 0 ? (completedCourses / totalEnrollments) * 100 : 0,
        popularCourses,
        recentActivities
      }
    }
  } catch (error) {
    console.error('Error getting course analytics:', error)
    return { success: false, message: 'Failed to get analytics' }
  }
}