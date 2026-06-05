import fs from "fs"
import { expect, test as setup } from "@playwright/test"

// Paths where session files will be saved
export const ADMIN_STORAGE_STATE = "playwright/.auth/admin.json"
export const USER_STORAGE_STATE = "playwright/.auth/user.json"

// Session lifetime in milliseconds (10 minutes = 10 * 60 * 1000)
const SESSION_TIMEOUT = 10 * 60 * 1000

/**
 * Helper function to check if the session file is still valid (less than 10 minutes old)
 */
function isSessionValid(filePath: string): boolean {
  if (fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath)
    const age = Date.now() - stats.mtimeMs
    return age < SESSION_TIMEOUT
  }
  return false
}

setup("Authentication as Admin", async ({ page }) => {
  // Check if the Admin session is still fresh
  if (isSessionValid(ADMIN_STORAGE_STATE)) {
    console.log("--> [Setup] Reusing valid Admin session. Skipping login.")
    return
  }

  console.log("--> [Setup] Admin session expired or missing. Logging in...")
  await page.goto("/auth/login")
  await page.fill('input[name="email"]', "admin@test.com")
  await page.fill('input[name="password"]', "12345678")
  await page.click('button[type="submit"]:has-text("LOG IN")')

  // Verify successful authentication
  await expect(page).toHaveURL("/users")

  // Save authentication state to file
  await page.context().storageState({ path: ADMIN_STORAGE_STATE })
})

setup("Authentication as User", async ({ page }) => {
  // Check if the standard User session is still fresh
  if (isSessionValid(USER_STORAGE_STATE)) {
    console.log("--> [Setup] Reusing valid User session. Skipping login.")
    return
  }

  console.log("--> [Setup] User session expired or missing. Logging in...")
  await page.goto("/auth/login")
  await page.fill('input[name="email"]', "employee@test.com")
  await page.fill('input[name="password"]', "12345678")
  await page.click('button[type="submit"]:has-text("LOG IN")')

  // Verify successful authentication
  await expect(page).toHaveURL("/users")

  // Save authentication state to file
  await page.context().storageState({ path: USER_STORAGE_STATE })
})
