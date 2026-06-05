import { useEffect, useState } from "react"
import { useMutation, useQuery } from "@apollo/client/react"
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema"
import { useT } from "next-i18next/client"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { SKILL_MASTERIES } from "@/config/const"
import {
  AddSkillFormInput as AddUserSkillInput,
  skillAddSchema,
} from "@/features/skills/hooks/skill-schema"
import { GET_SKILLS } from "@/graphql/skills/queries"
import { ADD_USER_SKILL } from "@/graphql/users/mutations"
import { usePermissions } from "@/hooks/use-permissions"
import { Mastery } from "@/types/__generated__/graphql"

export function useUserSkillAddForm(userId: string) {
  const { t } = useT("skills")

  const [open, setOpen] = useState(false)

  const { canUpdateUser } = usePermissions()

  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty, isValid },
  } = useForm<AddUserSkillInput>({
    resolver: standardSchemaResolver(skillAddSchema),
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

  const [addUserSkill, { loading }] = useMutation(ADD_USER_SKILL)

  const findSkill = (skillId: string) => {
    return skills.find((skill) => skill.id === skillId)
  }

  const onSubmit = async (values: AddUserSkillInput) => {
    if (!canUpdateUser(userId)) return

    const skill = findSkill(values.skillId)
    if (!skill) {
      console.error(`No skill found with id ${values.skillId}`)
      return
    }

    try {
      await addUserSkill({
        variables: {
          skill: {
            userId: userId,
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
