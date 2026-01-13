import { test, expect } from '@playwright/test'

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@veerupro.com'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'VeeruPro2024!'

test.describe('admin navigation smoke', () => {
  test('login and navigate core admin surfaces', async ({ page }) => {
    // Programmatic login to avoid flaky CSRF/UI redirects
    const csrfResp = await page.request.get('http://localhost:3000/api/auth/csrf')
    const { csrfToken } = await csrfResp.json()
    const loginResp = await page.request.post('http://localhost:3000/api/auth/callback/credentials', {
      form: {
        csrfToken,
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        callbackUrl: 'http://localhost:3000/admin/hub'
      }
    })
    expect(loginResp.ok()).toBeTruthy()
    await page.goto('http://localhost:3000/admin/hub')

    // Admin hub
    await expect(page.getByText(/admin dashboard/i)).toBeVisible({ timeout: 10_000 })

    // Quick actions from hub
    await page.getByRole('link', { name: /create course/i }).click()
    await expect(page.getByText(/create new course/i)).toBeVisible({ timeout: 10_000 })
    const courseSlug = `playwright-course-${Date.now()}`
    await page.getByPlaceholder(/complete javascript course/i).fill(courseSlug)
    await page.getByPlaceholder(/Brief description/i).fill('Playwright smoke course')
    await page.locator('form').getByRole('button', { name: /create course/i }).click()
    await expect(page).toHaveURL(/\/admin\/courses/)
    await expect(page.locator(`text=${courseSlug}`).first()).toBeVisible({ timeout: 10_000 })

    // Courses list
    await page.goto('http://localhost:3000/admin/courses')
    await expect(page.getByRole('heading', { name: /courses/i })).toBeVisible({ timeout: 10_000 })

    // Lessons list
    await page.goto('http://localhost:3000/admin/lessons')
    await expect(page.getByRole('heading', { name: /lessons/i })).toBeVisible({ timeout: 10_000 })

    // Content dashboard
    await page.goto('http://localhost:3000/admin/content')
    await expect(page.getByRole('heading', { name: /manage content/i })).toBeVisible({ timeout: 10_000 })

    // Sandbox admin
    await page.goto('http://localhost:3000/admin/sandbox')
    await expect(page.getByRole('heading', { name: /code sandboxes/i })).toBeVisible({ timeout: 10_000 })
    await page.getByRole('link', { name: 'New Sandbox', exact: true }).click()
    await expect(page.getByRole('heading', { name: /create new sandbox/i })).toBeVisible({ timeout: 10_000 })
    const sandboxTitle = `Playwright Sandbox ${Date.now()}`
    await page.getByPlaceholder(/sandbox title/i).fill(sandboxTitle)
    await page.getByPlaceholder(/Describe your sandbox/i).fill('Smoke sandbox')
    await page.getByRole('button', { name: /save sandbox/i }).click()
    await expect(page).toHaveURL(/\/admin\/sandbox/)
  })
})
