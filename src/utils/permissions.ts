export type CurrentUser = {
  id: string
  role?: string
} | null

export function isAdmin(user: CurrentUser) {
  return user?.role?.toLowerCase() === "admin"
}

export function canCreateUser(currentUser: CurrentUser) {
  return isAdmin(currentUser)
}

export function canUpdateUser(currentUser: CurrentUser, userId: string) {
  return isAdmin(currentUser) || currentUser?.id === userId
}

export function canDeleteUser(currentUser: CurrentUser, userId: string) {
  return isAdmin(currentUser) && currentUser?.id !== userId
}
