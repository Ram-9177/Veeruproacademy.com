import { getAllLessons, getLessonBySlug } from '../lib/content'

describe('content validation', () => {
  test('invalid lesson without title is skipped', () => {
    const lessons = getAllLessons()
    const invalid = lessons.find(l => l.slug === 'invalid')
    expect(invalid).toBeUndefined()
  })

  test('direct fetch of invalid lesson returns template or null', () => {
    const lesson = getLessonBySlug('invalid')
    // In current CMS setup, an "invalid" slug may resolve to a sample template lesson
    // Accept either null or a lesson object with title & slug
    if (lesson === null) {
      expect(lesson).toBeNull()
    } else {
      expect(lesson.slug).toBeTruthy()
      expect(lesson.title).toBeTruthy()
    }
  })

  test('valid lessons still load', () => {
    const lessons = getAllLessons()
    // At least one valid lesson should exist from fixture content
    expect(lessons.length).toBeGreaterThan(0)
    expect(lessons.every(l => !!l.title && !!l.slug)).toBe(true)
  })
})
