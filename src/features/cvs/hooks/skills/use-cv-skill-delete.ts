import { useMutation } from "@apollo/client/react"
import { useT } from "next-i18next/client"
import { toast } from "sonner"

import { useSelection } from "@/components/shared/selection/selection-provider"
import { DELETE_CV_SKILLS } from "@/graphql/cvs/mutations"
import { usePermissions } from "@/hooks/use-permissions"
import { CvUserId } from "@/types/graphql-types"

export function useCvSkillsDelete({ id: cvId, user }: CvUserId) {
  const { t } = useT("skills")

  const { canUpdateCv } = usePermissions()

  const [deleteCvSkill, { loading }] = useMutation(DELETE_CV_SKILLS)

  const { selectedValues, startSelection, stopSelection } = useSelection()

  const handleConfirmDelete = async () => {
    if (!canUpdateCv(user?.id)) return
    try {
      await deleteCvSkill({
        variables: {
          skills: {
            name: [...selectedValues],
            cvId,
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
