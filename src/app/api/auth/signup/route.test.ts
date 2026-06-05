import { NextRequest, NextResponse } from "next/server"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { POST } from "./route"

const mockCreateAuthJsonResponse = vi.hoisted(() => vi.fn())

vi.mock("@/config/env.server", () => ({
  serverEnv: {
    API_URL: "https://api.test/graphql",
  },
}))

vi.mock("@/features/auth/utils/cookies", () => ({
  createAuthJsonResponse: mockCreateAuthJsonResponse,
}))

describe("POST /api/auth/signup", () => {
  beforeEach(() => {
    vi.clearAllMocks()

    vi.stubGlobal("fetch", vi.fn())

    mockCreateAuthJsonResponse.mockReturnValue(
      NextResponse.json({ success: true })
    )
  })

  const createRequest = (body: Record<string, unknown>) =>
    new NextRequest("http://localhost/api/auth/signup", {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    })

  it("should return auth response on successful signup", async () => {
    const signupData = {
      access_token: "access-token",
      refresh_token: "refresh-token",
      user: {
        id: 1,
        role: "user",
        email: "john@example.com",
      },
    }

    vi.mocked(fetch).mockResolvedValue({
      json: async () => ({
        data: {
          signup: signupData,
        },
      }),
    } as Response)

    const request = createRequest({
      email: "john@example.com",
      password: "password123",
    })

    const response = await POST(request)

    expect(mockCreateAuthJsonResponse).toHaveBeenCalledWith(
      {
        user: signupData.user,
      },
      {
        accessToken: "access-token",
        refreshToken: "refresh-token",
      }
    )

    expect(response).toBeDefined()
  })

  it("should send signup payload as auth variables", async () => {
    vi.mocked(fetch).mockResolvedValue({
      json: async () => ({
        data: {
          signup: {
            access_token: "token",
            refresh_token: "refresh",
            user: {
              id: 1,
              role: "user",
              email: "john@example.com",
            },
          },
        },
      }),
    } as Response)

    const body = {
      email: "john@example.com",
      password: "password123",
    }

    const request = createRequest(body)

    await POST(request)

    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        method: "POST",
        cache: "no-store",
        body: JSON.stringify({
          query: `mutation Signup($auth: AuthInput!) {
        signup(auth: $auth) { access_token refresh_token user { id role email } }
      }`,
          variables: {
            auth: body,
          },
        }),
      })
    )
  })

  it("should return graphql error message", async () => {
    vi.mocked(fetch).mockResolvedValue({
      json: async () => ({
        errors: [
          {
            message: "Email already exists",
          },
        ],
      }),
    } as Response)

    const request = createRequest({
      email: "john@example.com",
      password: "password123",
    })

    const response = await POST(request)
    const json = await response.json()

    expect(response.status).toBe(400)
    expect(json).toEqual({
      message: "Email already exists",
    })
  })

  it("should return fallback error message when graphql error has no message", async () => {
    vi.mocked(fetch).mockResolvedValue({
      json: async () => ({
        errors: [{}],
      }),
    } as Response)

    const request = createRequest({
      email: "john@example.com",
      password: "password123",
    })

    const response = await POST(request)
    const json = await response.json()

    expect(response.status).toBe(400)
    expect(json).toEqual({
      message: "Signup failed",
    })
  })

  it("should return fallback error when signup data is missing", async () => {
    vi.mocked(fetch).mockResolvedValue({
      json: async () => ({
        data: {},
      }),
    } as Response)

    const request = createRequest({
      email: "john@example.com",
      password: "password123",
    })

    const response = await POST(request)
    const json = await response.json()

    expect(response.status).toBe(400)
    expect(json).toEqual({
      message: "Signup failed",
    })
  })
})
