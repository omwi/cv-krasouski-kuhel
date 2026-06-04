import { useEffect } from "react"
import { useMutation } from "@apollo/client/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useT } from "next-i18next/client"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { UPDATE_CV } from "@/graphql/cvs/mutations"
import { usePermissions } from "@/hooks/use-permissions"
import { Cv } from "@/types/graphql-types"

import { getCvFormSchema } from "./cv-form-schema"

export function useUpdateCvForm(
  cv: Cv,
  dialog?: { open: boolean; setOpen: (open: boolean) => void }
) {
  const { t } = useT(["input, 'cv-actions"])

  const { canUpdateCv } = usePermissions()

  const { reset, handleSubmit, register, control, formState } = useForm({
    resolver: zodResolver(getCvFormSchema(t)),
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

  const [updateCv, { loading: isUpdating }] = useMutation(UPDATE_CV)

  const onSubmit = handleSubmit(async (values) => {
    if (!canUpdateCv(cv.user?.id)) return
    try {
      await updateCv({
        variables: {
          cv: {
            cvId: cv.id,
            name: values.name,
            education: values.education,
            description: values.description,
          },
        },
      })
      toast.success(t("update.success", { ns: "cv-actions" }))
      if (dialog) {
        dialog.setOpen(false)
      } else {
        reset({
          name: values.name,
          education: values.education,
          description: values.description,
        })
      }
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
