import { NextRequest, NextResponse } from "next/server"

import { serverEnv } from "@/config/env.server"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const authHeader = req.headers.get("Authorization")

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    }

    if (authHeader) {
      headers["Authorization"] = authHeader
    }

    const gqlRes = await fetch(serverEnv.API_URL, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        query: `mutation ResetPassword($auth: ResetPasswordInput!) {
          resetPassword(auth: $auth)
        }`,
        variables: { auth: body },
      }),
      cache: "no-store",
    })

    const result = await gqlRes.json()

    if (result.errors) {
      return NextResponse.json(
        { message: result.errors[0].message || "GraphQL Error" },
        { status: 400 }
      )
    }

    return NextResponse.json({ success: true, data: result.data })
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500 }
    )
  }
}
