import { test, expect } from "@playwright/test";

const loginUrl =
  process.env.URL ||
  "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login";
const username = process.env.USERNAME || "Admin";
const password = process.env.PASSWORD || "admin123";

test.describe("Login", () => {
  test.describe.configure({ mode: "serial" });

  test.beforeEach(async ({ page }) => {
    test.setTimeout(120000);
    await page.goto(loginUrl, {
      waitUntil: "domcontentloaded",
      timeout: 120000,
    });
    await expect(page).toHaveTitle(/OrangeHRM/i);
    await expect(page.getByPlaceholder("Username")).toBeVisible();
    await expect(page.getByPlaceholder("Password")).toBeVisible();
  });

  test("successful login with valid credentials", async ({ page }) => {
    await page.getByPlaceholder("Username").fill(username);
    await page.getByPlaceholder("Password").fill(password);
    await page.getByRole("button", { name: /login/i }).click();

    await expect(page).toHaveURL(/\/dashboard\/index/i);
    await expect(
      page.getByRole("heading", { name: /dashboard/i }),
    ).toBeVisible();
  });

  test("login with incorrect username", async ({ page }) => {
    await page.getByPlaceholder("Username").fill("wronguser");
    await page.getByPlaceholder("Password").fill(password);
    await page.getByRole("button", { name: /login/i }).click();

    await expect(page.locator(".oxd-alert-content-text")).toContainText(
      /invalid credentials/i,
    );
    await expect(page).toHaveURL(/\/auth\/login/i);
  });

  test("login with incorrect password", async ({ page }) => {
    await page.getByPlaceholder("Username").fill(username);
    await page.getByPlaceholder("Password").fill("wrongpassword");
    await page.getByRole("button", { name: /login/i }).click();

    await expect(page.locator(".oxd-alert-content-text")).toContainText(
      /invalid credentials/i,
    );
    await expect(page).toHaveURL(/\/auth\/login/i);
  });

  test("login with empty fields", async ({ page }) => {
    await page.getByRole("button", { name: /login/i }).click();

    await expect(page.locator(".oxd-input-field-error-message")).toHaveCount(2);
    await expect(page).toHaveURL(/\/auth\/login/i);
  });
});
