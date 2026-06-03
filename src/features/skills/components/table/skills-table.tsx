"use client"

import { useMemo } from "react"
import { useSuspenseQuery } from "@apollo/client/react"
import { Plus } from "lucide-react"
import { useT } from "next-i18next/client"

import { DataTable } from "@/components/shared/data-table/data-table"
import { Button } from "@/components/ui/button"
import CreateSkill from "@/features/skills/components/actions/create-skill"
import { getColumns } from "@/features/skills/components/table/skills-table-columns"
import { GET_SKILLS } from "@/graphql/skills/queries"
import { usePermissions } from "@/hooks/use-permissions"
import { useProcessedData } from "@/hooks/use-processed-data"
import { useTableUrlState } from "@/hooks/use-table-url-state"

export default function SkillsTable() {
  const { data } = useSuspenseQuery(GET_SKILLS)
  const { params, updateParams } = useTableUrlState({
    defaultSortBy: "name",
  })
  const { t } = useT("table")

  const { isAdmin: canCreate } = usePermissions()

  const skills = data?.skills || []

  const columns = useMemo(() => getColumns(), [])

  const { paginatedData, totalCount } = useProcessedData({
    data: skills,
    params,
    columns,
  })

  return (
    <DataTable
      columns={columns}
      data={paginatedData}
      totalCount={totalCount}
      defaultSortBy="name"
      totalText={t("total", { count: totalCount })}
      searchValue={params.search}
      onSearchChangeAction={(value) => updateParams({ search: value })}
      actions={
        canCreate && (
          <CreateSkill>
            <Button variant="outline-primary">
              <Plus />
              {t("skills-table.create")}
            </Button>
          </CreateSkill>
        )
      }
    />
  )
}
