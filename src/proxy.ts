import { NextRequest, NextResponse } from "next/server"
import { createProxy } from "next-i18next/proxy"

import i18nConfig from "@root/i18n.config"

const AUTH_ROUTES = ["/auth/login", "/auth/signup", "/forgot-password"]

const STATIC_PATTERN =
  /^\/(api|_next\/static|_next\/image|assets|favicon\.ico|sw\.js|site\.webmanifest)/

function getAccessToken(request: NextRequest): string | undefined {
  return request.cookies.get("access_token")?.value
}

function isAuthRoute(pathname: string): boolean {
  return AUTH_ROUTES.some((route) => pathname.startsWith(route))
}

function isStaticAsset(pathname: string): boolean {
  return STATIC_PATTERN.test(pathname)
}

const i18nProxy = createProxy(i18nConfig)

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (isStaticAsset(pathname)) {
    return NextResponse.next()
  }

  const token = getAccessToken(request)

  if (token && isAuthRoute(pathname)) {
    return NextResponse.redirect(new URL("/users", request.url))
  }

  if (!token && !isAuthRoute(pathname)) {
    const loginUrl = new URL("/auth/login", request.url)
    loginUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(loginUrl)
  }

  return i18nProxy(request)
}
