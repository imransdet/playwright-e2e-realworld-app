import { Page, Locator } from "@playwright/test"

export class WaitHelper {
  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  async waitForElement(locator: Locator, timeout: number = 5000) {
    await locator.waitFor({ state: "visible", timeout })
  }

  async waitForElementHidden(locator: Locator, timeout: number = 5000) {
    await locator.waitFor({ state: "hidden", timeout })
  }

  async waitForElementAttached(locator: Locator, timeout: number = 5000) {
    await locator.waitFor({ state: "attached", timeout })
  }

  async waitForElementDetached(locator: Locator, timeout: number = 5000) {
    await locator.waitFor({ state: "detached", timeout })
  }

  async waitForNavigation(timeout: number = 30000) {
    await this.page.waitForLoadState("networkidle", { timeout })
  }

  async waitForURL(url: string | RegExp, timeout: number = 30000) {
    await this.page.waitForURL(url, { timeout })
  }

  async waitForResponse(urlPattern: string | RegExp, timeout: number = 30000) {
    await this.page.waitForResponse(urlPattern, { timeout })
  }

  async waitForTimeout(milliseconds: number) {
    await this.page.waitForTimeout(milliseconds)
  }

  async waitForPageToLoad(timeout: number = 30000) {
    await this.page.waitForLoadState("domcontentloaded", { timeout })
  }

  async waitForElementToBeEnabled(locator: Locator, timeout: number = 5000) {
    await locator.waitFor({ state: "visible", timeout })
    const isEnabled = await locator.isEnabled()
    if (!isEnabled) {
      throw new Error("Element is not enabled")
    }
  }

  async waitForText(locator: Locator, text: string, timeout: number = 5000) {
    await locator.waitFor({ state: "visible", timeout })
    await locator.getByText(text).waitFor({ state: "visible", timeout })
  }
}
