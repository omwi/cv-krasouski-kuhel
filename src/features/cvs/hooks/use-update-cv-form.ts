import { useEffect } from "react"
import { useMutation } from "@apollo/client/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useT } from "next-i18next/client"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { UPDATE_CV } from "@/graphql/cvs/mutations"
import { GET_CV } from "@/graphql/cvs/queries"
import { Cv } from "@/types/graphql-types"

export function useUpdateCvForm(
  cv: Cv,
  dialog?: { open: boolean; setOpen: (open: boolean) => void }
) {
  const { t } = useT(["input, 'cv-actions"])

  const { reset, handleSubmit, register, control, formState } = useForm({
    resolver: zodResolver(
      z.object({
        name: z.string().min(1, t("errors.required")),
        education: z.string(),
        description: z.string().min(1, t("errors.required")),
      })
    ),
    mode: "onSubmit",
    defaultValues: {
      name: cv.name,
      education: cv.education ?? "",
      description: cv.description,
    },
  })
  const { isValid, isDirty, isSubmitting, errors } = formState

  useEffect(() => {
    if (!dialog?.open) return

    reset({
      name: cv.name,
      education: cv.education ?? "",
      description: cv.description,
    })
  }, [cv, reset, dialog?.open])

  const [updateCv, { loading: isUpdating }] = useMutation(UPDATE_CV, {
    refetchQueries: [{ query: GET_CV, variables: { cvId: cv.id } }],
  })

  const onSubmit = handleSubmit(async (data) => {
    try {
      await updateCv({
        variables: {
          cv: {
            cvId: cv.id,
            name: data.name,
            education: data.education,
            description: data.description,
          },
        },
      })
      toast.success(t("update.success", { ns: "cv-actions" }))
      dialog?.setOpen(false)
    } catch (error) {
      console.error(error)
      toast.error(t("update.error", { ns: "cv-actions" }))
    }
  })

  return {
    register,
    control,
    onSubmit,
    isSubmitReady: isValid && isDirty,
    isSubmitting: isSubmitting || isUpdating,
    errors,
  }
}
