import { NextResponse } from "next/server"

const IS_PROD = process.env.NODE_ENV === "production"

const ACCESS_MAX_AGE = 15 * 60
const REFRESH_MAX_AGE = 7 * 24 * 60 * 60

interface Tokens {
  accessToken?: string | null
  refreshToken?: string | null
}

interface CookieOptions {
  destroy?: boolean
}

export function setAuthCookies(
  res: NextResponse,
  tokens: Tokens,
  options: CookieOptions = {}
): NextResponse {
  const { accessToken, refreshToken } = tokens
  const { destroy = false } = options

  if (accessToken !== undefined) {
    res.cookies.set("access_token", accessToken || "", {
      httpOnly: true,
      secure: IS_PROD,
      sameSite: "strict",
      path: "/",
      maxAge: destroy ? 0 : ACCESS_MAX_AGE,
    })
  }

  if (refreshToken !== undefined) {
    res.cookies.set("refresh_token", refreshToken || "", {
      httpOnly: true,
      secure: IS_PROD,
      sameSite: "strict",
      path: "/",
      maxAge: destroy ? 0 : REFRESH_MAX_AGE,
    })
  }

  return res
}

export function createAuthJsonResponse(
  body: Record<string, unknown>,
  tokens: Tokens,
  options: CookieOptions = {},
  status = 200
): NextResponse {
  const res = NextResponse.json(body, { status })
  return setAuthCookies(res, tokens, options)
}
