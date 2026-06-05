"use client"

import { useMemo } from "react"
import { useSuspenseQuery } from "@apollo/client/react"
import { Plus } from "lucide-react"
import { useT } from "next-i18next/client"

import { DataTable } from "@/components/shared/data-table/data-table"
import { Button } from "@/components/ui/button"
import CreateProject from "@/features/projects/components/actions/create-project"
import { getColumns } from "@/features/projects/components/table/projects-table-columns"
import { GET_PROJECTS } from "@/graphql/projects/queries"
import { usePermissions } from "@/hooks/use-permissions"
import { useProcessedData } from "@/hooks/use-processed-data"
import { useTableUrlState } from "@/hooks/use-table-url-state"

export default function ProjectsTable() {
  const { data } = useSuspenseQuery(GET_PROJECTS)
  const { params, updateParams } = useTableUrlState({
    defaultSortBy: "name",
  })
  const { t } = useT("table")
  const { isAdmin: canCreate } = usePermissions()

  const projects = data.projects
  const columns = useMemo(() => getColumns(), [])

  const { paginatedData, totalCount } = useProcessedData({
    data: projects,
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
          <CreateProject>
            <Button variant="outline-primary">
              <Plus />
              {t("projects-table.create")}
            </Button>
          </CreateProject>
        )
      }
    />
  )
}
