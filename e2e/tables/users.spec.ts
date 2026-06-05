import { expect, Page, test } from "@playwright/test"

function getTable(page: Page) {
  return page.getByTestId("users-table")
}
function getRows(page: Page) {
  return getTable(page).locator("tbody tr")
}
function getCreateBtn(page: Page) {
  return page.getByTestId("create-user-btn")
}
function getDeleteAction(page: Page) {
  return page.getByTestId("row-action-delete")
}
function getEditAction(page: Page) {
  return page.getByTestId("row-action-edit")
}
function getViewAction(page: Page) {
  return page.getByTestId("row-action-view")
}

async function waitForTableData(page: Page) {
  const table = getTable(page)

  await expect(table).toBeVisible()
}

test.describe("Users page - guest", () => {
  test("Unauthenticated user is redirected to login page", async ({ page }) => {
    await page.goto("/users")

    await expect(page).toHaveURL(/.*\/login/)
  })
})

test.describe("Users page - employee", () => {
  test.use({ storageState: "playwright/.auth/user.json" })

  test.beforeEach(async ({ page }) => {
    await page.goto("/users")
    await waitForTableData(page)
  })

  test("Table is visible and contains at least 2 rows", async ({ page }) => {
    const rowCount = await getRows(page).count()

    expect(rowCount, "Expected at least 2 user rows").toBeGreaterThan(1)
  })

  test("Create button is not present", async ({ page }) => {
    await expect(getCreateBtn(page)).not.toBeAttached()
  })

  test("Own row actions contain View and Edit only", async ({ page }) => {
    await getRows(page)
      .first()
      .getByTestId("row-actions-trigger")
      .click({ delay: 1000 })

    await expect(getViewAction(page)).toBeVisible()
    await expect(getEditAction(page)).toBeVisible()
    await expect(getDeleteAction(page)).not.toBeAttached()
  })

  test("Own row View navigates to user details page", async ({ page }) => {
    await getRows(page)
      .first()
      .getByTestId("row-actions-trigger")
      .click({ delay: 1000 })

    await getViewAction(page).click()

    await expect(page).toHaveURL(/\/users\/.+/)
  })

  test("Own row Edit opens update dialog", async ({ page }) => {
    await getRows(page)
      .first()
      .getByTestId("row-actions-trigger")
      .click({ delay: 1000 })

    await getEditAction(page).click()

    await expect(page.getByRole("dialog")).toBeVisible()
  })

  test("Other rows have direct view links", async ({ page }) => {
    const rows = getRows(page)
    const count = await rows.count()

    for (let i = 1; i < count; i++) {
      await expect(rows.nth(i).getByTestId("row-direct-view")).toBeVisible()
    }
  })

  test("Clicking direct view navigates to user details page", async ({
    page,
  }) => {
    await getRows(page)
      .nth(1)
      .getByTestId("row-direct-view")
      .click({ delay: 1000 })

    await expect(page).toHaveURL(/\/users\/.+/)
  })
})

test.describe("Users page - admin", () => {
  test.use({ storageState: "playwright/.auth/admin.json" })

  test.beforeEach(async ({ page }) => {
    await page.goto("/users")
    await waitForTableData(page)
  })

  test("Table is visible and contains at least 2 rows", async ({ page }) => {
    const rowCount = await getRows(page).count()

    expect(rowCount, "Expected at least 2 user rows").toBeGreaterThan(1)
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

  test("Current user row contains View and Edit but not Delete", async ({
    page,
  }) => {
    await getRows(page)
      .first()
      .getByTestId("row-actions-trigger")
      .click({ delay: 1000 })

    await expect(getViewAction(page)).toBeVisible()
    await expect(getEditAction(page)).toBeVisible()
    await expect(getDeleteAction(page)).not.toBeAttached()
  })

  test("Other user rows contain View, Edit and Delete", async ({ page }) => {
    await getRows(page)
      .nth(1)
      .getByTestId("row-actions-trigger")
      .click({ delay: 1000 })

    await expect(getViewAction(page)).toBeVisible()
    await expect(getEditAction(page)).toBeVisible()
    await expect(getDeleteAction(page)).toBeVisible()
  })

  test("Current user row View navigates to user details page", async ({
    page,
  }) => {
    await getRows(page)
      .first()
      .getByTestId("row-actions-trigger")
      .click({ delay: 1000 })

    await getViewAction(page).click()

    await expect(page).toHaveURL(/\/users\/.+/)
  })

  test("Clicking View navigates to other user details page", async ({
    page,
  }) => {
    await getRows(page)
      .nth(1)
      .getByTestId("row-actions-trigger")
      .click({ delay: 1000 })

    await getViewAction(page).click()

    await expect(page).toHaveURL(/\/users\/.+/)
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
      .nth(1)
      .getByTestId("row-actions-trigger")
      .click({ delay: 1000 })

    await getDeleteAction(page).click()

    await expect(page.getByRole("dialog")).toBeVisible()
  })
})
