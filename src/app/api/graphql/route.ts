import { NextRequest, NextResponse } from "next/server"

import { COOKIES } from "@/config/const"
import { serverEnv } from "@/config/env.server"

export async function POST(req: NextRequest) {
  const token = req.cookies.get(COOKIES.ACCESS_TOKEN)?.value
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
