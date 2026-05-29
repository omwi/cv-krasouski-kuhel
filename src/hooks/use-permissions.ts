"use client"

import { useAuthContext } from "@/features/auth/components/auth-provider"

export function usePermissions() {
  const { userId: currentUserId, role: currentUserRole } = useAuthContext()

  const isAdmin = currentUserRole?.toLowerCase() === "admin"

  const canCreateUser = () => isAdmin
  const canUpdateUser = (userId: string) => isAdmin || currentUserId === userId
  const canDeleteUser = (userId: string) => isAdmin && currentUserId !== userId

  const canCreateCv = (userId?: string) => {
    if (!userId) return true
    return isAdmin || currentUserId === userId
  }
  const canUpdateCv = (cvUserId?: string) => {
    if (!cvUserId) return isAdmin
    return isAdmin || currentUserId === cvUserId
  }
  const canDeleteCv = (cvUserId?: string) => {
    if (!cvUserId) return isAdmin
    return isAdmin || currentUserId === cvUserId
  }

  return {
    canCreateUser,
    canUpdateUser,
    canDeleteUser,
    canCreateCv,
    canUpdateCv,
    canDeleteCv,
  }
}
