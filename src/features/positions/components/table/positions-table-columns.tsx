import { TableColumnConfig } from "@/components/shared/data-table/data-table"
import PositionsRowActions from "@/features/positions/components/table/positions-row-actions"
import { GetPositionsQuery } from "@/types/__generated__/graphql"
import type { CurrentUser } from "@/utils/permissions"

export type TablePosition = GetPositionsQuery["positions"][0]

export const getColumns = (
  currentUser: CurrentUser
): TableColumnConfig<TablePosition>[] => [
  {
    id: "name",
    titleKey: "positions-table.columns.name",
    sortable: true,
    searchable: true,
  },
  {
    id: "actions",
    titleKey: "user-table.columns.actions",
    isSrOnly: true,
    sortable: false,
    searchable: false,
    cell: ({ row }) => (
      <PositionsRowActions position={row} currentUser={currentUser} />
    ),
  },
]
