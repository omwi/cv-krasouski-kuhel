"use client"

import { EntityRowActions } from "@/components/shared/data-table/entity-row-actions"
import DeletePosition from "@/features/positions/components/actions/delete-position"
import UpdatePosition from "@/features/positions/components/actions/update-position"
import { TablePosition } from "@/features/positions/components/table/positions-table-columns"
import type { CurrentUser } from "@/utils/permissions"

export default function PositionsRowActions({
  position,
  currentUser,
}: {
  position: TablePosition
  currentUser: CurrentUser
}) {
  if (!currentUser) return null

  return (
    <EntityRowActions<TablePosition>
      entity={position}
      entityType="positions"
      entityId={String(position.id)}
      currentUser={currentUser}
      renderEditModal={(props) => (
        <UpdatePosition position={props.entity} {...props} />
      )}
      renderDeleteModal={(props) => (
        <DeletePosition position={props.entity} {...props} />
      )}
    />
  )
}
