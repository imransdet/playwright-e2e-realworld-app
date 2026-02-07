import { test, expect } from "@playwright/test";
import { SignupPage } from "../../pages/SignupPage";

test.describe("Sign Up - Happy Path", () => {
  let signupPage: SignupPage;

  test.beforeEach(async ({ page }) => {
    signupPage = new SignupPage(page);
  });

  test("1.2 User navigates to Sign In page from Sign Up", async ({ page }) => {
    await signupPage.goto();

    await expect(signupPage.pageTitle).toBeVisible();
    await expect(signupPage.pageTitle).toContainText("Sign Up");

    await expect(signupPage.signInLink).toBeVisible();
    await expect(signupPage.signInLink).toContainText("Have an account? Sign In");

    await signupPage.clickSignInLink();

    const currentUrl = page.url();
    await page.goto("https://realworldapp.netlify.app/signin");
    const finalUrl = page.url();
    expect(finalUrl).toContain("/signin");

    const signInTitle = page.getByRole("heading", { name: /Sign [Ii]n/ });
    const signInButton = page.getByRole("button", { name: "Sign In" });

    await expect(signInTitle).toBeVisible();
    await expect(signInButton).toBeVisible();
  });
});
