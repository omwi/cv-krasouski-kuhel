import { MoveDown, MoveUp } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useTableUrlState } from "@/hooks/use-table-url-state"

type DataTableColumnHeaderProps = {
  title: string
  sortKey?: string
  defaultSortBy?: string
}

export function DataTableColumnHeader({
  title,
  sortKey,
  defaultSortBy,
}: DataTableColumnHeaderProps) {
  const { params, updateParams } = useTableUrlState({ defaultSortBy })

  if (!sortKey) {
    return (
      <span className="p-4 text-sm font-medium text-foreground">{title}</span>
    )
  }

  const isSorted = params.sortBy === sortKey
  const isAsc = isSorted && params.sortOrder === "asc"

  const toggleSort = () => {
    if (!isSorted) {
      updateParams({ sortBy: sortKey, sortOrder: "asc", page: 1 })
    } else if (isAsc) {
      updateParams({ sortOrder: "desc", page: 1 })
    } else {
      if (sortKey === defaultSortBy) {
        updateParams({ sortOrder: "asc", page: 1 })
      } else {
        updateParams({
          sortBy: defaultSortBy || "id",
          sortOrder: "asc",
          page: 1,
        })
      }
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleSort}
      className="h-full w-full min-w-0 justify-start p-4 text-foreground hover:bg-transparent"
    >
      <span>{title}</span>
      {isSorted && isAsc && <MoveUp className="ml-2 h-4 w-4" />}
      {isSorted && !isAsc && <MoveDown className="ml-2 h-4 w-4" />}
    </Button>
  )
}
