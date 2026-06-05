import { expect, test as setup } from "@playwright/test"

// Пути, куда мы сохраним файлы сессий
export const ADMIN_STORAGE_STATE = "playwright/.auth/admin.json"
export const USER_STORAGE_STATE = "playwright/.auth/user.json"

setup("Авторизация как Admin", async ({ page }) => {
  await page.goto("/auth/login")
  await page.fill('input[name="email"]', "admin@test.com")
  await page.fill('input[name="password"]', "12345678")
  await page.click('button[type="submit"]:has-text("LOG IN")')

  // Ждем, что залогинились (например, перешли на дашборд)
  await expect(page).toHaveURL("/users")

  // Сохраняем состояние в файл
  await page.context().storageState({ path: ADMIN_STORAGE_STATE })
})

setup("Авторизация как User", async ({ page }) => {
  await page.goto("/auth/login")
  await page.fill('input[name="email"]', "employee@test.com")
  await page.fill('input[name="password"]', "12345678")
  await page.click('button[type="submit"]:has-text("LOG IN")')

  await expect(page).toHaveURL("/users")

  // Сохраняем состояние во второй файл
  await page.context().storageState({ path: USER_STORAGE_STATE })
})
