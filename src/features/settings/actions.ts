"use server"

import { cookies } from "next/headers"

import { COOKIES } from "@/config/const"

export async function getLanguageCookie(): Promise<string> {
  const cookieStore = await cookies()
  return cookieStore.get(COOKIES.LANGUAGE)?.value ?? "system"
}

export async function setLanguageCookie(value: string) {
  const cookieStore = await cookies()
  cookieStore.set(COOKIES.LANGUAGE, value, { path: "/", sameSite: "lax" })
}

export async function resetLanguageCookie() {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIES.LANGUAGE)
}
