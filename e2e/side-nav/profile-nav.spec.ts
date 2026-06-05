import { expect, test } from "@playwright/test"

// 1. Instruct Playwright to use the pre-authenticated standard user session.
// This allows the browser to open directly in a logged-in state!
test.use({ storageState: "playwright/.auth/user.json" })

test("Navigate to employee profile via dropdown menu", async ({ page }) => {
  // 2. Navigate to the main page (the system allows access without a password prompt)
  await page.goto("/users")

  // 3. Find the user menu button (popover avatar) and click it
  await page.getByTestId("nav-avatar").click()

  // 4. Find and click the "Profile" link (using a dynamic matcher to handle varying user IDs safely)
  const profileLink = page
    .locator('a[href^="/users/"]')
    .filter({ hasText: "Profile" })
  await profileLink.click()

  // 5. Verify that we have successfully redirected to the profile page
  await expect(page).toHaveURL(/\/users\/\d+/)
})
