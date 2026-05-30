import { useEffect } from "react"
import { useMutation } from "@apollo/client/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useT } from "next-i18next/client"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { BASE_CV_FRAGMENT } from "@/graphql/cvs/fragments"
import { CREATE_CV } from "@/graphql/cvs/mutations"
import { usePermissions } from "@/hooks/use-permissions"
import { appendUniqueRef } from "@/utils/cache"

export function useCreateCvForm(
  userId?: string,
  dialog?: { open: boolean; setOpen: (open: boolean) => void }
) {
  const { t } = useT(["input", "cv-actions"])

  const { currentUserId, canCreateCv } = usePermissions()

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
  }, [reset, dialog?.open])

  const [createCv, { loading: isCreating }] = useMutation(CREATE_CV, {
    update(cache, { data }) {
      const newCv = data?.createCv
      if (!newCv) return

      const newCvRef = cache.writeFragment({
        data: newCv,
        fragment: BASE_CV_FRAGMENT,
      })
      if (!newCvRef) return

      cache.modify({
        fields: {
          cvs: appendUniqueRef(newCvRef, newCv.id),
        },
      })

      if (!newCv.user) return
      cache.modify({
        id: cache.identify({
          __typename: "User",
          id: newCv.user.id,
        }),
        fields: {
          cvs: appendUniqueRef(newCvRef, newCv.id),
        },
      })
    },
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
            userId: userId ?? currentUserId,
          },
        },
      })
      toast.success(t("create.success", { ns: "cv-actions" }))
      if (dialog) {
        dialog.setOpen(false)
      }
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
