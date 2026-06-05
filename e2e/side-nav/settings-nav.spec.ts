import { expect, test } from "@playwright/test"

// Use the pre-authenticated user session state
test.use({ storageState: "playwright/.auth/user.json" })

test("Navigate to settings via dropdown menu", async ({ page }) => {
  // 1. Navigate to the main page
  await page.goto("/users")

  // 2. Click the user menu button (using the universal avatar locator)
  await page.getByTestId("nav-avatar").click()

  // 3. Find the "Settings" link inside the menu and click it
  // Looks for an <a> tag that contains the text "Settings" (case-insensitive)
  const settingsLink = page.locator("a").filter({ hasText: /Settings/i })
  await settingsLink.click()

  // 4. Verify that we have successfully redirected to the settings section
  await expect(page).toHaveURL(/.*\/settings/)
})
