"use client"

import { useMemo } from "react"
import { useSuspenseQuery } from "@apollo/client/react"
import { Plus } from "lucide-react"
import { useT } from "next-i18next/client"

import { DataTable } from "@/components/shared/data-table/data-table"
import { Button } from "@/components/ui/button"
import CreateLanguage from "@/features/languages/components/actions/create-language"
import { getColumns } from "@/features/languages/components/table/languages-table-columns"
import { GET_LANGUAGES } from "@/graphql/languages/queries"
import { usePermissions } from "@/hooks/use-permissions"
import { useProcessedData } from "@/hooks/use-processed-data"
import { useTableUrlState } from "@/hooks/use-table-url-state"

export default function LanguagesTable() {
  const { data } = useSuspenseQuery(GET_LANGUAGES)
  const { params, updateParams } = useTableUrlState({
    defaultSortBy: "name",
  })
  const { t } = useT("table")
  const { isAdmin: canCreate } = usePermissions()

  const languages = data.languages
  const columns = useMemo(() => getColumns(), [])

  const { paginatedData, totalCount } = useProcessedData({
    data: languages,
    params,
    columns,
  })

  return (
    <DataTable
      columns={columns}
      data={paginatedData}
      totalCount={totalCount}
      totalText={t("total", { count: totalCount })}
      searchValue={params.search}
      onSearchChangeAction={(value) => updateParams({ search: value })}
      actions={
        canCreate && (
          <CreateLanguage>
            <Button variant="outline-primary">
              <Plus />
              {t("languages-table.create")}
            </Button>
          </CreateLanguage>
        )
      }
    />
  )
}
