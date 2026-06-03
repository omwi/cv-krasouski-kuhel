import { EntityRowActions } from "@/components/shared/data-table/entity-row-actions"
import { paths } from "@/config/paths"
import DeleteProject from "@/features/projects/components/actions/delete-project"
import UpdateProject from "@/features/projects/components/actions/update-project"
import { TableProjects } from "@/features/projects/components/table/projects-table-columns"

export default function ProjectsRowActions({
  project,
}: {
  project: TableProjects
}) {
  return (
    <EntityRowActions<TableProjects>
      entity={project}
      entityType="projects"
      entityId={String(project?.id)}
      viewLink={paths.projects.details.get(project.id)}
      renderEditModal={(props) => (
        <UpdateProject project={props.entity} {...props} />
      )}
      renderDeleteModal={(props) => (
        <DeleteProject project={props.entity} {...props} />
      )}
    />
  )
}
