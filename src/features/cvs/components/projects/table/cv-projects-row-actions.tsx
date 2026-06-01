import { EntityRowActions } from "@/components/shared/data-table/entity-row-actions"
import RemoveCvProject from "@/features/cvs/components/projects/actions/remove-cv-project"
import { CvProject, CvUserId } from "@/types/graphql-types"
import type { CurrentUser } from "@/utils/permissions"

export default function CvProjectsRowActions({
  project,
  currentUser,
  cvUserId,
}: {
  project: CvProject
  currentUser: CurrentUser
  cvUserId: CvUserId
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
      renderDeleteModal={(props) => (
        <RemoveCvProject
          cvProject={props.entity}
          cvUserId={cvUserId}
          {...props}
        />
      )}
    />
  )
}
