"use client"

import { useMemo } from "react"
import { useSuspenseQuery } from "@apollo/client/react"
import { Plus } from "lucide-react"
import { useT } from "next-i18next/client"

import { DataTable } from "@/components/shared/data-table/data-table"
import { Button } from "@/components/ui/button"
import CreateDepartment from "@/features/departments/components/actions/create-department"
import { getColumns } from "@/features/departments/components/table/departments-table-columns"
import { GET_DEPARTMENTS } from "@/graphql/departments/queries"
import { usePermissions } from "@/hooks/use-permissions"
import { useProcessedData } from "@/hooks/use-processed-data"
import { useTableUrlState } from "@/hooks/use-table-url-state"

export default function DepartmentsTable() {
  const { data } = useSuspenseQuery(GET_DEPARTMENTS)
  const { params, updateParams } = useTableUrlState({
    defaultSortBy: "name",
  })
  const { t } = useT("table")
  const { isAdmin: canCreate } = usePermissions()

  const departments = data.departments
  const columns = useMemo(() => getColumns(), [])

  const { paginatedData, totalCount } = useProcessedData({
    data: departments,
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
          <CreateDepartment>
            <Button variant="outline-primary">
              <Plus />
              {t("departments-table.create")}
            </Button>
          </CreateDepartment>
        )
      }
    />
  )
}
