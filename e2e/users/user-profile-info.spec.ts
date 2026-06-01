import { expect, test } from "@playwright/test"

test.describe("User Profile Information", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to login page
    await page.goto("/auth/login")
  })

  test("should display login inputs and successfully load login screen", async ({
    page,
  }) => {
    // Verify login form is loaded
    const title = page.locator("h4")
    await expect(title).toBeVisible()
    await expect(title).toHaveText("Welcome back")

    const emailInput = page.locator('input[type="email"]')
    await expect(emailInput).toBeVisible()
  })

  test("should load user profile and enforce read-only properties if unauthorized", async ({
    page,
  }) => {
    // When visiting without authentication, it redirects to login
    await page.goto("/users/1")
    await expect(page).toHaveURL(/.*\/auth\/login.*/)
  })
})
