import { useAuthContext } from "@/features/auth/components/auth-provider"

export function usePermissions() {
  const { userId: currentUserId, role: currentUserRole } = useAuthContext()

  const isAdmin = currentUserRole?.toLowerCase() === "admin"

  const canCreateUser = () => isAdmin
  const canUpdateUser = (userId: string) => isAdmin || currentUserId === userId
  const canDeleteUser = (userId: string) => isAdmin && currentUserId !== userId

  return { canCreateUser, canUpdateUser, canDeleteUser }
}
