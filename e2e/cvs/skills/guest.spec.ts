import { expect, test } from "@playwright/test"

test.describe("CV Skills page - guest", () => {
  test("Unauthenticated user is redirected to login page", async ({ page }) => {
    await page.goto("/cvs/999/skills")
    await expect(page).toHaveURL(/.*\/login/)
  })
})
