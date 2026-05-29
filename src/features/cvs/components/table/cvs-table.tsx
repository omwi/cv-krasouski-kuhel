"use client"

import { useMemo } from "react"
import { Plus } from "lucide-react"
import { useT } from "next-i18next/client"

import { DataTable } from "@/components/shared/data-table/data-table"
import { Button } from "@/components/ui/button"
import CreateCv from "@/features/cvs/components/actions/create-cv"
import { getColumns } from "@/features/cvs/components/table/cvs-table-columns"
import { usePermissions } from "@/hooks/use-permissions"
import { useProcessedData } from "@/hooks/use-processed-data"
import { useTableUrlState } from "@/hooks/use-table-url-state"
import { Cv } from "@/types/graphql-types"
import { CurrentUser } from "@/utils/permissions"

export default function CvsTable({
  currentUser,
  cvs,
  userId,
}: {
  currentUser: CurrentUser
  cvs: Cv[]
  userId?: string
}) {
  const { t } = useT("table")

  const { params, updateParams } = useTableUrlState({
    defaultSortBy: "name",
  })
  const columns = useMemo(() => getColumns(currentUser), [currentUser])
  const { paginatedData, totalCount } = useProcessedData({
    data: cvs,
    params,
    columns,
  })

  const { canCreateCv } = usePermissions()
  const hasCreatePermission = canCreateCv(userId)

  console.log("hasCreatePermission", hasCreatePermission)

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
        hasCreatePermission && (
          <CreateCv currentUser={currentUser} userId={currentUser!.id}>
            <Button variant="outline-primary">
              <Plus />
              {t("cvs-table.create")}
            </Button>
          </CreateCv>
        )
      }
    />
  )
}
