import { ReactNode } from "react"

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
