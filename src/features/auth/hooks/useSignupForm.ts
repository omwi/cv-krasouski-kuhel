import { useState } from "react"
import { useRouter } from "next/navigation"
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { authUserVar } from "@/lib/apollo/authVar"
import { SignupInput, SignupSchema } from "@/types/auth"

export function useSignupForm() {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupInput>({
    resolver: standardSchemaResolver(SignupSchema),
  })

  const [loading, setLoading] = useState(false)

  const onSubmit = async (formData: SignupInput) => {
    setLoading(true)
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Signup failed")

      authUserVar(data.user)
      router.push(`/users/${data.user.id}`)
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message)
      } else {
        toast.error("An unexpected error occurred")
      }
    } finally {
      setLoading(false)
    }
  }

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isSubmitting,
    loading,
  }
}
