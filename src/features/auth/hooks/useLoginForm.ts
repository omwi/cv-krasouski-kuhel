import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { authUserVar } from "@/lib/apollo/authVar"
import { LoginInput, LoginSchema } from "@/types/auth"

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
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: standardSchemaResolver(LoginSchema),
  })

  const [loading, setLoading] = useState(false)

  const onSubmit = async (formData: LoginInput) => {
    setLoading(true)
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.message || "Login failed")
        return
      }

      authUserVar(data.user)
      router.push(callbackUrl)
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
