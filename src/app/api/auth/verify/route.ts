import { NextRequest, NextResponse } from "next/server"

import { serverEnv } from "@/config/env.server"

export async function POST(req: NextRequest) {
  const body = await req.json()

  const gqlRes = await fetch(serverEnv.API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: `mutation ForgotPassword($auth: ForgotPasswordInput!) {
        forgotPassword(auth: $auth)
      }`,
      variables: { auth: body },
    }),
  })

  const { data, errors } = await gqlRes.json()

  if (errors) {
    const message = errors[0]?.message || "Failed to verify"
    return NextResponse.json({ message }, { status: 400 })
  }

  return NextResponse.json({ success: data.forgotPassword })
}
