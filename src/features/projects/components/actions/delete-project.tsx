"use client"

import { useMutation } from "@apollo/client/react"

import { DeleteDialog } from "@/components/shared/dialog/delete-dialog"
import { TableProjects } from "@/features/projects/components/table/projects-table-columns"
import { DELETE_PROJECT } from "@/graphql/projects/mutations"
import {
  DeleteProjectMutation,
  DeleteProjectMutationVariables,
} from "@/types/__generated__/graphql"

export type Props = {
  project: TableProjects
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function DeleteProject({ project, open, onOpenChange }: Props) {
  const [mutateDelete] = useMutation<
    DeleteProjectMutation,
    DeleteProjectMutationVariables
  >(DELETE_PROJECT, {
    update(cache) {
      if (project) {
        cache.evict({
          id: cache.identify({ __typename: "Project", id: project.id }),
        })
        cache.gc()
      }
    },
  })

  return (
    <DeleteDialog
      open={open}
      onOpenChange={onOpenChange}
      i18nKey="project-actions"
      entityName={project?.name}
      onConfirm={async () => {
        await mutateDelete({
          variables: { project: { projectId: project?.id } },
        })
      }}
    />
  )
}
