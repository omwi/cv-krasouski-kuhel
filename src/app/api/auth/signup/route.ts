import { NextRequest, NextResponse } from "next/server"

import { serverEnv } from "@/config/env.server"

const IS_PROD = process.env.NODE_ENV === "production"
const ACCESS_MAX_AGE = 15 * 60
const REFRESH_MAX_AGE = 7 * 24 * 60 * 60

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

  const res = NextResponse.json({ user: data.signup.user })

  res.cookies.set("access_token", data.signup.access_token, {
    httpOnly: true,
    secure: IS_PROD,
    sameSite: "strict",
    path: "/",
    maxAge: ACCESS_MAX_AGE,
  })
  res.cookies.set("refresh_token", data.signup.refresh_token, {
    httpOnly: true,
    secure: IS_PROD,
    sameSite: "strict",
    path: "/",
    maxAge: REFRESH_MAX_AGE,
  })

  return res
}
