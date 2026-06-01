import { DataTableSkeleton } from "@/components/shared/data-table/data-table-skeleton"

export default function UsersLoading() {
  return <DataTableSkeleton columns={4} rows={20} />
}
