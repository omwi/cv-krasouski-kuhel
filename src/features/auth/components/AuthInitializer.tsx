"use client"

import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"

import { authUserVar } from "@/lib/apollo/authVar"
import { onAuthEvent } from "@/lib/auth/authChannel"
import { User } from "@/types/auth"

const AUTH_ROUTES = ["/auth/login", "/auth/signup", "/forgot-password"]

export function AuthInitializer() {
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    let isMounted = true

    async function initAuth() {
      try {
        const res = await fetch("/api/auth/me")
        if (res.ok) {
          const { user } = await res.json()
          if (isMounted && user) {
            authUserVar(user as User)

            const pathWithoutLocale = pathname.replace(
              /^\/[a-zA-Z]{2}(-[a-zA-Z]{2})?(\/|$)/,
              "/"
            )
            const isAuthRoute = AUTH_ROUTES.some(
              (route) =>
                pathWithoutLocale === route ||
                pathWithoutLocale.startsWith(route + "/")
            )

            if (isAuthRoute) {
              router.push("/users")
            }
          }
        } else {
          if (isMounted) authUserVar(null)
        }
      } catch (err) {
        console.error("[AuthInitializer] Failed to fetch me:", err)
        if (isMounted) authUserVar(null)
      }
    }

    void initAuth()

    const unsubscribe = onAuthEvent((event) => {
      if (event.type === "LOGOUT") {
        if (isMounted) authUserVar(null)

        const pathWithoutLocale = pathname.replace(
          /^\/[a-zA-Z]{2}(-[a-zA-Z]{2})?(\/|$)/,
          "/"
        )
        const isAuthRoute = AUTH_ROUTES.some(
          (route) =>
            pathWithoutLocale === route ||
            pathWithoutLocale.startsWith(route + "/")
        )

        if (!isAuthRoute) {
          router.push("/auth/login")
        }
      } else if (event.type === "TOKEN_REFRESHED") {
        void initAuth()
      }
    })

    return () => {
      isMounted = false
      unsubscribe()
    }
  }, [pathname, router])

  return null
}
