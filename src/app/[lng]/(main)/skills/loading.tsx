import { DataTableSkeleton } from "@/components/shared/data-table/data-table-skeleton"

export default function SkillsLoading() {
  return <DataTableSkeleton columns={2} rows={20} />
}
