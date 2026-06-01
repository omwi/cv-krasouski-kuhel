"use client"

import { useMutation } from "@apollo/client/react"

import { DeleteDialog } from "@/components/shared/dialog/delete-dialog"
import { TableDepartment } from "@/features/departments/components/table/departments-table-columns"
import { DELETE_DEPARTMENT } from "@/graphql/departments/mutations"

export type Props = {
  department: TableDepartment
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export default function DeleteDepartment({
  department,
  open = false,
  onOpenChange = () => {},
}: Props) {
  const [mutateDelete] = useMutation(DELETE_DEPARTMENT, {
    update(cache) {
      if (department) {
        cache.evict({
          id: cache.identify({ __typename: "Department", id: department.id }),
        })
        cache.gc()
      }
    },
  })

  return (
    <DeleteDialog
      open={open}
      onOpenChange={onOpenChange}
      i18nKey="department-actions"
      entityName={department.name}
      onConfirm={async () => {
        await mutateDelete({
          variables: { department: { departmentId: String(department.id) } },
        })
      }}
    />
  )
}
