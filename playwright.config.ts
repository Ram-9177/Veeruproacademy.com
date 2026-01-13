import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  use: {
    headless: true,
    viewport: { width: 1280, height: 720 },
    actionTimeout: 10_000,
    ignoreHTTPSErrors: true,
  },
  // Start a lightweight static server before running tests so Playwright
  // has a stable site to connect to (serves the `out/` export directory).
  webServer: {
    // Use next start in production build rather than static export (Next 14 uses `output: export`)
    command: 'npm run start',
    url: 'http://127.0.0.1:3000',
    timeout: 120_000,
    reuseExistingServer: true,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
})
