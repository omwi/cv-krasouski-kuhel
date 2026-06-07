import { expect, test } from "@playwright/test"

test.describe("CV Projects page - guest", () => {
  test("Unauthenticated user is redirected to login page", async ({ page }) => {
    await page.goto("/cvs/999/projects")
    await expect(page).toHaveURL(/.*\/login/)
  })
})
