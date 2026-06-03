import { startTransition, useActionState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema"
import type { TFunction } from "i18next"
import { useT } from "next-i18next/client"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { API_ENDPOINTS } from "@/config/api-endpoints"
import { paths } from "@/config/paths"

export const getResetPasswordSchema = (t: TFunction) =>
  z
    .object({
      newPassword: z.string().min(8, t("errors.password", { ns: "input" })),
      "confirm-password": z
        .string()
        .min(8, t("errors.password", { ns: "input" })),
    })
    .refine((data) => data.newPassword === data["confirm-password"], {
      message: t("errors.password-match", { ns: "input" }),
      path: ["confirm-password"],
    })

export type ResetPasswordInput = z.infer<
  ReturnType<typeof getResetPasswordSchema>
>
export type ResetPasswordOutput = Pick<
  z.infer<ReturnType<typeof getResetPasswordSchema>>,
  "newPassword"
>

type ActionState = {
  error: string | null
  success: boolean
}

const initialState: ActionState = {
  error: null,
  success: false,
}

export function useResetPasswordForm() {
  const router = useRouter()
  const { t } = useT(["input", "auth"])
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: standardSchemaResolver(getResetPasswordSchema(t)),
  })

  const resetPasswordAction = async (
    prevState: ActionState,
    formData: ResetPasswordOutput
  ): Promise<ActionState> => {
    try {
      const res = await fetch(API_ENDPOINTS.auth["reset-password"], {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })
      const data = await res.json()

      if (!res.ok) {
        const errorMessage = data.message || "Failed"
        toast.error(errorMessage)
        return { error: errorMessage, success: false }
      }

      toast.success(t("toast.reset-success", { ns: "auth" }))
      router.push(paths.auth.login.get())

      return { error: null, success: true }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred"
      toast.error(errorMessage)
      return { error: errorMessage, success: false }
    }
  }

  const [state, formAction, isPending] = useActionState(
    resetPasswordAction,
    initialState
  )

  const onSubmitAction = (data: ResetPasswordInput) => {
    const { newPassword } = data

    startTransition(() => {
      formAction({ newPassword })
    })
  }
  return {
    register,
    handleSubmit: handleSubmit(onSubmitAction),
    errors,
    isPending,
    state,
  }
}
