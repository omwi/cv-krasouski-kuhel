import { NextRequest, NextResponse } from "next/server"

import { serverEnv } from "@/config/env.server"

export async function POST(req: NextRequest) {
  const token = req.cookies.get("access_token")?.value
  const body = await req.text()

  const gqlRes = await fetch(serverEnv.API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body,
  })

  const data = await gqlRes.json()
  return NextResponse.json(data, { status: gqlRes.status })
}
