"use client"

import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"

import { API_ENDPOINTS } from "@/config/api-endpoints"
import { paths } from "@/config/paths"
import { onAuthEvent } from "@/features/auth/lib/auth-channel"
import { isAuthRoute } from "@/features/auth/utils/is-auth-route"
import { authUserVar } from "@/lib/apollo/auth-var"
import { User } from "@/types/user"
import { pathWithoutLocale } from "@/utils/path-without-locale"

export function AuthInitializer() {
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    let isMounted = true

    async function initAuth() {
      try {
        const res = await fetch(API_ENDPOINTS.auth.me)
        if (res.ok) {
          const { user } = await res.json()
          if (isMounted && user) {
            authUserVar(user as User)

            if (isAuthRoute(pathWithoutLocale(pathname))) {
              router.replace(paths.users.get())
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
          router.replace(paths.auth.login.get())
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
