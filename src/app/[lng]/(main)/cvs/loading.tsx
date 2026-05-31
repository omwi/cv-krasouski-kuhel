import { DataTableSkeleton } from "@/components/shared/data-table/data-table-skeleton"

export default function DepartmentsLoading() {
  return <DataTableSkeleton columns={4} rows={10} />
}
