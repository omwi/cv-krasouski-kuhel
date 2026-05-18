import { NextRequest, NextResponse } from "next/server"

import { serverEnv } from "@/config/env.server"
import { createAuthJsonResponse } from "@/utils/auth/cookies"

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

  return createAuthJsonResponse(
    { ok: true },
    {
      accessToken: data.updateToken.access_token,
      refreshToken: data.updateToken.refresh_token,
    }
  )
}
