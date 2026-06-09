"use client"

import { useCallback, useMemo } from "react"
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
import { User } from "@/types/user"

export default function CvsTable({
  cvs,
  user,
  ownerId,
}: {
  cvs: Cv[]
  user?: User | null
  ownerId?: string
}) {
  const { t } = useT("table")

  const { currentUserId, canCreateCv } = usePermissions()
  const hasCreatePermission = canCreateCv(ownerId)
  const hoistPredicate = useCallback(
    (cv: Cv) => cv.user !== null && cv.user.id === currentUserId,
    [currentUserId]
  )

  const { params, updateParams } = useTableUrlState({
    defaultSortBy: "name",
  })
  const columns = useMemo(() => getColumns(user), [user])
  const { paginatedData, totalCount } = useProcessedData({
    data: cvs,
    params,
    columns,
    hoistPredicate,
  })

  return (
    <DataTable
      data-testid="cvs-table"
      columns={columns}
      data={paginatedData}
      totalCount={totalCount}
      defaultSortBy="name"
      totalText={t("total", { count: totalCount })}
      searchValue={params.search}
      onSearchChangeAction={(value) => updateParams({ search: value })}
      actions={
        hasCreatePermission && (
          <CreateCv userId={ownerId}>
            <Button data-testid="create-cv-button" variant="outline-primary">
              <Plus />
              {t("cvs-table.create")}
            </Button>
          </CreateCv>
        )
      }
    />
  )
}
