import { expect, test } from "@playwright/test"

import { SELECTORS, TEST_USER } from "@root/e2e/config"

test.describe("User Languages Management", () => {
  test("should redirect to login if visiting user languages page when not authenticated", async ({
    page,
  }) => {
    await page.goto("/users/1/languages")
    await expect(page).toHaveURL(/.*\/auth\/login.*/)
  })

  test("should allow authorized users to navigate, add, and remove languages", async ({
    page,
  }) => {
    await page.goto("/auth/login")
    await page.fill(SELECTORS.emailInput, TEST_USER.email)
    await page.fill(SELECTORS.passwordInput, TEST_USER.password)
    await page.click('button[type="submit"]')
    await page.waitForURL(/.*\/users.*/)

    const cookies = await page.context().cookies()
    const tokenCookie = cookies.find((c) => c.name === "access_token")
    if (!tokenCookie) {
      throw new Error("access_token cookie not found after login")
    }
    const payloadBase64 = tokenCookie.value.split(".")[1]
    const payload = JSON.parse(
      Buffer.from(payloadBase64, "base64").toString("utf-8")
    )
    const userId = payload.sub

    await page.goto(`/users/${userId}/languages`)
    await expect(page).toHaveURL(new RegExp(`.*/users/${userId}/languages`))

    await expect(page.locator(".animate-pulse")).toBeHidden()

    await page.click('button:has-text("ADD LANGUAGE")')
    await expect(page.locator('h2:has-text("Add Language")')).toBeVisible()

    await page.locator('button[data-slot="select-trigger"]').nth(0).click()
    const selectedLanguageName = await page
      .locator("role=option >> nth=0")
      .innerText()
    await page.click("role=option >> nth=0")

    await page.locator('button[data-slot="select-trigger"]').nth(1).click()
    await page.click('role=option[name="B2"]')

    await page.click('button:has-text("CONFIRM")')

    await expect(page.locator(".animate-pulse")).toBeHidden()

    const languageTag = page
      .locator("main")
      .getByText(selectedLanguageName, { exact: true })
      .first()
    await expect(languageTag).toBeVisible()

    await page.click('button:has-text("REMOVE LANGUAGE")')

    await languageTag.click()

    await page.click('button:has-text("DELETE")')

    await expect(page.locator(".animate-pulse")).toBeHidden()

    await expect(languageTag).not.toBeVisible()
  })
})
