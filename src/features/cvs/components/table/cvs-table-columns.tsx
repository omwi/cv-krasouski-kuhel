import { TableColumnConfig } from "@/components/shared/data-table/data-table"
import CvsRowActions from "@/features/cvs/components/table/cvs-row-actions"
import { Cv } from "@/types/graphql-types"
import { CurrentUser } from "@/utils/permissions"

export const getColumns = (
  currentUser: CurrentUser
): TableColumnConfig<Cv>[] => [
  {
    id: "name",
    titleKey: "cvs-table.columns.name",
    sortable: true,
    searchable: true,
  },
  {
    id: "education",
    titleKey: "cvs-table.columns.education",
    sortable: true,
    searchable: true,
  },
  {
    id: "employee",
    accessorFn: (row) => row.user?.email ?? "",
    titleKey: "cvs-table.columns.employee",
    sortable: true,
    searchable: true,
  },
  {
    id: "actions",
    titleKey: "user-table.columns.actions",
    isSrOnly: true,
    sortable: false,
    searchable: false,
    cell: ({ row }) => <CvsRowActions cv={row} currentUser={currentUser} />,
  },
]
