import { NextRequest } from "next/server"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { POST } from "./route"

vi.mock("@/config/env.server", () => ({
  serverEnv: {
    API_URL: "https://api.test/graphql",
  },
}))

describe("POST /api/auth/reset-password", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubGlobal("fetch", vi.fn())
  })

  const createRequest = (
    body: Record<string, unknown>,
    authorization?: string
  ) =>
    new NextRequest("http://localhost/api/auth/reset-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(authorization
          ? {
              Authorization: authorization,
            }
          : {}),
      },
      body: JSON.stringify(body),
    })

  it("should return success response", async () => {
    vi.mocked(fetch).mockResolvedValue({
      json: async () => ({
        data: {
          resetPassword: true,
        },
      }),
    } as Response)

    const request = createRequest({
      newPassword: "password123",
    })

    const response = await POST(request)
    const json = await response.json()

    expect(response.status).toBe(200)

    expect(json).toEqual({
      success: true,
      data: {
        resetPassword: true,
      },
    })
  })

  it("should map request body into graphql variables", async () => {
    vi.mocked(fetch).mockResolvedValue({
      json: async () => ({
        data: {
          resetPassword: true,
        },
      }),
    } as Response)

    const body = {
      newPassword: "password123",
    }

    const request = createRequest(body)

    await POST(request)

    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        method: "POST",
        cache: "no-store",
        body: JSON.stringify({
          query: `mutation ResetPassword($auth: ResetPasswordInput!) {
          resetPassword(auth: $auth)
        }`,
          variables: {
            auth: body,
          },
        }),
      })
    )
  })

  it("should forward authorization header", async () => {
    vi.mocked(fetch).mockResolvedValue({
      json: async () => ({
        data: {
          resetPassword: true,
        },
      }),
    } as Response)

    const request = createRequest(
      {
        newPassword: "password123",
      },
      "Bearer access-token"
    )

    await POST(request)

    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer access-token",
        }),
      })
    )
  })

  it("should omit authorization header when not provided", async () => {
    vi.mocked(fetch).mockResolvedValue({
      json: async () => ({
        data: {
          resetPassword: true,
        },
      }),
    } as Response)

    const request = createRequest({
      newPassword: "password123",
    })

    await POST(request)

    const [, options] = vi.mocked(fetch).mock.calls[0]

    const headers = (options as RequestInit).headers as Record<string, string>

    expect(headers).not.toHaveProperty("Authorization")
  })

  it("should return graphql error message", async () => {
    vi.mocked(fetch).mockResolvedValue({
      json: async () => ({
        errors: [
          {
            message: "Invalid token",
          },
        ],
      }),
    } as Response)

    const request = createRequest({
      newPassword: "password123",
    })

    const response = await POST(request)
    const json = await response.json()

    expect(response.status).toBe(400)

    expect(json).toEqual({
      message: "Invalid token",
    })
  })

  it("should return fallback graphql error message", async () => {
    vi.mocked(fetch).mockResolvedValue({
      json: async () => ({
        errors: [{}],
      }),
    } as Response)

    const request = createRequest({
      newPassword: "password123",
    })

    const response = await POST(request)
    const json = await response.json()

    expect(response.status).toBe(400)

    expect(json).toEqual({
      message: "GraphQL Error",
    })
  })

  it("should return 500 when fetch throws", async () => {
    vi.mocked(fetch).mockRejectedValue(new Error("Network error"))

    const request = createRequest({
      newPassword: "password123",
    })

    const response = await POST(request)
    const json = await response.json()

    expect(response.status).toBe(500)

    expect(json).toEqual({
      message: "Network error",
    })
  })

  it("should return 500 when request body parsing fails", async () => {
    const request = {
      json: vi.fn().mockRejectedValue(new Error("Invalid JSON")),
      headers: {
        get: vi.fn(),
      },
    } as unknown as NextRequest

    const response = await POST(request)
    const json = await response.json()

    expect(response.status).toBe(500)

    expect(json).toEqual({
      message: "Invalid JSON",
    })
  })
})
