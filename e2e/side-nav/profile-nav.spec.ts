import { expect, test } from "@playwright/test"

// 1. Указываем Playwright взять готовую сессию обычного пользователя.
// Теперь браузер откроется сразу залогиненным!
test.use({ storageState: "playwright/.auth/user.json" })

test("Переход в профиль сотрудника через выпадающее меню", async ({ page }) => {
  // 2. Заходим на главную страницу (система пустит нас без ввода пароля)
  await page.goto("/users")

  // 3. Ищем кнопку меню пользователя (поповер) и кликаем
  await page.getByTestId("nav-avatar").click()

  // 4. Находим и кликаем на ссылку «Профиль» (с защитой от изменения ID пользователя)
  const profileLink = page
    .locator('a[href^="/users/"]')
    .filter({ hasText: "Profile" })
  await profileLink.click()

  // 5. Проверяем, что успешно перешли на страницу профиля
  await expect(page).toHaveURL(/\/users\/\d+/)
})
