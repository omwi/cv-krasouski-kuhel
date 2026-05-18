import { startTransition, useActionState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { authUserVar } from "@/lib/apollo/authVar"
import { LoginInput, LoginSchema } from "@/types/auth"

type ActionState = {
  error: string | null
  success: boolean
}

const initialState: ActionState = {
  error: null,
  success: false,
}

function sanitizeCallbackUrl(url: string | null): string {
  if (!url || !url.startsWith("/") || url.startsWith("//")) return "/users"
  try {
    new URL(url, "http://x")
    return url
  } catch {
    return "/users"
  }
}

export function useLoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = sanitizeCallbackUrl(searchParams.get("callbackUrl"))

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: standardSchemaResolver(LoginSchema),
  })

  const loginAction = async (
    prevState: ActionState,
    formData: LoginInput
  ): Promise<ActionState> => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      const data = await res.json()

      if (!res.ok) {
        const errorMessage = data.message || "Login failed"
        toast.error(errorMessage)
        return { error: errorMessage, success: false }
      }

      authUserVar(data.user)
      router.push(callbackUrl)

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
