import { expect, test } from "@playwright/test"

test.describe("Authorization Page", () => {
  // Open the login page before each test
  test.beforeEach(async ({ page }) => {
    await page.goto("auth/login")
  })

  test("Successful login with email and password", async ({ page }) => {
    // 1. Open the login page (handled by beforeEach)
    // 2. Find the email input by the name="email" attribute and enter data
    await page.fill('input[name="email"]', "admin@test.com")

    // 3. Find the password input by the name="password" attribute and enter password
    await page.fill('input[name="password"]', "12345678")

    // 4. Click the button that contains the exact text "LOG IN"
    await page.click('button[type="submit"]:has-text("LOG IN")')

    // 5. Verify that we are redirected inside the system
    await expect(page).toHaveURL("/users") // replace with your actual internal URL
  })

  test("Error when entering an incorrect password (Sonner Toast)", async ({
    page,
  }) => {
    // 1. Enter credentials (using reliable name attributes from the layout)
    await page.fill('input[name="email"]', "admin@test.com")
    await page.fill('input[name="password"]', "IncorretPassword123")

    // 2. Click "LOG IN"
    await page.click('button[type="submit"]:has-text("LOG IN")')

    // 3. Find the toast notification from the Sonner library
    const toast = page.locator("[data-sonner-toast]")

    // 4. Verify that the toast appears on the screen and is visible
    await expect(toast).toBeVisible()

    // Or more precisely by the title attribute inside the toast:
    await expect(page.locator("[data-sonner-toast] [data-title]")).toHaveText(
      "User not found or invalid password\n"
    )

    // Verify the toast type (error)
    await expect(toast).toHaveAttribute("data-type", "error")

    // 5. Verify that we DID NOT leave the login page
    await expect(page).not.toHaveURL("/users")
  })
})
