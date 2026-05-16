import { useState } from "react"
import { useRouter } from "next/navigation"
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema"
import { useT } from "next-i18next/client"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { ForgotPasswordInput, ForgotPasswordSchema } from "@/types/auth"

export function useForgotPasswordForm() {
  const router = useRouter()
  const { t } = useT("auth")

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInput>({
    resolver: standardSchemaResolver(ForgotPasswordSchema),
  })

  const [loading, setLoading] = useState(false)

  const onSubmit = async (formData: ForgotPasswordInput) => {
    setLoading(true)
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Failed")

      toast.success(t("toast.forgot-password"))
      router.push("/auth/login")
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
