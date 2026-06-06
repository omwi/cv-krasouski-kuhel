import fs from "fs"
import { BrowserContext, expect, test } from "@playwright/test"

async function getUserIdFromCookies(context: BrowserContext): Promise<string> {
  const cookies = await context.cookies()
  const tokenCookie = cookies.find((c) => c.name === "access_token")
  if (!tokenCookie) {
    throw new Error("access_token cookie not found")
  }
  const payloadBase64 = tokenCookie.value.split(".")[1]
  const payloadJson = Buffer.from(payloadBase64, "base64").toString("utf-8")
  const payload = JSON.parse(payloadJson) as { sub: number | string }
  return String(payload.sub)
}

function getUserIdFromStorageState(filePath: string): string {
  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"))
  const cookies = data.cookies as Array<{ name: string; value: string }>
  const tokenCookie = cookies.find((c) => c.name === "access_token")
  if (!tokenCookie) {
    throw new Error("access_token cookie not found in storage state")
  }
  const payloadBase64 = tokenCookie.value.split(".")[1]
  const payloadJson = Buffer.from(payloadBase64, "base64").toString("utf-8")
  const payload = JSON.parse(payloadJson) as { sub: number | string }
  return String(payload.sub)
}

test.describe("User CVs page - admin", () => {
  test.describe("Own Profile CVs (Admin)", () => {
    test.use({ storageState: "playwright/.auth/admin.json" })

    test.beforeEach(async ({ page, context }) => {
      const userId = await getUserIdFromCookies(context)
      await page.goto(`/users/${userId}/cvs`)
      await expect(page.getByTestId("cvs-table")).toBeVisible()
    })

    test("Admin should be able to add, edit, verify details and delete a CV on their own profile", async ({
      page,
      context,
    }) => {
      const userId = await getUserIdFromCookies(context)
      const cvName = `AdminOwnCV-${Date.now()}`

      const createBtn = page.getByTestId("create-cv-button")
      await expect(createBtn).toBeVisible()

      // Create CV
      await createBtn.click()
      await expect(page.getByRole("dialog")).toBeVisible()

      await page.locator('input[id="name"]').fill(cvName)
      await page.locator('input[id="education"]').fill("Admin Academy")
      await page
        .locator('textarea[id="description"]')
        .fill("Admin own CV description.")
      await page.getByTestId("dialog-submit-button").click()

      const successToast = page
        .locator("[data-sonner-toast] [data-title]")
        .filter({ hasText: "CV created successfully!" })
      await expect(successToast).toBeVisible()
      await expect(page.getByRole("dialog")).toBeHidden()

      // Locate row
      const cvRow = page.locator("tr").filter({ hasText: cvName })
      await expect(cvRow).toBeVisible()

      // Edit CV
      await cvRow.getByTestId("row-actions-trigger").click()
      await page.getByTestId("row-action-edit").click()
      await expect(page.getByRole("dialog")).toBeVisible()

      await page
        .locator('textarea[id="description"]')
        .fill("Admin own CV description - edited.")
      await page.getByTestId("dialog-submit-button").click()

      const updateToast = page
        .locator("[data-sonner-toast] [data-title]")
        .filter({ hasText: "CV updated successfully!" })
      await expect(updateToast).toBeVisible()
      await expect(page.getByRole("dialog")).toBeHidden()

      // Verify Details
      await cvRow.getByTestId("row-actions-trigger").click()
      await page.getByTestId("row-action-view").click()
      await expect(page).toHaveURL(/\/cvs\/.+/)

      const detailsTab = page.getByRole("link", { name: "Details" })
      await expect(detailsTab).toBeVisible()

      const updateBtn = page
        .locator('button[type="submit"]')
        .filter({ hasText: "Update" })
      await expect(updateBtn).toBeVisible()

      // Go back and Delete
      await page.goto(`/users/${userId}/cvs`)
      const updatedRow = page.locator("tr").filter({ hasText: cvName })
      await expect(updatedRow).toBeVisible()
      await updatedRow.getByTestId("row-actions-trigger").click()
      await page.getByTestId("row-action-delete").click()

      await expect(page.getByRole("dialog")).toBeVisible()
      await page.getByTestId("delete-dialog-confirm-button").click()

      const deleteToast = page
        .locator("[data-sonner-toast] [data-title]")
        .filter({ hasText: "CV deleted successfully!" })
      await expect(deleteToast).toBeVisible()
      await expect(updatedRow).toBeHidden()
    })
  })

  test.describe("Other Profile CVs (Admin)", () => {
    test.use({ storageState: "playwright/.auth/admin.json" })

    test.beforeEach(async ({ page }) => {
      const employeeId = getUserIdFromStorageState("playwright/.auth/user.json")
      await page.goto(`/users/${employeeId}/cvs`)
      await expect(page.getByTestId("cvs-table")).toBeVisible()
    })

    test("Admin should be able to add, edit, verify details and delete a CV on employee's profile", async ({
      page,
    }) => {
      const employeeId = getUserIdFromStorageState("playwright/.auth/user.json")
      const cvName = `AdminForEmployeeCV-${Date.now()}`

      const createBtn = page.getByTestId("create-cv-button")
      await expect(createBtn).toBeVisible()

      // Create CV
      await createBtn.click()
      await expect(page.getByRole("dialog")).toBeVisible()

      await page.locator('input[id="name"]').fill(cvName)
      await page.locator('input[id="education"]').fill("Employee School")
      await page
        .locator('textarea[id="description"]')
        .fill("Admin created this CV for Employee.")
      await page.getByTestId("dialog-submit-button").click()

      const successToast = page
        .locator("[data-sonner-toast] [data-title]")
        .filter({ hasText: "CV created successfully!" })
      await expect(successToast).toBeVisible()
      await expect(page.getByRole("dialog")).toBeHidden()

      // Locate row
      const cvRow = page.locator("tr").filter({ hasText: cvName })
      await expect(cvRow).toBeVisible()

      // Edit CV
      await cvRow.getByTestId("row-actions-trigger").click()
      await page.getByTestId("row-action-edit").click()
      await expect(page.getByRole("dialog")).toBeVisible()

      await page
        .locator('textarea[id="description"]')
        .fill("Admin created this CV for Employee - edited.")
      await page.getByTestId("dialog-submit-button").click()

      const updateToast = page
        .locator("[data-sonner-toast] [data-title]")
        .filter({ hasText: "CV updated successfully!" })
      await expect(updateToast).toBeVisible()
      await expect(page.getByRole("dialog")).toBeHidden()

      // Verify Details
      await cvRow.getByTestId("row-actions-trigger").click()
      await page.getByTestId("row-action-view").click()
      await expect(page).toHaveURL(/\/cvs\/.+/)

      const detailsTab = page.getByRole("link", { name: "Details" })
      await expect(detailsTab).toBeVisible()

      const updateBtn = page
        .locator('button[type="submit"]')
        .filter({ hasText: "Update" })
      await expect(updateBtn).toBeVisible()

      // Go back and Delete
      await page.goto(`/users/${employeeId}/cvs`)
      const updatedRow = page.locator("tr").filter({ hasText: cvName })
      await expect(updatedRow).toBeVisible()
      await updatedRow.getByTestId("row-actions-trigger").click()
      await page.getByTestId("row-action-delete").click()

      await expect(page.getByRole("dialog")).toBeVisible()
      await page.getByTestId("delete-dialog-confirm-button").click()

      const deleteToast = page
        .locator("[data-sonner-toast] [data-title]")
        .filter({ hasText: "CV deleted successfully!" })
      await expect(deleteToast).toBeVisible()
      await expect(updatedRow).toBeHidden()
    })
  })
})
