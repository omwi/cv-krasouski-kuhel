import { createAuthJsonResponse } from "@/features/auth/utils/cookies"

export async function POST() {
  return createAuthJsonResponse(
    { success: true },
    { accessToken: "", refreshToken: "" },
    { destroy: true }
  )
}
