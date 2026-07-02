import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

// a local dev server (e.g. http://localhost:3000) or a live deployment.
const baseURL = process.env.BASE_URL || "http://localhost:3000";

// Only auto-start local servers when BASE_URL points to localhost.
const isLocal = baseURL.includes("localhost") || baseURL.includes("127.0.0.1");

// Can be overridden via SLOWMO env var; defaults to 100ms.
const slowMo = parseInt(process.env.SLOWMO || "200", 10);

export default defineConfig({
  testDir: path.join(__dirname, "./tests"),
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  timeout: 60_000,
  expect: { timeout: 10_000 },
  reporter: "html",
  globalSetup: path.join(__dirname, "./global-setup.ts"),
  globalTeardown: path.join(__dirname, "./global-teardown.ts"),
  /* Only run .spec.ts files in tests directory */
  testMatch: "**/*.spec.ts",
  /* Ignore src directory and Vitest test files to prevent running unit tests */
  testIgnore: [
    "**/src/**",
    "**/node_modules/**",
    "**/__tests__/**",
    "**/*.test.ts",
    "**/vitest.config.*",
    "**/vite.config.*",
  ],
  use: {
    baseURL,
    trace: "on-first-retry",
    testIdAttribute: "data-test",
    launchOptions: { slowMo },
    // Give actions extra time to complete when running slowly.
    actionTimeout: 30_000,
    navigationTimeout: 30_000,
  },

  /* Configure projects for all major desktop browsers */
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        baseURL,
      },
    },

    {
      name: "firefox",
      use: {
        ...devices["Desktop Firefox"],
        baseURL,
      },
    },

    {
      name: "webkit",
      use: {
        ...devices["Desktop Safari"],
        baseURL,
      },
    },

    /* Test against mobile viewports. */
    {
      name: "Mobile Chrome",
      use: {
        ...devices["Pixel 5"],
        baseURL,
      },
    },
    {
      name: "Mobile Safari",
      use: {
        ...devices["iPhone 12"],
        baseURL,
      },
    },

    /* Test against branded browsers. */
    // {
    //   name: "Microsoft Edge",
    //   use: { ...devices["Desktop Edge"], channel: "msedge", baseURL },
    // },
    {
      name: "Google Chrome",
      use: {
        ...devices["Desktop Chrome"],
        channel: "chrome",
        baseURL,
      },
    },
  ],

  /* Run your local dev server before starting the tests.
     Only enabled for local URLs. For live deployments, set BASE_URL
     to the deployed URL and no local server will be started.
     Uses `yarn dev` which starts both the Vite frontend and the
     backend API concurrently. */
  ...(isLocal
    ? {
        webServer: {
          command: "yarn dev",
          url: baseURL,
          reuseExistingServer: true,
          timeout: 180_000,
          stdout: "pipe",
          stderr: "pipe",
        },
      }
    : {}),
});