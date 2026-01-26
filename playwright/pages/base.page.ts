import { Page, Locator } from '@playwright/test';

export class BasePage {
  constructor(protected page: Page) {}

  async navigateTo(url: string) {
    await this.page.goto(url);
  }

  async fillInput(locator: Locator, value: string) {
    await locator.fill(value);
  }

  async clickElement(locator: Locator) {
    await locator.click();
  }

  async getText(locator: Locator): Promise<string> {
    return await locator.textContent() || '';
  }

  async isElementVisible(locator: Locator): Promise<boolean> {
    return await locator.isVisible();
  }

  async waitForElement(locator: Locator, timeout: number = 5000) {
    await locator.waitFor({ state: 'visible', timeout });
  }

  async waitForUrl(url: string, timeout: number = 5000) {
    await this.page.waitForURL(url, { timeout });
  }

  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }
}