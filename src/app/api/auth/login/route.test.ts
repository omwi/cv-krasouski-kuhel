import { NextRequest } from "next/server"
import { beforeEach, describe, expect, it, vi } from "vitest"

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

describe("POST /api/auth/login", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    global.fetch = vi.fn()
  })

  it("should login successfully", async () => {
    ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      json: async () => ({
        data: {
          login: {
            access_token: "access-token",
            refresh_token: "refresh-token",
            user: {
              id: 1,
              email: "john@test.com",
              role: "USER",
              is_verified: true,
            },
          },
        },
      }),
    })

    const expectedResponse = new Response(null)

    mockCreateAuthJsonResponse.mockReturnValue(expectedResponse)

    const request = new NextRequest("http://localhost/api/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: "john@test.com",
        password: "password123",
      }),
    })

    const response = await POST(request)

    expect(fetch).toHaveBeenCalledWith(
      "http://api.test/graphql",
      expect.objectContaining({
        method: "POST",
        cache: "no-store",
      })
    )

    const fetchCall = (fetch as ReturnType<typeof vi.fn>).mock.calls[0]

    expect(JSON.parse(fetchCall[1].body)).toEqual({
      query: `query Login($auth: AuthInput!) {
        login(auth: $auth) { access_token refresh_token user { id role email is_verified } }
      }`,
      variables: {
        auth: {
          email: "john@test.com",
          password: "password123",
        },
      },
    })

    expect(mockCreateAuthJsonResponse).toHaveBeenCalledWith(
      {
        user: {
          id: 1,
          email: "john@test.com",
          role: "USER",
          is_verified: true,
        },
      },
      {
        accessToken: "access-token",
        refreshToken: "refresh-token",
      }
    )

    expect(response).toBe(expectedResponse)
  })

  it("should return 401 when graphql returns errors", async () => {
    ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      json: async () => ({
        errors: [{ message: "Invalid credentials" }],
      }),
    })

    const request = new NextRequest("http://localhost/api/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: "john@test.com",
        password: "wrong-password",
      }),
    })

    const response = await POST(request)

    expect(response.status).toBe(401)

    expect(await response.json()).toEqual({
      message: "Invalid credentials",
    })

    expect(mockCreateAuthJsonResponse).not.toHaveBeenCalled()
  })

  it("should return 401 when login data is missing", async () => {
    ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      json: async () => ({
        data: {},
      }),
    })

    const request = new NextRequest("http://localhost/api/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: "john@test.com",
        password: "password123",
      }),
    })

    const response = await POST(request)

    expect(response.status).toBe(401)

    expect(await response.json()).toEqual({
      message: "Login failed",
    })

    expect(mockCreateAuthJsonResponse).not.toHaveBeenCalled()
  })
})
