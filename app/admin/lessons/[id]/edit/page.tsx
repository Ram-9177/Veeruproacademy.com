'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { LessonEditor } from '../../components/LessonEditor'

export default function EditLessonPage() {
  const params = useParams()
  const lessonId = params?.id as string

  const [lesson, setLesson] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const fetchLesson = useCallback(async () => {
    if (!lessonId) return
    try {
      const response = await fetch(`/api/admin/lessons/${lessonId}`)
      if (response.ok) {
        const data = await response.json()
        setLesson(data.lesson)
      }
    } catch (error) {
      console.error('Error fetching lesson:', error)
    } finally {
      setLoading(false)
    }
  }, [lessonId])

  useEffect(() => {
    fetchLesson()
  }, [fetchLesson])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading lesson...</div>
      </div>
    )
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Lesson not found</div>
      </div>
    )
  }

  return <LessonEditor lesson={lesson} courses={[]} />
}
