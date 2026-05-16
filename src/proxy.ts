import { NextRequest, NextResponse } from "next/server"
import { createProxy } from "next-i18next/proxy"

import i18nConfig from "@root/i18n.config"
import { serverEnv } from "@/config/env.server"

const AUTH_ROUTES = ["/auth/login", "/auth/signup", "/forgot-password"]

const STATIC_PATTERN =
  /^\/(api|_next\/static|_next\/image|assets|favicon\.ico|sw\.js|site\.webmanifest)/

function decodeJwtExp(token: string): number | null {
  try {
    const [, payload] = token.split(".")
    const { exp } = JSON.parse(atob(payload))
    return typeof exp === "number" ? exp : null
  } catch {
    return null
  }
}

function checkAccessToken(request: NextRequest): boolean {
  const token = request.cookies.get("access_token")?.value
  if (token) {
    const exp = decodeJwtExp(token)
    if (exp && exp * 1000 > Date.now()) return true
  }
  return false
}

function isAuthRoute(pathname: string): boolean {
  const pathWithoutLocale = pathname.replace(
    /^\/[a-zA-Z]{2}(-[a-zA-Z]{2})?(\/|$)/,
    "/"
  )
  return AUTH_ROUTES.some(
    (route) =>
      pathWithoutLocale === route || pathWithoutLocale.startsWith(route + "/")
  )
}

function isStaticAsset(pathname: string): boolean {
  return STATIC_PATTERN.test(pathname)
}

const i18nProxy = createProxy(i18nConfig)

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (isStaticAsset(pathname)) {
    return NextResponse.next()
  }

  let isAuthenticated = checkAccessToken(request)
  let newAccessToken: string | null = null
  let newRefreshToken: string | null = null

  if (!isAuthenticated) {
    const refreshToken = request.cookies.get("refresh_token")?.value
    if (refreshToken) {
      try {
        const gqlRes = await fetch(serverEnv.API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${refreshToken}`,
          },
          body: JSON.stringify({
            query: "mutation { updateToken { access_token refresh_token } }",
          }),
        })
        const { data } = await gqlRes.json()
        if (data?.updateToken) {
          isAuthenticated = true
          newAccessToken = data.updateToken.access_token
          newRefreshToken = data.updateToken.refresh_token

          request.cookies.set("access_token", newAccessToken!)
          request.cookies.set("refresh_token", newRefreshToken!)
        }
      } catch (e) {}
    }
  }

  if (isAuthenticated && isAuthRoute(pathname)) {
    return NextResponse.redirect(new URL("/users", request.url))
  }

  if (!isAuthenticated && !isAuthRoute(pathname)) {
    const loginUrl = new URL("/auth/login", request.url)
    loginUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(loginUrl)
  }

  const response = i18nProxy(request)

  if (newAccessToken && newRefreshToken) {
    const IS_PROD = process.env.NODE_ENV === "production"
    response.cookies.set("access_token", newAccessToken, {
      httpOnly: true,
      secure: IS_PROD,
      sameSite: "strict",
      path: "/",
      maxAge: 15 * 60,
    })
    response.cookies.set("refresh_token", newRefreshToken, {
      httpOnly: true,
      secure: IS_PROD,
      sameSite: "strict",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    })
  }

  if (isAuthRoute(pathname)) {
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate")
    response.headers.set("Pragma", "no-cache")
  }

  return response
}
