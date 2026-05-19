"use client"

import { useReactiveVar } from "@apollo/client/react"

import UsersTable from "@/features/users/components/users-table"
import { columns } from "@/features/users/config/columns"
import { useFetchUsers } from "@/features/users/hooks/useFetshUsers"
import { authUserVar } from "@/lib/apollo/auth-var"

export default function Users() {
  const loggedUser = useReactiveVar(authUserVar)
  const { data, loading } = useFetchUsers()
  console.log(data)
  return <>{/*<UsersTable />*/}</>
}
