import { useRouter } from "next/navigation"
import { useApolloClient } from "@apollo/client/react"

import { API_ENDPOINTS } from "@/config/api-endpoints"
import { paths } from "@/config/paths"
import { broadcastAuthEvent } from "@/features/auth/lib/auth-channel"
import { authUserVar } from "@/lib/apollo/auth-var"

export function useLogout() {
  const client = useApolloClient()
  const router = useRouter()

  const logout = async () => {
    try {
      await fetch(API_ENDPOINTS.auth.logout, { method: "POST" })
    } catch (error) {
      console.error("Logout request failed", error)
    } finally {
      authUserVar(null)

      await client.clearStore()

      broadcastAuthEvent({ type: "LOGOUT" })

      router.replace(paths.auth.login.get())
    }
  }

  return { logout }
}
