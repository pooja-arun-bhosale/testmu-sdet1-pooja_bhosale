# Prompts

## Task 2 - Login Module

### Planner Agent

```
Explore the OrangeHRM demo login page and create a test plan covering Valid Login and Invalid Login scenarios, including:

- Successful login with valid credentials
- Login with incorrect username
- Login with incorrect password
- Login with empty fields
- Error message validation on failure

Save the plan as specs/login.md.
```

---

### Generator Agent

```
Generate tests for the "### 1. Login" section.
Save to tests/login/login.spec.ts.
Use process.env for login credentials, following the same pattern as tests/seed.spec.ts.
```

---

### Healer Agent

```
Run tests/login/login.spec.ts, investigate the page.goto timeout in beforeEach, identify whether it's a timeout or environment issue, and fix it without marking the tests as flaky.
```

---

### Notes

The initial test generation failed because the Playwright Generator MCP required `generator_setup_page` before writing the test file. After initializing the browser page, the tests were generated successfully. A subsequent `page.goto` timeout was resolved by correctly loading the `.env` configuration and updating the navigation timeout.

## Task 2 - Dashboard Module

## Planner Agent

```
Explore the OrangeHRM Dashboard using the URL and credentials from the .env file. After logging in, create a Playwright test plan covering widget loading, data accuracy, filter/sort behavior, responsive layout, and permission-based visibility. Save the test plan as specs/dashboard.md
```

---

### Generator Agent

```
GUse the test plan in specs/dashboard.md to generate Playwright tests using the URL and credentials from the .env file.
Save them in tests/dashboard/dashboard.spec.ts.
```

---

### Healer Agent

```
Run tests/dashboard/dashboard.spec.ts, investigate all failing tests, identify the root cause (locators, assertions, timing, navigation, or application behavior), and fix the tests accordingly. Use stable Playwright locators and best practices. Ensure all dashboard tests pass while continuing to use the URL and credentials from the .env file.


Fix the remaining dashboard test by resolving the locator issue.

```

---

### Notes

The Planner and Generator agents completed successfully. The generated tests initially failed due to the default 30s suite timeout during login. After increasing the test suite timeout, all dashboard tests passed.

---
