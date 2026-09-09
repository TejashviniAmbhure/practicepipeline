// spec: specs/saucedemo-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Inventory and Cart', () => {
  test('Add, remove, and preserve cart contents', async ({ page }) => {
    // 1. Log in and add Backpack, Bike Light, and Onesie from inventory.
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-onesie"]').click();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('3');

    // 2. Open the cart.
    await page.locator('.shopping_cart_link').click();
    await expect(page.locator('.cart_item')).toHaveCount(3);
    await expect(page.getByRole('button', { name: 'Checkout' })).toBeVisible();

    // 3. Remove Bike Light, continue shopping, add it again, and return to cart.
    await page.locator('[data-test="remove-sauce-labs-bike-light"]').click();
    await expect(page.locator('.cart_item')).toHaveCount(2);
    await page.getByRole('button', { name: 'Continue Shopping' }).click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    await page.locator('.shopping_cart_link').click();
    await expect(page.locator('.cart_item')).toHaveCount(3);

    // 4. Remove every item.
    await page.locator('[data-test^="remove-"]').all().then(async (buttons) => {
      for (const button of buttons) await button.click();
    });
    await expect(page.locator('.cart_item')).toHaveCount(0);
    await expect(page.locator('.shopping_cart_badge')).toHaveCount(0);
  });
});
