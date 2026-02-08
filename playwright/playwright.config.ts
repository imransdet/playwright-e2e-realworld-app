import { defineConfig, devices } from "@playwright/test"
import dotenv from "dotenv"
import path from "path"

dotenv.config({ path: path.resolve(__dirname, "../.env") })

export default defineConfig({
  testDir: path.join(__dirname, "./tests"),
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  globalSetup: "./global-setup.ts",
  globalTeardown: "./global-teardown.ts",
  /* Ignore src directory and Vitest test files to prevent running unit tests */
  testIgnore: [
    "**/src/**",
    "**/__tests__/**",
    "**/node_modules/**",
    "**/*.test.ts"
  ],
  use: {
    baseURL: process.env.BASE_URL || "http://localhost:3000",
    trace: "on-first-retry",
    testIdAttribute: "data-test",
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: process.env.BASE_URL || "http://localhost:3000",
      },
    },

    {
      name: "firefox",
      use: {
        ...devices["Desktop Firefox"],
        baseURL: process.env.BASE_URL || "http://localhost:3000",
      },
    },

    {
      name: "webkit",
      use: {
        ...devices["Desktop Safari"],
        baseURL: process.env.BASE_URL || "http://localhost:3000",
      },
    },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
})
