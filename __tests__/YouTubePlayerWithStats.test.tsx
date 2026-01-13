/* eslint-env jest */
import React from 'react'
import { render, screen } from '@testing-library/react'
import YouTubePlayerWithStats from '../components/YouTubePlayerWithStats'

test('renders youtube player frame', async () => {
  // mock fetch to avoid act warnings from async state updates
  // and to keep test output deterministic
  const originalFetch = global.fetch
  global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ viewCount: '123', likeCount: '10', commentCount: '2' }) }) as any

  try {
    // pass preload to force iframe to render in test environment
    render(React.createElement(YouTubePlayerWithStats, { url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', preload: true }))
    const frame = await screen.findByTitle(/YouTube video player/i)
    expect(frame).toBeInTheDocument()
  } finally {
    global.fetch = originalFetch as any
  }
})
