import { defineConfig, devices } from '@playwright/test';

const isCI = !!process.env.CI;

export default defineConfig({
  testDir: './tests',
  timeout: 30 * 1000,
  retries: 1,
  workers: isCI ? 1 : undefined,
  reporter: isCI ? [['list'],['html', {open: 'never'}]] : 'list',
  use: {
    baseURL: 'http://localhost:5173',
    headless: isCI,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [{
    name: 'chromium',
    use: { ...devices['Desktop Chrome'] },
  }]
})