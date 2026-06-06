"use client"

import { useMemo } from "react"
import { useSuspenseQuery } from "@apollo/client/react"
import { Plus } from "lucide-react"
import { useT } from "next-i18next/client"

import { DataTable } from "@/components/shared/data-table/data-table"
import { Button } from "@/components/ui/button"
import CreatePosition from "@/features/positions/components/actions/create-position"
import { getColumns } from "@/features/positions/components/table/positions-table-columns"
import { GET_POSITIONS } from "@/graphql/positions/queries"
import { usePermissions } from "@/hooks/use-permissions"
import { useProcessedData } from "@/hooks/use-processed-data"
import { useTableUrlState } from "@/hooks/use-table-url-state"

export default function PositionsTable() {
  const { data } = useSuspenseQuery(GET_POSITIONS)
  const { params, updateParams } = useTableUrlState({
    defaultSortBy: "name",
  })
  const { t } = useT("table")

  const { isAdmin: canCreate } = usePermissions()

  const positions = data.positions

  const columns = useMemo(() => getColumns(), [])

  const { paginatedData, totalCount } = useProcessedData({
    data: positions,
    params,
    columns,
  })

  return (
    <DataTable
      data-testid="positions-table"
      columns={columns}
      data={paginatedData}
      totalCount={totalCount}
      defaultSortBy="name"
      totalText={t("total", { count: totalCount })}
      searchValue={params.search}
      onSearchChangeAction={(value) => updateParams({ search: value })}
      actions={
        canCreate && (
          <CreatePosition>
            <Button variant="outline-primary" data-testid="create-position-btn">
              <Plus />
              {t("positions-table.create")}
            </Button>
          </CreatePosition>
        )
      }
    />
  )
}
