import { createAuthJsonResponse } from "@/utils/auth/cookies"

export async function POST() {
  return createAuthJsonResponse(
    { success: true },
    { accessToken: "", refreshToken: "" },
    { destroy: true }
  )
}
