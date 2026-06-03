import { EntityRowActions } from "@/components/shared/data-table/entity-row-actions"
import { paths } from "@/config/paths"
import DeleteUser from "@/features/users/components/actions/delete-user"
import UpdateUser from "@/features/users/components/actions/update-user"
import { TableUser } from "@/features/users/components/user-table/users-table"

export function UserRowActions({ rowUser }: { rowUser: TableUser }) {
  return (
    <EntityRowActions<TableUser>
      entity={rowUser}
      entityType="user"
      entityId={rowUser.id}
      viewLink={paths.users.details.get(rowUser.id)}
      renderEditModal={(props) => <UpdateUser user={props.entity} {...props} />}
      renderDeleteModal={(props) => (
        <DeleteUser user={props.entity} {...props} />
      )}
    />
  )
}
