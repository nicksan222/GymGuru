import { expect, test } from "@playwright/test";

test("authenticate", async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto("/sign-in");

  // Check env variables.
  expect(process.env.TEST_EMAIL).toBeTruthy();
  expect(process.env.TEST_EMAIL).toContain("@");
  expect(process.env.TEST_PASSWORD).toBeTruthy();

  await page.goto("/sign-in");
  if (await page.isVisible('input[name="identifier"]')) {
    return;
  }

  await page.fill('input[name="identifier"]', process.env.TEST_EMAIL ?? "");
  await page.click('[data-localization-key="formButtonPrimary"]');

  await page.waitForSelector('input[name="password"]');
  await page.fill('input[name="password"]', process.env.TEST_PASSWORD ?? "");
  // Click button with data-localization-key="formButtonPrimary"
  await page.click('[data-localization-key="formButtonPrimary"]');

  // Should get redirected to the dashboard
  await page.waitForURL("http://localhost:3000");

  // TODO: Check if the user is logged in.
  // There should be cookies
  const cookies = await page.context().cookies();
  expect(cookies).toBeTruthy();
  expect(cookies.length).toBeGreaterThan(0);

  await context.storageState({ path: "playwright/.auth/user.json" });
});
