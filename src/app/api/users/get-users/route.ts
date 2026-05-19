import { NextRequest, NextResponse } from "next/server"

import { COOKIES } from "@/config/const"
import { serverEnv } from "@/config/env.server"
import { decodeJwtPayload } from "@/features/auth/utils/jwt"
import { User } from "@/types/user"

export async function GET(req: NextRequest) {
  const token = req.cookies.get(COOKIES.ACCESS_TOKEN)?.value
  const { searchParams } = new URL(req.url)
  const limit = searchParams.get("limit")
    ? Number(searchParams.get("limit"))
    : 10
  const offset = searchParams.get("offset")
    ? Number(searchParams.get("offset"))
    : 0

  if (!token) {
    return NextResponse.json({ user: null }, { status: 401 })
  }

  const payload = decodeJwtPayload(token)
  if (!payload || !payload.sub) {
    return NextResponse.json({ user: null }, { status: 401 })
  }

  const gqlRes = await fetch(serverEnv.API_URL, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      query: `
      query GetUsersList($limit: Int, $offset: Int) {
        users(limit: $limit, offset: $offset) {
          id
          email
          department_name
          position_name
          // profile {
          //     avatar
          //     first_name
          //     last_name
          // }
        }
      }
      `,
      variables: { limit, offset },
    }),
  })

  const { data, errors } = await gqlRes.json()

  if (errors || !data?.user) {
    return NextResponse.json({ user: null }, { status: 401 })
  }

  const user: User = {
    id: data.user.id,
    email: data.user.email,
    avatarSrc: data.user.profile.avatar,
    // firstNa  me: data.user.profile.first_name,
    // lastName: data.user.profile.last_name,
    departmentName: data.user.department_name,
    positionName: data.user.position_name,
  }

  return NextResponse.json({ user })
}
