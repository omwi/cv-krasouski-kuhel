import { useEffect, useState } from "react"
import { useMutation } from "@apollo/client/react"
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema"
import { useT } from "next-i18next/client"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { UPDATE_USER_LANGUAGE } from "@/graphql/users/mutations"
import { usePermissions } from "@/hooks/use-permissions"
import { Proficiency } from "@/types/__generated__/graphql"
import { UserLanguage } from "@/types/graphql-types"

const formSchema = z.object({
  proficiency: z.string().min(1),
})

type UpdateUserLanguageInput = z.infer<typeof formSchema>

export function useUserLanguageUpdateForm(
  userId: string,
  userLanguage: UserLanguage
) {
  const { t } = useT("languages")

  const { canUpdateUser } = usePermissions()

  const [open, setOpen] = useState(false)

  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty, isValid },
  } = useForm<UpdateUserLanguageInput>({
    resolver: standardSchemaResolver(formSchema),
    defaultValues: {
      proficiency: userLanguage.proficiency,
    },
  })

  useEffect(() => {
    reset({
      proficiency: userLanguage.proficiency,
    })
  }, [userLanguage.proficiency, open, reset])

  const [updateUserLanguage, { loading }] = useMutation(UPDATE_USER_LANGUAGE)

  const onSubmit = async (values: UpdateUserLanguageInput) => {
    if (!canUpdateUser(userId)) return

    try {
      await updateUserLanguage({
        variables: {
          language: {
            userId: userId,
            name: userLanguage.name,
            proficiency: values.proficiency as Proficiency,
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
