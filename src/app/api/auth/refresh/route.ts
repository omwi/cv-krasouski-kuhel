import { NextRequest, NextResponse } from "next/server"

import { serverEnv } from "@/config/env.server"

const IS_PROD = process.env.NODE_ENV === "production"

export async function POST(req: NextRequest) {
  const refreshToken = req.cookies.get("refresh_token")?.value
  if (!refreshToken) {
    return NextResponse.json({ message: "No refresh token" }, { status: 401 })
  }

  const gqlRes = await fetch(serverEnv.API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${refreshToken}`,
    },
    body: JSON.stringify({
      query: "mutation { updateToken { access_token refresh_token } }",
    }),
  })

  const { data, errors } = await gqlRes.json()

  if (errors || !data?.updateToken) {
    const res = NextResponse.json(
      { message: "Refresh failed" },
      { status: 401 }
    )
    res.cookies.delete("access_token")
    res.cookies.delete("refresh_token")
    return res
  }

  const res = NextResponse.json({ ok: true })
  res.cookies.set("access_token", data.updateToken.access_token, {
    httpOnly: true,
    secure: IS_PROD,
    sameSite: "strict",
    path: "/",
    maxAge: 15 * 60,
  })
  res.cookies.set("refresh_token", data.updateToken.refresh_token, {
    httpOnly: true,
    secure: IS_PROD,
    sameSite: "strict",
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  })
  return res
}
