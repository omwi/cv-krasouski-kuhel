import { expect, test } from "@playwright/test"

test.describe("User Languages page - guest", () => {
  test("Unauthenticated user is redirected to login page", async ({ page }) => {
    await page.goto("/users/999/languages")

    await expect(page).toHaveURL(/.*\/login/)
  })
})
