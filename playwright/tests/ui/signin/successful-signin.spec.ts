import { test, expect } from "@playwright/test";
import { faker } from "@faker-js/faker";

import { SigninPage } from "../../../pages/signin.page";
import { getLastUser } from "../../../helpers/user-data.helper";

test.describe("Sign In - Happy Path", () => {
  let signinPage: SigninPage;

  test.beforeEach(async ({ page }) => {
    signinPage = new SigninPage(page);
    await page.goto("/");
    await page.evaluate(() => localStorage.clear());
  });

  test("2.1 User successfully signs in with valid credentials", async ({ page }) => {
    const user = getLastUser();

    await signinPage.goto();
    await signinPage.assertFormIsVisible();

    await signinPage.fillSigninForm({
      username: user.username,
      password: user.password,
    });

    await signinPage.assertSignInButtonEnabled();
    await signinPage.submitSignin();

    await signinPage.assertLoggedIn(user.firstName, user.lastName, user.username);
  });

  test("2.2 User cannot sign in with an incorrect password", async ({ page }) => {
    const user = getLastUser();

    await signinPage.goto();
    await signinPage.assertFormIsVisible();

    await signinPage.fillSigninForm({
      username: user.username,
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
