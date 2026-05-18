import { NextRequest, NextResponse } from "next/server"

import { serverEnv } from "@/config/env.server"
import { createAuthJsonResponse } from "@/utils/auth/cookies"

export async function POST(req: NextRequest) {
  const { email, password } = await req.json()

  const gqlRes = await fetch(serverEnv.API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: `query Login($auth: AuthInput!) {
        login(auth: $auth) { access_token refresh_token user { id role email } }
      }`,
      variables: { auth: { email, password } },
    }),
  })

  const { data, errors } = await gqlRes.json()

  if (errors || !data?.login) {
    const message = errors?.[0]?.message || "Login failed"
    return NextResponse.json({ message }, { status: 401 })
  }

  return createAuthJsonResponse(
    { user: data.login.user },
    {
      accessToken: data.login.access_token,
      refreshToken: data.login.refresh_token,
    }
  )
}
