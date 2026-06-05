import { expect, test } from "@playwright/test"

// Загружаем готовую сессию авторизованного пользователя
test.use({ storageState: "playwright/.auth/user.json" })

test.describe("Боковая панель навигации (Sidebar)", () => {
  // Перед каждым тестом ставим десктопное разрешение, чтобы видеть все пункты меню
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 })
    await page.goto("/users") // Начинаем с базовой страницы
  })

  // Описываем карту навигации: какой текст ищем внутри тега nav и какой URL ожидаем
  const navLinks = [
    { text: "Employees", expectedUrl: /.*\/users/ },
    { text: "Skills", expectedUrl: /.*\/skills/ },
    { text: "Languages", expectedUrl: /.*\/languages/ },
    { text: "CVs", expectedUrl: /.*\/cvs/ },
    { text: "Positions", expectedUrl: /.*\/positions/ },
    { text: "Projects", expectedUrl: /.*\/projects/ },
    { text: "Departments", expectedUrl: /.*\/departments/ },
  ]

  // Запускаем динамические тесты в цикле
  for (const link of navLinks) {
    test(`Переход в раздел ${link.text}`, async ({ page }) => {
      // Ищем ссылку строго внутри тега <nav>, ориентируясь на текст во вложенном <span>
      const menuButton = page.locator("nav a").filter({ hasText: link.text })

      // Проверяем, что кнопка видна на экране, и кликаем по ней
      await expect(menuButton).toBeVisible()
      await menuButton.click()

      // Проверяем, что URL изменился на правильный
      await expect(page).toHaveURL(link.expectedUrl)
    })
  }
})
