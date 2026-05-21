"use client"

import { useMemo } from "react"
import { useSuspenseQuery } from "@apollo/client/react"
import { Plus } from "lucide-react"
import { useT } from "next-i18next/client"

import { DataTable } from "@/components/shared/data-table/data-table"
import SearchPanel from "@/components/shared/search-panel"
import { Button } from "@/components/ui/button"
import { useProcessedUsers } from "@/features/users/hooks/use-processed-users"
import { GET_USERS_LIST } from "@/graphql/users/queries"
import { useTableUrlState } from "@/hooks/use-table-url-state"
import { GetUsersListQuery } from "@/types/__generated__/graphql"
import type { CurrentUser } from "@/utils/get-auth-user"

import CreateUser from "../actions/create-user"
import { getColumns } from "./users-table-columns"

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
  const { t } = useT("user-table")

  const isAdmin = currentUser?.role?.toLowerCase() === "admin"
  const { paginatedData, totalCount } = useProcessedUsers(
    data?.users || [],
    params,
    currentUser
  )

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col gap-4 overflow-hidden">
      <div className="flex items-center justify-between">
        <SearchPanel
          value={params.search}
          onChangeAction={(value) => updateParams({ search: value })}
          className="w-62.5 shrink-0 py-4 lg:w-87.5"
          debounceMs={300}
        />
        {isAdmin && (
          <CreateUser currentUser={currentUser}>
            <Button variant="outline-primary">
              <Plus />
              {t("create-user")}
            </Button>
          </CreateUser>
        )}
      </div>
      <DataTable
        columns={columns}
        data={paginatedData}
        totalCount={totalCount}
        defaultSortBy="firstName"
        totalText={t("total-users", { total: totalCount })}
      />
    </div>
  )
}
