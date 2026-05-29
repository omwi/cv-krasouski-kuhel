import { useMutation } from "@apollo/client/react"
import { useT } from "next-i18next/client"
import { toast } from "sonner"

import { useSelection } from "@/components/shared/selection/selection-provider"
import { DELETE_USER_SKILLS } from "@/graphql/users/mutations"
import { GET_USER_SKILLS } from "@/graphql/users/queries"

export function useUserSkillsDelete(userId: string) {
  const { t } = useT("skills")

  const [deleteUserSkills, { loading }] = useMutation(DELETE_USER_SKILLS, {
    refetchQueries: [{ query: GET_USER_SKILLS, variables: { userId } }],
  })

  const { selectedValues, startSelection, stopSelection } = useSelection()

  const handleConfirmDelete = async () => {
    try {
      await deleteUserSkills({
        variables: {
          skills: {
            name: [...selectedValues],
            userId: userId,
          },
        },
      })
      if (selectedValues.size === 1) {
        toast.success(t("toast.deleted"))
      } else {
        toast.success(t("toast.deleted-plural"))
      }
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
