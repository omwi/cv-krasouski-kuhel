import { useEffect, useState } from "react"
import { useMutation } from "@apollo/client/react"
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema"
import { useT } from "next-i18next/client"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import {
  skillBaseSchema,
  UpdateSkillFormInput as UpdateUserSkillInput,
} from "@/features/skills/hooks/skill-schema"
import { UPDATE_USER_SKILL } from "@/graphql/users/mutations"
import { usePermissions } from "@/hooks/use-permissions"
import { Mastery } from "@/types/__generated__/graphql"
import { UserSkill } from "@/types/graphql-types"

export function useUserSkillUpdateForm(userId: string, userSkill: UserSkill) {
  const { t } = useT("skills")

  const { canUpdateUser } = usePermissions()

  const [open, setOpen] = useState(false)

  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty, isValid },
  } = useForm<UpdateUserSkillInput>({
    resolver: standardSchemaResolver(skillBaseSchema),
    defaultValues: {
      mastery: userSkill.mastery,
    },
  })

  useEffect(() => {
    reset({
      mastery: userSkill.mastery,
    })
  }, [userSkill.mastery, open, reset])

  const [updateUserSkill, { loading }] = useMutation(UPDATE_USER_SKILL)

  const onSubmit = async (values: UpdateUserSkillInput) => {
    if (!canUpdateUser(userId)) return

    try {
      await updateUserSkill({
        variables: {
          skill: {
            userId: userId,
            mastery: values.mastery as Mastery,
            name: userSkill.name,
            categoryId: userSkill.categoryId,
          },
        },
      })
      toast.success(t("toast.updated"))
    } catch (error) {
      console.error(error)
    } finally {
      setOpen(false)
    }
  }

  return {
    control,
    reset,
    isSubmitReady: isDirty && isValid,
    onSubmit: handleSubmit(onSubmit),
    loading,
    open,
    setOpen,
  }
}
