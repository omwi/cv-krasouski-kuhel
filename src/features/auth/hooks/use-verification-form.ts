import { startTransition, useActionState } from "react"
import { useRouter } from "next/navigation"
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema"
import type { TFunction } from "i18next"
import { useT } from "next-i18next/client"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { API_ENDPOINTS } from "@/config/api-endpoints"
import { paths } from "@/config/paths"

export const getVerificationSchema = (t: TFunction) =>
  z.object({
    otp: z.string().length(6, t("errors.otp", { ns: "input" })),
  })

export type VerificationInput = z.infer<
  ReturnType<typeof getVerificationSchema>
>

type ActionState = {
  error: string | null
  success: boolean
}

const initialState: ActionState = {
  error: null,
  success: false,
}

export function useVerificationForm() {
  const router = useRouter()
  const { t } = useT(["input", "auth"])

  const {
    setValue,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<VerificationInput>({
    resolver: standardSchemaResolver(getVerificationSchema(t)),
    defaultValues: {
      otp: "",
    },
  })

  const verificationAction = async (
    prevState: ActionState,
    formData: VerificationInput
  ): Promise<ActionState> => {
    try {
      const res = await fetch(API_ENDPOINTS.auth.verify, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      const data = await res.json()

      if (!res.ok) {
        const errorMessage = data.message || "Failed to verify email"
        toast.error(errorMessage)
        return { error: errorMessage, success: false }
      }

      toast.success(t("toast.verification-success", { ns: "auth" }))
      router.push(paths.users.get())

      return { error: null, success: true }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred"
      toast.error(errorMessage)
      return { error: errorMessage, success: false }
    }
  }

  const [state, formAction, isPending] = useActionState(
    verificationAction,
    initialState
  )

  const onSubmitAction = (data: VerificationInput) => {
    startTransition(() => {
      formAction(data)
    })
  }

  return {
    setValue,
    watch,
    handleSubmit: handleSubmit(onSubmitAction),
    errors,
    isPending,
    state,
  }
}
