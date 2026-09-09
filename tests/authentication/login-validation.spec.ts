// spec: specs/saucedemo-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Authentication and Navigation', () => {
  test('Reject invalid and incomplete credentials', async ({ page }) => {
    // 1. Open the login page.
    await page.goto('https://www.saucedemo.com/');

    // 2. Click Login with both fields empty.
    await page.locator('[data-test="login-button"]').click();
    await expect(page.getByText('Epic sadface: Username is required')).toBeVisible();
    await expect(page).toHaveURL('https://www.saucedemo.com/');

    // 3. Enter a valid username with an empty password and submit.
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="login-button"]').click();
    await expect(page.getByText('Epic sadface: Password is required')).toBeVisible();

    // 4. Submit an unknown username with an arbitrary password.
    await page.locator('[data-test="username"]').fill('unknown_user');
    await page.locator('[data-test="password"]').fill('wrong_password');
    await page.locator('[data-test="login-button"]').click();
    await expect(page.getByText('Epic sadface: Username and password do not match any user in this service')).toBeVisible();
    await expect(page.locator('[data-test="password"]')).toHaveAttribute('type', 'password');
  });
});
