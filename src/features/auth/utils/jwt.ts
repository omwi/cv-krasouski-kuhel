import { NextRequest } from "next/server"

import { COOKIES } from "@/config/const"

export type JwtPayload = {
  exp?: number
  role?: string
  sub?: string | number
}

export function decodeJwtPayload(token: string): JwtPayload | null {
  try {
    const base64Payload = token.split(".")[1]
    const decoded = atob(base64Payload.replace(/-/g, "+").replace(/_/g, "/"))
    return JSON.parse(decoded) as JwtPayload
  } catch {
    return null
  }
}

export function checkAccessToken(request: NextRequest): {
  isValid: boolean
  role?: string
} {
  const token = request.cookies.get(COOKIES.ACCESS_TOKEN)?.value
  if (token) {
    const payload = decodeJwtPayload(token)
    if (payload?.exp && payload.exp * 1000 > Date.now()) {
      return { isValid: true, role: payload.role }
    }
  }
  return { isValid: false }
}
