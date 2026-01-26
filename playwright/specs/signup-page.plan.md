# Sign Up Page Test Plan

## Application Overview

This test plan covers comprehensive testing of the Sign Up page at https://realworldapp.netlify.app/signup. The Sign Up page is a user registration form that collects first name, last name, username, password, and password confirmation. The page implements client-side validation for required fields and password matching, with the Sign Up button remaining disabled until all validations pass. The plan includes tests for happy path registration, field-level validation, password matching, edge cases, and accessibility scenarios.

## Test Scenarios

### 1. Sign Up - Happy Path

**Seed:** `playwright/seed.spec.ts`

#### 1.1. User successfully signs up with valid credentials

**File:** `playwright/tests/signup/successful-signup.spec.ts`

**Steps:**
  1. Navigate to https://realworldapp.netlify.app/signup
    - expect: The Sign Up page is displayed with all form fields visible
  2. Verify the form structure and required field indicators (*)
    - expect: All form fields are present: First Name, Last Name, Username, Password, Confirm Password
  3. Enter 'John' in the First Name field
    - expect: First Name field displays 'John'
  4. Enter 'Doe' in the Last Name field
    - expect: Last Name field displays 'Doe'
  5. Enter 'johndoe123' in the Username field
    - expect: Username field displays 'johndoe123'
  6. Enter 'SecurePass123!' in the Password field
    - expect: Password field displays the entered value (masked)
  7. Enter 'SecurePass123!' in the Confirm Password field
    - expect: Confirm Password field displays the entered value (masked)
    - expect: No validation error messages appear
    - expect: The Sign Up button is enabled
  8. Click the Sign Up button
    - expect: The form is submitted
    - expect: User is redirected away from the signup page
    - expect: New account is created successfully
    - Save the credentials under playwright/test-data/users.json

#### 1.2. User navigates to Sign In page from Sign Up

**File:** `playwright/tests/signup/navigate-signin.spec.ts`

**Steps:**
  1. Navigate to https://realworldapp.netlify.app/signup
    - expect: The Sign Up page is displayed
  2. Locate the 'Have an account? Sign In' link
    - expect: The 'Have an account? Sign In' link is visible
  3. Click the 'Have an account? Sign In' link
    - expect: User is navigated to the Sign In page
    - expect: The URL changes to /signin
    - expect: The Sign In form is displayed

### 2. Sign Up - Required Field Validation

**Seed:** `playwright/seed.spec.ts`

#### 2.1. First Name field is required

**File:** `playwright/tests/signup/first-name-required.spec.ts`

**Steps:**
  1. Navigate to https://realworldapp.netlify.app/signup
    - expect: The Sign Up page is displayed
  2. Leave the First Name field empty and move to another field
    - expect: The First Name field is empty
  3. Trigger validation on the First Name field
    - expect: The error message 'First Name is required' appears
    - expect: The Sign Up button is disabled
  4. Enter 'John' in the First Name field
    - expect: The error message disappears
    - expect: The Sign Up button becomes enabled (when all other fields are valid)

#### 2.2. Last Name field is required

**File:** `playwright/tests/signup/last-name-required.spec.ts`

**Steps:**
  1. Navigate to https://realworldapp.netlify.app/signup
    - expect: The Sign Up page is displayed
  2. Leave the Last Name field empty and focus on another field
    - expect: Fill all fields except Last Name with valid data
  3. Trigger validation on the Last Name field
    - expect: The error message 'Last Name is required' appears
    - expect: The Sign Up button is disabled
  4. Enter 'Doe' in the Last Name field
    - expect: The error message disappears

#### 2.3. Username field is required

**File:** `playwright/tests/signup/username-required.spec.ts`

**Steps:**
  1. Navigate to https://realworldapp.netlify.app/signup
    - expect: The Sign Up page is displayed
  2. Leave the Username field empty and focus on another field
    - expect: Fill all fields except Username with valid data
  3. Trigger validation on the Username field
    - expect: The error message 'Username is required' appears
    - expect: The Sign Up button is disabled
  4. Enter a valid username in the Username field
    - expect: The error message disappears

#### 2.4. Password field is required

**File:** `playwright/tests/signup/password-required.spec.ts`

**Steps:**
  1. Navigate to https://realworldapp.netlify.app/signup
    - expect: The Sign Up page is displayed
  2. Leave the Password field empty and focus on another field
    - expect: Fill all fields except Password with valid data
  3. Trigger validation on the Password field
    - expect: The error message 'Password is required' appears
    - expect: The Sign Up button is disabled
  4. Enter a password in the Password field
    - expect: The error message disappears

#### 2.5. Confirm Password field is required

**File:** `playwright/tests/signup/confirm-password-required.spec.ts`

**Steps:**
  1. Navigate to https://realworldapp.netlify.app/signup
    - expect: The Sign Up page is displayed
  2. Leave the Confirm Password field empty and focus on another field
    - expect: Fill all fields except Confirm Password with valid data
  3. Trigger validation on the Confirm Password field
    - expect: The error message 'Confirm Password is required' appears
    - expect: The Sign Up button is disabled
  4. Enter a matching password in the Confirm Password field
    - expect: The error message disappears

### 3. Sign Up - Password Validation

**Seed:** `playwright/seed.spec.ts`

#### 3.1. Password mismatch validation displays error

**File:** `playwright/tests/signup/password-mismatch.spec.ts`

**Steps:**
  1. Navigate to https://realworldapp.netlify.app/signup
    - expect: The Sign Up page is displayed
  2. Fill First Name, Last Name, and Username with valid values
    - expect: Enter all other fields with valid data
  3. Enter 'SecurePass123!' in the Password field
    - expect: The Password field contains 'SecurePass123!'
  4. Enter 'DifferentPass456!' in the Confirm Password field
    - expect: The error message 'Password does not match' appears
    - expect: The Sign Up button is disabled
  5. Update Confirm Password to match: 'SecurePass123!'
    - expect: The error message disappears
    - expect: The Sign Up button becomes enabled

#### 3.2. Password matching is case-sensitive

**File:** `playwright/tests/signup/password-case-sensitive.spec.ts`

**Steps:**
  1. Navigate to https://realworldapp.netlify.app/signup
    - expect: The Sign Up page is displayed
  2. Enter valid values in First Name, Last Name, and Username
    - expect: Fill all other fields with valid data
  3. Enter 'SecurePass123!' in the Password field
    - expect: The Password field contains 'SecurePass123!'
  4. Enter 'securepass123!' (lowercase) in the Confirm Password field
    - expect: The error message 'Password does not match' appears (case mismatch is detected)
    - expect: The Sign Up button is disabled
  5. Update Confirm Password to match exactly with correct case: 'SecurePass123!'
    - expect: The error message disappears

#### 3.3. Password accepts special characters

**File:** `playwright/tests/signup/password-special-chars.spec.ts`

**Steps:**
  1. Navigate to https://realworldapp.netlify.app/signup
    - expect: The Sign Up page is displayed
  2. Enter 'P@ssw0rd!#$%' in the Password field
    - expect: Fill all fields with valid data including special characters in password
  3. Enter 'P@ssw0rd!#$%' in the Confirm Password field
    - expect: Passwords match without error
  4. Verify form can be submitted with special character passwords
    - expect: No validation error appears
    - expect: The Sign Up button is enabled

### 4. Sign Up - Edge Cases

**Seed:** `playwright/seed.spec.ts`

#### 4.1. Form handles whitespace in input fields

**File:** `playwright/tests/signup/whitespace-handling.spec.ts`

**Steps:**
  1. Navigate to https://realworldapp.netlify.app/signup
    - expect: The Sign Up page is displayed
  2. Enter ' John ' (with spaces) in the First Name field
    - expect: Determine if leading/trailing spaces are trimmed or preserved
  3. Complete remaining fields and attempt submission
    - expect: Field displays the value with or without trimming
  4. Verify the submission behavior
    - expect: Observe how the form handles whitespace

#### 4.2. Form handles very long input values

**File:** `playwright/tests/signup/long-input-values.spec.ts`

**Steps:**
  1. Navigate to https://realworldapp.netlify.app/signup
    - expect: The Sign Up page is displayed
  2. Enter a very long string (100+ characters) in the First Name field
    - expect: Field accepts the input or shows max-length validation error
  3. Enter a very long string in the Username field
    - expect: Field accepts or rejects the input appropriately
  4. Enter a very long string in the Password field
    - expect: Verify handling of long password values

#### 4.3. Form accepts numeric values in text fields

**File:** `playwright/tests/signup/numeric-input.spec.ts`

**Steps:**
  1. Navigate to https://realworldapp.netlify.app/signup
    - expect: The Sign Up page is displayed
  2. Enter '12345' in the First Name field
    - expect: The field accepts numeric values
  3. Enter '67890' in the Last Name field
    - expect: Field displays numeric value
  4. Enter '123456' in the Username field
    - expect: Form accepts all-numeric username
  5. Complete form and verify submission
    - expect: Numeric values are accepted

#### 4.4. Name fields accept special characters

**File:** `playwright/tests/signup/special-chars-names.spec.ts`

**Steps:**
  1. Navigate to https://realworldapp.netlify.app/signup
    - expect: The Sign Up page is displayed
  2. Enter 'Jean-Pierre' in the First Name field
    - expect: Field accepts hyphen in name
  3. Enter 'O'Brien' in the Last Name field
    - expect: Field accepts apostrophe or shows validation error
  4. Enter 'José' in a name field
    - expect: Field accepts or rejects international characters
  5. Complete remaining fields and check submission
    - expect: Form behavior with special characters is validated

#### 4.5. Username field special character handling

**File:** `playwright/tests/signup/username-special-chars.spec.ts`

**Steps:**
  1. Navigate to https://realworldapp.netlify.app/signup
    - expect: The Sign Up page is displayed
  2. Enter 'user_name' in the Username field
    - expect: Underscore is accepted or rejected
  3. Clear and enter 'user-name' in the Username field
    - expect: Hyphen is accepted or rejected
  4. Clear and enter 'user.name' in the Username field
    - expect: Period is accepted or rejected
  5. Clear and enter 'user@name' in the Username field
    - expect: Special character like @ is handled appropriately

### 5. Sign Up - Duplicate Account Detection

**Seed:** `playwright/seed.spec.ts`

#### 5.1. Duplicate username error is displayed

**File:** `playwright/tests/signup/duplicate-username.spec.ts`

**Steps:**
  1. Navigate to https://realworldapp.netlify.app/signup
    - expect: The Sign Up page is displayed
  2. Enter valid data with a username that already exists (e.g., 'demo')
    - expect: All client-side validations pass
  3. Click the Sign Up button
    - expect: Form submission is attempted
  4. 
    - expect: An error message appears: 'Username is already taken' or similar
    - expect: User remains on the Sign Up page
    - expect: Previously entered data is preserved

#### 5.2. User can correct duplicate username and sign up successfully

**File:** `playwright/tests/signup/duplicate-username-recovery.spec.ts`

**Steps:**
  1. Receive a duplicate username error from submission
    - expect: User is on the Sign Up page with duplicate username error
  2. Change the Username field to a unique value
    - expect: The error message is cleared after field modification
  3. Verify the form is valid
    - expect: The Sign Up button is enabled
  4. Click the Sign Up button to submit again
    - expect: User is redirected to the authenticated area
    - expect: New account is created with the unique username

### 6. Sign Up - Accessibility & Keyboard Navigation

**Seed:** `playwright/seed.spec.ts`

#### 6.1. Form fields can be navigated using Tab key

**File:** `playwright/tests/signup/tab-navigation.spec.ts`

**Steps:**
  1. Navigate to https://realworldapp.netlify.app/signup
    - expect: The Sign Up page is displayed with focus on First Name
  2. Press Tab key repeatedly to navigate through form elements
    - expect: Tab order follows: First Name → Last Name → Username → Password → Confirm Password → Sign Up → Sign In link
  3. Verify tab navigation sequence
    - expect: Each field receives focus in the correct order

#### 6.2. Form can be submitted using keyboard

**File:** `playwright/tests/signup/keyboard-submit.spec.ts`

**Steps:**
  1. Fill all form fields and place focus on a form field
    - expect: All form fields are filled with valid data
    - expect: The Sign Up button is enabled
  2. Press Enter key on the Confirm Password field
    - expect: Form behavior when Enter is pressed on the last field
  3. 
    - expect: Form is submitted or focus moves to next element

#### 6.3. Field labels and required indicators are visible

**File:** `playwright/tests/signup/labels-visibility.spec.ts`

**Steps:**
  1. Navigate to https://realworldapp.netlify.app/signup
    - expect: The Sign Up page is displayed
  2. Verify each input field has an associated label
    - expect: All labels are visible: First Name, Last Name, Username, Password, Confirm Password
  3. Check that required indicators are present
    - expect: All labels display required field indicator (*)
  4. Verify clicking a label focuses the corresponding field
    - expect: Labels are properly associated with input fields

#### 6.4. Error messages are visible and descriptive

**File:** `playwright/tests/signup/error-message-visibility.spec.ts`

**Steps:**
  1. Navigate to https://realworldapp.netlify.app/signup
    - expect: The Sign Up page is displayed
  2. Clear a required field to trigger validation error
    - expect: Error message appears near the field
  3. Verify error message accessibility and positioning
    - expect: Error message is readable and explains the issue
    - expect: Error message is close to the field it relates to
