import { EntityRowActions } from "@/components/shared/data-table/entity-row-actions"
import { paths } from "@/config/paths"
import DeleteCv from "@/features/cvs/components/actions/delete-cv"
import UpdateCv from "@/features/cvs/components/actions/update-cv"
import { Cv } from "@/types/graphql-types"
import { CurrentUser } from "@/utils/permissions"

export default function CvsRowActions({
  cv,
  currentUser,
}: {
  cv: Cv
  currentUser: CurrentUser
}) {
  if (!currentUser) return null
  return (
    <EntityRowActions<Cv>
      entity={cv}
      entityType="cvs"
      entityId={cv.id}
      currentUser={currentUser}
      viewLink={paths.cvs.details.get(cv.id)}
      renderEditModal={(props) => <UpdateCv cv={props.entity} {...props} />}
      renderDeleteModal={(props) => <DeleteCv cv={props.entity} {...props} />}
    />
  )
}
