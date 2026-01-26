import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login.page';
import { DashboardPage } from '../../pages/dashboard.page';

test.describe('Login Tests', () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    await page.goto('/signin');
  });

  test('should login with valid credentials', async ({ page }) => {
    await loginPage.login('testUser', 'password');
    await expect(page).toHaveURL('**/');
    await dashboardPage.userGreeting.isVisible();
  });

  test('should show error with invalid credentials', async ({ page }) => {
    await loginPage.login('invalidUser', 'wrongPassword');
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain('invalid');
  });

  test('should navigate to sign up page', async ({ page }) => {
    const signUpLink = page.getByRole('link', { name: /sign up/i });
    await signUpLink.click();
    await expect(page).toHaveURL('**/signup');
  });

  test('should validate empty username', async ({ page }) => {
    await loginPage.passwordInput.fill('password');
    await loginPage.loginButton.click();
    await loginPage.errorMessage.isVisible();
  });

  test('should validate empty password', async ({ page }) => {
    await loginPage.usernameInput.fill('testUser');
    await loginPage.loginButton.click();
    await loginPage.errorMessage.isVisible();
  });
});