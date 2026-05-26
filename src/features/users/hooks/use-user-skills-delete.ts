import { useMutation } from "@apollo/client/react"

import { useSelection } from "@/components/shared/selection-provider"
import { DELETE_USER_SKILL } from "@/graphql/users/mutations"
import { GET_USER_SKILLS } from "@/graphql/users/queries"

export function useUserSkillsDelete(userId: string) {
  const [deleteUserSkills, { loading }] = useMutation(DELETE_USER_SKILL, {
    refetchQueries: [{ query: GET_USER_SKILLS, variables: { userId } }],
  })

  const { selectedValues, startSelection, stopSelection } = useSelection()

  const handleConfirmDelete = async () => {
    try {
      await deleteUserSkills({
        variables: {
          skill: {
            name: [...selectedValues],
            userId: userId,
          },
        },
      })
    } catch (error) {
      console.error(error)
    } finally {
      stopSelection()
    }
  }

  return {
    handleStartDelete: startSelection,
    handleCancelDelete: stopSelection,
    handleConfirmDelete,
    loading,
  }
}
