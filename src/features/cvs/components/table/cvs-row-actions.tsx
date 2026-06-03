import { EntityRowActions } from "@/components/shared/data-table/entity-row-actions"
import { paths } from "@/config/paths"
import DeleteCv from "@/features/cvs/components/actions/delete-cv"
import UpdateCv from "@/features/cvs/components/actions/update-cv"
import { Cv } from "@/types/graphql-types"

export default function CvsRowActions({ cv }: { cv: Cv }) {
  return (
    <EntityRowActions<Cv>
      entity={cv}
      entityType="cvs"
      entityId={cv.id}
      viewLink={paths.cvs.details.get(cv.id)}
      renderEditModal={(props) => <UpdateCv cv={props.entity} {...props} />}
      renderDeleteModal={(props) => <DeleteCv cv={props.entity} {...props} />}
    />
  )
}
