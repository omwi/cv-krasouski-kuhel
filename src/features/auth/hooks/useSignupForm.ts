import { startTransition, useActionState } from "react"
import { useRouter } from "next/navigation"
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { authUserVar } from "@/lib/apollo/authVar"
import { SignupInput, SignupSchema } from "@/types/auth"

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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupInput>({
    resolver: standardSchemaResolver(SignupSchema),
  })

  const signupAction = async (
    prevState: ActionState,
    formData: SignupInput
  ): Promise<ActionState> => {
    try {
      const res = await fetch("/api/auth/signup", {
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
      router.push(`/users/${data.user.id}`)

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
