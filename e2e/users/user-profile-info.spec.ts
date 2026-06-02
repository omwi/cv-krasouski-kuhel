import { expect, test } from "@playwright/test"

import { SELECTORS, TEST_USER } from "@root/e2e/config"

test.describe("User Profile Information", () => {
  test("should display login inputs and successfully load login screen", async ({
    page,
  }) => {
    await page.goto("/auth/login")

    const title = page.locator("h4")
    await expect(title).toBeVisible()
    await expect(title).toHaveText("Welcome back")

    const emailInput = page.locator('input[type="email"]')
    await expect(emailInput).toBeVisible()
  })

  test("should load user profile and enforce read-only properties if unauthorized", async ({
    page,
  }) => {
    await page.goto("/users/1")
    await expect(page).toHaveURL(/.*\/auth\/login.*/)
  })

  test("should allow authorized users to view and edit profile details", async ({
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

    await page.goto(`/users/${userId}`)
    await expect(page).toHaveURL(new RegExp(`.*/users/${userId}`))

    const firstNameInput = page.locator('input[name="firstName"]')
    const lastNameInput = page.locator('input[name="lastName"]')
    await expect(firstNameInput).toBeVisible()
    await expect(lastNameInput).toBeVisible()

    await firstNameInput.fill("Test")
    await expect(firstNameInput).toHaveValue("Test")
  })
})
