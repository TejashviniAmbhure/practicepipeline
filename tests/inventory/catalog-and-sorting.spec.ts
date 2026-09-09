// spec: specs/saucedemo-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Inventory and Cart', () => {
  test('Verify catalog and sort inventory', async ({ page }) => {
    // 1. Log in as standard_user and inspect inventory.
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await expect(page.getByText('Products')).toBeVisible();
    await expect(page.locator('.inventory_item')).toHaveCount(6);
    await expect(page.getByText('Sauce Labs Backpack')).toBeVisible();
    await expect(page.getByText('Sauce Labs Bike Light')).toBeVisible();
    await expect(page.getByText('Sauce Labs Bolt T-Shirt')).toBeVisible();
    await expect(page.getByText('Sauce Labs Fleece Jacket')).toBeVisible();
    await expect(page.getByText('Sauce Labs Onesie')).toBeVisible();
    await expect(page.getByText('Test.allTheThings() T-Shirt (Red)')).toBeVisible();

    // 2. Select Name (Z to A), Price (low to high), and Price (high to low).
    const sort = page.locator('[data-test="product-sort-container"]');
    await sort.selectOption('za');
    await expect(sort).toHaveValue('za');
    await sort.selectOption('lohi');
    await expect(sort).toHaveValue('lohi');
    await expect(page.locator('.inventory_item_price').first()).toHaveText('$7.99');
    await sort.selectOption('hilo');
    await expect(sort).toHaveValue('hilo');
    await expect(page.locator('.inventory_item_price').first()).toHaveText('$49.99');
  });
});
