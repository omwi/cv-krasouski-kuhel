import { useRouter } from "next/navigation"

import { EntityRowActions } from "@/components/shared/data-table/entity-row-actions"
import { paths } from "@/config/paths"
import DeleteUser from "@/features/users/components/actions/delete-user"
import UpdateUser from "@/features/users/components/actions/update-user"
import { TableUser } from "@/features/users/components/user-table/users-table"
import type { CurrentUser } from "@/utils/permissions"

export function UserRowActions({
  rowUser,
  currentUser,
}: {
  rowUser: TableUser
  currentUser: CurrentUser
}) {
  if (!currentUser) return null

  return (
    <EntityRowActions<TableUser>
      entity={rowUser}
      entityType="user"
      entityId={rowUser.id}
      currentUser={currentUser}
      viewLink={paths.users.details.get(rowUser.id)}
      renderEditModal={(props) => (
        <UpdateUser user={props.entity} currentUser={currentUser} {...props} />
      )}
      renderDeleteModal={(props) => (
        <DeleteUser user={props.entity} {...props} />
      )}
    />
  )
}
