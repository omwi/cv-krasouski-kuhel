import { useEffect } from "react"
import { useMutation } from "@apollo/client/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useT } from "next-i18next/client"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { CREATE_CV } from "@/graphql/cvs/mutations"
import { GET_CVS } from "@/graphql/cvs/queries"
import { usePermissions } from "@/hooks/use-permissions"

export function useCreateCvForm(
  userId: string,
  dialog?: { open: boolean; setOpen: (open: boolean) => void }
) {
  const { t } = useT(["input, 'cv-actions"])

  const { canCreateCv } = usePermissions()

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
      name: "",
      education: "",
      description: "",
    },
  })
  const { isValid, isSubmitting, errors } = formState

  useEffect(() => {
    if (!dialog?.open) return

    reset({
      name: "",
      education: "",
      description: "",
    })
  }, [userId, reset, dialog?.open])

  const [createCv, { loading: isCreating }] = useMutation(CREATE_CV, {
    refetchQueries: [{ query: GET_CVS }],
  })

  const onSubmit = handleSubmit(async (values) => {
    if (!canCreateCv) return
    try {
      await createCv({
        variables: {
          cv: {
            name: values.name,
            education: values.education,
            description: values.description,
            userId,
          },
        },
      })
      toast.success(t("create.success", { ns: "cv-actions" }))
      dialog?.setOpen(false)
    } catch (error) {
      console.error(error)
      toast.error(t("create.error", { ns: "cv-actions" }))
    }
  })

  return {
    register,
    control,
    onSubmit,
    isSubmitReady: isValid,
    isSubmitting: isSubmitting || isCreating,
    errors,
  }
}
