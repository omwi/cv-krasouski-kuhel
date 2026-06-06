import { expect, test } from "@playwright/test"
import i18nConfig from "i18n.config"

const { supportedLngs, fallbackLng } = i18nConfig

test.describe("Settings page - guest", () => {
  test("Unauthenticated user is redirected to login page", async ({ page }) => {
    await page.goto("/settings")

    await expect(page).toHaveURL(/.*\/login/)
  })
})

test.describe("Settings page - authenticated", () => {
  test.use({ storageState: "playwright/.auth/user.json" })

  test.beforeEach(async ({ page }) => {
    await page.goto("/settings")
  })

  test("Settings page loads", async ({ page }) => {
    await expect(page.locator("#theme-select")).toBeVisible()
    await expect(page.locator("#language-select")).toBeVisible()
  })

  test("User can switch theme", async ({ page }) => {
    const html = page.locator("html")

    await page.locator("#theme-select").click()
    await page.getByRole("option", { name: /light/i }).click()

    await expect(html).not.toHaveClass(/dark/)

    await page.locator("#theme-select").click()
    await page.getByRole("option", { name: /dark/i }).click()

    await expect(html).toHaveClass(/dark/)
  })

  test("User can switch language", async ({ page }) => {
    const currentUrl = page.url()
    const currentLanguage =
      supportedLngs.find((lng) =>
        currentUrl.match(new RegExp(`/${lng}(/|$)`))
      ) ?? fallbackLng

    const targetLanguage = supportedLngs.find((lng) => lng !== currentLanguage)

    expect(targetLanguage).toBeDefined()

    await page.locator("#language-select").click()
    await page.getByTestId(targetLanguage!).click()

    await expect(page).toHaveURL(new RegExp(`/${targetLanguage}(/|$)`))
  })
})
