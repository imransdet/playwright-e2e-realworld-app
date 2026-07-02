import { type Page, type Locator, expect } from "@playwright/test";

export class BankAccountPage {
  readonly page: Page;

  // Form inputs (MUI TextField — target inner input)
  readonly bankNameInput: Locator;
  readonly routingNumberInput: Locator;
  readonly accountNumberInput: Locator;

  // Form wrapper (for error helper text lookup)
  readonly bankNameWrapper: Locator;
  readonly routingNumberWrapper: Locator;
  readonly accountNumberWrapper: Locator;

  // Actions
  readonly saveButton: Locator;
  readonly createNewButton: Locator;

  // List
  readonly bankAccountList: Locator;

  // Nav
  readonly sidenavBankAccounts: Locator;
  readonly sidenavToggle: Locator;

  constructor(page: Page) {
    this.page = page;

    this.bankNameInput = page.locator('[data-test="bankaccount-bankName-input"] input');
    this.routingNumberInput = page.locator('[data-test="bankaccount-routingNumber-input"] input');
    this.accountNumberInput = page.locator('[data-test="bankaccount-accountNumber-input"] input');

    this.bankNameWrapper = page.getByTestId("bankaccount-bankName-input");
    this.routingNumberWrapper = page.getByTestId("bankaccount-routingNumber-input");
    this.accountNumberWrapper = page.getByTestId("bankaccount-accountNumber-input");

    this.saveButton = page.getByTestId("bankaccount-submit");
    this.createNewButton = page.getByTestId("bankaccount-new");

    this.bankAccountList = page.getByTestId("bankaccount-list");

    this.sidenavBankAccounts = page.getByTestId("sidenav-bankaccounts");
    this.sidenavToggle = page.getByTestId("sidenav-toggle");
  }

  // ─── Navigation ──────────────────────────────────────────────────────

  async gotoList() {
    await this.page.goto("/bankaccounts");
  }

  async gotoNew() {
    await this.page.goto("/bankaccounts/new");
  }

  async openViaNav() {
    await this.sidenavToggle.click();
    await this.sidenavBankAccounts.click();
  }

  async clickCreateNew() {
    await this.createNewButton.click();
  }

  // ─── Form Interactions ───────────────────────────────────────────────

  async fillBankName(bankName: string) {
    await this.bankNameInput.fill(bankName);
  }

  async fillRoutingNumber(routingNumber: string) {
    await this.routingNumberInput.fill(routingNumber);
  }

  async fillAccountNumber(accountNumber: string) {
    await this.accountNumberInput.fill(accountNumber);
  }

  async fillBankAccountForm(data: {
    bankName: string;
    routingNumber: string;
    accountNumber: string;
  }) {
    await this.fillBankName(data.bankName);
    await this.fillRoutingNumber(data.routingNumber);
    await this.fillAccountNumber(data.accountNumber);
  }

  async submit() {
    await this.saveButton.click();
  }

  // ─── Validation Error Helpers ────────────────────────────────────────

  private async getFieldError(wrapper: Locator): Promise<string | null> {
    const helperText = wrapper.locator(".MuiFormHelperText-root");
    const count = await helperText.count();
    if (count === 0) return null;
    const text = await helperText.textContent();
    return text && text.trim().length > 0 ? text.trim() : null;
  }

  async getBankNameError() {
    return this.getFieldError(this.bankNameWrapper);
  }

  async getRoutingNumberError() {
    return this.getFieldError(this.routingNumberWrapper);
  }

  async getAccountNumberError() {
    return this.getFieldError(this.accountNumberWrapper);
  }

  // ─── Assertion Helpers ───────────────────────────────────────────────

  async assertFormIsVisible() {
    await expect(this.bankNameWrapper).toBeVisible();
    await expect(this.routingNumberWrapper).toBeVisible();
    await expect(this.accountNumberWrapper).toBeVisible();
    await expect(this.saveButton).toBeVisible();
  }

  async assertSaveButtonDisabled() {
    await expect(this.saveButton).toBeDisabled();
  }

  async assertSaveButtonEnabled() {
    await expect(this.saveButton).toBeEnabled();
  }

  async assertBankNameError(expectedText: string) {
    const error = await this.getBankNameError();
    expect(error).toContain(expectedText);
  }

  async assertRoutingNumberError(expectedText: string) {
    const error = await this.getRoutingNumberError();
    expect(error).toContain(expectedText);
  }

  async assertAccountNumberError(expectedText: string) {
    const error = await this.getAccountNumberError();
    expect(error).toContain(expectedText);
  }

  async assertBankAccountInList(bankName: string) {
    await expect(this.bankAccountList).toBeVisible();
    await expect(this.bankAccountList).toContainText(bankName);
  }
}
