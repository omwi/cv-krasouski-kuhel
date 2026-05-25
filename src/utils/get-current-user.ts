import { cache } from "react"
import { cookies } from "next/headers"

import { COOKIES } from "@/config/const"
import { decodeJwtPayload } from "@/features/auth/utils/jwt"
import type { CurrentUser } from "@/utils/permissions"

export const getCurrentUser = cache(async (): Promise<CurrentUser> => {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(COOKIES.ACCESS_TOKEN)?.value

    if (!token) return null

    const payload = decodeJwtPayload(token)
    if (payload && payload.sub) {
      return {
        id: String(payload.sub),
        role: payload.role,
      }
    }

    return null
  } catch (error) {
    console.error(error)
    return null
  }
})
