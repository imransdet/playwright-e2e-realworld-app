import { test, expect } from "@playwright/test";
import { faker } from "@faker-js/faker";

import { SignupPage } from "../../../pages/signup.page";
import { saveUser, findUserByUsername } from "../../../helpers/user-data.helper";

test.describe("Sign Up - Happy Path", () => {
  let signupPage: SignupPage;

  test.beforeEach(async ({ page }) => {
    signupPage = new SignupPage(page);
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

    // Submit the form
    await signupPage.submitSignup();
    await expect(page).toHaveURL(/\/signup-success/, { timeout: 10000 });
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
