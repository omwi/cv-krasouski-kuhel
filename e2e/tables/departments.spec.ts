import { expect, Page, test } from "@playwright/test"

function getTable(page: Page) {
  return page.getByTestId("departments-table")
}
function getRows(page: Page) {
  return getTable(page).locator("tbody tr")
}
function getCreateBtn(page: Page) {
  return page.getByTestId("create-department-btn")
}
function getDeleteAction(page: Page) {
  return page.getByTestId("row-action-delete")
}
function getEditAction(page: Page) {
  return page.getByTestId("row-action-edit")
}

async function waitForTableData(page: Page) {
  const table = getTable(page)

  await expect(table).toBeVisible()
}

test.describe("Departments page - guest", () => {
  test("Unauthenticated user is redirected to login page", async ({ page }) => {
    await page.goto("/departments")

    await expect(page).toHaveURL(/.*\/login/)
  })
})

test.describe("Departments page - employee", () => {
  test.use({ storageState: "playwright/.auth/user.json" })

  test.beforeEach(async ({ page }) => {
    await page.goto("/departments")
    await waitForTableData(page)
  })

  test("Table is visible and contains at least one row", async ({ page }) => {
    const rowCount = await getRows(page).count()

    expect(rowCount, "Expected at least one department row").toBeGreaterThan(0)
  })

  test("Create button is not present", async ({ page }) => {
    await expect(getCreateBtn(page)).not.toBeAttached()
  })

  test("Row actions trigger is not present on any row", async ({ page }) => {
    const rowActions = page.getByTestId("row-actions-trigger")

    await expect(rowActions).not.toBeAttached()
  })
})

test.describe("Departments page - admin", () => {
  test.use({ storageState: "playwright/.auth/admin.json" })

  test.beforeEach(async ({ page }) => {
    await page.goto("/departments")
    await waitForTableData(page)
  })

  test("Table is visible and contains at least one row", async ({ page }) => {
    const rowCount = await getRows(page).count()

    expect(rowCount, "Expected at least one department row").toBeGreaterThan(0)
  })

  test("Create button is visible", async ({ page }) => {
    await expect(getCreateBtn(page)).toBeVisible()
  })

  test("Clicking Create button opens the create dialog", async ({ page }) => {
    await getCreateBtn(page).click({ delay: 1000 })

    await expect(page.getByRole("dialog")).toBeVisible()
  })

  test("Row actions trigger is visible on every row", async ({ page }) => {
    const rowsCount = await getRows(page).count()
    const triggersCount = await page.getByTestId("row-actions-trigger").count()

    expect(rowsCount).toBe(triggersCount)
  })

  test("Row actions popover contains Edit and Delete options", async ({
    page,
  }) => {
    await getRows(page)
      .first()
      .getByTestId("row-actions-trigger")
      .click({ delay: 1000 })

    await expect(getEditAction(page)).toBeVisible()
    await expect(getDeleteAction(page)).toBeVisible()
  })

  test("Clicking Edit opens the update dialog", async ({ page }) => {
    await getRows(page)
      .first()
      .getByTestId("row-actions-trigger")
      .click({ delay: 1000 })
    await getEditAction(page).click()

    await expect(page.getByRole("dialog")).toBeVisible()
  })

  test("Clicking Delete opens the delete confirmation dialog", async ({
    page,
  }) => {
    await getRows(page)
      .first()
      .getByTestId("row-actions-trigger")
      .click({ delay: 1000 })
    await getDeleteAction(page).click()

    await expect(page.getByRole("dialog")).toBeVisible()
  })
})
