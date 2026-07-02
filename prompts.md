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
