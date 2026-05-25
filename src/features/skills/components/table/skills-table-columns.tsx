import { TableColumnConfig } from "@/components/shared/data-table/data-table"
import SkillsRowActions from "@/features/skills/components/table/skills-row-actions"
import { SkillsQuery } from "@/types/__generated__/graphql"
import type { CurrentUser } from "@/utils/permissions"

export type TableSkill = SkillsQuery["skills"][0]

export const getColumns = (
  currentUser: CurrentUser
): TableColumnConfig<TableSkill>[] => [
  {
    id: "name",
    titleKey: "skills-table.columns.name",
    sortable: true,
    searchable: true,
  },
  {
    id: "category_name",
    titleKey: "skills-table.columns.category",
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
      <SkillsRowActions skill={row} currentUser={currentUser} />
    ),
  },
]
