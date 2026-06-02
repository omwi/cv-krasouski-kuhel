import { NextRequest, NextResponse } from "next/server"

import { COOKIES } from "@/config/const"
import { serverEnv } from "@/config/env.server"

export async function POST(req: NextRequest) {
  const body = await req.json()
  const token = req.cookies.get(COOKIES.ACCESS_TOKEN)?.value

  const gqlRes = await fetch(serverEnv.API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({
      query: `mutation VerifyMail($mail: VerifyMailInput!) {
        verifyMail(mail: $mail)
      }`,
      variables: { mail: { otp: body.otp } },
    }),
    cache: "no-store",
  })

  const { errors } = await gqlRes.json()

  if (errors) {
    const message = errors[0]?.message || "Failed to verify"
    return NextResponse.json({ message }, { status: 400 })
  }

  return NextResponse.json({ success: true })
}
