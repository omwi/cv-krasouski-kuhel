import { useT } from "next-i18next/client"

import { TableColumnConfig } from "@/components/shared/data-table/data-table"
import ProjectsRowActions from "@/features/projects/components/table/projects-row-actions"
import { GetProjectsQuery } from "@/types/__generated__/graphql"
import { parseUtcToLocal, toHumanDate } from "@/utils/date"

export type TableProjects = GetProjectsQuery["projects"][0]

const DateCell = ({
  dateStr,
  isEndDate,
}: {
  dateStr?: string | null
  isEndDate?: boolean
}) => {
  const { t, i18n } = useT("project-details")
  const date = parseUtcToLocal(dateStr || undefined)
  if (!date) {
    return isEndDate ? <span className="text-sm">{t("till-now")}</span> : null
  }
  return <span className="text-sm">{toHumanDate(date, i18n.language)}</span>
}

export const getColumns = (): TableColumnConfig<TableProjects>[] => [
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
    cell: ({ value }) => <DateCell dateStr={value as string} />,
  },
  {
    id: "end_date",
    titleKey: "projects-table.columns.end-date",
    sortable: true,
    searchable: false,
    cell: ({ value }) => <DateCell dateStr={value as string} isEndDate />,
  },
  {
    id: "actions",
    titleKey: "projects-table.columns.actions",
    isSrOnly: true,
    sortable: false,
    searchable: false,
    cell: ({ row }) => <ProjectsRowActions project={row} />,
  },
]
