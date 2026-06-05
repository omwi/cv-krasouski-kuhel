import { NextResponse } from "next/server"
import { describe, expect, it } from "vitest"

import { COOKIES } from "@/config/const"
import {
  createAuthJsonResponse,
  setAuthCookies,
} from "@/features/auth/utils/cookies"

describe("setAuthCookies", () => {
  it("sets access token cookie when provided", () => {
    const res = NextResponse.json({})

    setAuthCookies(res, {
      accessToken: "access-token",
    })

    expect(res.cookies.get(COOKIES.ACCESS_TOKEN)?.value).toBe("access-token")

    expect(res.cookies.get(COOKIES.REFRESH_TOKEN)).toBeUndefined()
  })

  it("sets refresh token cookie when provided", () => {
    const res = NextResponse.json({})

    setAuthCookies(res, {
      refreshToken: "refresh-token",
    })

    expect(res.cookies.get(COOKIES.REFRESH_TOKEN)?.value).toBe("refresh-token")

    expect(res.cookies.get(COOKIES.ACCESS_TOKEN)).toBeUndefined()
  })

  it("sets both cookies when both tokens are provided", () => {
    const res = NextResponse.json({})

    setAuthCookies(res, {
      accessToken: "access-token",
      refreshToken: "refresh-token",
    })

    expect(res.cookies.get(COOKIES.ACCESS_TOKEN)?.value).toBe("access-token")

    expect(res.cookies.get(COOKIES.REFRESH_TOKEN)?.value).toBe("refresh-token")
  })

  it("does not set cookies when tokens are undefined", () => {
    const res = NextResponse.json({})

    setAuthCookies(res, {})

    expect(res.cookies.get(COOKIES.ACCESS_TOKEN)).toBeUndefined()

    expect(res.cookies.get(COOKIES.REFRESH_TOKEN)).toBeUndefined()
  })

  it("clears cookies when destroy is true", () => {
    const res = NextResponse.json({})

    setAuthCookies(
      res,
      {
        accessToken: "access-token",
        refreshToken: "refresh-token",
      },
      {
        destroy: true,
      }
    )

    expect(res.cookies.get(COOKIES.ACCESS_TOKEN)?.value).toBe("access-token")

    expect(res.cookies.get(COOKIES.REFRESH_TOKEN)?.value).toBe("refresh-token")

    // Verify the Set-Cookie headers contain Max-Age=0
    const setCookie = res.headers.get("set-cookie") ?? ""

    expect(setCookie).toContain("Max-Age=0")
  })

  it("returns the same response instance", () => {
    const res = NextResponse.json({})

    const result = setAuthCookies(res, {
      accessToken: "token",
    })

    expect(result).toBe(res)
  })
})

describe("createAuthJsonResponse", () => {
  it("creates a json response and sets cookies", async () => {
    const res = createAuthJsonResponse(
      { success: true },
      {
        accessToken: "access-token",
      },
      {},
      201
    )

    expect(res.status).toBe(201)

    expect(res.cookies.get(COOKIES.ACCESS_TOKEN)?.value).toBe("access-token")

    await expect(res.json()).resolves.toEqual({
      success: true,
    })
  })
})
