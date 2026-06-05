import { expect, test } from "@playwright/test"

test.use({ storageState: "playwright/.auth/user.json" })

test("Successful logout from the system", async ({ page }) => {
  // 1. Navigate to the main protected page
  await page.goto("/users")

  // 2. Open the user profile dropdown menu
  await page.getByTestId("nav-avatar").click()

  // 3. Find the logout button or link
  // Usually this is either an <a> link or a <button>, so we look for the text
  const logoutButton = page.locator("button, a").filter({ hasText: /Logout/i })
  await logoutButton.click()

  // 4. Verify that we are redirected to the login page
  await expect(page).toHaveURL(/.*\/auth\/login/)

  // 5. SECURITY CHECK: Attempt to navigate back to the protected /users page
  await page.goto("/users")

  // The system should deny access and kick us back to the login page
  await expect(page).toHaveURL(/.*\/auth\/login/)
})
