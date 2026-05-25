import { startTransition, useActionState } from "react"
import { useSearchParams } from "next/navigation"
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema"
import type { TFunction } from "i18next"
import { useT } from "next-i18next/client"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { API_ENDPOINTS } from "@/config/api-endpoints"
import { sanitizeCallbackUrl } from "@/features/auth/utils/sanitize-callback-url"

export const getLoginSchema = (t: TFunction) =>
  z.object({
    email: z.email(t("errors.email")),
    password: z.string().min(8, t("errors.password")),
  })

export type LoginInput = z.infer<ReturnType<typeof getLoginSchema>>

type ActionState = {
  error: string | null
  success: boolean
}

const initialState: ActionState = {
  error: null,
  success: false,
}

export function useLoginForm() {
  const searchParams = useSearchParams()
  const callbackUrl = sanitizeCallbackUrl(searchParams.get("callbackUrl"))
  const { t } = useT("input")

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: standardSchemaResolver(getLoginSchema(t)),
  })

  const loginAction = async (
    prevState: ActionState,
    formData: LoginInput
  ): Promise<ActionState> => {
    try {
      const res = await fetch(API_ENDPOINTS.auth.login, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      const data = await res.json()

      if (!res.ok) {
        const errorMessage =
          res.status === 401 || data.message === "Invalid credentials"
            ? t("errors.invalid-credentials", { ns: "input" })
            : data.message || "Login failed"
        toast.error(errorMessage)
        return { error: errorMessage, success: false }
      }

      window.location.href = callbackUrl

      return { error: null, success: true }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred"
      toast.error(errorMessage)
      return { error: errorMessage, success: false }
    }
  }

  const [state, formAction, isPending] = useActionState(
    loginAction,
    initialState
  )

  const onSubmitAction = (data: LoginInput) => {
    startTransition(() => {
      formAction(data)
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
