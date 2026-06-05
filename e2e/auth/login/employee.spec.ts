import { expect, test } from "@playwright/test"

test.describe("Страница авторизации", () => {
  // Перед каждым тестом открываем страницу логина
  test.beforeEach(async ({ page }) => {
    await page.goto("/auth/login")
  })

  test("Успешный вход по email и паролю", async ({ page }) => {
    // 1. Открываем страницу логина
    // 2. Ищем инпут email по атрибуту name="email" и вводим данные
    await page.fill('input[name="email"]', "employee@test.com")

    // 3. Ищем инпут пароля по атрибуту name="password" и вводим пароль
    await page.fill('input[name="password"]', "12345678")

    // 4. Кликаем по кнопке, которая содержит точный текст "ВОЙТИ"
    // text=ВОЙТИ ищет кнопку без учета регистра, но у вас там капс, так что в самый раз
    await page.click('button[type="submit"]:has-text("LOG IN")')

    // 5. Проверяем, что нас перенаправило внутрь системы
    await expect(page).toHaveURL("/users") // замените на ваш внутренний URL
  })

  test("Ошибка при вводе неверного пароля (Sonner Toast)", async ({ page }) => {
    // 1. Вводим данные (используем надежные name из прошлой верстки)
    await page.fill('input[name="email"]', "employee@test.com")
    await page.fill('input[name="password"]', "IncorretPassword123")

    // 2. Кликаем «ВОЙТИ»
    await page.click('button[type="submit"]:has-text("LOG IN")')

    // 3. Ищем тост от библиотеки Sonner
    // 3. Ищем тост от библиотеки Sonner
    const toast = page.locator("[data-sonner-toast]")

    // 4. Проверяем, что тост появился на экране и содержит нужный текст
    await expect(toast).toBeVisible()

    // Или более точечно по атрибуту заголовка внутри тоста:
    await expect(page.locator("[data-sonner-toast] [data-title]")).toHaveText(
      "User not found or invalid password"
    )

    // Проверяем тип тоста (error)
    await expect(toast).toHaveAttribute("data-type", "error")

    // 5. Проверяем, что мы НЕ ушли со страницы логина
    await expect(page).not.toHaveURL("/users")
  })
})
