import { NextRequest, NextResponse } from "next/server"

import { COOKIES } from "@/config/const"
import { serverEnv } from "@/config/env.server"
import { decodeJwtPayload } from "@/features/auth/utils/jwt"
import { User } from "@/types/user"

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
            department_name
            position_name
            profile {
              avatar
              full_name
            }
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

  const user: User = {
    id: data.user.id,
    email: data.user.email,
    role: data.user.role,
    avatarSrc: data.user.profile.avatar,
    fullName: data.user.profile.full_name,
    departmentName: data.user.department_name,
    positionName: data.user.position_name,
  }

  return NextResponse.json({ user })
}
