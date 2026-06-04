import { startTransition, useActionState } from "react"
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema"
import type { TFunction } from "i18next"
import { useT } from "next-i18next/client"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { API_ENDPOINTS } from "@/config/api-endpoints"
import { paths } from "@/config/paths"

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

const signupAction = async (
  prevState: ActionState,
  formData: SignupInput
): Promise<ActionState> => {
  try {
    const res = await fetch(API_ENDPOINTS.auth.signup, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
      cache: "no-store",
    })

    const data = await res.json()

    if (!res.ok) {
      const errorMessage = data.message || "Signup failed"
      toast.error(errorMessage)
      return { error: errorMessage, success: false }
    }
    window.location.href = paths.verification.get()

    return { error: null, success: true }
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : "An unexpected error occurred"
    toast.error(errorMessage)
    return { error: errorMessage, success: false }
  }
}

export function useSignupForm() {
  const { t } = useT("input")

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupInput>({
    resolver: standardSchemaResolver(getSignupSchema(t)),
  })

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
