import { test, expect } from "@playwright/test";

import { BankAccountPage } from "../../../pages/bankaccount.page";
import { getSeedUser } from "../../../helpers/user-data.helper";
import { loginAndDismissOnboarding } from "../../../helpers/auth.helper";

test.describe("Bank Account - Create", () => {
  let bankAccountPage: BankAccountPage;

  test.beforeEach(async ({ page }) => {
    bankAccountPage = new BankAccountPage(page);
    const user = getSeedUser();
    await page.goto("/");
    await page.evaluate(() => localStorage.clear());
    await loginAndDismissOnboarding(page, user);
  });

  test("3.1 User successfully creates a new bank account", async ({ page }) => {
    const newAccount = {
      bankName: "Test Bank of America",
      routingNumber: "987654321",
      accountNumber: "112233445",
    };

    await bankAccountPage.gotoList();
    await expect(page).toHaveURL(/\/bankaccounts/);

    await bankAccountPage.clickCreateNew();
    await expect(page).toHaveURL(/\/bankaccounts\/new/);

    await bankAccountPage.assertFormIsVisible();

    await bankAccountPage.fillBankAccountForm(newAccount);
    await bankAccountPage.assertSaveButtonEnabled();

    await bankAccountPage.submit();

    await expect(page).toHaveURL(/\/bankaccounts/, { timeout: 10000 });
    await bankAccountPage.assertBankAccountInList(newAccount.bankName);
  });

  test("3.2 Bank Name shows error when less than 5 characters", async ({ page }) => {
    await bankAccountPage.gotoNew();
    await bankAccountPage.assertFormIsVisible();

    await bankAccountPage.fillBankName("ABC");
    await bankAccountPage.fillRoutingNumber("123456789");
    await bankAccountPage.fillAccountNumber("123456789");

    // Blur bank name to trigger validation
    await bankAccountPage.routingNumberInput.focus();

    await bankAccountPage.assertBankNameError("Must contain at least 5 characters");
    await bankAccountPage.assertSaveButtonDisabled();
  });

  test("3.3 Routing Number shows error when not exactly 9 digits", async ({ page }) => {
    await bankAccountPage.gotoNew();
    await bankAccountPage.assertFormIsVisible();

    await bankAccountPage.fillBankName("Valid Bank Name");
    await bankAccountPage.fillRoutingNumber("12345");
    await bankAccountPage.fillAccountNumber("123456789");

    // Blur routing number to trigger validation
    await bankAccountPage.accountNumberInput.focus();

    await bankAccountPage.assertRoutingNumberError("Must contain a valid routing number");
    await bankAccountPage.assertSaveButtonDisabled();
  });

  test("3.4 Account Number shows error when less than 9 digits", async ({ page }) => {
    await bankAccountPage.gotoNew();
    await bankAccountPage.assertFormIsVisible();

    await bankAccountPage.fillBankName("Valid Bank Name");
    await bankAccountPage.fillRoutingNumber("123456789");
    await bankAccountPage.fillAccountNumber("12345");

    // Blur account number to trigger validation
    await bankAccountPage.bankNameInput.focus();

    await bankAccountPage.assertAccountNumberError("Must contain at least 9 digits");
    await bankAccountPage.assertSaveButtonDisabled();
  });
});
