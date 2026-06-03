"use client"

import { Fragment, ReactNode, useMemo } from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { useT } from "next-i18next/client"

import { mapColumnsToColumnDefs } from "@/components/shared/data-table/data-table-helper"
import { DataTablePagination } from "@/components/shared/data-table/data-table-pagination"
import SearchPanel from "@/components/shared/search-panel"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

export type TableCellValue = string | number | boolean | null | undefined

export interface TableColumnConfig<TData, TValue = TableCellValue> {
  id: string
  titleKey: string
  ns?: string
  sortable?: boolean
  searchable?: boolean
  accessorFn?: (row: TData) => TValue
  cell?: (info: { row: TData; value: TValue }) => ReactNode
  isSrOnly?: boolean
}

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
  renderSubRow?: (row: TData) => React.ReactNode
}

function SubRowWrapper<TData>({
  render,
  data,
}: {
  render: (row: TData) => React.ReactNode
  data: TData
}) {
  return <>{render(data)}</>
}

export function DataTable<TData, TValue>({
  columns,
  data,
  totalCount,
  noResultsI18Key = "common",
  defaultSortBy,
  defaultPerPage = 20,
  totalText,
  searchValue,
  onSearchChangeAction,
  actions,
  renderSubRow,
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
                    <TableHead
                      key={header.id}
                      className={cn(
                        header.id === "actions"
                          ? "w-12 text-right"
                          : "max-w-64 truncate"
                      )}
                    >
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
                <Fragment key={row.id}>
                  <TableRow
                    data-state={row.getIsSelected() && "selected"}
                    className={cn(
                      renderSubRow && "border-b-0 hover:bg-muted/30"
                    )}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className={cn(
                          cell.column.id === "actions"
                            ? "w-12 text-right"
                            : "max-w-64 truncate"
                        )}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                  {renderSubRow && (
                    <TableRow className="border-t-0 hover:bg-muted/30">
                      <TableCell
                        colSpan={row.getVisibleCells().length}
                        className="pt-2 text-xs font-normal wrap-break-word whitespace-normal text-muted-foreground"
                      >
                        <SubRowWrapper
                          render={renderSubRow}
                          data={row.original}
                        />
                      </TableCell>
                    </TableRow>
                  )}
                </Fragment>
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
