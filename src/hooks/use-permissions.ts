import { useAuth } from "@/app/auth-provider"

export function usePermission() {
  const { user: currentUser } = useAuth()

  const isAdmin = currentUser?.role?.toLowerCase() === "admin"

  const canCreateUser = () => {
    return isAdmin
  }

  const canUpdateUser = (userId: string) => {
    return isAdmin || currentUser?.id === userId
  }

  const canDeleteUser = (userId: string) => {
    return isAdmin && currentUser?.id !== userId
  }

  const canUpdateCv = (cvUserId: string) => {
    return isAdmin || currentUser?.id === cvUserId
  }

  return {
    canCreateUser,
    canUpdateUser,
    canDeleteUser,
    canUpdateCv,
  }
}
