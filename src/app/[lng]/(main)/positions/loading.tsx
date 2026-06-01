import { DataTableSkeleton } from "@/components/shared/data-table/data-table-skeleton"

export default function PositionsLoading() {
  return <DataTableSkeleton columns={1} rows={12} />
}
