import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login.page';
import { DashboardPage } from '../../pages/dashboard.page';

test.describe('Checkout Tests', () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    
    // Login before each test
    await page.goto('/signin');
    await loginPage.login('testUser', 'password');
    await expect(page).toHaveURL('**/');
  });

  test('should navigate to create transaction', async ({ page }) => {
    await dashboardPage.clickNewTransaction();
    await expect(page).toHaveURL('**/transaction/new');
  });

  test('should display user balance', async ({ page }) => {
    const balance = await dashboardPage.getBalanceAmount();
    expect(balance).toBeTruthy();
  });

  test('should navigate to bank accounts', async ({ page }) => {
    await dashboardPage.goToBankAccounts();
    await expect(page).toHaveURL('**/bankaccounts');
  });

  test('should navigate to transactions', async ({ page }) => {
    await dashboardPage.goToTransactions();
    await expect(page).toHaveURL('**/transactions');
  });

  test('should logout successfully', async ({ page }) => {
    await dashboardPage.logout();
    await expect(page).toHaveURL('**/signin');
  });
});