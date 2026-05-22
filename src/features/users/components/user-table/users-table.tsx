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
import { useProcessedData } from "@/hooks/use-processed-data"
import { useTableUrlState } from "@/hooks/use-table-url-state"
import { GetUsersListQuery } from "@/types/__generated__/graphql"
import type { CurrentUser } from "@/utils/permissions"

export type TableUser = GetUsersListQuery["users"][0]

export default function UsersTable({
  currentUser,
}: {
  currentUser: CurrentUser
}) {
  const { data } = useSuspenseQuery(GET_USERS_LIST)
  const columns = useMemo(() => getColumns(currentUser), [currentUser])
  const { params, updateParams } = useTableUrlState({
    defaultSortBy: "firstName",
  })
  const { t } = useT("table")

  const isAdmin = currentUser?.role?.toLowerCase() === "admin"
  const hoistPredicate = useCallback(
    (u: TableUser) => u.id === currentUser?.id,
    [currentUser?.id]
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
        isAdmin && (
          <CreateUser currentUser={currentUser}>
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
