import { NextRequest, NextResponse } from "next/server"

import { serverEnv } from "@/config/env.server"
import { createAuthJsonResponse } from "@/utils/auth/cookies"

export async function POST(req: NextRequest) {
  const body = await req.json()

  const gqlRes = await fetch(serverEnv.API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: `mutation Signup($auth: AuthInput!) {
        signup(auth: $auth) { access_token refresh_token user { id role email } }
      }`,
      variables: { auth: body },
    }),
  })

  const { data, errors } = await gqlRes.json()

  if (errors || !data?.signup) {
    const message = errors?.[0]?.message || "Signup failed"
    return NextResponse.json({ message }, { status: 400 })
  }

  return createAuthJsonResponse(
    { user: data.signup.user },
    {
      accessToken: data.signup.access_token,
      refreshToken: data.signup.refresh_token,
    }
  )
}
