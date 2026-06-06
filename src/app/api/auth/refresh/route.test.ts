import { NextRequest } from "next/server"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { COOKIES } from "@/config/const"

import { POST } from "./route"

const mockCreateAuthJsonResponse = vi.hoisted(() => vi.fn())

vi.mock("@/config/env.server", () => ({
  serverEnv: {
    API_URL: "http://api.test/graphql",
  },
}))

vi.mock("@/features/auth/utils/cookies", () => ({
  createAuthJsonResponse: mockCreateAuthJsonResponse,
}))

describe("POST /api/auth/refresh", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    global.fetch = vi.fn()
  })

  it("should return 401 when refresh token is missing", async () => {
    const request = new NextRequest("http://localhost/api/auth/refresh", {
      method: "POST",
    })

    const response = await POST(request)

    expect(response.status).toBe(401)

    expect(await response.json()).toEqual({
      message: "No refresh token",
    })
  })

  it("should refresh tokens successfully", async () => {
    ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      json: async () => ({
        data: {
          updateToken: {
            access_token: "new-access",
            refresh_token: "new-refresh",
          },
        },
      }),
    })

    const expectedResponse = new Response(null)

    mockCreateAuthJsonResponse.mockReturnValue(expectedResponse)

    const request = new NextRequest("http://localhost/api/auth/refresh", {
      method: "POST",
      headers: {
        cookie: `${COOKIES.REFRESH_TOKEN}=refresh-token`,
      },
    })

    const response = await POST(request)

    expect(fetch).toHaveBeenCalledWith(
      "http://api.test/graphql",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          Authorization: "Bearer refresh-token",
        }),
      })
    )

    expect(mockCreateAuthJsonResponse).toHaveBeenCalledWith(
      { ok: true },
      {
        accessToken: "new-access",
        refreshToken: "new-refresh",
      }
    )

    expect(response).toBe(expectedResponse)
  })

  it("should return 401 and clear cookies when graphql returns errors", async () => {
    ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      json: async () => ({
        errors: [{ message: "invalid token" }],
      }),
    })

    const request = new NextRequest("http://localhost/api/auth/refresh", {
      method: "POST",
      headers: {
        cookie: `${COOKIES.REFRESH_TOKEN}=refresh-token`,
      },
    })

    const response = await POST(request)

    expect(response.status).toBe(401)

    expect(await response.json()).toEqual({
      message: "Refresh failed",
    })

    const setCookie = response.headers.get("set-cookie")

    expect(setCookie).toContain(COOKIES.ACCESS_TOKEN)
    expect(setCookie).toContain(COOKIES.REFRESH_TOKEN)
  })

  it("should return 401 when updateToken is missing", async () => {
    ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      json: async () => ({
        data: {},
      }),
    })

    const request = new NextRequest("http://localhost/api/auth/refresh", {
      method: "POST",
      headers: {
        cookie: `${COOKIES.REFRESH_TOKEN}=refresh-token`,
      },
    })

    const response = await POST(request)

    expect(response.status).toBe(401)

    expect(await response.json()).toEqual({
      message: "Refresh failed",
    })
  })
})
