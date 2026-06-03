"use client"

import { createContext, ReactNode, use, useMemo } from "react"

type AuthContextType = {
  userId: string | null
  role: string | null
}

const AuthContext = createContext<AuthContextType>({
  userId: null,
  role: null,
})

export function AuthProvider({
  children,
  userId,
  role,
}: {
  children: ReactNode
  userId: string | null
  role: string | null
}) {
  const value = useMemo(() => ({ userId, role }), [userId, role])

  return <AuthContext value={value}>{children}</AuthContext>
}

export function useAuthContext() {
  return use(AuthContext)
}
