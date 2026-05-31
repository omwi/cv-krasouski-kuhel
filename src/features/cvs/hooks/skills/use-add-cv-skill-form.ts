import { useEffect, useState } from "react"
import { useMutation, useQuery } from "@apollo/client/react"
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema"
import { useT } from "next-i18next/client"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { SKILL_MASTERIES } from "@/config/const"
import { ADD_CV_SKILL } from "@/graphql/cvs/mutations"
import { GET_CV_SKILLS } from "@/graphql/cvs/queries"
import { GET_SKILLS } from "@/graphql/skills/queries"
import { usePermissions } from "@/hooks/use-permissions"
import { Mastery } from "@/types/__generated__/graphql"
import { CvUserId } from "@/types/graphql-types"

const formSchema = z.object({
  mastery: z.string().min(1),
  skillId: z.string().min(1),
})

type AddCvSkillInput = z.infer<typeof formSchema>

export function useCvSkillAddForm({ id: cvId, user }: CvUserId) {
  const { t } = useT("skills")

  const [open, setOpen] = useState(false)

  const { canUpdateCv } = usePermissions()

  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty, isValid },
  } = useForm<AddCvSkillInput>({
    resolver: standardSchemaResolver(formSchema),
    defaultValues: {
      mastery: SKILL_MASTERIES[0],
      skillId: "",
    },
  })

  useEffect(() => {
    reset({
      mastery: SKILL_MASTERIES[0],
      skillId: "",
    })
  }, [open, reset])

  const { data } = useQuery(GET_SKILLS)
  const skills = data?.skills ?? []

  const [addCvSkill, { loading }] = useMutation(ADD_CV_SKILL, {
    refetchQueries: [{ query: GET_CV_SKILLS, variables: { cvId } }],
  })

  const findSkill = (skillId: string) => {
    return skills.find((skill) => skill.id === skillId)
  }

  const onSubmit = async (values: AddCvSkillInput) => {
    if (!canUpdateCv(user?.id)) return

    const skill = findSkill(values.skillId)
    if (!skill) {
      console.error(`No skill found with id ${values.skillId}`)
      return
    }

    try {
      await addCvSkill({
        variables: {
          skill: {
            cvId: cvId,
            mastery: values.mastery as Mastery,
            name: skill.name,
            categoryId: skill.category?.id,
          },
        },
      })
      toast.success(t("toast.added"))
    } catch (error) {
      console.error(error)
    } finally {
      setOpen(false)
    }
  }

  return {
    control,
    reset,
    isSubmitReady: isValid && isDirty,
    onSubmit: handleSubmit(onSubmit),
    loading,
    open,
    setOpen,
  }
}
