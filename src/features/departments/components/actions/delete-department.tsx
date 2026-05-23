"use client"

import { useMutation } from "@apollo/client/react"

import { DeleteDialog } from "@/components/shared/delete-dialog"
import { TableDepartment } from "@/features/departments/components/table/departments-table-columns"
import { DELETE_DEPARTMENT } from "@/graphql/departments/mutations"
import { GET_DEPARTMENTS } from "@/graphql/departments/queries"

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
    refetchQueries: [{ query: GET_DEPARTMENTS }],
  })

  return (
    <DeleteDialog
      open={open}
      onOpenChange={onOpenChange}
      i18nKey="department"
      entityName={department.name}
      onConfirm={async () => {
        await mutateDelete({
          variables: { department: { departmentId: String(department.id) } },
        })
      }}
    />
  )
}
