import { expect, test } from "@playwright/test"

// Load the pre-authenticated user session state
test.use({ storageState: "playwright/.auth/user.json" })

test.describe("Navigation Sidebar", () => {
  // Set a desktop viewport before each test to ensure all menu items are visible
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 })
    await page.goto("/users") // Start from the default base page
  })

  // Define the navigation map: what text to search for inside the <nav> tag and the expected URL
  const navLinks = [
    { text: "Employees", expectedUrl: /.*\/users/ },
    { text: "Skills", expectedUrl: /.*\/skills/ },
    { text: "Languages", expectedUrl: /.*\/languages/ },
    { text: "CVs", expectedUrl: /.*\/cvs/ },
    { text: "Positions", expectedUrl: /.*\/positions/ },
    { text: "Projects", expectedUrl: /.*\/projects/ },
    { text: "Departments", expectedUrl: /.*\/departments/ },
  ]

  // Run dynamic tests in a loop
  for (const link of navLinks) {
    test(`Navigate to ${link.text} section`, async ({ page }) => {
      // Find the link strictly inside the <nav> tag, matching the text within it
      const menuButton = page.locator("nav a").filter({ hasText: link.text })

      // Verify that the button is visible on the screen, then click it
      await expect(menuButton).toBeVisible()
      await menuButton.click()

      // Verify that the URL changed to the correct path
      await expect(page).toHaveURL(link.expectedUrl)
    })
  }
})
