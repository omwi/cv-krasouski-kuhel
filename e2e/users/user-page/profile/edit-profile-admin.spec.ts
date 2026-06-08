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

test.describe("Profile Editing Permissions", () => {
  // =========================================================================
  // СЦЕНАРИЙ 1: Пользователь редактирует свой собственный профиль
  // =========================================================================
  test.describe("User Self-Editing", () => {
    test.use({ storageState: "playwright/.auth/user.json" })
    test.beforeEach(async ({ page, context }) => {
      const userId = await getUserIdFromCookies(context)
      await page.goto(`/users/${userId}`)
    })

    test("Should allow user to modify their own profile parameters and avatar", async ({
      page,
    }) => {
      const firstNameInput = page.locator('input[name="firstName"]')
      const lastNameInput = page.locator('input[name="lastName"]')
      const departmentDropdown = page.getByTestId("select-department-trigger")
      const positionDropdown = page.getByTestId("select-position-trigger")
      const updateButton = page.getByTestId("profile-update-button")

      await expect(firstNameInput).toBeVisible()
      await expect(lastNameInput).toBeVisible()
      await expect(updateButton).toBeDisabled()

      // 1. Clear avatar if exists
      const deleteAvatarButton = page.locator('span[data-slot="avatar"] button')
      if (await deleteAvatarButton.isVisible()) {
        await deleteAvatarButton.click({ force: true })
      }

      // 2. Introduce mutations
      await firstNameInput.clear()
      await firstNameInput.fill(`John-${Date.now()}`)
      await lastNameInput.clear()
      await lastNameInput.fill("Doe")

      await departmentDropdown.click()
      await page.locator('role=option[name="Quality Assurance"]').click()

      await positionDropdown.click()
      await page.locator('role=option[name="Software Engineer"]').click()

      // 3. Upload file from buffer
      const imageUrl = "https://picsum.photos/200/300.jpg"
      const response = await page.request.get(imageUrl)
      const imageBuffer = await response.body()

      const fileInput = page.locator('input[type="file"]')
      await fileInput.setInputFiles({
        name: "avatar.jpg",
        mimeType: "image/jpeg",
        buffer: imageBuffer,
      })
      await fileInput.dispatchEvent("change")

      // 4. Submit and verify success
      await expect(updateButton).toBeEnabled()
      await updateButton.click()

      const successToast = page
        .locator("[data-sonner-toast] [data-title]")
        .filter({ hasText: "Profile updated successfully" })
      await expect(successToast).toBeVisible()
    })
  })

  // =========================================================================
  // СЦЕНАРИЙ 2: Администратор редактирует чужой профиль (пользователя 630)
  // =========================================================================
  test.describe("Admin Editing Someone Else's Profile", () => {
    // Говорим Playwright взять сессию глобального администратора для этого блока тестов
    test.use({ storageState: "playwright/.auth/admin.json" })

    test.beforeEach(async ({ page }) => {
      // Администратор заходит на страницу того же самого пользователя 630 (employee)
      const employeeId = getUserIdFromStorageState("playwright/.auth/user.json")
      await page.goto(`/users/${employeeId}`)
    })

    test("Should allow admin to modify employee parameters, update avatar and save changes", async ({
      page,
    }) => {
      const firstNameInput = page.locator('input[name="firstName"]')
      const lastNameInput = page.locator('input[name="lastName"]')
      const departmentDropdown = page.getByTestId("select-department-trigger")
      const positionDropdown = page.getByTestId("select-position-trigger")
      const updateButton = page.getByTestId("profile-update-button")

      // Проверяем, что админу так же доступны поля ввода и кнопка заблокирована по умолчанию
      await expect(firstNameInput).toBeVisible()
      await expect(lastNameInput).toBeVisible()
      await expect(updateButton).toBeDisabled()

      // 1. Удаление текущего аватара пользователя администратором
      const deleteAvatarButton = page.locator('span[data-slot="avatar"] button')
      if (await deleteAvatarButton.isVisible()) {
        await deleteAvatarButton.click({ force: true })
      }

      // 2. Внесение изменений в чужую карточку
      await firstNameInput.clear()
      await firstNameInput.fill(`John-${Date.now()}`)
      await lastNameInput.clear()
      await lastNameInput.fill("AdminChangedLastName")

      // Меняем департамент и позицию сотрудника
      await departmentDropdown.click()
      await page.locator('role=option[name="DevOps"]').click()

      await positionDropdown.click()
      await page.locator('role=option[name="DevOps Engineer"]').click()

      // 3. Загрузка нового аватара для сотрудника администратором
      const imageUrl = "https://picsum.photos/200/300.jpg"
      const response = await page.request.get(imageUrl)
      const imageBuffer = await response.body()

      const fileInput = page.locator('input[type="file"]')
      await fileInput.setInputFiles({
        name: "avatar.jpg",
        mimeType: "image/jpeg",
        buffer: imageBuffer,
      })
      await fileInput.dispatchEvent("change")

      // 4. Отправка формы администратором и проверка тоста успешного сохранения
      await expect(updateButton).toBeEnabled()
      await updateButton.click()

      const successToast = page
        .locator("[data-sonner-toast] [data-title]")
        .filter({ hasText: "Profile updated successfully" })
      await expect(successToast).toBeVisible()
    })
  })
})
