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

test.describe("User CVs page - employee", () => {
  test.use({ storageState: "playwright/.auth/user.json" })

  test.describe("Own Profile CVs", () => {
    test.beforeEach(async ({ page, context }) => {
      const userId = await getUserIdFromCookies(context)
      await page.goto(`/users/${userId}/cvs`)
      await expect(page.getByTestId("cvs-table")).toBeVisible()
    })

    test("Should be able to add, edit, verify details and delete a CV on their own profile", async ({
      page,
      context,
    }) => {
      const userId = await getUserIdFromCookies(context)
      const cvName = `CV-${Date.now()}`

      // 1. Initial State Check
      const createBtn = page.getByTestId("create-cv-button")
      await expect(createBtn).toBeVisible()

      // 2. Create a new CV
      await createBtn.click()
      await expect(page.getByRole("dialog")).toBeVisible()

      await page.locator('input[id="name"]').fill(cvName)
      await page.locator('input[id="education"]').fill("Test University")
      await page
        .locator('textarea[id="description"]')
        .fill("Test CV description.")

      await page.getByTestId("dialog-submit-button").click()

      // Wait for success toast
      const successToast = page
        .locator("[data-sonner-toast] [data-title]")
        .filter({ hasText: "CV created successfully!" })
      await expect(successToast).toBeVisible()
      await expect(page.getByRole("dialog")).toBeHidden()

      // Locate the created row
      const cvRow = page.locator("tr").filter({ hasText: cvName })
      await expect(cvRow).toBeVisible()

      // 3. Edit the CV
      await cvRow.getByTestId("row-actions-trigger").click()
      await page.getByTestId("row-action-edit").click()
      await expect(page.getByRole("dialog")).toBeVisible()

      await page
        .locator('textarea[id="description"]')
        .fill("Test CV description - edited.")
      await page.getByTestId("dialog-submit-button").click()

      // Wait for success toast
      const updateToast = page
        .locator("[data-sonner-toast] [data-title]")
        .filter({ hasText: "CV updated successfully!" })
      await expect(updateToast).toBeVisible()
      await expect(page.getByRole("dialog")).toBeHidden()

      // 4. Verify details tab
      await cvRow.getByTestId("row-actions-trigger").click()
      await page.getByTestId("row-action-view").click()
      await expect(page).toHaveURL(/\/cvs\/.+/)

      // Verify Details tab is present
      const detailsTab = page.getByRole("link", { name: "Details" })
      await expect(detailsTab).toBeVisible()

      // Verify form is editable (Update button is visible)
      const updateBtn = page
        .locator('button[type="submit"]')
        .filter({ hasText: "Update" })
      await expect(updateBtn).toBeVisible()

      // Go back to CVs page
      await page.goto(`/users/${userId}/cvs`)
      await expect(page.getByTestId("cvs-table")).toBeVisible()

      // 5. Delete CV
      const updatedRow = page.locator("tr").filter({ hasText: cvName })
      await expect(updatedRow).toBeVisible()
      await updatedRow.getByTestId("row-actions-trigger").click()
      await page.getByTestId("row-action-delete").click()

      await expect(page.getByRole("dialog")).toBeVisible()
      await page.getByTestId("delete-dialog-confirm-button").click()

      // Wait for success toast
      const deleteToast = page
        .locator("[data-sonner-toast] [data-title]")
        .filter({ hasText: "CV deleted successfully!" })
      await expect(deleteToast).toBeVisible()

      // Verify row is deleted
      await expect(updatedRow).toBeHidden()
    })
  })

  test.describe("Other Profile CVs", () => {
    test("Should restrict employee from modifying another user's CVs", async ({
      page,
      context,
    }) => {
      const userId = await getUserIdFromCookies(context)
      const otherUserId = userId === "630" ? "629" : "630"
      await page.goto(`/users/${otherUserId}/cvs`)

      // Verify that the create button is hidden
      await expect(page.getByTestId("create-cv-button")).not.toBeAttached()

      // Check rows - should not have actions trigger, only direct view link
      const cvRows = page.locator("tbody tr")
      const count = await cvRows.count()
      for (let i = 0; i < count; i++) {
        const row = cvRows.nth(i)
        const directViewLink = row.getByTestId("row-direct-view")
        if (await directViewLink.isVisible()) {
          await expect(
            row.getByTestId("row-actions-trigger")
          ).not.toBeAttached()
        }
      }

      // If at least one CV exists, verify read-only details page
      const firstRow = cvRows.first()
      const firstDirectViewLink = firstRow.getByTestId("row-direct-view")
      if (await firstDirectViewLink.isVisible()) {
        await firstDirectViewLink.click()
        await expect(page).toHaveURL(/\/cvs\/.+/)

        // Verify inputs are read-only
        await expect(page.locator('input[id="name"]')).toHaveAttribute(
          "readonly",
          ""
        )
        await expect(page.locator('input[id="education"]')).toHaveAttribute(
          "readonly",
          ""
        )
        await expect(
          page.locator('textarea[id="description"]')
        ).toHaveAttribute("readonly", "")

        // Verify Update button is not visible
        const updateBtn = page
          .locator('button[type="submit"]')
          .filter({ hasText: "Update" })
        await expect(updateBtn).toBeHidden()
      }
    })
  })
})
