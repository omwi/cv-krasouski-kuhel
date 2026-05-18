import { startTransition, useActionState } from "react"
import { useRouter } from "next/navigation"
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema"
import { useT } from "next-i18next/client"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { paths } from "@/config/paths"
import { ForgotPasswordInput, ForgotPasswordSchema } from "@/types/auth"

type ActionState = {
  error: string | null
  success: boolean
}

const initialState: ActionState = {
  error: null,
  success: false,
}

export function useForgotPasswordForm() {
  const router = useRouter()
  const { t } = useT("auth")

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: standardSchemaResolver(ForgotPasswordSchema),
  })

  const forgotPasswordAction = async (
    prevState: ActionState,
    formData: ForgotPasswordInput
  ): Promise<ActionState> => {
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      const data = await res.json()

      if (!res.ok) {
        const errorMessage = data.message || "Failed"
        toast.error(errorMessage)
        return { error: errorMessage, success: false }
      }

      toast.success(t("toast.forgot-password"))
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
    forgotPasswordAction,
    initialState
  )

  const onSubmitAction = (data: ForgotPasswordInput) => {
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
