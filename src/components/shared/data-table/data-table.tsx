"use client"

import { useMemo } from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { useT } from "next-i18next/client"

import { DataTablePagination } from "@/components/shared/data-table/data-table-pagination"
import {
  TableCellValue,
  TableColumnConfig,
} from "@/components/shared/data-table/types"
import { mapColumnsToColumnDefs } from "@/components/shared/data-table/utils"
import SearchPanel from "@/components/shared/search-panel"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[] | TableColumnConfig<TData>[]
  data: TData[]
  totalCount: number
  noResultsI18Key?: string
  defaultSortBy?: string
  defaultPerPage?: number
  totalText: string
  searchValue?: string
  onSearchChangeAction?: (value: string) => void
  actions?: React.ReactNode
}

export function DataTable<TData, TValue>({
  columns,
  data,
  totalCount,
  noResultsI18Key = "table",
  defaultSortBy,
  defaultPerPage = 20,
  totalText,
  searchValue,
  onSearchChangeAction,
  actions,
}: DataTableProps<TData, TValue>) {
  const mappedColumns = useMemo(() => {
    if (!columns || columns.length === 0) return []
    const isCustomConfig = "titleKey" in columns[0]
    if (isCustomConfig) {
      return mapColumnsToColumnDefs(
        columns as TableColumnConfig<TData, TableCellValue>[],
        defaultSortBy
      )
    }
    return columns as ColumnDef<TData, TValue>[]
  }, [columns, defaultSortBy])

  const table = useReactTable({
    data,
    columns: mappedColumns,
    getCoreRowModel: getCoreRowModel(),
  })
  const { t } = useT(noResultsI18Key)
  const noResultsText = t("not-found")

  const showToolbar = searchValue !== undefined || actions !== undefined

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col gap-4 overflow-hidden">
      {showToolbar && (
        <div className="flex items-center justify-between gap-4 max-sm:flex-col max-sm:items-start">
          {onSearchChangeAction && searchValue !== undefined ? (
            <SearchPanel
              value={searchValue}
              onChangeAction={onSearchChangeAction}
              className="w-62.5 shrink-0 py-4 lg:w-87.5"
              debounceMs={300}
            />
          ) : (
            <div />
          )}
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
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
                <TableCell colSpan={columns.length}>{noResultsText}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination
        totalCount={totalCount}
        totalText={totalText}
        defaultPerPage={defaultPerPage}
      />
    </div>
  )
}
