import { DataTableSkeleton } from "@/components/shared/data-table/data-table-skeleton"

export default function DepartmentsLoading() {
  return <DataTableSkeleton columns={1} rows={10} />
}
