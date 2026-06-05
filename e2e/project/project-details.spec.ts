import { expect, test } from "@playwright/test"

test.describe("Project details page - guest", () => {
  test("Unauthenticated user is redirected to login page", async ({ page }) => {
    await page.goto("/projects/1")

    await expect(page).toHaveURL(/.*\/login/)
  })
})

test.describe("Project details page - employee", () => {
  test.use({ storageState: "playwright/.auth/user.json" })

  test("Employee can view project details", async ({ page }) => {
    await page.goto("/projects/1")

    await expect(page.getByTestId("project-name")).toBeVisible()
  })
})

test.describe("Project details page - admin", () => {
  test.use({ storageState: "playwright/.auth/admin.json" })

  test("Admin can view project details", async ({ page }) => {
    await page.goto("/projects/1")

    await expect(page.getByTestId("project-name")).toBeVisible()
  })
})
