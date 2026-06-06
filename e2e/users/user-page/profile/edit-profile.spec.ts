import { BrowserContext, expect, test } from "@playwright/test"

async function getUserIdFromCookies(context: BrowserContext): Promise<string> {
  const cookies = await context.cookies()
  const tokenCookie = cookies.find((c) => c.name === "access_token")
  if (!tokenCookie) {
    throw new Error("access_token cookie not found")
  }
  const payloadBase64 = tokenCookie.value.split(".")[1]
  const payloadJson = Buffer.from(payloadBase64, "base64").toString("utf-8")
  const payload = JSON.parse(payloadJson) as { sub: number | string }
  return String(payload.sub)
}

test.describe("Individual Profile Editing Page", () => {
  test.use({ storageState: "playwright/.auth/user.json" })

  test.beforeEach(async ({ page, context }) => {
    const userId = await getUserIdFromCookies(context)
    await page.goto(`/users/${userId}`)
  })

  test("Should delete existing avatar, fill text mutations, upload new avatar, and save changes", async ({
    page,
  }) => {
    const firstNameInput = page.locator('input[name="firstName"]')
    const lastNameInput = page.locator('input[name="lastName"]')

    // Locating elements via the newly added data-testid attributes
    const departmentDropdown = page.getByTestId("select-department-trigger")
    const positionDropdown = page.getByTestId("select-position-trigger")
    const updateButton = page.getByTestId("profile-update-button")

    // Verify initial state
    await expect(firstNameInput).toBeVisible()
    await expect(lastNameInput).toBeVisible()
    await expect(updateButton).toBeDisabled()

    // -------------------------------------------------------------
    // 1. Delete current profile photo first (if one exists)
    // -------------------------------------------------------------
    const deleteAvatarButton = page.locator('span[data-slot="avatar"] button')

    // .isVisible() ensures the element is rendered on screen and can be interacted with
    if (await deleteAvatarButton.isVisible()) {
      await deleteAvatarButton.click({ force: true })
    }
    // -------------------------------------------------------------
    // 2. Fill text form parameters to mutate state
    // -------------------------------------------------------------
    await firstNameInput.clear()
    await firstNameInput.fill(`John-${Date.now()}`)
    await lastNameInput.clear()
    await lastNameInput.fill("Doe")

    // Open Department dropdown via data-testid and select option
    await departmentDropdown.click()
    await page.locator('role=option[name="Quality Assurance"]').click()

    // Open Position dropdown via data-testid and select option
    await positionDropdown.click()
    await page.locator('role=option[name="Software Engineer"]').click()

    // -------------------------------------------------------------
    // 3. Download image from network and upload it as a file asset
    // -------------------------------------------------------------
    const imageUrl = "https://picsum.photos/200/300.jpg"
    const response = await page.request.get(imageUrl)
    const imageBuffer = await response.body()

    const fileInput = page.locator('input[type="file"]')
    await fileInput.setInputFiles({
      name: "avatar.jpg",
      mimeType: "image/jpeg",
      buffer: imageBuffer,
    })

    await fileInput.dispatchEvent("change")

    // -------------------------------------------------------------
    // 4. Verify system enables updates, save changes, and check toast
    // -------------------------------------------------------------
    await expect(updateButton).toBeEnabled()
    await updateButton.click()

    // Verify success toast string notification safely without strict mode conflicts
    const successToast = page
      .locator("[data-sonner-toast] [data-title]")
      .filter({ hasText: "Profile updated successfully" })

    await expect(successToast).toBeVisible()
  })

  test("Should restrict standard users from editing another employee profile", async ({
    page,
    context,
  }) => {
    const userId = await getUserIdFromCookies(context)
    const otherUserId = userId === "630" ? "629" : "630"
    // Navigate to a completely different user profile id (e.g., admin profile)
    await page.goto(`/users/${otherUserId}`)

    const firstNameInput = page.locator('input[name="firstName"]')
    const lastNameInput = page.locator('input[name="lastName"]')
    const departmentDropdown = page.getByTestId("select-department-trigger")
    const positionDropdown = page.getByTestId("select-position-trigger")
    const updateButton = page.getByTestId("profile-update-button")
    const uploadDropzone = page.locator('[data-slot="file-upload"]')
    const deleteAvatarButton = page.locator('span[data-slot="avatar"] button')

    // 1. Text inputs must be read-only
    await expect(firstNameInput).toHaveAttribute("readonly", "")
    await expect(lastNameInput).toHaveAttribute("readonly", "")

    // 2. Selection triggers must be explicitly disabled
    await expect(departmentDropdown).toBeDisabled()
    await expect(positionDropdown).toBeDisabled()

    // 3. File upload dropzone element and avatar removal controls must be hidden or disabled
    await expect(uploadDropzone).toBeHidden()
    await expect(deleteAvatarButton).toBeDisabled()

    // 4. The structural submission button should be completely hidden from view
    await expect(updateButton).toBeHidden()
  })
})
