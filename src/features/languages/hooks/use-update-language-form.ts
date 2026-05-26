import { useEffect } from "react"
import { useMutation } from "@apollo/client/react"
import { zodResolver } from "@hookform/resolvers/zod"
import type { TFunction } from "i18next"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { TableLanguages } from "@/features/languages/components/table/languages-table-columns"
import {
  getLanguageSchema,
  LanguageFormValues,
} from "@/features/languages/schema"
import { UPDATE_LANGUAGE } from "@/graphql/languages/mutations"
import { GET_LANGUAGES } from "@/graphql/languages/queries"

export function useUpdateLanguageForm(
  language: TableLanguages,
  open: boolean,
  t: TFunction,
  onSuccess?: () => void
) {
  const [mutateUpdate, { loading }] = useMutation(UPDATE_LANGUAGE, {
    refetchQueries: [{ query: GET_LANGUAGES }],
  })

  const form = useForm<LanguageFormValues>({
    resolver: zodResolver(getLanguageSchema(t)),
    mode: "onBlur",
    defaultValues: {
      name: language?.name || "",
      native_name: language?.native_name || "",
      iso2: language?.iso2 || "",
    },
  })

  const { reset } = form

  useEffect(() => {
    if (open) {
      reset({
        name: language?.name || "",
        native_name: language?.native_name || "",
        iso2: language?.iso2 || "",
      })
    }
  }, [open, language, reset])

  const onSubmit = form.handleSubmit(async (data) => {
    if (!form.formState.isDirty) {
      toast.info(t("update.no-changes", { ns: "department-actions" }))
      onSuccess?.()
      return
    }

    try {
      await mutateUpdate({
        variables: {
          language: {
            languageId: String(language?.id),
            name: data.name,
            native_name: data.native_name,
            iso2: data.iso2.toUpperCase(),
          },
        },
      })
      toast.success(t("update.success", { ns: "department-actions" }))
      onSuccess?.()
    } catch (error) {
      console.error(error)
      const errorMessage =
        error instanceof Error
          ? error.message
          : t("update.error", { ns: "department-actions" })
      toast.error(errorMessage)
    }
  })

  return {
    form,
    onSubmit,
    loading,
  }
}
