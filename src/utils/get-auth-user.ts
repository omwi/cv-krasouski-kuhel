import { cookies } from "next/headers"

import { COOKIES } from "@/config/const"
import { decodeJwtPayload } from "@/features/auth/utils/jwt"

export type CurrentUser = {
  id: string
  role?: string
} | null

export async function getCurrentUser(): Promise<CurrentUser> {
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
}
