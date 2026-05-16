import { NextResponse } from "next/server"

export async function POST() {
  const IS_PROD = process.env.NODE_ENV === "production"
  const res = NextResponse.json({ ok: true })

  res.cookies.set("access_token", "", {
    httpOnly: true,
    secure: IS_PROD,
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  })
  res.cookies.set("refresh_token", "", {
    httpOnly: true,
    secure: IS_PROD,
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  })

  return res
}
