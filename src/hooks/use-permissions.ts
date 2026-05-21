import { useReactiveVar } from "@apollo/client/react"

import { authUserVar } from "@/lib/apollo/auth-var"

export function usePermission() {
  const authUser = useReactiveVar(authUserVar)

  const isAdmin = authUser?.role?.toLowerCase() === "admin"

  const canCreateUser = () => {
    return isAdmin
  }

  const canUpdateUser = (userId: string) => {
    return isAdmin || authUser?.id === userId
  }

  const canDeleteUser = (userId: string) => {
    return isAdmin && authUser?.id !== userId
  }

  const canUpdateCv = (cvUserId: string) => {
    return isAdmin || authUser?.id === cvUserId
  }

  return {
    canCreateUser,
    canUpdateUser,
    canDeleteUser,
    canUpdateCv,
  }
}
