import { TableColumnConfig } from "@/components/shared/data-table/data-table"
import ProjectsRowActions from "@/features/projects/components/table/projects-row-actions"
import { GetProjectsQuery } from "@/types/__generated__/graphql"
import type { CurrentUser } from "@/utils/permissions"

export type TableProjects = GetProjectsQuery["projects"][0]

export const getColumns = (
  currentUser: CurrentUser
): TableColumnConfig<TableProjects>[] => [
  {
    id: "name",
    titleKey: "projects-table.columns.name",
    sortable: true,
    searchable: true,
  },
  {
    id: "internal_name",
    titleKey: "projects-table.columns.internal-name",
    sortable: true,
    searchable: true,
  },
  {
    id: "domain",
    titleKey: "projects-table.columns.domain",
    sortable: true,
    searchable: true,
  },
  {
    id: "start_date",
    titleKey: "projects-table.columns.start-date",
    sortable: true,
    searchable: false,
  },
  {
    id: "end_date",
    titleKey: "projects-table.columns.end-date",
    sortable: true,
    searchable: false,
  },
  {
    id: "actions",
    titleKey: "user-table.columns.actions",
    isSrOnly: true,
    sortable: false,
    searchable: false,
    cell: ({ row }) => (
      <ProjectsRowActions project={row} currentUser={currentUser} />
    ),
  },
]
