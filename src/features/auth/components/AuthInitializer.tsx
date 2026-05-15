"use client"

import { useEffect } from "react"

import { authUserVar } from "@/lib/apollo/authVar"
import { User } from "@/types/auth"

interface JwtPayload {
  sub: number | string
  email: string
  role: string
  exp: number
}

function parseJwt(token: string): JwtPayload | null {
  try {
    const base64Payload = token.split(".")[1]
    const decoded = atob(base64Payload.replace(/-/g, "+").replace(/_/g, "/"))
    return JSON.parse(decoded) as JwtPayload
  } catch {
    return null
  }
}

function getCookie(name: string): string | undefined {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(";").shift()
  return undefined
}

export function AuthInitializer() {
  useEffect(() => {
    const token = getCookie("access_token")
    if (!token) return

    const payload = parseJwt(token)
    if (!payload) return

    const isExpired = payload.exp * 1000 < Date.now()
    if (isExpired) return

    const user: User = {
      id: String(payload.sub),
      email: payload.email,
      role: payload.role,
    }

    authUserVar(user)
  }, [])

  return null
}
