import { useEffect, useState } from "react"
import { useMutation } from "@apollo/client/react"
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema"
import { useT } from "next-i18next/client"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { UPDATE_CV_SKILL } from "@/graphql/cvs/mutations"
import { GET_CV_SKILLS } from "@/graphql/cvs/queries"
import { usePermissions } from "@/hooks/use-permissions"
import { Mastery } from "@/types/__generated__/graphql"
import { CvSkill } from "@/types/graphql-types"

const formSchema = z.object({
  mastery: z.string().min(1),
})

type UpdateCvSkillInput = z.infer<typeof formSchema>

export function useCvSkillUpdateForm(cvId: string, cvSkill: CvSkill) {
  const { t } = useT("skills")

  const { canUpdateCv } = usePermissions()

  const [open, setOpen] = useState(false)

  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty, isValid },
  } = useForm<UpdateCvSkillInput>({
    resolver: standardSchemaResolver(formSchema),
    defaultValues: {
      mastery: cvSkill.mastery,
    },
  })

  useEffect(() => {
    reset({
      mastery: cvSkill.mastery,
    })
  }, [cvSkill.mastery, open, reset])

  const [updateUserSkill, { loading }] = useMutation(UPDATE_CV_SKILL, {
    refetchQueries: [{ query: GET_CV_SKILLS, variables: { cvId: cvId } }],
  })

  const onSubmit = async (values: UpdateCvSkillInput) => {
    if (!canUpdateCv(cvId)) return

    try {
      await updateUserSkill({
        variables: {
          skill: {
            cvId: cvId,
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
