import { DataTableSkeleton } from "@/components/shared/data-table/data-table-skeleton"

export default function SkillsLoading() {
  return <DataTableSkeleton columns={3} rows={20} />
}
