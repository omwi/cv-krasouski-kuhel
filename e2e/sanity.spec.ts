import { expect, test } from "@playwright/test"

test("should load the login page and display the welcome title", async ({
  page,
}) => {
  // Navigate to the login page (using default language)
  await page.goto("/auth/login")

  // Verify that the login form title "Welcome back" is visible
  const title = page.locator("h4")
  await expect(title).toBeVisible()
  await expect(title).toHaveText("Welcome back")
})
