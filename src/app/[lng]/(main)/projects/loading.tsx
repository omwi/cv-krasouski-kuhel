import { DataTableSkeleton } from "@/components/shared/data-table/data-table-skeleton"

export default function ProjectsLoading() {
  return <DataTableSkeleton columns={5} rows={20} />
}
