"use client"

import { EntityRowActions } from "@/components/shared/data-table/entity-row-actions"
import DeleteDepartment from "@/features/departments/components/actions/delete-department"
import UpdateDepartment from "@/features/departments/components/actions/update-department"
import { TableDepartment } from "@/features/departments/components/table/departments-table-columns"
import type { CurrentUser } from "@/utils/permissions"

export default function DepartmentsRowActions({
  department,
  currentUser,
}: {
  department: TableDepartment
  currentUser: CurrentUser
}) {
  if (!currentUser) return null

  return (
    <EntityRowActions<TableDepartment>
      entity={department}
      entityType="departments"
      entityId={String(department.id)}
      currentUser={currentUser}
      renderEditModal={(props) => (
        <UpdateDepartment department={props.entity} {...props} />
      )}
      renderDeleteModal={(props) => (
        <DeleteDepartment department={props.entity} {...props} />
      )}
    />
  )
}
