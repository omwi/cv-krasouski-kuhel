import { useMemo } from "react"
import { useReactiveVar } from "@apollo/client/react"

import { TableUser } from "@/features/users/components/users-table"
import { authUserVar } from "@/lib/apollo/auth-var"

import { UsersUrlParams } from "./use-users-url-state"

export function useProcessedUsers(users: TableUser[], params: UsersUrlParams) {
  const currentUser = useReactiveVar(authUserVar)

  return useMemo(() => {
    if (!users || !users.length) return { paginatedData: [], totalCount: 0 }

    let processed = users.filter((u) => {
      if (!params.search) return true
      const term = params.search.toLowerCase()
      return (
        u.profile?.full_name?.toLowerCase().includes(term) ||
        u.email?.toLowerCase().includes(term) ||
        u.position_name?.toLowerCase().includes(term) ||
        u.department_name?.toLowerCase().includes(term)
      )
    })

    processed = [...processed].sort((a, b) => {
      let fieldA = ""
      let fieldB = ""

      switch (params.sortBy) {
        case "firstName":
          fieldA = a.profile?.first_name || ""
          fieldB = b.profile?.first_name || ""
          break
        case "lastName":
          fieldA = a.profile?.last_name || ""
          fieldB = b.profile?.last_name || ""
          break
        case "email":
          fieldA = a.email || ""
          fieldB = b.email || ""
          break
        case "departmentName":
          fieldA = a.department_name || ""
          fieldB = b.department_name || ""
          break
        case "positionName":
          fieldA = a.position_name || ""
          fieldB = b.position_name || ""
          break
      }

      const comparison = fieldA.localeCompare(fieldB)
      return params.sortOrder === "asc" ? comparison : -comparison
    })

    if (currentUser) {
      const currentUserIndex = processed.findIndex(
        (u) => u.id === currentUser.id
      )
      if (currentUserIndex > 0) {
        const [curUser] = processed.splice(currentUserIndex, 1)
        processed.unshift(curUser)
      }
    }

    const totalCount = processed.length
    const paginatedData = processed.slice(
      (params.page - 1) * params.perPage,
      params.page * params.perPage
    )

    return { paginatedData, totalCount }
  }, [users, currentUser, params])
}
