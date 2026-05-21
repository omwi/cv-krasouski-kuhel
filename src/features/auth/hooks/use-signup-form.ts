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
import { sanitizeCallbackUrl } from "@/features/auth/utils/sanitize-callback-url"
import { authUserVar } from "@/lib/apollo/auth-var"

export const getSignupSchema = (t: TFunction) =>
  z.object({
    email: z.email(t("errors.email")),
    password: z.string().min(8, t("errors.password")),
  })

export type SignupInput = z.infer<ReturnType<typeof getSignupSchema>>

type ActionState = {
  error: string | null
  success: boolean
}

const initialState: ActionState = {
  error: null,
  success: false,
}

export function useSignupForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { t } = useT("input")

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupInput>({
    resolver: standardSchemaResolver(getSignupSchema(t)),
  })

  const signupAction = async (
    prevState: ActionState,
    formData: SignupInput
  ): Promise<ActionState> => {
    try {
      const res = await fetch(API_ENDPOINTS.auth.signup, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok) {
        const errorMessage = data.message || "Signup failed"
        toast.error(errorMessage)
        return { error: errorMessage, success: false }
      }

      authUserVar(data.user)
      const callbackUrl = sanitizeCallbackUrl(
        searchParams.get("callbackUrl"),
        paths.users.details.get(data.user.id)
      )
      router.replace(callbackUrl)

      return { error: null, success: true }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred"
      toast.error(errorMessage)
      return { error: errorMessage, success: false }
    }
  }

  const [state, formAction, isPending] = useActionState(
    signupAction,
    initialState
  )

  const onSubmitAction = (data: SignupInput) => {
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
