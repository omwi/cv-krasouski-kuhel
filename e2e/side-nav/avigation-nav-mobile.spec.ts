import { devices, expect, test } from "@playwright/test"

test.use({
  storageState: "playwright/.auth/user.json",
})

test.describe("Мобильная навигация по атрибутам href", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 400, height: 720 })
    await page.goto("/users")
  })

  // Карта навигации: ищем по точному href, проверяем переход по expectedUrl
  const mobileRoutes = [
    { href: "/users", expectedUrl: /.*\/users/ },
    { href: "/skills", expectedUrl: /.*\/skills/ },
    { href: "/languages", expectedUrl: /.*\/languages/ },
  ]

  for (const route of mobileRoutes) {
    test(`Мобильный переход по ссылке ${route.href}`, async ({ page }) => {
      // Находим ссылку внутри <nav> по её атрибуту href
      const navLink = page.locator(`nav a[href="${route.href}"]`)

      // Проверяем, что сама ссылка (иконка в ней) присутствует в DOM-дереве
      await expect(navLink).toBeAttached()

      // Нажимаем на иконку/ссылку
      await navLink.click()

      // Проверяем, что успешно перешли по URL
      await expect(page).toHaveURL(route.expectedUrl)
    })
  }

  test("Проверка, что десктопные разделы скрыты на мобилке", async ({
    page,
  }) => {
    // Ссылки, которые на мобилке имеют класс hidden md:flex
    const desktopOnlyRoutes = [
      "/cvs",
      "/positions",
      "/projects",
      "/departments",
    ]

    for (const href of desktopOnlyRoutes) {
      const hiddenLink = page.locator(`nav a[href="${href}"]`)
      // Железно проверяем, что на мобилке их не видно
      await expect(hiddenLink).toBeHidden()
    }
  })
})
