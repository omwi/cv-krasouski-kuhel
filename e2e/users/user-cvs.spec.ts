import { expect, test } from "@playwright/test"

import { SELECTORS, TEST_USER } from "@root/e2e/config"

test.describe("User CVs Management Flow", () => {
  test("should redirect to login if visiting user cvs page when not authenticated", async ({
    page,
  }) => {
    await page.goto("/users/1/cvs")
    await expect(page).toHaveURL(/.*\/auth\/login.*/)
  })

  test("should allow authorized users to navigate, add, edit, view, and delete CVs", async ({
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

    await page.goto(`/users/${userId}/cvs`)
    await expect(page).toHaveURL(new RegExp(`.*/users/${userId}/cvs`))

    await expect(page.locator(".animate-pulse")).toHaveCount(0)

    await page.click('button:has-text("ADD CV")')
    await expect(page.locator('h2:has-text("Create CV")')).toBeVisible()

    const uniqueCvName = `Playwright E2E CV ${Date.now()}`
    await page.fill('input[id="name"]', uniqueCvName)
    await page.fill('input[id="education"]', "Harvard University")
    await page.fill(
      'textarea[id="description"]',
      "This is an automated E2E test CV."
    )
    await page.click('button:has-text("CREATE")')

    await expect(page.locator(".animate-pulse")).toHaveCount(0)

    await expect(page.locator("table")).toContainText(uniqueCvName)

    const row = page.locator("tr", { hasText: uniqueCvName })
    const actionBtn = row.locator('button[aria-label="Control Actions"]')
    await actionBtn.click()
    await page.click('a:has-text("Details")')

    await page.waitForURL(/.*\/cvs\/[^\/]+/)
    const nameInput = page.locator('input[id="name"]')
    await expect(nameInput).toHaveValue(uniqueCvName)

    await page.goto(`/users/${userId}/cvs`)
    await expect(page).toHaveURL(new RegExp(`.*/users/${userId}/cvs`))

    await expect(page.locator(".animate-pulse")).toHaveCount(0)
    await expect(page.locator("table")).toContainText(uniqueCvName)

    await actionBtn.click()
    await page.click('button:has-text("Edit CV")')

    const updatedCvName = `${uniqueCvName} Updated`
    await page.fill('input[id="name"]', updatedCvName)
    await page.click('button:has-text("UPDATE")')

    await expect(page.locator(".animate-pulse")).toHaveCount(0)
    await expect(page.locator("table")).toContainText(updatedCvName)

    await actionBtn.click()
    await page.click('button:has-text("Delete CV")')
    await page.click('button:has-text("DELETE")')

    await expect(page.locator(".animate-pulse")).toHaveCount(0)
    await expect(page.locator("table")).not.toContainText(updatedCvName)
  })
})
