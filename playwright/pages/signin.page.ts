import { type Page, type Locator, expect } from "@playwright/test";

export class SigninPage {
  readonly page: Page;

  // Form inputs
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly rememberMeCheckbox: Locator;

  // Actions
  readonly signInButton: Locator;
  readonly signUpLink: Locator;

  // Error
  readonly errorAlert: Locator;

  // Post-login nav elements
  readonly sidenavUserFullName: Locator;
  readonly sidenavUsername: Locator;
  readonly sidenavHome: Locator;

  constructor(page: Page) {
    this.page = page;

    // MUI TextField puts data-test on the wrapper div — target the inner input
    this.usernameInput = page.locator('[data-test="signin-username"] input');
    this.passwordInput = page.locator('[data-test="signin-password"] input');
    this.rememberMeCheckbox = page.getByTestId("signin-remember-me");
    this.signInButton = page.getByTestId("signin-submit");
    this.signUpLink = page.getByTestId("signup");
    this.errorAlert = page.getByTestId("signin-error");

    this.sidenavUserFullName = page.getByTestId("sidenav-user-full-name");
    this.sidenavUsername = page.getByTestId("sidenav-username");
    this.sidenavHome = page.getByTestId("sidenav-home");
  }

  // ─── Navigation ──────────────────────────────────────────────────────

  async goto() {
    await this.page.goto("/signin");
  }

  // ─── Form Interactions ───────────────────────────────────────────────

  async fillUsername(username: string) {
    await this.usernameInput.fill(username);
  }

  async fillPassword(password: string) {
    await this.passwordInput.fill(password);
  }

  async fillSigninForm(credentials: { username: string; password: string }) {
    await this.fillUsername(credentials.username);
    await this.fillPassword(credentials.password);
  }

  async submitSignin() {
    await this.signInButton.click();
  }

  async signin(credentials: { username: string; password: string }) {
    await this.fillSigninForm(credentials);
    await this.submitSignin();
  }

  async clickSignUpLink() {
    await this.signUpLink.click();
  }

  // ─── Assertion Helpers ───────────────────────────────────────────────

  async assertFormIsVisible() {
    const heading = this.page.getByRole("heading", { name: /Sign in/i });
    await expect(heading).toBeVisible();
    await expect(this.page.getByTestId("signin-username")).toBeVisible();
    await expect(this.page.getByTestId("signin-password")).toBeVisible();
    await expect(this.signInButton).toBeVisible();
    await expect(this.signUpLink).toBeVisible();
  }

  async assertSignInButtonDisabled() {
    await expect(this.signInButton).toBeDisabled();
  }

  async assertSignInButtonEnabled() {
    await expect(this.signInButton).toBeEnabled();
  }

  async assertErrorVisible(expectedText?: string) {
    await expect(this.errorAlert).toBeVisible();
    if (expectedText) {
      await expect(this.errorAlert).toContainText(expectedText);
    }
  }

  async assertLoggedIn(firstName: string, lastName: string, expectedUsername: string) {
    await expect(this.page).toHaveURL(/\/$/, { timeout: 10000 });
    await expect(this.sidenavUserFullName).toBeVisible();
    // Nav renders firstName + first char of lastName (lodash head())
    await expect(this.sidenavUserFullName).toContainText(`${firstName} ${lastName[0]}`);
    await expect(this.sidenavUsername).toContainText(`@${expectedUsername}`);
  }
}
