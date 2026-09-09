// spec: specs/saucedemo-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Authentication and Navigation', () => {
  test('Reject locked-out user', async ({ page }) => {
    // 1. Open the login page and submit locked_out_user credentials.
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('locked_out_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();

    // 2. Verify the locked-out error.
    await expect(page.getByText('Epic sadface: Sorry, this user has been locked out.')).toBeVisible();
    await expect(page).toHaveURL('https://www.saucedemo.com/');
  });
});
