import { NextRequest, NextResponse } from "next/server"

import { COOKIES } from "@/config/const"
import { serverEnv } from "@/config/env.server"
import { decodeJwtPayload } from "@/features/auth/utils/jwt"

export async function GET(req: NextRequest) {
  const token = req.cookies.get(COOKIES.ACCESS_TOKEN)?.value

  if (!token) {
    return NextResponse.json({ user: null }, { status: 401 })
  }

  const payload = decodeJwtPayload(token)
  if (!payload || !payload.sub) {
    return NextResponse.json({ user: null }, { status: 401 })
  }

  const userId = String(payload.sub)

  const gqlRes = await fetch(serverEnv.API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      query: `
        query GetMe($userId: ID!) {
          user(userId: $userId) {
            id
            email
            role
          }
        }
      `,
      variables: { userId },
    }),
  })

  const { data, errors } = await gqlRes.json()

  if (errors || !data?.user) {
    return NextResponse.json({ user: null }, { status: 401 })
  }

  return NextResponse.json({ user: data.user })
}
