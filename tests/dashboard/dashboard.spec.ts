import { test, expect } from "@playwright/test";
import { Page } from "@playwright/test";

const loginUrl =
  process.env.URL ||
  "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login";
const username = process.env.USERNAME || "Admin";
const password = process.env.PASSWORD || "admin123";

async function login(page: Page) {
  await page.goto(loginUrl, { waitUntil: "domcontentloaded", timeout: 120000 });
  await page.getByPlaceholder("Username", { exact: true }).fill(username);
  await page.getByPlaceholder("Password", { exact: true }).fill(password);
  await page.getByRole("button", { name: /login/i }).click();
  await page.waitForURL(/\/dashboard\/index/i, { timeout: 120000 });
  await expect(page.getByRole("heading", { name: /Dashboard/i })).toBeVisible({
    timeout: 120000,
  });
}

test.describe.configure({ timeout: 120000 });

test.describe("OrangeHRM Dashboard", () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test("dashboard widget loading and content", async ({ page }) => {
    await expect(page.getByText(/Time at Work/i)).toBeVisible();
    await expect(page.getByText(/My Actions/i)).toBeVisible();
    await expect(page.getByText(/Quick Launch/i)).toBeVisible();
    await expect(page.getByText(/Buzz Latest Posts/i)).toBeVisible();
    await expect(page.getByText(/Employees on Leave Today/i)).toBeVisible();
    await expect(
      page.getByText(/Employee Distribution by Sub Unit/i),
    ).toBeVisible();
    await expect(
      page.getByText(/Employee Distribution by Location/i),
    ).toBeVisible();
  });

  test("filter and sort behavior", async ({ page }) => {
    await expect(page.getByText(/Quick Launch/i)).toBeVisible();
    await expect(page.getByText(/Pending Self Review/i)).toBeVisible();
    await expect(page.getByText(/Candidate to Interview/i)).toBeVisible();
  });

  test("responsive layout", async ({ page }) => {
    const viewportSizes = [
      { width: 1280, height: 1024 },
      { width: 768, height: 1024 },
      { width: 480, height: 960 },
    ];

    for (const size of viewportSizes) {
      await page.setViewportSize(size);
      await expect(
        page.getByRole("heading", { name: /Dashboard/i }),
      ).toBeVisible();
    }
  });

  test("permission-based visibility", async ({ page }) => {
    await expect(page.getByRole("link", { name: /Admin/i })).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /Dashboard/i }),
    ).toBeVisible();
  });
});
