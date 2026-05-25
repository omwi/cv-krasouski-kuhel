"use client"

import { createContext, ReactNode, useContext, useMemo } from "react"

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

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuthContext() {
  return useContext(AuthContext)
}
