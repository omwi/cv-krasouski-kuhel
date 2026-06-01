import { expect, test } from "@playwright/test"

test.describe("User CVs Management Flow", () => {
  // Test case 1: Security Redirect check (runs without authentication)
  test("should redirect to login if visiting user cvs page when not authenticated", async ({
    page,
  }) => {
    await page.goto("/users/1/cvs")
    await expect(page).toHaveURL(/.*\/auth\/login.*/)
  })

  // Test case 2: Full CRUD Flow (Logged-in Admin/User scenario)
  test("should allow authorized users to navigate, add, edit, view, and delete CVs", async ({
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

    // 3. Navigate directly to the dynamic user CVs page
    await page.goto(`/users/${userId}/cvs`)
    await expect(page).toHaveURL(new RegExp(`.*/users/${userId}/cvs`))

    // 4. Open "ADD CV" dialog
    await page.click('button:has-text("ADD CV")')
    await expect(page.locator('h2:has-text("Create CV")')).toBeVisible()

    // 5. Fill and save the CV form
    const uniqueCvName = `Playwright E2E CV ${Date.now()}`
    await page.fill('input[id="name"]', uniqueCvName)
    await page.fill('input[id="education"]', "Harvard University")
    await page.fill(
      'textarea[id="description"]',
      "This is an automated E2E test CV."
    )
    await page.click('button:has-text("CREATE")')

    // 6. Verify the CV is successfully added and displayed in the table
    await expect(page.locator("table")).toContainText(uniqueCvName)

    // 7. Test "View Details" action
    // Locate the dynamic row's control actions popover trigger
    const row = page.locator("tr", { hasText: uniqueCvName })
    const actionBtn = row.locator('button[aria-label="Control Actions"]')
    await actionBtn.click()

    // Click "Details" link (translates from "profile" key in table namespace)
    await page.click('a:has-text("Details")')

    // Verify it redirects to the CV details page `/cvs/[cvId]`
    await page.waitForURL(/.*\/cvs\/[^\/]+/)
    // Verify the details page shows the correct CV name in name field
    const nameInput = page.locator('input[id="name"]')
    await expect(nameInput).toHaveValue(uniqueCvName)

    // 8. Go back to CVs page to test edit & delete
    await page.goto(`/users/${userId}/cvs`)
    await expect(page.locator("table")).toContainText(uniqueCvName)

    // 9. Update CV Name
    await actionBtn.click()
    await page.click('button:has-text("Edit CV")')

    const updatedCvName = `${uniqueCvName} Updated`
    await page.fill('input[id="name"]', updatedCvName)
    await page.click('button:has-text("UPDATE")')

    // Verify updated CV displays in table
    await expect(page.locator("table")).toContainText(updatedCvName)

    // 10. Delete CV
    await actionBtn.click()
    await page.click('button:has-text("Delete CV")')

    // Confirm deletion in the confirmation dialog
    await page.click('button:has-text("DELETE")')

    // Verify CV is fully deleted and gone from table
    await expect(page.locator("table")).not.toContainText(updatedCvName)
  })
})
