import { EntityRowActions } from "@/components/shared/data-table/entity-row-actions"
import { paths } from "@/config/paths"
import DeleteCv from "@/features/cvs/components/actions/delete-cv"
import UpdateCv from "@/features/cvs/components/actions/update-cv"
import { Cv } from "@/types/graphql-types"

export default function CvsRowActions({
  cv,
  userId,
}: {
  cv: Cv
  userId?: string
}) {
  return (
    <EntityRowActions<Cv>
      entity={cv}
      entityType="cvs"
      entityId={cv.id}
      ownerId={cv.user?.id || userId}
      viewLink={paths.cvs.details.get(cv.id)}
      renderEditModal={(props) => (
        <UpdateCv cv={props.entity} userId={userId} {...props} />
      )}
      renderDeleteModal={(props) => (
        <DeleteCv cv={props.entity} userId={userId} {...props} />
      )}
    />
  )
}
