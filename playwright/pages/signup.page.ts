import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class SignupPage extends BasePage {
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly signUpButton: Locator;
  readonly signInLink: Locator;
  readonly firstNameError: Locator;
  readonly lastNameError: Locator;
  readonly usernameError: Locator;
  readonly passwordError: Locator;
  readonly confirmPasswordError: Locator;

  constructor(page: Page) {
    super(page);
    this.firstNameInput = page.locator('[data-test="signup-first-name"]');
    this.lastNameInput = page.locator('[data-test="signup-last-name"]');
    this.usernameInput = page.locator('[data-test="signup-username"]');
    this.passwordInput = page.locator('[data-test="signup-password"]');
    this.confirmPasswordInput = page.locator('[data-test="signup-confirmPassword"]');
    this.signUpButton = page.locator('[data-test="signup-submit"]');
    this.signInLink = page.getByText('Have an account? Sign In');
    this.firstNameError = page.locator('#firstName-helper-text');
    this.lastNameError = page.locator('#lastName-helper-text');
    this.usernameError = page.locator('#username-helper-text');
    this.passwordError = page.locator('#password-helper-text');
    this.confirmPasswordError = page.locator('#confirmPassword-helper-text');
  }

  async signup(firstName: string, lastName: string, username: string, password: string, confirmPassword: string) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.confirmPasswordInput.fill(confirmPassword);
    await this.signUpButton.click();
  }

  async navigateToSignIn() {
    await this.signInLink.click();
  }

  async isSignUpButtonEnabled(): Promise<boolean> {
    return await this.signUpButton.isEnabled();
  }

  async getFirstNameError(): Promise<string> {
    return await this.firstNameError.textContent() || '';
  }

  async getLastNameError(): Promise<string> {
    return await this.lastNameError.textContent() || '';
  }

  async getUsernameError(): Promise<string> {
    return await this.usernameError.textContent() || '';
  }

  async getPasswordError(): Promise<string> {
    return await this.passwordError.textContent() || '';
  }

  async getConfirmPasswordError(): Promise<string> {
    return await this.confirmPasswordError.textContent() || '';
  }
}