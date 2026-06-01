import { useMutation } from "@apollo/client/react"

import { REMOVE_CV_PROJECT } from "@/graphql/cvs/mutations"
import { GET_CV_PROJECTS } from "@/graphql/cvs/queries"
import { usePermissions } from "@/hooks/use-permissions"
import { CvProject, CvUserId } from "@/types/graphql-types"

export function useRemoveCvProject(cvProject: CvProject, cvUserId: CvUserId) {
  const [removeCvProject] = useMutation(REMOVE_CV_PROJECT, {
    refetchQueries: [
      { query: GET_CV_PROJECTS, variables: { cvId: cvUserId.id } },
    ],
  })

  const { canUpdateCv } = usePermissions()

  const handleDelete = async () => {
    if (!canUpdateCv(cvUserId.user?.id)) return
    await removeCvProject({
      variables: { project: { projectId: cvProject.id, cvId: cvUserId.id } },
    })
  }

  return { handleDelete }
}
