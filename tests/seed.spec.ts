import { test, expect } from "@playwright/test";

test.describe("Test group", () => {
  test("seed", async ({ page }) => {
    await page.goto(process.env.URL||"https://opensource-demo.orangehrmlive.com/web/index.php/auth/login", {
      waitUntil: "domcontentloaded",
    });
  });
});
