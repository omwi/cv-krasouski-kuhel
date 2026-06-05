import { beforeEach, describe, expect, it, vi } from "vitest"

import { POST } from "./route"

const mockCreateAuthJsonResponse = vi.hoisted(() => vi.fn())

vi.mock("@/features/auth/utils/cookies", () => ({
  createAuthJsonResponse: mockCreateAuthJsonResponse,
}))

describe("POST /api/auth/logout", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should clear auth cookies", async () => {
    const expectedResponse = new Response(null)

    mockCreateAuthJsonResponse.mockReturnValue(expectedResponse)

    const response = await POST()

    expect(mockCreateAuthJsonResponse).toHaveBeenCalledWith(
      { success: true },
      {
        accessToken: "",
        refreshToken: "",
      },
      {
        destroy: true,
      }
    )

    expect(response).toBe(expectedResponse)
  })
})
