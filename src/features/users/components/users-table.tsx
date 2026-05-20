"use client"

import { useSuspenseQuery } from "@apollo/client/react"
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { useT } from "next-i18next/client"

import SearchPanel from "@/components/shared/search-panel"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { UsersTablePagination } from "@/features/users/components/users-table-pagination"
import { GET_USERS_LIST } from "@/features/users/graphql/queries"
import { useProcessedUsers } from "@/features/users/hooks/use-processed-users"
import { useUsersUrlState } from "@/features/users/hooks/use-users-url-state"

import { columns } from "./users-table-columns"

export type TableUser = {
  id: string
  email: string
  department_name: string
  position_name: string
  profile?: {
    avatar?: string | null
    first_name?: string
    last_name?: string
    full_name?: string | null
  } | null
}

export default function UsersTable() {
  const { data } = useSuspenseQuery<{ users: TableUser[] }>(GET_USERS_LIST)
  const { params, updateParams } = useUsersUrlState()
  const { t } = useT("user-table")

  const { paginatedData, totalCount } = useProcessedUsers(
    data?.users || [],
    params
  )

  const table = useReactTable({
    data: paginatedData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col gap-4 overflow-hidden">
      <SearchPanel
        value={params.search}
        onChangeAction={(value) => updateParams({ search: value })}
        className="w-62.5 shrink-0 py-4 lg:w-87.5"
        debounceMs={300}
      />
      <div className="flex-1 overflow-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className="h-24 text-center hover:bg-transparent">
                <TableCell colSpan={columns.length}>{t("not-found")}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <UsersTablePagination totalCount={totalCount} />
    </div>
  )
}
