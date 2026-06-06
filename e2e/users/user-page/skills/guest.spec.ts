import { expect, test } from "@playwright/test"

test.describe("User Skills page - guest", () => {
  test("Unauthenticated user is redirected to login page", async ({ page }) => {
    await page.goto("/users/630/skills")

    await expect(page).toHaveURL(/.*\/login/)
  })
})
