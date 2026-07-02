import { Page } from "@playwright/test";
import { SigninPage } from "../pages/signin.page";
import { TestUser } from "./user-data.helper";

/**
 * Signs in and handles the onboarding dialog that appears for new users
 * who have no bank accounts yet. Fills the minimum required bank account
 * during onboarding so subsequent test steps land on the main app.
 */
export async function loginAndDismissOnboarding(page: Page, user: TestUser): Promise<void> {
  const signinPage = new SigninPage(page);
  await signinPage.goto();
  await signinPage.signin({ username: user.username, password: user.password });

  // New users are redirected to onboarding — handle it if it appears
  const onboardingDialog = page.getByTestId("user-onboarding-dialog");
  const hasOnboarding = await onboardingDialog.isVisible({ timeout: 5000 }).catch(() => false);

  if (!hasOnboarding) return;

  // Step 1 — "Get Started" screen
  await page.getByTestId("user-onboarding-next").click();

  // Step 2 — required bank account creation inside onboarding
  await page.locator('[data-test="bankaccount-bankName-input"] input').fill("Setup Bank");
  await page.locator('[data-test="bankaccount-routingNumber-input"] input').fill("123456789");
  await page.locator('[data-test="bankaccount-accountNumber-input"] input').fill("987654321");
  await page.getByTestId("bankaccount-submit").click();

  // Step 3 — "Finished" screen
  await page.getByTestId("user-onboarding-next").click();
  await onboardingDialog.waitFor({ state: "hidden", timeout: 5000 });
}
