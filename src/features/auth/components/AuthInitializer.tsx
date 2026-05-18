"use client"

import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"

import { paths } from "@/config/paths"
import { authUserVar } from "@/lib/apollo/authVar"
import { onAuthEvent } from "@/lib/auth/authChannel"
import { User } from "@/types/auth"
import { isAuthRoute } from "@/utils/is-auth-route"
import { pathWithoutLocale } from "@/utils/path-without-locale"

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

            if (isAuthRoute(pathWithoutLocale(pathname))) {
              router.push(paths.users.get())
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

        if (!isAuthRoute(pathWithoutLocale(pathname))) {
          router.push(paths.auth.login.get())
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
