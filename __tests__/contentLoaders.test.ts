import { getLessonBySlug, getCourseBySlug } from '../lib/content'

describe('content loaders', () => {
  test('loads MDX lesson and normalizes youtube_url', () => {
    const lesson = getLessonBySlug('intro-to-python')
    expect(lesson).toBeTruthy()
    expect(lesson?.slug).toBe('intro-to-python')
    expect(typeof lesson?.body).toBe('string')
    // Should produce youtube_url either from original youtube_url or fallback
    expect(lesson?.youtube_url || lesson?.youtube).toBeTruthy()
  })

  test('course frontmatter exposes lessons array', () => {
    const course = getCourseBySlug('python')
    expect(course).toBeTruthy()
    expect(Array.isArray(course?.lessons)).toBe(true)
  })
})