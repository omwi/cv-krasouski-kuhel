import { TableColumnConfig } from "@/components/shared/data-table/data-table"
import LanguagesRowActions from "@/features/languages/components/table/languages-row-actions"
import { GetLanguagesQuery } from "@/types/__generated__/graphql"
import type { CurrentUser } from "@/utils/permissions"

export type TableLanguages = GetLanguagesQuery["languages"][0]

export const getColumns = (
  currentUser: CurrentUser
): TableColumnConfig<TableLanguages>[] => [
  {
    id: "name",
    titleKey: "languages-table.columns.name",
    sortable: true,
    searchable: true,
  },
  {
    id: "native_name",
    titleKey: "languages-table.columns.native-name",
    sortable: true,
    searchable: true,
  },
  {
    id: "iso2",
    titleKey: "languages-table.columns.iso2",
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
      <LanguagesRowActions language={row} currentUser={currentUser} />
    ),
  },
]
