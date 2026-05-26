import { useRouter } from "next/navigation"

import { EntityRowActions } from "@/components/shared/data-table/entity-row-actions"
import { paths } from "@/config/paths"
import DeleteProject from "@/features/projects/components/actions/delete-project"
import UpdateProject from "@/features/projects/components/actions/update-project"
import { TableProjects } from "@/features/projects/components/table/projects-table-columns"
import type { CurrentUser } from "@/utils/permissions"

export default function ProjectsRowActions({
  project,
  currentUser,
}: {
  project: TableProjects
  currentUser: CurrentUser
}) {
  const router = useRouter()

  if (!currentUser) return null

  return (
    <EntityRowActions<TableProjects>
      entity={project}
      entityType="projects"
      entityId={String(project?.id)}
      currentUser={currentUser}
      onView={(project) => {
        router.push(paths.projects.details.get(project.id))
      }}
      renderEditModal={(props) => (
        <UpdateProject project={props.entity} {...props} />
      )}
      renderDeleteModal={(props) => (
        <DeleteProject project={props.entity} {...props} />
      )}
    />
  )
}
