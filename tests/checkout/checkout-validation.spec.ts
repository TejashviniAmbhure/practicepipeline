// spec: specs/saucedemo-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Checkout and Completion', () => {
  test('Validate required checkout information', async ({ page }) => {
    // 1. Reach checkout step one with an item and submit all fields empty.
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('.shopping_cart_link').click();
    await page.locator('[data-test="checkout"]').click();
    await page.locator('[data-test="continue"]').click();
    await expect(page.getByText('Error: First Name is required')).toBeVisible();

    // 2. Enter only first name, then first and last names without postal code.
    await page.locator('[data-test="firstName"]').fill('Ada');
    await page.locator('[data-test="continue"]').click();
    await expect(page.getByText('Error: Last Name is required')).toBeVisible();
    await page.locator('[data-test="lastName"]').fill('Lovelace');
    await page.locator('[data-test="continue"]').click();
    await expect(page.getByText('Error: Postal Code is required')).toBeVisible();
    await expect(page).toHaveURL(/checkout-step-one\.html/);
  });
});
