"use client"

import { EntityRowActions } from "@/components/shared/data-table/entity-row-actions"
import DeleteProject from "@/features/projects/components/actions/delete-project"
import { TableProjects } from "@/features/projects/components/table/projects-table-columns"
import type { CurrentUser } from "@/utils/permissions"

export default function ProjectsRowActions({
  project,
  currentUser,
}: {
  project: TableProjects
  currentUser: CurrentUser
}) {
  if (!currentUser) return null

  return (
    <EntityRowActions<TableProjects>
      entity={project}
      entityType="projects"
      entityId={String(project?.id)}
      currentUser={currentUser}
      renderEditModal={(props) => (
        // <UpdateLanguage language={props.entity} {...props} />
        <p>dw</p>
      )}
      renderDeleteModal={(props) => (
        <DeleteProject project={props.entity} {...props} />
      )}
    />
  )
}
