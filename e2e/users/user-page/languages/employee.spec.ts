import { expect, test } from "@playwright/test"

test.describe("User Languages page - employee", () => {
  test.use({ storageState: "playwright/.auth/user.json" })

  test.describe("Own Profile Languages", () => {
    test.beforeEach(async ({ page }) => {
      // 630 is the standard employee's user ID
      await page.goto("/users/630/languages")
      await expect(page.getByTestId("add-language-button")).toBeVisible()
    })

    test("Should be able to add, edit, and delete a language on their own profile", async ({
      page,
    }) => {
      // 1. Initial State Check
      const addBtn = page.getByTestId("add-language-button")
      await expect(addBtn).toBeVisible()

      // If user has no languages, verify remove-languages-button is hidden or not attached.
      const removeBtn = page.getByTestId("remove-languages-button")
      const langCards = page.locator('[data-testid^="language-item-"]')
      const initialLangCount = await langCards.count()

      if (initialLangCount === 0) {
        await expect(removeBtn).toBeHidden()
      } else {
        await expect(removeBtn).toBeVisible()
      }

      // 2. Add a new language
      await addBtn.click()
      await expect(page.getByRole("dialog")).toBeVisible()

      // Click the combobox to open the popover
      await page.getByTestId("language-select").click()

      // Get first available option
      const firstOption = page.locator("role=option").first()
      await expect(firstOption).toBeVisible()
      const targetLang = (await firstOption.textContent())?.trim()
      if (!targetLang) {
        throw new Error("No available languages to add in Combobox")
      }

      // Select that language
      await firstOption.click()

      // Choose proficiency "A1"
      await page.getByTestId("language-proficiency-select").click()
      await page.locator('role=option[name="A1"]').click()

      // Submit
      await page.getByTestId("dialog-submit-button").click()

      // Wait for success toast
      const successToast = page
        .locator("[data-sonner-toast] [data-title]")
        .filter({ hasText: "Language was added" })
      await expect(successToast).toBeVisible()
      await expect(page.getByRole("dialog")).toBeHidden()

      // 3. Edit the language
      const addedLangCard = page.getByTestId(`language-item-${targetLang}`)
      await expect(addedLangCard).toBeVisible()
      await addedLangCard.click()

      // Verify update dialog is visible
      await expect(page.getByRole("dialog")).toBeVisible()

      // Change proficiency to "B2"
      await page.getByTestId("language-proficiency-select").click()
      await page.locator('role=option[name="B2"]').click()

      // Submit
      await page.getByTestId("dialog-submit-button").click()

      // Wait for success toast
      const updateToast = page
        .locator("[data-sonner-toast] [data-title]")
        .filter({ hasText: "Language was updated" })
      await expect(updateToast).toBeVisible()
      await expect(page.getByRole("dialog")).toBeHidden()

      // 4. Select languages and delete
      const removeBtnNow = page.getByTestId("remove-languages-button")
      await expect(removeBtnNow).toBeVisible()
      await removeBtnNow.click()

      // In selection mode, click the added language to select it
      await addedLangCard.click()

      // Click delete button in selection mode
      const confirmDeleteBtn = page.getByTestId("confirm-delete-button")
      await expect(confirmDeleteBtn).toBeEnabled()
      await confirmDeleteBtn.click()

      // Wait for success toast
      const deleteToast = page
        .locator("[data-sonner-toast] [data-title]")
        .filter({ hasText: "Language was removed" })
      await expect(deleteToast).toBeVisible()

      // Verify language is gone
      await expect(addedLangCard).toBeHidden()
    })
  })

  test.describe("Other Profile Languages", () => {
    test("Should restrict employee from modifying another user's languages", async ({
      page,
    }) => {
      // Navigate to a different user profile (e.g., admin user ID 629)
      await page.goto("/users/629/languages")

      // Verify that the languages modification panel / buttons are hidden
      await expect(page.getByTestId("user-languages-actions")).toBeHidden()
      await expect(page.getByTestId("add-language-button")).toBeHidden()
      await expect(page.getByTestId("remove-languages-button")).toBeHidden()

      // Verify language items are present but disabled (cannot open edit dialog)
      const langCards = page.locator('[data-testid^="language-item-"]')
      const count = await langCards.count()
      for (let i = 0; i < count; i++) {
        await expect(langCards.nth(i)).toBeDisabled()
      }
    })
  })
})
