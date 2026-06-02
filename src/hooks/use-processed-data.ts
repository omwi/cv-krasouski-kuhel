import { useMemo } from "react"

import {
  TableCellValue,
  TableColumnConfig,
} from "@/components/shared/data-table/data-table"
import { TableUrlParams } from "@/hooks/use-table-url-state"

interface UseProcessedDataOptions<TData> {
  data: TData[]
  params: TableUrlParams
  columns: TableColumnConfig<TData>[]
  hoistPredicate?: (row: TData) => boolean
}

export function useProcessedData<TData>({
  data,
  params,
  columns,
  hoistPredicate,
}: UseProcessedDataOptions<TData>) {
  return useMemo(() => {
    if (!data || !data.length) return { paginatedData: [], totalCount: 0 }

    let processed = data.filter((row) => {
      if (!params.search) return true
      const term = params.search.toLowerCase()

      return columns.some((col) => {
        if (!col.searchable) return false

        const val = col.accessorFn
          ? col.accessorFn(row)
          : (row as Record<string, TableCellValue>)[col.id]
        if (val === undefined || val === null) return false

        return String(val).toLowerCase().includes(term)
      })
    })

    const activeSortColumn = columns.find((col) => col.id === params.sortBy)
    if (activeSortColumn && activeSortColumn.sortable) {
      processed = processed.toSorted((a, b) => {
        let valA = activeSortColumn.accessorFn
          ? activeSortColumn.accessorFn(a)
          : (a as Record<string, TableCellValue>)[activeSortColumn.id]
        let valB = activeSortColumn.accessorFn
          ? activeSortColumn.accessorFn(b)
          : (b as Record<string, TableCellValue>)[activeSortColumn.id]

        if (valA === undefined || valA === null) valA = ""
        if (valB === undefined || valB === null) valB = ""

        let comparison = 0
        if (typeof valA === "number" && typeof valB === "number") {
          comparison = valA - valB
        } else {
          comparison = String(valA).localeCompare(String(valB))
        }

        return params.sortOrder === "asc" ? comparison : -comparison
      })
    }

    if (hoistPredicate) {
      const hoistIndex = processed.findIndex(hoistPredicate)
      if (hoistIndex > 0) {
        const [hoistedItem] = processed.splice(hoistIndex, 1)
        processed.unshift(hoistedItem)
      }
    }

    const totalCount = processed.length
    const paginatedData = processed.slice(
      (params.page - 1) * params.perPage,
      params.page * params.perPage
    )

    return { paginatedData, totalCount }
  }, [data, params, columns, hoistPredicate])
}
