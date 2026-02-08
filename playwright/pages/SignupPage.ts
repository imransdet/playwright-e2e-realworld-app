import { Page, Locator } from "@playwright/test"

export class SignupPage {
  readonly page: Page
  readonly firstNameInput: Locator
  readonly lastNameInput: Locator
  readonly usernameInput: Locator
  readonly passwordInput: Locator
  readonly confirmPasswordInput: Locator
  readonly signUpButton: Locator
  readonly signInLink: Locator
  readonly pageTitle: Locator

  constructor(page: Page) {
    this.page = page
    this.firstNameInput = page.getByRole("textbox", { name: "First Name", exact: true })
    this.lastNameInput = page.getByRole("textbox", { name: "Last Name", exact: true })
    this.usernameInput = page.getByRole("textbox", { name: "Username", exact: true })
    this.passwordInput = page.locator("#password")
    this.confirmPasswordInput = page.locator("#confirmPassword")
    this.signUpButton = page.getByRole("button", { name: "Sign Up" })
    this.signInLink = page.getByRole("link", { name: "Have an account? Sign In" })
    this.pageTitle = page.getByRole("heading", { name: "Sign Up", level: 1 })
  }

  async goto() {
    await this.page.goto("https://realworldapp.netlify.app/signup")
  }

  async fillFirstName(firstName: string) {
    await this.firstNameInput.fill(firstName)
  }

  async fillLastName(lastName: string) {
    await this.lastNameInput.fill(lastName)
  }

  async fillUsername(username: string) {
    await this.usernameInput.fill(username)
  }

  async fillPassword(password: string) {
    await this.passwordInput.fill(password)
  }

  async fillConfirmPassword(confirmPassword: string) {
    await this.confirmPasswordInput.fill(confirmPassword)
  }

  async fillSignupForm(formData: {
    firstName: string
    lastName: string
    username: string
    password: string
    confirmPassword: string
  }) {
    await this.fillFirstName(formData.firstName)
    await this.fillLastName(formData.lastName)
    await this.fillUsername(formData.username)
    await this.fillPassword(formData.password)
    await this.fillConfirmPassword(formData.confirmPassword)
  }

  async clickSignUp() {
    await this.signUpButton.click()
  }

  async clickSignInLink() {
    await this.signInLink.click()
    await this.page.waitForTimeout(2000)
  }

  async isSignUpButtonEnabled(): Promise<boolean> {
    return await this.signUpButton.isEnabled()
  }

  async getFirstNameValue(): Promise<string> {
    return await this.firstNameInput.inputValue()
  }

  async getLastNameValue(): Promise<string> {
    return await this.lastNameInput.inputValue()
  }

  async getUsernameValue(): Promise<string> {
    return await this.usernameInput.inputValue()
  }

  async getFirstNameError(): Promise<string | null> {
    const error = this.firstNameInput.getByRole("alert")
    return (await error.count()) > 0 ? await error.textContent() : null
  }

  async getLastNameError(): Promise<string | null> {
    const error = this.lastNameInput.getByRole("alert")
    return (await error.count()) > 0 ? await error.textContent() : null
  }

  async getUsernameError(): Promise<string | null> {
    const error = this.usernameInput.getByRole("alert")
    return (await error.count()) > 0 ? await error.textContent() : null
  }

  async getPasswordError(): Promise<string | null> {
    const error = this.passwordInput.getByRole("alert")
    return (await error.count()) > 0 ? await error.textContent() : null
  }

  async getConfirmPasswordError(): Promise<string | null> {
    const error = this.confirmPasswordInput.getByRole("alert")
    return (await error.count()) > 0 ? await error.textContent() : null
  }
}
