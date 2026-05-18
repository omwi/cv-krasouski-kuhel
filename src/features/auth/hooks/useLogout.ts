import { useRouter } from "next/navigation"
import { useApolloClient } from "@apollo/client/react"

import { paths } from "@/config/paths"
import { authUserVar } from "@/lib/apollo/authVar"
import { broadcastAuthEvent } from "@/lib/auth/authChannel"

export function useLogout() {
  const client = useApolloClient()
  const router = useRouter()

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
    } catch (error) {
      console.error("Logout request failed", error)
    } finally {
      authUserVar(null)

      await client.clearStore()

      broadcastAuthEvent({ type: "LOGOUT" })

      router.push(paths.auth.login.get())
    }
  }

  return { logout }
}
