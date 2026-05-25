export type CurrentUser = {
  id: string
  role?: string
} | null

export function isAdmin(user: CurrentUser) {
  return user?.role?.toLowerCase() === "admin"
}

export function isEmployee(user: CurrentUser) {
  return user?.role?.toLowerCase() === "employee"
}

export const userPermissions = {
  canCreate: (user: CurrentUser) => isAdmin(user),
  canView: (user: CurrentUser) => isAdmin(user) || isEmployee(user),
  canUpdate: (user: CurrentUser, targetId: string) =>
    isAdmin(user) || user?.id === targetId,
  canDelete: (user: CurrentUser, targetId: string) =>
    isAdmin(user) && user?.id !== targetId,
}

export const cvPermissions = {
  canCreate: (user: CurrentUser) => isAdmin(user) || isEmployee(user),
  canView: (user: CurrentUser) => isAdmin(user) || isEmployee(user),
  canUpdate: (user: CurrentUser, isOwner = false) => isAdmin(user) || isOwner,
  canDelete: (user: CurrentUser, isOwner = false) => isAdmin(user) || isOwner,
}

export const projectPermissions = {
  canCreate: (user: CurrentUser) => isAdmin(user),
  canView: (user: CurrentUser) => isAdmin(user) || isEmployee(user),
  canUpdate: (user: CurrentUser) => isAdmin(user),
  canDelete: (user: CurrentUser) => isAdmin(user),
}

export const adminOnlyPermissions = {
  canCreate: (user: CurrentUser) => isAdmin(user),
  canUpdate: (user: CurrentUser) => isAdmin(user),
  canDelete: (user: CurrentUser) => isAdmin(user),
}
