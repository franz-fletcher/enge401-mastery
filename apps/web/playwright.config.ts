import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for ENGE401 Mastery E2E testing
 *
 * Best practices followed:
 * - Test isolation with fresh browser contexts per test
 * - Parallel execution for faster feedback
 * - Web server auto-start for CI/CD
 * - Multiple viewport configurations for responsive testing
 * - Screenshot and video capture on failure
 */
export default defineConfig({
  testDir: './e2e',

  // Run tests in files in parallel
  fullyParallel: true,

  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,

  // Retry on CI only
  retries: process.env.CI ? 2 : 0,

  // Opt out of parallel tests on CI for stability
  workers: process.env.CI ? 1 : undefined,

  // Reporter to use
  reporter: [
    ['html', { open: 'never' }],
    ['list'],
  ],

  // Snapshot configuration for visual regression testing
  snapshotPathTemplate: '{testDir}/__screenshots__/{projectName}/{testFilePath}/{arg}{ext}',

  // Shared settings for all the projects below
  use: {
    // Base URL to use in actions like `await page.goto('/')`
    baseURL: 'http://localhost:3000',

    // Collect trace when retrying the failed test
    trace: 'on-first-retry',

    // Capture screenshot on failure
    screenshot: 'only-on-failure',

    // Record video on failure
    video: 'on-first-retry',

    // Action timeout
    actionTimeout: 10000,

    // Navigation timeout
    navigationTimeout: 15000,
  },

  // Configure projects for major browsers and viewports
  projects: [
    // Auth setup project - runs first
    {
      name: 'setup',
      testMatch: /auth\.setup\.ts/,
    },

    // Desktop Chrome - depends on setup
    {
      name: 'chromium-desktop',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
        storageState: 'playwright/.auth/test-user.json',
      },
      dependencies: ['setup'],
    },

    // Laptop - depends on setup
    {
      name: 'chromium-laptop',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1366, height: 768 },
        storageState: 'playwright/.auth/test-user.json',
      },
      dependencies: ['setup'],
    },

    // Tablet - depends on setup
    {
      name: 'chromium-tablet',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 834, height: 1194 },
        storageState: 'playwright/.auth/test-user.json',
      },
      dependencies: ['setup'],
    },

    // Mobile - depends on setup
    {
      name: 'chromium-mobile',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 390, height: 844 },
        storageState: 'playwright/.auth/test-user.json',
      },
      dependencies: ['setup'],
    },

    // Dark mode testing - depends on setup
    {
      name: 'chromium-dark',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
        colorScheme: 'dark',
        storageState: 'playwright/.auth/test-user.json',
      },
      dependencies: ['setup'],
    },

    // Visual regression testing - dedicated project for consistent screenshots
    {
      name: 'chromium-visual',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
        storageState: 'playwright/.auth/test-user.json',
        // Consistent rendering for visual tests
        deviceScaleFactor: 1,
        // Disable animations for consistent screenshots
        launchOptions: {
          args: ['--force-color-profile=srgb'],
        },
      },
      dependencies: ['setup'],
    },
  ],

  // Run local dev server before starting the tests
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
