import { test as base } from '@playwright/test';

export interface AuthFixtures {
  authenticatedPage: any;
}

export const test = base.extend<AuthFixtures>({
  authenticatedPage: async ({ page }, use) => {
    // Perform login before each test
    await page.goto('/signin');
    await page.fill('[data-testid="username"]', process.env.TEST_USER_USERNAME || 'testUser');
    await page.fill('[data-testid="password"]', process.env.TEST_USER_PASSWORD || 'password');
    await page.click('[data-testid="signin-submit"]');
    
    // Wait for navigation to complete
    await page.waitForURL('**/');

    // Use the authenticated page in tests
    await use(page);
  },
});

export const expect = test.expect;