# SauceDemo Comprehensive Test Plan

## Application Overview

Comprehensive functional and quality test plan for SauceDemo (Swag Labs). The plan covers login personas and validation, global navigation, inventory catalog and sorting, product details, cart state, checkout validation and price calculations, order completion and PDF output, responsive behavior, keyboard accessibility, and known special-user paths. Each scenario is independent and starts from a fresh browser context at the login page unless stated otherwise. Use secret_sauce as the password for accepted users.

## Test Scenarios

### 1. Authentication and Navigation

**Seed:** `tests/seed.spec.ts`

#### 1.1. Login with accepted personas

**File:** `tests/authentication/login-accepted-personas.spec.ts`

**Steps:**
  1. Open https://www.saucedemo.com/ in a fresh browser context.
    - expect: Swag Labs login page displays Username, Password, and Login controls.
    - expect: Accepted usernames and shared password guidance are visible.
  2. Repeat independently for standard_user, problem_user, performance_glitch_user, error_user, and visual_user: enter the username, enter secret_sauce, and click Login.
    - expect: Each accepted persona logs in successfully.
    - expect: inventory.html opens with the Products heading and six products.
    - expect: No unexpected authentication error is shown.
  3. Open the global menu and choose Logout.
    - expect: Logout returns to the login page.
    - expect: Authenticated inventory content is no longer shown.

#### 1.2. Reject invalid and incomplete credentials

**File:** `tests/authentication/login-validation.spec.ts`

**Steps:**
  1. Click Login with both fields empty.
    - expect: An inline error states that the username is required.
    - expect: The user remains on the login page.
  2. Enter a valid username with an empty password and submit.
    - expect: An inline error states that the password is required.
  3. Enter an empty username with a valid password and submit.
    - expect: An inline error states that the username is required.
  4. Submit an unknown username with an arbitrary password, then submit standard_user with an incorrect password.
    - expect: An invalid-credentials error is shown for each attempt.
    - expect: No authenticated page opens.
    - expect: Password input is masked.

#### 1.3. Special personas and session protection

**File:** `tests/authentication/special-personas.spec.ts`

**Steps:**
  1. Log in as locked_out_user with secret_sauce.
    - expect: Login is rejected with a clear locked-out-user message.
    - expect: The user remains on the login page.
  2. Log in as performance_glitch_user and measure until inventory is usable.
    - expect: Login eventually succeeds.
    - expect: The delayed response does not leave a broken or partially usable inventory page.
  3. In a fresh unauthenticated context, directly open inventory.html, cart.html, checkout-step-one.html, and checkout-step-two.html.
    - expect: Protected pages do not expose authenticated shopping or checkout data.
    - expect: The application redirects to login or denies access consistently.

#### 1.4. Global navigation and reset state

**File:** `tests/navigation/global-navigation.spec.ts`

**Steps:**
  1. Log in, open the global menu, and inspect its entries.
    - expect: All Items, About, Logout, and Reset App State are available.
    - expect: Close Menu closes the navigation without blocking the page.
  2. Select All Items, then select About.
    - expect: All Items returns to inventory.
    - expect: About opens the configured Sauce Labs destination without an application error.
  3. Add products, open the menu, and select Reset App State.
    - expect: Cart contents and badge are cleared.
    - expect: The inventory remains usable after reset and refresh.

#### 1.5. External footer links and page chrome

**File:** `tests/navigation/footer-and-chrome.spec.ts`

**Steps:**
  1. Inspect the footer on login, inventory, cart, and checkout pages.
    - expect: Twitter, Facebook, and LinkedIn links are present with correct destinations.
    - expect: Branding, page titles, and footer content are readable and not overlapping primary controls.
  2. Activate each external footer link in a controlled new tab.
    - expect: Each link opens the expected external destination.
    - expect: The SauceDemo session remains intact in the original tab.

### 2. Inventory and Cart

**Seed:** `tests/seed.spec.ts`

#### 2.1. Verify catalog and product details

**File:** `tests/inventory/catalog-and-details.spec.ts`

**Steps:**
  1. Log in as standard_user and inspect inventory.
    - expect: Exactly six products are displayed: Backpack, Bike Light, Bolt T-Shirt, Fleece Jacket, Onesie, and Test.allTheThings() T-Shirt (Red).
    - expect: Each product has name, description, price, image, and Add to cart control.
    - expect: Product images have meaningful alternative text.
  2. Open each product name and return with Back to products.
    - expect: Detail view matches the selected product name, description, price, and image.
    - expect: Back to products returns to inventory without losing session or cart state.
  3. Compare inventory and detail prices for every product.
    - expect: Each product has the same price in both views.

#### 2.2. Sort inventory by every option

**File:** `tests/inventory/sorting.spec.ts`

**Steps:**
  1. Verify the default sort.
    - expect: Name (A to Z) is selected.
    - expect: Products are alphabetically ascending.
  2. Select Name (Z to A), Price (low to high), and Price (high to low), one at a time.
    - expect: Products reorder correctly for each selection.
    - expect: The selected option remains visible.
    - expect: No products are lost or duplicated.

#### 2.3. Add, remove, and preserve cart contents

**File:** `tests/cart/cart-management.spec.ts`

**Steps:**
  1. Add Backpack, Bike Light, and Onesie from inventory.
    - expect: Each product changes to its selected/remove state.
    - expect: Cart badge shows 3.
  2. Open the cart.
    - expect: Exactly the three selected products appear with quantity 1, descriptions, prices, and Remove controls.
    - expect: Checkout and Continue Shopping are available.
  3. Remove Bike Light, continue shopping, add it again, and return to cart.
    - expect: Only Bike Light is removed in the first step.
    - expect: After re-adding, each intended product appears once and the badge returns to 3.
  4. Remove all items.
    - expect: Cart is empty, with no stale rows or incorrect badge.
    - expect: Checkout cannot create an order from an empty cart.

#### 2.4. Empty cart, refresh, and boundary behavior

**File:** `tests/cart/cart-boundaries.spec.ts`

**Steps:**
  1. Open cart from a fresh authenticated session without adding products.
    - expect: A clear empty-cart state is shown.
    - expect: No stale item or incorrect badge is displayed.
  2. Add one product, refresh cart, navigate away, and return.
    - expect: The item and badge remain consistent across refresh and normal navigation.
  3. Attempt checkout with an empty cart, including direct checkout URL if possible.
    - expect: The application blocks an invalid empty order or shows clear empty-cart handling.
    - expect: No completion confirmation appears.

### 3. Checkout and Completion

**Seed:** `tests/seed.spec.ts`

#### 3.1. Complete one-item checkout and verify totals

**File:** `tests/checkout/happy-path.spec.ts`

**Steps:**
  1. Add Sauce Labs Backpack, open cart, and click Checkout.
    - expect: Checkout: Your Information displays First Name, Last Name, Zip/Postal Code, Cancel, and Continue.
  2. Enter Ada, Lovelace, and 12345, then click Continue.
    - expect: Checkout: Overview shows the selected item and quantity.
    - expect: Item total is $29.99, tax is $2.40, and total is $32.39.
    - expect: Payment and shipping information are displayed.
  3. Click Finish, then click Back Home.
    - expect: Checkout: Complete! displays the thank-you and dispatch messages.
    - expect: Back Home returns to inventory.
    - expect: The completed order does not remain as a stale cart.

#### 3.2. Validate checkout information

**File:** `tests/checkout/checkout-validation.spec.ts`

**Steps:**
  1. Reach checkout step one with an item and submit all fields empty.
    - expect: A clear error identifies the missing first name.
    - expect: The user remains on step one.
  2. Enter only first name, then first and last names without postal code, submitting after each state.
    - expect: Errors identify the next missing required field.
    - expect: The user cannot reach overview until all required fields are populated.
  3. Submit whitespace-only values and then long, hyphenated, numeric, and Unicode names with varied postal code formats.
    - expect: Invalid values are rejected consistently when format validation applies.
    - expect: Accepted values render without clipping or layout breakage.
    - expect: Errors are actionable and do not clear unrelated valid fields.

#### 3.3. Cancel checkout and browser navigation

**File:** `tests/checkout/cancel-and-back-navigation.spec.ts`

**Steps:**
  1. From checkout step one, click Cancel.
    - expect: The user returns to the documented prior page.
    - expect: Cart contents remain and no order is created.
  2. Reach overview with valid information and click Cancel.
    - expect: The user returns to the documented prior page.
    - expect: No completion confirmation is shown and cart state is consistent.
  3. Use browser Back and Forward across cart, step one, and overview.
    - expect: The session does not unexpectedly expire.
    - expect: Items are not duplicated and invalid checkout data cannot be completed.

#### 3.4. Calculate totals for multiple products

**File:** `tests/checkout/multi-item-totals.spec.ts`

**Steps:**
  1. Add Onesie, Bike Light, and Fleece Jacket, proceed through checkout with valid customer information, and open overview.
    - expect: All selected products appear exactly once with quantity 1.
    - expect: Each price matches inventory.
  2. Sum displayed item prices and compare with Item total, tax, and Total.
    - expect: Item total equals the sum of item prices.
    - expect: Tax follows the displayed application rule and rounding.
    - expect: Total equals item total plus tax.
  3. Finish the order and refresh the completion page.
    - expect: One completion confirmation is shown.
    - expect: Refresh does not create a duplicate order or error state.

#### 3.5. Completion PDF and keyboard actions

**File:** `tests/checkout/completion-actions.spec.ts`

**Steps:**
  1. Complete a valid order and click Generate PDF order.
    - expect: A non-empty PDF download or browser PDF response is produced.
    - expect: The completion page does not break.
  2. Use keyboard-only navigation on completion to activate Generate PDF order and Back Home.
    - expect: Both controls are keyboard reachable with visible focus.
    - expect: Keyboard activation matches pointer behavior.

#### 3.6. Responsive and accessibility smoke coverage

**File:** `tests/quality/responsive-accessibility.spec.ts`

**Steps:**
  1. Run login, inventory, cart, and checkout at desktop, tablet, and narrow mobile viewport sizes.
    - expect: Primary controls, messages, product data, and totals are not clipped or overlapped.
    - expect: Menu, cart, forms, and checkout actions remain reachable.
  2. Complete the core flow using keyboard only.
    - expect: Interactive controls follow a logical focus order.
    - expect: All controls have meaningful accessible names and visible focus.
  3. Inspect accessibility tree for images, fields, errors, and success state.
    - expect: Product and navigation images have useful alternative text or are correctly decorative.
    - expect: Validation errors are discoverable and associated with relevant fields.
    - expect: Color is not the only indicator of error, selection, or success.
