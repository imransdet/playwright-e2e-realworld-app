import { type Page, type Locator, expect } from "@playwright/test";

export class SignupPage {
  readonly page: Page;

  // Form inputs
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;

  // Form labels
  readonly firstNameLabel: Locator;
  readonly lastNameLabel: Locator;
  readonly usernameLabel: Locator;
  readonly passwordLabel: Locator;
  readonly confirmPasswordLabel: Locator;

  // Actions
  readonly signUpButton: Locator;
  readonly signInLink: Locator;

  // Page elements
  readonly pageTitle: Locator;

  // Signup Success page elements
  readonly successIcon: Locator;
  readonly successTitle: Locator;
  readonly successMessage: Locator;
  readonly goToSignInButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // Form inputs – using id selectors that target the actual <input> elements (MUI TextField sets id on the input)
    this.firstNameInput = page.locator("#firstName");
    this.lastNameInput = page.locator("#lastName");
    this.usernameInput = page.locator("#username");
    this.passwordInput = page.locator("#password");
    this.confirmPasswordInput = page.locator("#confirmPassword");

    // Form labels (MUI TextField labels rendered with for=id)
    this.firstNameLabel = page.locator('label[for="firstName"]');
    this.lastNameLabel = page.locator('label[for="lastName"]');
    this.usernameLabel = page.locator('label[for="username"]');
    this.passwordLabel = page.locator('label[for="password"]');
    this.confirmPasswordLabel = page.locator('label[for="confirmPassword"]');

    // Actions
    this.signUpButton = page.getByTestId("signup-submit");
    this.signInLink = page.getByRole("link", { name: "Have an account? Sign In" });

    // Page elements
    this.pageTitle = page.getByTestId("signup-title");

    // Signup Success page elements
    this.successIcon = page.getByTestId("signup-success-icon");
    this.successTitle = page.getByTestId("signup-success-title");
    this.successMessage = page.getByTestId("signup-success-message");
    this.goToSignInButton = page.getByTestId("signup-success-signin-button");
  }

  // ─── Navigation ──────────────────────────────────────────────────────

  async goto() {
    await this.page.goto("/signup");
  }

  // ─── Form Interactions ───────────────────────────────────────────────

  async fillFirstName(firstName: string) {
    await this.firstNameInput.fill(firstName);
  }

  async fillLastName(lastName: string) {
    await this.lastNameInput.fill(lastName);
  }

  async fillUsername(username: string) {
    await this.usernameInput.fill(username);
  }

  async fillPassword(password: string) {
    await this.passwordInput.fill(password);
  }

  async fillConfirmPassword(confirmPassword: string) {
    await this.confirmPasswordInput.fill(confirmPassword);
  }

  async fillSignupForm(user: {
    firstName: string;
    lastName: string;
    username: string;
    password: string;
    confirmPassword: string;
  }) {
    await this.fillFirstName(user.firstName);
    await this.fillLastName(user.lastName);
    await this.fillUsername(user.username);
    await this.fillPassword(user.password);
    await this.fillConfirmPassword(user.confirmPassword);
  }

  async submitSignup() {
    await this.signUpButton.click();
  }

  async signup(user: {
    firstName: string;
    lastName: string;
    username: string;
    password: string;
    confirmPassword: string;
  }) {
    await this.fillSignupForm(user);
    await this.submitSignup();
  }

  // ─── Field Value Getters ─────────────────────────────────────────────

  async getFirstNameValue(): Promise<string> {
    return this.firstNameInput.inputValue();
  }

  async getLastNameValue(): Promise<string> {
    return this.lastNameInput.inputValue();
  }

  async getUsernameValue(): Promise<string> {
    return this.usernameInput.inputValue();
  }

  async getPasswordValue(): Promise<string> {
    return this.passwordInput.inputValue();
  }

  async getConfirmPasswordValue(): Promise<string> {
    return this.confirmPasswordInput.inputValue();
  }

  // ─── Validation Error Getters ────────────────────────────────────────

  async getFirstNameError(): Promise<string | null> {
    return this.getFieldError(this.firstNameInput);
  }

  async getLastNameError(): Promise<string | null> {
    return this.getFieldError(this.lastNameInput);
  }

  async getUsernameError(): Promise<string | null> {
    return this.getFieldError(this.usernameInput);
  }

  async getPasswordError(): Promise<string | null> {
    return this.getFieldError(this.passwordInput);
  }

  async getConfirmPasswordError(): Promise<string | null> {
    return this.getFieldError(this.confirmPasswordInput);
  }

  private async getFieldError(field: Locator): Promise<string | null> {
    // MUI TextField renders helper text as a sibling paragraph inside the form control
    const formControl = field.locator("..");
    const helperText = formControl.locator(".MuiFormHelperText-root");
    const count = await helperText.count();
    if (count === 0) return null;
    const text = await helperText.textContent();
    return text && text.trim().length > 0 ? text.trim() : null;
  }

  async isSignUpButtonEnabled(): Promise<boolean> {
    return this.signUpButton.isEnabled();
  }

  async clickSignInLink() {
    await this.signInLink.click();
  }

  async clickGoToSignIn() {
    await this.goToSignInButton.click();
  }

  // ─── Success Page Assertion Helpers ──────────────────────────────────

  async assertSuccessPageIsVisible() {
    await expect(this.successIcon).toBeVisible();
    await expect(this.successTitle).toBeVisible();
    await expect(this.successTitle).toContainText("Sign Up Successful!");
    await expect(this.successMessage).toBeVisible();
    await expect(this.successMessage).toContainText("Your account has been created successfully");
    await expect(this.goToSignInButton).toBeVisible();
    await expect(this.goToSignInButton).toContainText("Go to Sign In");
  }

  // ─── Assertion Helpers ───────────────────────────────────────────────

  async assertFormIsVisible() {
    await expect(this.pageTitle).toBeVisible();
    await expect(this.firstNameInput).toBeVisible();
    await expect(this.lastNameInput).toBeVisible();
    await expect(this.usernameInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.confirmPasswordInput).toBeVisible();
    await expect(this.signUpButton).toBeVisible();
    await expect(this.signInLink).toBeVisible();
  }

  async assertLabelsAreVisible() {
    await expect(this.firstNameLabel).toBeVisible();
    await expect(this.firstNameLabel).toContainText("First Name");
    await expect(this.firstNameLabel).toContainText("*");

    await expect(this.lastNameLabel).toBeVisible();
    await expect(this.lastNameLabel).toContainText("Last Name");
    await expect(this.lastNameLabel).toContainText("*");

    await expect(this.usernameLabel).toBeVisible();
    await expect(this.usernameLabel).toContainText("Username");
    await expect(this.usernameLabel).toContainText("*");

    await expect(this.passwordLabel).toBeVisible();
    await expect(this.passwordLabel).toContainText("Password");
    await expect(this.passwordLabel).toContainText("*");

    await expect(this.confirmPasswordLabel).toBeVisible();
    await expect(this.confirmPasswordLabel).toContainText("Confirm Password");
    await expect(this.confirmPasswordLabel).toContainText("*");
  }

  async assertNoValidationErrors() {
    expect(await this.getFirstNameError()).toBeNull();
    expect(await this.getLastNameError()).toBeNull();
    expect(await this.getUsernameError()).toBeNull();
    expect(await this.getPasswordError()).toBeNull();
    expect(await this.getConfirmPasswordError()).toBeNull();
  }

  async assertFieldValues(expected: {
    firstName: string;
    lastName: string;
    username: string;
    password: string;
    confirmPassword: string;
  }) {
    expect(await this.getFirstNameValue()).toBe(expected.firstName);
    expect(await this.getLastNameValue()).toBe(expected.lastName);
    expect(await this.getUsernameValue()).toBe(expected.username);
    expect(await this.getPasswordValue()).toBe(expected.password);
    expect(await this.getConfirmPasswordValue()).toBe(expected.confirmPassword);
  }
}
