"use client"

import { useMemo } from "react"
import { useSuspenseQuery } from "@apollo/client/react"
import { Plus } from "lucide-react"
import { useT } from "next-i18next/client"

import { DataTable } from "@/components/shared/data-table/data-table"
import { Button } from "@/components/ui/button"
import AddCvProject from "@/features/cvs/components/projects/actions/add-cv-project"
import {
  getColumns,
  renderResponsibilitiesRow,
} from "@/features/cvs/components/projects/table/cv-projects-columns"
import { GET_CV_PROJECTS } from "@/graphql/cvs/queries"
import { usePermissions } from "@/hooks/use-permissions"
import { useProcessedData } from "@/hooks/use-processed-data"
import { useTableUrlState } from "@/hooks/use-table-url-state"
import { CurrentUser } from "@/utils/permissions"

export default function CvProjectsTable({
  currentUser,
  cvId,
}: {
  currentUser: CurrentUser
  cvId: string
}) {
  const { t } = useT("table")

  const { data } = useSuspenseQuery(GET_CV_PROJECTS, { variables: { cvId } })
  const projects = data.cv.projects ?? []

  const { params, updateParams } = useTableUrlState({
    defaultSortBy: "name",
  })

  const columns = useMemo(
    () => getColumns(currentUser, data.cv),
    [currentUser, data.cv]
  )

  const { paginatedData, totalCount } = useProcessedData({
    data: projects,
    params,
    columns,
  })

  const { canUpdateCv } = usePermissions()
  const hasUpdatePermissions = canUpdateCv(data.cv.user?.id)

  return (
    <DataTable
      columns={columns}
      data={paginatedData}
      totalCount={totalCount}
      totalText={t("total", { count: totalCount })}
      searchValue={params.search}
      onSearchChangeAction={(value) => updateParams({ search: value })}
      renderSubRow={renderResponsibilitiesRow}
      actions={
        hasUpdatePermissions && (
          <AddCvProject cvUserId={data.cv}>
            <Button variant="outline-primary">
              <Plus />
              {t("projects-table.create")}
            </Button>
          </AddCvProject>
        )
      }
    />
  )
}
