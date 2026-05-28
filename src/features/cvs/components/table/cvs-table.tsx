"use client"

import { useMemo } from "react"
import { useSuspenseQuery } from "@apollo/client/react"
import { Plus } from "lucide-react"
import { useT } from "next-i18next/client"

import { DataTable } from "@/components/shared/data-table/data-table"
import { Button } from "@/components/ui/button"
import CreateCv from "@/features/cvs/components/actions/create-cv"
import { getColumns } from "@/features/cvs/components/table/cvs-table-columns"
import { GET_CVS } from "@/graphql/cvs/queries"
import { useProcessedData } from "@/hooks/use-processed-data"
import { useTableUrlState } from "@/hooks/use-table-url-state"
import { CurrentUser, cvPermissions } from "@/utils/permissions"

export default function CvsTable({
  currentUser,
}: {
  currentUser: CurrentUser
}) {
  const { t } = useT("table")

  const { data } = useSuspenseQuery(GET_CVS)
  const { cvs } = data

  const { params, updateParams } = useTableUrlState({
    defaultSortBy: "name",
  })
  const columns = useMemo(() => getColumns(currentUser), [currentUser])
  const { paginatedData, totalCount } = useProcessedData({
    data: cvs,
    params,
    columns,
  })

  const hasCreatePermission = cvPermissions.canCreate(currentUser)

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
