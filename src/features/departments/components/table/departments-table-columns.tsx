import { TableColumnConfig } from "@/components/shared/data-table/data-table"
import DepartmentsRowActions from "@/features/departments/components/table/departments-row-actions"
import { GetDepartmentsQuery } from "@/types/__generated__/graphql"

export type TableDepartment = GetDepartmentsQuery["departments"][0]

export const getColumns = (): TableColumnConfig<TableDepartment>[] => [
  {
    id: "name",
    titleKey: "departments-table.columns.name",
    sortable: true,
    searchable: true,
  },
  {
    id: "actions",
    titleKey: "user-table.columns.actions",
    isSrOnly: true,
    sortable: false,
    searchable: false,
    cell: ({ row }) => <DepartmentsRowActions department={row} />,
  },
]
