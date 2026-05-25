import { useApolloClient } from "@apollo/client/react"

import { API_ENDPOINTS } from "@/config/api-endpoints"
import { paths } from "@/config/paths"
import { broadcastAuthEvent } from "@/features/auth/lib/auth-channel"

export function useLogout() {
  const client = useApolloClient()

  const logout = async () => {
    try {
      await fetch(API_ENDPOINTS.auth.logout, { method: "POST" })
    } catch (error) {
      console.error("Logout request failed", error)
    } finally {
      await client.clearStore()

      broadcastAuthEvent({ type: "LOGOUT" })
      window.location.href = paths.auth.login.get()
    }
  }

  return { logout }
}
