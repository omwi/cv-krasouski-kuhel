import { expect, test } from "@playwright/test"

import { SELECTORS, TEST_USER } from "@root/e2e/config"

test.describe("User Skills Management", () => {
  test("should redirect to login if visiting user skills page when not authenticated", async ({
    page,
  }) => {
    await page.goto("/users/1/skills")
    await expect(page).toHaveURL(/.*\/auth\/login.*/)
  })

  test("should allow authorized users to navigate, add, and remove skills", async ({
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

    await page.goto(`/users/${userId}/skills`)
    await expect(page).toHaveURL(new RegExp(`.*/users/${userId}/skills`))

    await expect(page.locator(".animate-pulse")).toBeHidden()

    await page.click('button:has-text("ADD SKILL")')
    await expect(page.locator('h2:has-text("Add skill")')).toBeVisible()

    await page.click('button[role="combobox"]')
    await page.fill('input[placeholder*="Search"]', "React")
    await page.click('div.cursor-pointer:has-text("React")')

    const selectedSkillName = "React"

    await page.click('button[data-slot="select-trigger"]')
    await page.click('role=option[name="Advanced"]')

    await page.click('button:has-text("CONFIRM")')

    await expect(page.locator(".animate-pulse")).toBeHidden()

    const skillTag = page.getByText(selectedSkillName, { exact: true })
    await expect(skillTag).toBeVisible()

    await page.click('button:has-text("REMOVE SKILLS")')

    await skillTag.click()

    await page.click('button:has-text("DELETE")')

    await expect(page.locator(".animate-pulse")).toBeHidden()

    await expect(skillTag).not.toBeVisible()
  })
})
