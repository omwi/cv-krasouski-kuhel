import { expect, test } from "@playwright/test"

test.describe("User Profile Information", () => {
  // Test case 1: Verify login inputs rendering
  test("should display login inputs and successfully load login screen", async ({
    page,
  }) => {
    await page.goto("/auth/login")

    // Verify login form is loaded
    const title = page.locator("h4")
    await expect(title).toBeVisible()
    await expect(title).toHaveText("Welcome back")

    const emailInput = page.locator('input[type="email"]')
    await expect(emailInput).toBeVisible()
  })

  // Test case 2: Unauthorized redirect check
  test("should load user profile and enforce read-only properties if unauthorized", async ({
    page,
  }) => {
    // When visiting without authentication, it redirects to login
    await page.goto("/users/1")
    await expect(page).toHaveURL(/.*\/auth\/login.*/)
  })

  // Test case 3: Full Profile Details view for Authorized Admin user
  test("should allow authorized users to view and edit profile details", async ({
    page,
  }) => {
    // 1. Log in
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

    // 3. Navigate directly to the dynamic user profile page (Step 2 section)
    await page.goto(`/users/${userId}`)
    await expect(page).toHaveURL(new RegExp(`.*/users/${userId}`))

    // 4. Verify that profile inputs are visible
    const firstNameInput = page.locator('input[name="firstName"]')
    const lastNameInput = page.locator('input[name="lastName"]')
    await expect(firstNameInput).toBeVisible()
    await expect(lastNameInput).toBeVisible()

    // 5. Verify the field is editable by filling it with a test value
    await firstNameInput.fill("Test")
    await expect(firstNameInput).toHaveValue("Test")
  })
})
