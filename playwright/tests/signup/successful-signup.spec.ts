import { test, expect } from '@playwright/test';
import { SignupPage } from '../../pages/signup.page';
import * as fs from 'fs';
import * as path from 'path';

test.describe('Sign Up - Happy Path', () => {
  let signupPage: SignupPage;
  const testDataDir = path.join(__dirname, '../../test-data');
  const usersFilePath = path.join(testDataDir, 'users.json');

  const testUser = {
    firstName: 'John',
    lastName: 'Doe',
    username: `johndoe${Date.now()}`, // Unique username to avoid duplicates
    password: 'SecurePass123!'
  };

  test.beforeEach(async ({ page }) => {
    signupPage = new SignupPage(page);
  });

  test('1.1. User successfully signs up with valid credentials', async ({ page }) => {
    // Step 1: Navigate to signup page
    await page.goto('http://localhost:3000/signup');
    
    // Verify: signup page is displayed with all form fields
    await expect(signupPage.firstNameInput).toBeVisible();
    await expect(signupPage.lastNameInput).toBeVisible();
    await expect(signupPage.usernameInput).toBeVisible();
    await expect(signupPage.passwordInput).toBeVisible();
    await expect(signupPage.confirmPasswordInput).toBeVisible();
    await expect(signupPage.signUpButton).toBeVisible();

    // Step 2: Verify form structure and required field indicators
    // Check that all form fields are present
    await expect(signupPage.firstNameInput).toBeAttached();
    await expect(signupPage.lastNameInput).toBeAttached();
    await expect(signupPage.usernameInput).toBeAttached();
    await expect(signupPage.passwordInput).toBeAttached();
    await expect(signupPage.confirmPasswordInput).toBeAttached();

    // Step 3: Enter 'John' in First Name field
    await signupPage.firstNameInput.fill(testUser.firstName);
    await expect(signupPage.firstNameInput).toHaveValue(testUser.firstName);

    // Step 4: Enter 'Doe' in Last Name field
    await signupPage.lastNameInput.fill(testUser.lastName);
    await expect(signupPage.lastNameInput).toHaveValue(testUser.lastName);

    // Step 5: Enter username in Username field
    await signupPage.usernameInput.fill(testUser.username);
    await expect(signupPage.usernameInput).toHaveValue(testUser.username);

    // Step 6: Enter 'SecurePass123!' in Password field
    await signupPage.passwordInput.fill(testUser.password);
    await expect(signupPage.passwordInput).toHaveValue(testUser.password);

    // Step 7: Enter 'SecurePass123!' in Confirm Password field
    await signupPage.confirmPasswordInput.fill(testUser.password);
    await expect(signupPage.confirmPasswordInput).toHaveValue(testUser.password);

    // Verify no validation error messages appear
    await expect(signupPage.firstNameError).not.toBeVisible();
    await expect(signupPage.lastNameError).not.toBeVisible();
    await expect(signupPage.usernameError).not.toBeVisible();
    await expect(signupPage.passwordError).not.toBeVisible();
    await expect(signupPage.confirmPasswordError).not.toBeVisible();

    // Verify the Sign Up button is enabled
    const isButtonEnabled = await signupPage.isSignUpButtonEnabled();
    expect(isButtonEnabled).toBe(true);

    // Step 8: Click Sign Up button
    await signupPage.signup(
      testUser.firstName,
      testUser.lastName,
      testUser.username,
      testUser.password,
      testUser.password
    );

    // Expect the form is submitted
    // Expect User is redirected away from signup page
    await expect(page).not.toHaveURL(/\/signup/, { timeout: 10000 });
    
    // Expect new account is created successfully
    // User should be redirected to signin or dashboard after signup
    const currentUrl = page.url();
    expect(currentUrl).not.toBe('http://localhost:3000/signup');

    // Save credentials under playwright/test-data/users.json
    try {
      // Read existing users if file exists
      let users = [];
      if (fs.existsSync(usersFilePath)) {
        const fileContent = fs.readFileSync(usersFilePath, 'utf-8');
        users = JSON.parse(fileContent);
      }

      // Add new test user
      users.push(testUser);

      // Write back to file
      if (!fs.existsSync(testDataDir)) {
        fs.mkdirSync(testDataDir, { recursive: true });
      }
      fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2), 'utf-8');

      console.log(`✅ Test user saved to ${usersFilePath}`);
    } catch (error) {
      console.error('❌ Failed to save test user:', error);
    }
  });
});