import { expect, test } from "@playwright/test"

test.describe("User Languages Management", () => {
  // Test case 1: Security Redirect check (runs without authentication)
  test("should redirect to login if visiting user languages page when not authenticated", async ({
    page,
  }) => {
    await page.goto("/users/1/languages")
    await expect(page).toHaveURL(/.*\/auth\/login.*/)
  })

  // Test case 2: Full CRUD Flow (Logged-in User scenario)
  test("should allow authorized users to navigate, add, and remove languages", async ({
    page,
  }) => {
    // 1. Log in using the provided Admin credentials
    await page.goto("/auth/login")
    await page.fill('input[type="email"]', "zwu7daue62@bltiwd.com")
    await page.fill('input[type="password"]', "111111111111111111111")
    await page.click('button[type="submit"]')

    // Wait for redirect to main page/dashboard
    await page.waitForURL(/.*\/users.*/)

    // 2. Parse the dynamic userId from the JWT token in cookies
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

    // 3. Navigate directly to the dynamic user languages page
    await page.goto(`/users/${userId}/languages`)
    await expect(page).toHaveURL(new RegExp(`.*/users/${userId}/languages`))

    // 4. Open "ADD LANGUAGE" dialog
    await page.click('button:has-text("ADD LANGUAGE")')
    await expect(page.locator('h2:has-text("Add Language")')).toBeVisible()

    // 5. Select a language from Select dropdown (first select trigger)
    await page.locator('button[data-slot="select-trigger"]').nth(0).click()
    const selectedLanguageName = await page
      .locator("role=option >> nth=0")
      .innerText()
    await page.click("role=option >> nth=0")

    // 6. Select Proficiency Level (second select trigger)
    await page.locator('button[data-slot="select-trigger"]').nth(1).click()
    await page.click('role=option[name="B2"]')

    // 7. Click "CONFIRM" to add language
    await page.click('button:has-text("CONFIRM")')

    // 8. Verify the language tag is added and visible in the main list (avoiding select modals)
    const languageTag = page
      .locator("main")
      .getByText(selectedLanguageName, { exact: true })
      .first()
    await expect(languageTag).toBeVisible()

    // 9. Click "REMOVE LANGUAGE" to enter selection mode
    await page.click('button:has-text("REMOVE LANGUAGE")')

    // 10. Click on the language tag to select it for deletion
    await languageTag.click()

    // 11. Click "DELETE" to delete selected language
    await page.click('button:has-text("DELETE")')

    // 12. Verify the language tag is successfully removed from the DOM
    await expect(languageTag).not.toBeVisible()
  })
})
