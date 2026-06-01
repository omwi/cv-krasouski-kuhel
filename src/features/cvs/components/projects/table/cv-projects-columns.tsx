import { TableColumnConfig } from "@/components/shared/data-table/data-table"
import CvProjectsRowActions from "@/features/cvs/components/projects/table/cv-projects-row-actions"
import { CvProject, CvUserId } from "@/types/graphql-types"
import type { CurrentUser } from "@/utils/permissions"

export const getColumns = (
  currentUser: CurrentUser,
  cvUserId: CvUserId
): TableColumnConfig<CvProject>[] => [
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
      <CvProjectsRowActions
        project={row}
        currentUser={currentUser}
        cvUserId={cvUserId}
      />
    ),
  },
]
