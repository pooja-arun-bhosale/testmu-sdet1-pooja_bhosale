# OrangeHRM Login Test Plan

## Application Overview

OrangeHRM demo login page scenarios covering successful and failed authentication flows.

## Test Scenarios

### 1. Login

**Seed:** `tests/seed.spec.ts`

#### 1.1. Successful login with valid credentials

**File:** `specs/login.md`

**Steps:**

1. Open the OrangeHRM login page.
   - expect: The login form is displayed with Username and Password inputs.

2. Enter the valid username and password from the environment configuration.
   - expect: The user is redirected to the dashboard and the dashboard page is visible.

#### 1.2. Login with incorrect username

**File:** `specs/login.md`

**Steps:**

1. Open the OrangeHRM login page.
   - expect: The login form is displayed.

2. Enter an incorrect username with the correct password.
   - expect: An error message is displayed indicating invalid credentials, and the user remains on the login page.

#### 1.3. Login with incorrect password

**File:** `specs/login.md`

**Steps:**

1. Open the OrangeHRM login page.
   - expect: The login form is displayed.

2. Enter the correct username with an incorrect password.
   - expect: An error message is displayed indicating invalid credentials, and the user remains on the login page.

#### 1.4. Login with empty fields

**File:** `specs/login.md`

**Steps:**

1. Open the OrangeHRM login page.
   - expect: The login form is displayed.

2. Leave the Username and Password fields empty and submit the form.
   - expect: Validation messages are shown for both required fields, and the login is not successful.

---

## Notes

The following scenarios were not fully automated due to limitations of the OrangeHRM public demo environment:

- **Forgot Password:** End-to-end password reset verification cannot be performed because the demo environment does not send real password reset emails. Only navigation and reset request submission can be validated.

- **Session Expiry:** The demo environment does not provide a configurable or predictable session timeout, making automated session expiry validation impractical.

- **Brute-Force Account Lockout:** The demo environment does not enforce account lockout after repeated failed login attempts, so this scenario cannot be validated.
