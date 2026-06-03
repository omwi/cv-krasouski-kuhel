"use client"

import { useAuthContext } from "@/features/auth/components/auth-provider"

export function usePermissions() {
  const { userId: currentUserId, role: currentUserRole } = useAuthContext()

  const isAdmin = currentUserRole?.toLowerCase() === "admin"

  const canCreateUser = () => isAdmin
  const canUpdateUser = (userId: string) => isAdmin || currentUserId === userId
  const canDeleteUser = (userId: string) => isAdmin && currentUserId !== userId

  const canCreateCv = (userId?: string) => {
    if (!currentUserId) return false
    if (!userId) return true
    return isAdmin || currentUserId === userId
  }
  const canUpdateCv = (cvUserId?: string) => {
    if (!currentUserId) return false
    if (!cvUserId) return isAdmin
    return isAdmin || currentUserId === cvUserId
  }
  const canDeleteCv = (cvUserId?: string) => {
    if (!currentUserId) return false
    if (!cvUserId) return isAdmin
    return isAdmin || currentUserId === cvUserId
  }

  const canCreateProject = () => isAdmin
  const canUpdateProject = () => isAdmin
  const canDeleteProject = () => isAdmin

  return {
    currentUserId,
    canCreateUser,
    canUpdateUser,
    canDeleteUser,

    canCreateCv,
    canUpdateCv,
    canDeleteCv,

    canCreateProject,
    canUpdateProject,
    canDeleteProject,
  }
}
