import { NextRequest, NextResponse } from "next/server"

import { COOKIES } from "@/config/const"
import { serverEnv } from "@/config/env.server"
import { createAuthJsonResponse } from "@/features/auth/utils/cookies"

export async function POST(req: NextRequest) {
  const refreshToken = req.cookies.get(COOKIES.REFRESH_TOKEN)?.value
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
    cache: "no-store",
  })

  const { data, errors } = await gqlRes.json()

  if (errors || !data?.updateToken) {
    const res = NextResponse.json(
      { message: "Refresh failed" },
      { status: 401 }
    )
    res.cookies.delete(COOKIES.ACCESS_TOKEN)
    res.cookies.delete(COOKIES.REFRESH_TOKEN)
    return res
  }

  return createAuthJsonResponse(
    { ok: true },
    {
      accessToken: data.updateToken.access_token,
      refreshToken: data.updateToken.refresh_token,
    }
  )
}
