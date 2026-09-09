// spec: specs/saucedemo-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Authentication and Navigation', () => {
  test('Login with accepted personas and logout', async ({ page }) => {
    // 1. Open the SauceDemo login page.
    await page.goto('https://www.saucedemo.com/');

    // 2. Repeat independently for accepted personas.
    for (const username of ['standard_user', 'problem_user', 'performance_glitch_user', 'error_user', 'visual_user']) {
      await page.locator('[data-test="username"]').fill(username);
      await page.locator('[data-test="password"]').fill('secret_sauce');
      await page.locator('[data-test="login-button"]').click();
      await expect(page).toHaveURL(/inventory\.html/);
      await expect(page.getByText('Products')).toBeVisible();

      // 3. Open the global menu and choose Logout.
      await page.getByRole('button', { name: 'Open Menu' }).click();
      await page.getByRole('link', { name: 'Logout' }).click();
      await expect(page).toHaveURL('https://www.saucedemo.com/');
      await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
    }
  });
});
