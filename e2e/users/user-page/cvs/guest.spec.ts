import { expect, test } from "@playwright/test"

test.describe("User CVs page - guest", () => {
  test("Unauthenticated user is redirected to login page", async ({ page }) => {
    await page.goto("/users/999/cvs")
    await expect(page).toHaveURL(/.*\/login/)
  })
})
