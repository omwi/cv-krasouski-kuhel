import { expect, test } from "@playwright/test"

// Используем готовую сессию пользователя
test.use({ storageState: "playwright/.auth/user.json" })

test("Переход в настройки через выпадающее меню", async ({ page }) => {
  // 1. Заходим на главную страницу
  await page.goto("/users")

  // 2. Кликаем на кнопку меню пользователя (универсальный локатор без email)
  await page.getByTestId("nav-avatar").click()
  // 3. Находим ссылку «Настройки» или «Settings» внутри меню и кликаем
  // Ищет тег <a>, который содержит слово "Settings" или "Настройки" (выберите нужное)
  const settingsLink = page
    .locator("a")
    .filter({ hasText: /Settings|Настройки/i })
  await settingsLink.click()

  // 4. Проверяем, что успешно перешли в раздел настроек
  await expect(page).toHaveURL(/.*\/settings/)
})
