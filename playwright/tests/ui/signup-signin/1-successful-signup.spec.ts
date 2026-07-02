import { test, expect } from "@playwright/test";
import { faker } from "@faker-js/faker";
import * as fs from "fs";
import * as path from "path";

import { SignupPage } from "../../../pages/signup.page";
import { saveUser, findUserByUsername } from "../../../helpers/user-data.helper";

/**
 * Save the last registered user's credentials to a JSON file so that
 * subsequent test suites (e.g. signin) can read them.
 * NOTE: We avoid writing to .env because Vite watches .env and restarts
 * the dev server on change, which would break running tests.
 */
function saveCredentials(username: string, password: string) {
  const credsPath = path.resolve(__dirname, "../../../test-data/credentials.json");
  const data = JSON.stringify({ username, password }, null, 2);
  fs.writeFileSync(credsPath, data);
}

test.describe("Sign Up - Happy Path", () => {
  let signupPage: SignupPage;

  test.beforeEach(async ({ page }) => {
    signupPage = new SignupPage(page);
    // Clear localStorage to remove stale auth state that can interfere with signup flow
    await page.goto("/");
    await page.evaluate(() => localStorage.clear());
  });

  const generateTestUser = () => ({
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    username: `johndoe${Date.now()}`,
    password: "SecurePass123!",
    confirmPassword: "SecurePass123!",
  });

  test("1.1 User successfully signs up with valid credentials", async ({ page }) => {
    const testUser = generateTestUser();

    await signupPage.goto();

    await signupPage.assertFormIsVisible();
    await signupPage.assertLabelsAreVisible();

    await signupPage.fillSignupForm(testUser);
    await signupPage.assertFieldValues(testUser);

    await signupPage.assertNoValidationErrors();
    await expect(await signupPage.isSignUpButtonEnabled()).toBe(true);

    // Submit the form and wait for navigation
    await signupPage.submitSignup();
    // Wait for the API call to complete and navigation to happen
    await page.waitForURL(/\/signup-success/, { timeout: 30000 });
    await signupPage.assertSuccessPageIsVisible();

    await signupPage.clickGoToSignIn();

    const signInTitle = page.getByRole("heading", { name: /Sign [Ii]n/ });
    const signInButton = page.getByRole("button", { name: "Sign In" });
    await expect(signInTitle).toBeVisible({ timeout: 5000 });
    await expect(signInButton).toBeVisible();

    saveUser(testUser);

    // Verify user was saved correctly
    const savedUser = findUserByUsername(testUser.username);
    expect(savedUser).toBeDefined();
    expect(savedUser!.firstName).toBe(testUser.firstName);
    expect(savedUser!.lastName).toBe(testUser.lastName);
    expect(savedUser!.username).toBe(testUser.username);
    expect(savedUser!.password).toBe(testUser.password);

    // Save credentials for use by signin tests
    saveCredentials(testUser.username, testUser.password);
  });

  test("1.2 User navigates to Sign In page from Sign Up", async ({ page }) => {
    await signupPage.goto();

    await expect(signupPage.pageTitle).toBeVisible();
    await expect(signupPage.pageTitle).toContainText("Sign Up");

    await expect(signupPage.signInLink).toBeVisible();
    await expect(signupPage.signInLink).toContainText("Have an account? Sign In");

    await signupPage.clickSignInLink();
    await page.goto("/signin");

    // Verify sign-in page elements are visible
    const signInTitle = page.getByRole("heading", { name: /Sign [Ii]n/ });
    const signInButton = page.getByRole("button", { name: "Sign In" });

    await expect(signInTitle).toBeVisible();
    await expect(signInButton).toBeVisible();
  });
});