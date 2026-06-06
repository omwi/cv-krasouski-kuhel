import { expect, test } from "@playwright/test"

test.describe("User Skills page - employee", () => {
  test.use({ storageState: "playwright/.auth/user.json" })

  test.describe("Own Profile Skills", () => {
    test.beforeEach(async ({ page }) => {
      // 630 is the standard employee's user ID
      await page.goto("/users/630/skills")
      await expect(page.getByTestId("add-skill-button")).toBeVisible()
    })

    test("Should be able to add, edit, and delete a skill on their own profile", async ({
      page,
    }) => {
      // 1. Initial State Check
      const addBtn = page.getByTestId("add-skill-button")
      await expect(addBtn).toBeVisible()

      // If user has no skills, verify remove-skills-button is hidden or not attached.
      const removeBtn = page.getByTestId("remove-skills-button")
      const skillCards = page.locator('[data-testid^="skill-item-"]')
      const initialSkillCount = await skillCards.count()

      if (initialSkillCount === 0) {
        await expect(removeBtn).toBeHidden()
      } else {
        await expect(removeBtn).toBeVisible()
      }

      // 2. Add a new skill
      await addBtn.click()
      await expect(page.getByRole("dialog")).toBeVisible()

      // Click the combobox to open the popover
      await page.getByTestId("skill-select").click()

      // Get first available option
      const firstOption = page.locator("role=option").first()
      await expect(firstOption).toBeVisible()
      const targetSkill = (await firstOption.textContent())?.trim()
      if (!targetSkill) {
        throw new Error("No available skills to add in Combobox")
      }

      // Select that skill
      await firstOption.click()

      // Choose mastery "Novice"
      await page.getByTestId("skill-mastery-select").click()
      await page.locator('role=option[name="Novice"]').click()

      // Submit
      await page.getByTestId("dialog-submit-button").click()

      // Wait for success toast
      const successToast = page
        .locator("[data-sonner-toast] [data-title]")
        .filter({ hasText: "Skill was added" })
      await expect(successToast).toBeVisible()
      await expect(page.getByRole("dialog")).toBeHidden()

      // 3. Edit the skill
      const addedSkillCard = page.getByTestId(`skill-item-${targetSkill}`)
      await expect(addedSkillCard).toBeVisible()
      await addedSkillCard.click()

      // Verify update dialog is visible
      await expect(page.getByRole("dialog")).toBeVisible()

      // Change mastery to "Proficient"
      await page.getByTestId("skill-mastery-select").click()
      await page.locator('role=option[name="Proficient"]').click()

      // Submit
      await page.getByTestId("dialog-submit-button").click()

      // Wait for success toast
      const updateToast = page
        .locator("[data-sonner-toast] [data-title]")
        .filter({ hasText: "Skill was updated" })
      await expect(updateToast).toBeVisible()
      await expect(page.getByRole("dialog")).toBeHidden()

      // 4. Select skills and delete
      const removeBtnNow = page.getByTestId("remove-skills-button")
      await expect(removeBtnNow).toBeVisible()
      await removeBtnNow.click()

      // In selection mode, click the added skill to select it
      await addedSkillCard.click()

      // Click delete button in selection mode
      const confirmDeleteBtn = page.getByTestId("confirm-delete-button")
      await expect(confirmDeleteBtn).toBeEnabled()
      await confirmDeleteBtn.click()

      // Wait for success toast
      const deleteToast = page
        .locator("[data-sonner-toast] [data-title]")
        .filter({ hasText: "Skill was removed" })
      await expect(deleteToast).toBeVisible()

      // Verify skill is gone
      await expect(addedSkillCard).toBeHidden()
    })
  })

  test.describe("Other Profile Skills", () => {
    test("Should restrict employee from modifying another user's skills", async ({
      page,
    }) => {
      // Navigate to a different user profile (e.g., admin user ID 629)
      await page.goto("/users/629/skills")

      // Verify that the skills modification panel / buttons are hidden
      await expect(page.getByTestId("user-skills-actions")).toBeHidden()
      await expect(page.getByTestId("add-skill-button")).toBeHidden()
      await expect(page.getByTestId("remove-skills-button")).toBeHidden()

      // Verify skill items are present but disabled (cannot open edit dialog)
      const skillCards = page.locator('[data-testid^="skill-item-"]')
      const count = await skillCards.count()
      for (let i = 0; i < count; i++) {
        await expect(skillCards.nth(i)).toBeDisabled()
      }
    })
  })
})
