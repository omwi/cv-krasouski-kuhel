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
  const router = useRouter()

  if (!currentUser) return null

  const isMe = currentUser.id === rowUser.id

  return (
    <EntityRowActions<TableUser>
      entity={rowUser}
      entityType="user"
      entityId={rowUser.id}
      currentUser={currentUser}
      isMe={isMe}
      onView={(user) => {
        router.push(paths.users.details.get(Number(user.id)))
      }}
      renderEditModal={(props) => (
        <UpdateUser user={props.entity} currentUser={currentUser} {...props} />
      )}
      renderDeleteModal={(props) => (
        <DeleteUser user={props.entity} {...props} />
      )}
    />
  )
}
