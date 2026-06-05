import { expect, test } from "@playwright/test"

test.use({ storageState: "playwright/.auth/user.json" })

test("Успешный логаут из системы", async ({ page }) => {
  // 1. Заходим на главную страницу
  await page.goto("/users")

  // 2. Открываем меню пользователя
  await page.getByTestId("nav-avatar").click()
  // 3. Находим кнопку или ссылку выхода (Log out / Выйти)
  // Часто это бывает либо ссылка <a>, либо кнопка <button>, поэтому ищем по тексту
  const logoutButton = page
    .locator("button, a")
    .filter({ hasText: /Logout|Выйти/i })
  await logoutButton.click()

  // 4. Проверяем, что нас перенаправило на страницу входа
  await expect(page).toHaveURL(/.*\/auth\/login/)

  // 5. ПРОВЕРКА ЗАЩИТЫ: Пробуем снова зайти на защищенную страницу /users
  await page.goto("/users")

  // Система должна отказать в доступе и вернуть обратно на логин
  await expect(page).toHaveURL(/.*\/auth\/login/)
})
