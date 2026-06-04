import { useEffect, useState } from "react"
import { useMutation } from "@apollo/client/react"
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema"
import { useT } from "next-i18next/client"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import {
  skillBaseSchema as cvSkillBaseSchema,
  UpdateSkillFormInput as UpdateCvSkillInput,
} from "@/features/skills/hooks/skill-schema"
import { UPDATE_CV_SKILL } from "@/graphql/cvs/mutations"
import { usePermissions } from "@/hooks/use-permissions"
import { Mastery } from "@/types/__generated__/graphql"
import { CvSkill, CvUserId } from "@/types/graphql-types"

export function useCvSkillUpdateForm(
  { id: cvId, user }: CvUserId,
  cvSkill: CvSkill
) {
  const { t } = useT("skills")

  const { canUpdateCv } = usePermissions()

  const [open, setOpen] = useState(false)

  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty, isValid },
  } = useForm<UpdateCvSkillInput>({
    resolver: standardSchemaResolver(cvSkillBaseSchema),
    defaultValues: {
      mastery: cvSkill.mastery,
    },
  })

  useEffect(() => {
    reset({
      mastery: cvSkill.mastery,
    })
  }, [cvSkill.mastery, open, reset])

  const [updateUserSkill, { loading }] = useMutation(UPDATE_CV_SKILL)

  const onSubmit = async (values: UpdateCvSkillInput) => {
    if (!canUpdateCv(user?.id)) return

    try {
      await updateUserSkill({
        variables: {
          skill: {
            cvId,
            mastery: values.mastery as Mastery,
            name: cvSkill.name,
            categoryId: cvSkill.categoryId,
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
