"use client"

import { useAuthContext } from "@/features/auth/components/auth-provider"

export function usePermissions() {
  const { userId: currentUserId, role: currentUserRole } = useAuthContext()

  const isAdmin = currentUserRole?.toLowerCase() === "admin"

  const canCreateUser = () => isAdmin
  const canUpdateUser = (userId: string) => isAdmin || currentUserId === userId
  const canDeleteUser = (userId: string) => isAdmin && currentUserId !== userId

  const canCreateCv = (ownerId?: string) => {
    if (!currentUserId) return false
    if (!ownerId) return true
    return isAdmin || currentUserId === ownerId
  }
  const canUpdateCv = (ownerId?: string) => {
    if (!currentUserId) return false
    if (!ownerId) return isAdmin
    return isAdmin || currentUserId === ownerId
  }
  const canDeleteCv = (ownerId?: string) => {
    if (!currentUserId) return false
    if (!ownerId) return isAdmin
    return isAdmin || currentUserId === ownerId
  }

  return {
    currentUserId,
    isAdmin,

    canCreateUser,
    canUpdateUser,
    canDeleteUser,

    canCreateCv,
    canUpdateCv,
    canDeleteCv,
  }
}
