import { useEffect, useState } from "react"
import { useMutation } from "@apollo/client/react"
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema"
import { useT } from "next-i18next/client"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { LANGUAGE_PROFICIENCIES } from "@/config/const"
import { ADD_USER_LANGUAGE } from "@/graphql/users/mutations"
import { usePermissions } from "@/hooks/use-permissions"
import { Proficiency } from "@/types/__generated__/graphql"

const formSchema = z.object({
  languageName: z.string().min(1),
  proficiency: z.string().min(1),
})

type AddUserLanguageInput = z.infer<typeof formSchema>

export function useUserLanguageAddForm(userId: string) {
  const { t } = useT("skills")

  const [open, setOpen] = useState(false)

  const { canUpdateUser } = usePermissions()

  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty, isValid },
  } = useForm<AddUserLanguageInput>({
    resolver: standardSchemaResolver(formSchema),
    defaultValues: {
      languageName: "",
      proficiency: LANGUAGE_PROFICIENCIES[0],
    },
  })

  useEffect(() => {
    reset({
      languageName: "",
      proficiency: LANGUAGE_PROFICIENCIES[0],
    })
  }, [open, reset])

  const [addUserLanguage, { loading }] = useMutation(ADD_USER_LANGUAGE)

  const onSubmit = async (values: AddUserLanguageInput) => {
    if (!canUpdateUser(userId)) return

    try {
      await addUserLanguage({
        variables: {
          language: {
            userId: userId,
            name: values.languageName,
            proficiency: values.proficiency as Proficiency,
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
    isSubmitReady: isDirty && isValid,
    onSubmit: handleSubmit(onSubmit),
    loading,
    open,
    setOpen,
  }
}
