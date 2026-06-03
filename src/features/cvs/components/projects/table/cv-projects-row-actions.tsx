import { EntityRowActions } from "@/components/shared/data-table/entity-row-actions"
import RemoveCvProject from "@/features/cvs/components/projects/actions/remove-cv-project"
import UpdateCvProject from "@/features/cvs/components/projects/actions/update-cv-project"
import { CvProject, CvUserId } from "@/types/graphql-types"

export default function CvProjectsRowActions({
  project,
  cvUserId,
}: {
  project: CvProject
  cvUserId: CvUserId
}) {
  return (
    <EntityRowActions<CvProject>
      entity={project}
      entityType="cv-projects"
      entityId={String(project?.id)}
      ownerId={cvUserId.user?.id}
      renderEditModal={(props) => (
        <UpdateCvProject
          cvProject={props.entity}
          cvUserId={cvUserId}
          {...props}
        />
      )}
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
