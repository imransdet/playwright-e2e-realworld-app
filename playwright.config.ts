// Root-level Playwright config that re-exports the main config.
// This ensures `npx playwright test` works without needing --config flag.
export { default } from "./playwright/playwright.config";