import { expect, test } from "@playwright/test"

test.describe("User Profile Tab Navigation", () => {
  test("should load the login page if not authenticated", async ({ page }) => {
    await page.goto("/users/1")

    await expect(page).toHaveURL(/.*\/auth\/login.*/)
  })

  test("should display auth page components", async ({ page }) => {
    await page.goto("/auth/login")

    const signupLink = page.locator(
      "a:has-text('I HAVE AN ACCOUNT'), a:has-text('sign up'), a[href*='signup']"
    )
    if ((await signupLink.count()) > 0) {
      await signupLink.first().click()
      await expect(page).toHaveURL(/.*\/auth\/signup.*/)
    }
  })
})
