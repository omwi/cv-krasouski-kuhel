"use client"

import { useCallback, useMemo } from "react"
import { useSuspenseQuery } from "@apollo/client/react"
import { Plus } from "lucide-react"
import { useT } from "next-i18next/client"

import { DataTable } from "@/components/shared/data-table/data-table"
import { Button } from "@/components/ui/button"
import CreateUser from "@/features/users/components/actions/create-user"
import { getColumns } from "@/features/users/components/user-table/users-table-columns"
import { GET_USERS_LIST } from "@/graphql/users/queries"
import { usePermissions } from "@/hooks/use-permissions"
import { useProcessedData } from "@/hooks/use-processed-data"
import { useTableUrlState } from "@/hooks/use-table-url-state"
import { GetUsersListQuery } from "@/types/__generated__/graphql"

export type TableUser = GetUsersListQuery["users"][0]

export default function UsersTable() {
  const { data } = useSuspenseQuery(GET_USERS_LIST)
  const columns = useMemo(() => getColumns(), [])
  const { params, updateParams } = useTableUrlState({
    defaultSortBy: "firstName",
  })
  const { t } = useT("table")

  const { currentUserId, canCreateUser } = usePermissions()

  const hasCreatePermission = canCreateUser()
  const hoistPredicate = useCallback(
    (u: TableUser) => u.id === currentUserId,
    [currentUserId]
  )

  const { paginatedData, totalCount } = useProcessedData({
    data: data?.users || [],
    params,
    columns,
    hoistPredicate,
  })

  return (
    <DataTable
      columns={columns}
      data={paginatedData}
      totalCount={totalCount}
      defaultSortBy="firstName"
      totalText={t("total", { count: totalCount })}
      searchValue={params.search}
      onSearchChangeAction={(value) => updateParams({ search: value })}
      actions={
        hasCreatePermission && (
          <CreateUser>
            <Button variant="outline-primary">
              <Plus />
              {t("user-table.create")}
            </Button>
          </CreateUser>
        )
      }
    />
  )
}
