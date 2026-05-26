import { useEffect } from "react"
import { useMutation } from "@apollo/client/react"
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { UPDATE_USER_SKILL } from "@/graphql/users/mutations"
import { GET_USER_SKILLS } from "@/graphql/users/queries"
import { usePermissions } from "@/hooks/use-permissions"
import { Mastery } from "@/types/__generated__/graphql"
import { UserSkill } from "@/types/graphql-types"

const formSchema = z.object({
  mastery: z.string().min(1),
})

type UpdateUserSkillInput = z.infer<typeof formSchema>

export function useUserSkillUpdateForm(userId: string, userSkill: UserSkill) {
  const { canUpdateUser } = usePermissions()

  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty, isValid },
  } = useForm<UpdateUserSkillInput>({
    resolver: standardSchemaResolver(formSchema),
    defaultValues: {
      mastery: userSkill.mastery,
    },
  })

  useEffect(() => {
    reset({
      mastery: userSkill.mastery,
    })
  }, [userSkill.mastery, reset])

  const [updateUserSkill, { loading }] = useMutation(UPDATE_USER_SKILL, {
    refetchQueries: [{ query: GET_USER_SKILLS, variables: { userId } }],
  })

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
    } catch (error) {
      console.error(error)
    }
  }

  return {
    control,
    reset,
    isDirty,
    isValid,
    onSubmit: handleSubmit(onSubmit),
    loading,
  }
}
