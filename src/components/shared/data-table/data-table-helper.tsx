import { ColumnDef } from "@tanstack/react-table"
import { useT } from "next-i18next/client"

import {
  TableCellValue,
  TableColumnConfig,
} from "@/components/shared/data-table/data-table"
import { DataTableColumnHeader } from "@/components/shared/data-table/data-table-column-header"

const SRHeader = ({ titleKey, ns }: { titleKey: string; ns?: string }) => {
  const { t } = useT(ns || "table")
  return <span className="sr-only">{t(titleKey)}</span>
}

const SortableHeader = ({
  titleKey,
  sortKey,
  ns,
  defaultSortBy,
}: {
  titleKey: string
  sortKey: string
  ns?: string
  defaultSortBy?: string
}) => {
  const { t } = useT(ns || "table")
  return (
    <DataTableColumnHeader
      title={t(titleKey)}
      sortKey={sortKey}
      defaultSortBy={defaultSortBy}
    />
  )
}

const NormalHeader = ({ titleKey, ns }: { titleKey: string; ns?: string }) => {
  const { t } = useT(ns || "table")
  return (
    <span className="p-4 text-sm font-medium text-foreground">
      {t(titleKey)}
    </span>
  )
}

export function mapColumnsToColumnDefs<TData>(
  columns: TableColumnConfig<TData, TableCellValue>[],
  defaultSortBy?: string
): ColumnDef<TData, TableCellValue>[] {
  return columns.map((col) => {
    const columnDef: ColumnDef<TData, TableCellValue> = {
      id: col.id,
      accessorFn:
        col.accessorFn ||
        ((row) => (row as Record<string, TableCellValue>)[col.id]),
    }

    columnDef.header = () => {
      if (col.isSrOnly) {
        return <SRHeader titleKey={col.titleKey} ns={col.ns} />
      }
      if (col.sortable) {
        return (
          <SortableHeader
            titleKey={col.titleKey}
            sortKey={col.id}
            ns={col.ns}
            defaultSortBy={defaultSortBy}
          />
        )
      }
      return <NormalHeader titleKey={col.titleKey} ns={col.ns} />
    }

    if (col.cell) {
      columnDef.cell = ({ row, getValue }) =>
        col.cell!({ row: row.original, value: getValue() })
    } else {
      columnDef.cell = ({ getValue }) => {
        const val = getValue()
        return val !== undefined && val !== null ? (
          <div className="text-sm">{String(val)}</div>
        ) : null
      }
    }

    return columnDef
  })
}
