import { test, expect } from "@playwright/test";
import { faker } from "@faker-js/faker";
import * as fs from "fs";
import * as path from "path";

import { SigninPage } from "../../../pages/signin.page";

/**
 * Read credentials saved by the signup test from test-data/credentials.json.
 */
function getCredentials(): { username: string; password: string } | null {
  const credsPath = path.resolve(__dirname, "../../../test-data/credentials.json");
  if (!fs.existsSync(credsPath)) {
    return null;
  }
  try {
    return JSON.parse(fs.readFileSync(credsPath, "utf-8"));
  } catch {
    return null;
  }
}

test.describe("Sign In - Happy Path", () => {
  let signinPage: SigninPage;

  test.beforeEach(async ({ page }) => {
    signinPage = new SigninPage(page);
    await page.goto("/");
    await page.evaluate(() => localStorage.clear());
  });

  test("2.1 User successfully signs in with valid credentials", async ({ page }) => {
    const creds = getCredentials();
    test.skip(
      !creds,
      "No credentials found in test-data/credentials.json — run signup tests first"
    );

    await signinPage.goto();
    await signinPage.assertFormIsVisible();

    await signinPage.fillSigninForm({
      username: creds!.username,
      password: creds!.password,
    });

    await signinPage.assertSignInButtonEnabled();
    await signinPage.submitSignin();

    // Wait for navigation to home page after successful login
    await page.waitForURL(/\/$/, { timeout: 30000 });

    // New users see the onboarding dialog — either the dialog or the
    // sidenav username confirms the user is authenticated
    const onboardingDialog = page.getByTestId("user-onboarding-dialog");
    const isOnboarding = await onboardingDialog.isVisible({ timeout: 3000 }).catch(() => false);

    if (isOnboarding) {
      await expect(onboardingDialog).toBeVisible();
    } else {
      await expect(signinPage.sidenavUsername).toBeVisible({ timeout: 10000 });
      await expect(signinPage.sidenavUsername).toContainText(`@${creds!.username}`);
    }
  });

  test("2.2 User cannot sign in with an incorrect password", async ({ page }) => {
    const creds = getCredentials();
    test.skip(
      !creds,
      "No credentials found in test-data/credentials.json — run signup tests first"
    );

    await signinPage.goto();
    await signinPage.assertFormIsVisible();

    await signinPage.fillSigninForm({
      username: creds!.username,
      password: "WrongPassword999!",
    });

    await signinPage.assertSignInButtonEnabled();
    await signinPage.submitSignin();

    await signinPage.assertErrorVisible();
    await expect(page).toHaveURL(/\/signin/);
  });

  test("2.3 User cannot sign in with a non-existent username", async ({ page }) => {
    await signinPage.goto();
    await signinPage.assertFormIsVisible();

    await signinPage.fillSigninForm({
      username: `ghost_${faker.string.alphanumeric(8)}`,
      password: "SecurePass123!",
    });

    await signinPage.assertSignInButtonEnabled();
    await signinPage.submitSignin();

    await signinPage.assertErrorVisible();
    await expect(page).toHaveURL(/\/signin/);
  });
});