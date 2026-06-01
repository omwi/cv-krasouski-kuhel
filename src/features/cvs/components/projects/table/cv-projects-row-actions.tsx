import { EntityRowActions } from "@/components/shared/data-table/entity-row-actions"
import { CvProject } from "@/types/graphql-types"
import type { CurrentUser } from "@/utils/permissions"

export default function CvProjectsRowActions({
  project,
  currentUser,
}: {
  project: CvProject
  currentUser: CurrentUser
}) {
  if (!currentUser) return null

  return (
    <EntityRowActions<CvProject>
      entity={project}
      entityType="projects"
      entityId={String(project?.id)}
      currentUser={currentUser}
      // renderEditModal={(props) => (
      //   <UpdateProject project={props.entity} {...props} />
      // )}
      // renderDeleteModal={(props) => (
      //   <DeleteProject project={props.entity} {...props} />
      // )}
    />
  )
}
