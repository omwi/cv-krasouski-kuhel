import { NextRequest } from "next/server"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { COOKIES } from "@/config/const"

import { POST } from "./route"

describe("POST /api/auth/verify", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubGlobal("fetch", vi.fn())
  })

  const createRequest = (
    body: Record<string, unknown>,
    accessToken?: string
  ) => {
    const request = new NextRequest("http://localhost/api/auth/verify", {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (accessToken) {
      request.cookies.set(COOKIES.ACCESS_TOKEN, accessToken)
    }

    return request
  }

  it("should return success when verification succeeds", async () => {
    vi.mocked(fetch).mockResolvedValue({
      json: async () => ({}),
    } as Response)

    const request = createRequest({
      otp: "123456",
    })

    const response = await POST(request)
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body).toEqual({
      success: true,
    })

    expect(fetch).toHaveBeenCalledTimes(1)
    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        method: "POST",
        cache: "no-store",
      })
    )
  })

  it("should map otp into graphql variables", async () => {
    vi.mocked(fetch).mockResolvedValue({
      json: async () => ({}),
    } as Response)

    const request = createRequest({
      otp: "654321",
    })

    await POST(request)

    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        body: JSON.stringify({
          query: `mutation VerifyMail($mail: VerifyMailInput!) {
        verifyMail(mail: $mail)
      }`,
          variables: {
            mail: {
              otp: "654321",
            },
          },
        }),
      })
    )
  })

  it("should return graphql error message", async () => {
    vi.mocked(fetch).mockResolvedValue({
      json: async () => ({
        errors: [{ message: "Invalid OTP" }],
      }),
    } as Response)

    const request = createRequest({
      otp: "123456",
    })

    const response = await POST(request)
    const body = await response.json()

    expect(response.status).toBe(400)
    expect(body).toEqual({
      message: "Invalid OTP",
    })
  })

  it("should return fallback error message when graphql error has no message", async () => {
    vi.mocked(fetch).mockResolvedValue({
      json: async () => ({
        errors: [{}],
      }),
    } as Response)

    const request = createRequest({
      otp: "123456",
    })

    const response = await POST(request)
    const body = await response.json()

    expect(response.status).toBe(400)
    expect(body).toEqual({
      message: "Failed to verify",
    })
  })

  it("should send authorization header when access token exists", async () => {
    vi.mocked(fetch).mockResolvedValue({
      json: async () => ({}),
    } as Response)

    const request = createRequest(
      {
        otp: "123456",
      },
      "access-token"
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

  it("should not send authorization header when access token is missing", async () => {
    vi.mocked(fetch).mockResolvedValue({
      json: async () => ({}),
    } as Response)

    const request = createRequest({
      otp: "123456",
    })

    await POST(request)

    const [, options] = vi.mocked(fetch).mock.calls[0]

    expect(
      (options as RequestInit).headers as Record<string, string>
    ).not.toHaveProperty("Authorization")
  })
})
