"use client"

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react"
import { useReactiveVar } from "@apollo/client/react"

import { authUserVar } from "@/lib/apollo/auth-var"
import { CurrentUser } from "@/utils/permissions"

type AuthContextValue = {
  user: CurrentUser
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

type AuthProviderProps = {
  initialUser: CurrentUser
  children: ReactNode
}

export function AuthProvider({ initialUser, children }: AuthProviderProps) {
  const [user, setUser] = useState(initialUser)

  const authUser = useReactiveVar(authUserVar)
  useEffect(() => {
    // todo: tmp solution, should fix authentication
    // currently we have 3 sources of truth: /me, authUserVar and cookies
    // also AuthInitializer refetches /me on every navigation, probably it should be refactored
    if (!authUser) return
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUser(authUser)
  }, [authUser])

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
