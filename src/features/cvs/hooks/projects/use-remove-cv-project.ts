import { useMutation } from "@apollo/client/react"

import { REMOVE_CV_PROJECT } from "@/graphql/cvs/mutations"
import { usePermissions } from "@/hooks/use-permissions"
import { CvProject, CvUserId } from "@/types/graphql-types"

export function useRemoveCvProject(cvProject: CvProject, cvUserId: CvUserId) {
  const [removeCvProject] = useMutation(REMOVE_CV_PROJECT)

  const { canUpdateCv } = usePermissions()

  const handleDelete = async () => {
    if (!canUpdateCv(cvUserId.user?.id)) return
    await removeCvProject({
      variables: {
        project: { projectId: cvProject.project.id, cvId: cvUserId.id },
      },
    })
  }

  return { handleDelete }
}
