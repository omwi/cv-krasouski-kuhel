"use client"

import { EntityRowActions } from "@/components/shared/data-table/entity-row-actions"
import DeletePosition from "@/features/positions/components/actions/delete-position"
import UpdatePosition from "@/features/positions/components/actions/update-position"
import { TablePosition } from "@/features/positions/components/table/positions-table-columns"

export default function PositionsRowActions({
  position,
}: {
  position: TablePosition
}) {
  return (
    <EntityRowActions<TablePosition>
      entity={position}
      entityType="positions"
      entityId={String(position.id)}
      renderEditModal={(props) => (
        <UpdatePosition position={props.entity} {...props} />
      )}
      renderDeleteModal={(props) => (
        <DeletePosition position={props.entity} {...props} />
      )}
    />
  )
}
