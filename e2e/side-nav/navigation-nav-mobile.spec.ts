import { expect, test } from "@playwright/test"

test.use({
  storageState: "playwright/.auth/user.json",
})

test.describe("Mobile Navigation by href Attributes", () => {
  test.beforeEach(async ({ page }) => {
    // Set mobile viewport dimensions before each test
    await page.setViewportSize({ width: 400, height: 720 })
    await page.goto("/users")
  })

  // Navigation map: look for precise href values, then verify redirection via expectedUrl
  const mobileRoutes = [
    { href: "/users", expectedUrl: /.*\/users/ },
    { href: "/skills", expectedUrl: /.*\/skills/ },
    { href: "/languages", expectedUrl: /.*\/languages/ },
  ]

  for (const route of mobileRoutes) {
    test(`Mobile navigation using link ${route.href}`, async ({ page }) => {
      // Find the link inside the <nav> tag using its href attribute
      const navLink = page.locator(`nav a[href="${route.href}"]`)

      // Verify that the link element (or its nested icon) is attached to the DOM tree
      await expect(navLink).toBeAttached()

      // Click the icon/link
      await navLink.click({ force: true })
      // Verify that the URL successfully updated
      await expect(page).toHaveURL(route.expectedUrl)
    })
  }

  test("Verify that desktop-only sections are hidden on mobile layouts", async ({
    page,
  }) => {
    // Routes that use classes like 'hidden md:flex' to stay hidden on mobile viewports
    const desktopOnlyRoutes = [
      "/cvs",
      "/positions",
      "/projects",
      "/departments",
    ]

    for (const href of desktopOnlyRoutes) {
      const hiddenLink = page.locator(`nav a[href="${href}"]`)

      // Strict assertion to ensure they are not visible on mobile viewports
      await expect(hiddenLink).toBeHidden()
    }
  })
})
