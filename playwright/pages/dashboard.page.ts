import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class DashboardPage extends BasePage {
  readonly userGreeting: Locator;
  readonly bankAccountsTab: Locator;
  readonly transactionsTab: Locator;
  readonly logoutButton: Locator;
  readonly newTransactionButton: Locator;
  readonly balanceAmount: Locator;

  constructor(page: Page) {
    super(page);
    this.userGreeting = page.locator('[data-testid="user-greeting"]');
    this.bankAccountsTab = page.locator('[data-testid="nav-bankaccounts"]');
    this.transactionsTab = page.locator('[data-testid="nav-transactions"]');
    this.logoutButton = page.locator('[data-testid="logout-button"]');
    this.newTransactionButton = page.locator('[data-testid="new-transaction-button"]');
    this.balanceAmount = page.locator('[data-testid="balance-amount"]');
  }

  async goToBankAccounts() {
    await this.clickElement(this.bankAccountsTab);
  }

  async goToTransactions() {
    await this.clickElement(this.transactionsTab);
  }

  async logout() {
    await this.clickElement(this.logoutButton);
  }

  async clickNewTransaction() {
    await this.clickElement(this.newTransactionButton);
  }

  async getUserGreeting(): Promise<string> {
    return await this.getText(this.userGreeting);
  }

  async getBalanceAmount(): Promise<string> {
    return await this.getText(this.balanceAmount);
  }
}