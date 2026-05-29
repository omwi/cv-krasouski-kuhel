import { NextRequest, NextResponse } from "next/server"
import { createProxy } from "next-i18next/proxy"

import i18nConfig from "@root/i18n.config"
import { COOKIES } from "@/config/const"
import { serverEnv } from "@/config/env.server"
import { paths } from "@/config/paths"
import { setAuthCookies } from "@/features/auth/utils/cookies"
import { isAuthRoute } from "@/features/auth/utils/is-auth-route"
import { checkAccessToken } from "@/features/auth/utils/jwt"
import { getLngPrefix } from "@/utils/url"

const STATIC_PATTERN =
  /^\/(api|_next\/static|_next\/image|assets|favicon\.ico|sw\.js|site\.webmanifest)/

function isStaticAsset(pathname: string): boolean {
  return STATIC_PATTERN.test(pathname)
}

const i18nProxy = createProxy(i18nConfig)

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (isStaticAsset(pathname)) {
    return NextResponse.next()
  }

  const authStatus = checkAccessToken(request)
  let isAuthenticated = authStatus.isValid

  let newAccessToken: string | null = null
  let newRefreshToken: string | null = null

  if (!isAuthenticated) {
    const refreshToken = request.cookies.get(COOKIES.REFRESH_TOKEN)?.value
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

          request.cookies.set(COOKIES.ACCESS_TOKEN, newAccessToken!)
          request.cookies.set(COOKIES.REFRESH_TOKEN, newRefreshToken!)
        }
      } catch {}
    }
  }

  const lngPrefix = getLngPrefix(pathname)

  if (isAuthenticated && isAuthRoute(pathname)) {
    return NextResponse.redirect(
      new URL(`${lngPrefix}${paths.users.get()}`, request.url)
    )
  }

  if (!isAuthenticated && !isAuthRoute(pathname)) {
    const loginUrl = new URL(
      `${lngPrefix}${paths.auth.login.get()}`,
      request.url
    )
    loginUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(loginUrl)
  }

  const cookieLang = request.cookies.get(COOKIES.LANGUAGE)?.value
  if (
    !lngPrefix &&
    cookieLang &&
    cookieLang !== "en" &&
    cookieLang !== "system"
  ) {
    return NextResponse.redirect(
      new URL(`/${cookieLang}${pathname}${request.nextUrl.search}`, request.url)
    )
  }

  const response = i18nProxy(request)

  if (newAccessToken && newRefreshToken) {
    setAuthCookies(response, {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    })
  }
  if (isAuthRoute(pathname)) {
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate")
    response.headers.set("Pragma", "no-cache")
  }

  return response
}
