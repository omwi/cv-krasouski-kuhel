import { useMutation } from "@apollo/client/react"
import { zodResolver } from "@hookform/resolvers/zod"
import type { TFunction } from "i18next"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import {
  getLanguageSchema,
  LanguageFormValues,
} from "@/features/languages/schema"
import { CREATE_LANGUAGE } from "@/graphql/languages/mutations"
import { appendUniqueRef } from "@/utils/cache"

export function useCreateLanguageForm(t: TFunction, onSuccess?: () => void) {
  const [mutateCreate, { loading }] = useMutation(CREATE_LANGUAGE, {
    update(cache, { data }) {
      if (data?.createLanguage) {
        cache.modify({
          fields: {
            languages(existingRefs = [], { readField }) {
              const newRef = { __ref: cache.identify(data.createLanguage)! }
              return appendUniqueRef(newRef, data.createLanguage.id)(
                existingRefs,
                {
                  readField,
                }
              )
            },
          },
        })
      }
    },
  })

  const form = useForm<LanguageFormValues>({
    resolver: zodResolver(getLanguageSchema(t)),
    mode: "onBlur",
    defaultValues: {
      name: "",
      native_name: "",
      iso2: "",
    },
  })

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      await mutateCreate({
        variables: {
          language: {
            name: data.name,
            native_name: data.native_name,
            iso2: data.iso2.toUpperCase(),
          },
        },
      })
      toast.success(t("create.success", { ns: "language-actions" }))
      form.reset()
      onSuccess?.()
    } catch (error) {
      console.error(error)
      const errorMessage =
        error instanceof Error
          ? error.message
          : t("create.error", { ns: "language-actions" })
      toast.error(errorMessage)
    }
  })

  return {
    form,
    onSubmit,
    loading,
  }
}
