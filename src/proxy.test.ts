import { NextRequest, NextResponse } from "next/server"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { COOKIES } from "@/config/const"
import { proxy } from "@/proxy"

const mockCheckAccessToken = vi.hoisted(() => vi.fn())
const mockSetAuthCookies = vi.hoisted(() => vi.fn())
const mockIsAuthRoute = vi.hoisted(() => vi.fn())

const mockI18nProxy = vi.hoisted(() =>
  vi.fn(() => new NextResponse(null, { status: 200 }))
)

vi.mock("next-i18next/proxy", () => ({
  createProxy: vi.fn(() => mockI18nProxy),
}))

vi.mock("@root/i18n.config", () => ({
  default: {},
}))

vi.mock("@/config/env.server", () => ({
  serverEnv: {
    API_URL: "https://api.test.com/graphql",
  },
}))

vi.mock("@/features/auth/utils/jwt", () => ({
  checkAccessToken: mockCheckAccessToken,
}))

vi.mock("@/features/auth/utils/is-auth-route", () => ({
  isAuthRoute: mockIsAuthRoute,
}))

vi.mock("@/features/auth/utils/cookies", () => ({
  setAuthCookies: mockSetAuthCookies,
}))

function createRequest(pathname: string, cookies: Record<string, string> = {}) {
  const request = new NextRequest(`http://localhost${pathname}`)

  Object.entries(cookies).forEach(([key, value]) => {
    request.cookies.set(key, value)
  })

  return request
}

describe("proxy", () => {
  beforeEach(() => {
    vi.clearAllMocks()

    mockCheckAccessToken.mockReturnValue({
      isValid: false,
    })

    mockIsAuthRoute.mockReturnValue(false)

    mockI18nProxy.mockReturnValue(
      new NextResponse(null, {
        status: 200,
      })
    )

    mockSetAuthCookies.mockImplementation((response) => response)

    vi.stubGlobal("fetch", vi.fn())
  })

  it("should bypass static assets", async () => {
    const request = createRequest("/_next/static/chunk.js")

    const response = await proxy(request)

    expect(response.status).toBe(200)
    expect(mockI18nProxy).not.toHaveBeenCalled()
  })

  it("should redirect authenticated users away from auth routes", async () => {
    mockCheckAccessToken.mockReturnValue({
      isValid: true,
    })

    mockIsAuthRoute.mockReturnValue(true)

    const request = createRequest("/auth/login")

    const response = await proxy(request)

    expect(response.status).toBe(307)
    expect(response.headers.get("location")).toContain("/users")
  })

  it("should redirect unauthenticated users to login with callbackUrl", async () => {
    mockCheckAccessToken.mockReturnValue({
      isValid: false,
    })

    mockIsAuthRoute.mockReturnValue(false)

    const request = createRequest("/users")

    const response = await proxy(request)

    expect(response.status).toBe(307)

    const location = response.headers.get("location")

    expect(location).toContain("/auth/login")
    expect(location).toContain("callbackUrl=%2Fusers")
  })

  it("should refresh tokens and set auth cookies when refresh succeeds", async () => {
    mockCheckAccessToken.mockReturnValue({
      isValid: false,
    })
    ;(fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      json: async () => ({
        data: {
          updateToken: {
            access_token: "new-access",
            refresh_token: "new-refresh",
          },
        },
      }),
    })

    const request = createRequest("/users", {
      [COOKIES.REFRESH_TOKEN]: "refresh-token",
    })

    await proxy(request)

    expect(fetch).toHaveBeenCalledTimes(1)

    expect(mockSetAuthCookies).toHaveBeenCalledWith(expect.any(NextResponse), {
      accessToken: "new-access",
      refreshToken: "new-refresh",
    })
  })

  it("should redirect using language cookie when locale prefix is missing", async () => {
    mockCheckAccessToken.mockReturnValue({
      isValid: true,
    })

    const request = createRequest("/users", {
      [COOKIES.LANGUAGE]: "pl",
    })

    const response = await proxy(request)

    expect(response.status).toBe(307)
    expect(response.headers.get("location")).toContain("/pl/users")
  })

  it("should add no-cache headers for auth routes", async () => {
    mockCheckAccessToken.mockReturnValue({
      isValid: false,
    })

    mockIsAuthRoute.mockReturnValue(true)

    const request = createRequest("/auth/login")

    const response = await proxy(request)

    expect(response.headers.get("Cache-Control")).toBe(
      "no-store, no-cache, must-revalidate"
    )

    expect(response.headers.get("Pragma")).toBe("no-cache")
  })

  it("should continue when token refresh fails", async () => {
    ;(fetch as unknown as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error("network error")
    )

    const request = createRequest("/auth/login", {
      [COOKIES.REFRESH_TOKEN]: "refresh-token",
    })

    mockIsAuthRoute.mockReturnValue(true)

    const response = await proxy(request)

    expect(response.status).toBe(200)
  })

  it("should not redirect for language cookie value en", async () => {
    mockCheckAccessToken.mockReturnValue({
      isValid: true,
    })

    const request = createRequest("/users", {
      [COOKIES.LANGUAGE]: "en",
    })

    const response = await proxy(request)

    expect(response.status).toBe(200)
    expect(mockI18nProxy).toHaveBeenCalled()
  })

  it("should not redirect for language cookie value system", async () => {
    mockCheckAccessToken.mockReturnValue({
      isValid: true,
    })

    const request = createRequest("/users", {
      [COOKIES.LANGUAGE]: "system",
    })

    const response = await proxy(request)

    expect(response.status).toBe(200)
    expect(mockI18nProxy).toHaveBeenCalled()
  })
})
