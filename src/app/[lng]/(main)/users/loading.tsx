import { DataTableSkeleton } from "@/components/shared/data-table/data-table-skeleton"

export default function UsersLoading() {
  return <DataTableSkeleton columns={5} rows={20} />
}
