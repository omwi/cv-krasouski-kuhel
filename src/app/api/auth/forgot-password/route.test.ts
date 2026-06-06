import { NextRequest } from "next/server"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { POST } from "./route"

vi.mock("@/config/env.server", () => ({
  serverEnv: {
    API_URL: "http://api.test/graphql",
  },
}))

describe("POST /api/auth/forgot-password", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    global.fetch = vi.fn()
  })

  it("should request password reset successfully", async () => {
    ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      json: async () => ({
        data: {
          forgotPassword: true,
        },
      }),
    })

    const request = new NextRequest(
      "http://localhost/api/auth/forgot-password",
      {
        method: "POST",
        body: JSON.stringify({
          email: "john@test.com",
        }),
      }
    )

    const response = await POST(request)

    expect(fetch).toHaveBeenCalledWith(
      "http://api.test/graphql",
      expect.objectContaining({
        method: "POST",
        cache: "no-store",
      })
    )

    const body = JSON.parse(
      ((fetch as ReturnType<typeof vi.fn>).mock.calls[0][1] as RequestInit)
        .body as string
    )

    expect(body).toEqual({
      query: `mutation ForgotPassword($auth: ForgotPasswordInput!) {
        forgotPassword(auth: $auth)
      }`,
      variables: {
        auth: {
          email: "john@test.com",
        },
      },
    })

    expect(response.status).toBe(200)

    expect(await response.json()).toEqual({
      success: true,
    })
  })

  it("should return graphql error message", async () => {
    ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      json: async () => ({
        errors: [
          {
            message: "User not found",
          },
        ],
      }),
    })

    const request = new NextRequest(
      "http://localhost/api/auth/forgot-password",
      {
        method: "POST",
        body: JSON.stringify({
          email: "john@test.com",
        }),
      }
    )

    const response = await POST(request)

    expect(response.status).toBe(400)

    expect(await response.json()).toEqual({
      message: "User not found",
    })
  })

  it("should return fallback error message", async () => {
    ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      json: async () => ({
        errors: [],
      }),
    })

    const request = new NextRequest(
      "http://localhost/api/auth/forgot-password",
      {
        method: "POST",
        body: JSON.stringify({
          email: "john@test.com",
        }),
      }
    )

    const response = await POST(request)

    expect(response.status).toBe(400)

    expect(await response.json()).toEqual({
      message: "Failed to request password reset",
    })
  })
})
