import { TableColumnConfig } from "@/components/shared/data-table/data-table"
import CvsRowActions from "@/features/cvs/components/table/cvs-row-actions"
import { Cv } from "@/types/graphql-types"
import { User } from "@/types/user"

export const getColumns = (user?: User | null): TableColumnConfig<Cv>[] => [
  {
    id: "name",
    titleKey: "cvs-table.columns.name",
    sortable: true,
    searchable: true,
  },
  {
    id: "description",
    titleKey: "cvs-table.columns.description",
    sortable: false,
    searchable: true,
    cell: ({ row }) => (
      <div className="max-w-64 truncate">{row.description}</div>
    ),
  },
  {
    id: "education",
    titleKey: "cvs-table.columns.education",
    sortable: false,
    searchable: false,
  },
  {
    id: "employee",
    accessorFn: (row) => row.user?.email ?? user?.email ?? "",
    titleKey: "cvs-table.columns.employee",
    sortable: true,
    searchable: false,
  },
  {
    id: "actions",
    titleKey: "user-table.columns.actions",
    isSrOnly: true,
    sortable: false,
    searchable: false,
    cell: ({ row }) => <CvsRowActions cv={row} userId={user?.id} />,
  },
]
