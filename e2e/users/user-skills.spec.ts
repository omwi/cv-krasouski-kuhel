import { expect, test } from "@playwright/test"

test.describe("User Skills Management", () => {
  // Test case 1: Security Redirect check (runs without authentication)
  test("should redirect to login if visiting user skills page when not authenticated", async ({
    page,
  }) => {
    await page.goto("/users/1/skills")
    await expect(page).toHaveURL(/.*\/auth\/login.*/)
  })

  // Test case 2: Full CRUD Flow (Logged-in User scenario)
  test("should allow authorized users to navigate, add, and remove skills", async ({
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

    // 3. Navigate directly to the dynamic user skills page
    await page.goto(`/users/${userId}/skills`)
    await expect(page).toHaveURL(new RegExp(`.*/users/${userId}/skills`))

    // 4. Open "ADD SKILL" dialog
    // Use the ADD SKILL button selector
    await page.click('button:has-text("ADD SKILL")')
    await expect(page.locator('h2:has-text("Add skill")')).toBeVisible()

    // 5. Select a skill from Combobox
    await page.click('button[role="combobox"]')
    await page.fill('input[placeholder*="Search"]', "React")
    await page.click('div.cursor-pointer:has-text("React")')

    const selectedSkillName = "React"

    // 6. Select Mastery Level
    await page.click('button[data-slot="select-trigger"]')
    await page.click('role=option[name="Advanced"]')

    // 7. Click "CONFIRM" to add skill
    await page.click('button:has-text("CONFIRM")')

    // 8. Verify the skill tag is added and visible in the category list
    const skillTag = page.getByText(selectedSkillName, { exact: true })
    await expect(skillTag).toBeVisible()

    // 9. Click "REMOVE SKILLS" to enter selection mode
    await page.click('button:has-text("REMOVE SKILLS")')

    // 10. Click on the skill tag to select it for deletion
    await skillTag.click()

    // 11. Click "DELETE" to delete selected skill
    await page.click('button:has-text("DELETE")')

    // 12. Verify the skill tag is successfully removed from the DOM
    await expect(skillTag).not.toBeVisible()
  })
})
