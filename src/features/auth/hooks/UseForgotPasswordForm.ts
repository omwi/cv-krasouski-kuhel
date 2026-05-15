import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useMutation } from "@apollo/client/react"
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema"
import { useT } from "next-i18next/client"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import {
  ForgotPasswordInput,
  ForgotPasswordResponse,
  ForgotPasswordSchema,
} from "@/types/auth"

import { FORGOT_PASSWORD_MUTATION } from "../api/forgotPassword"

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

  const [forgotPasswordMutation, { loading, data, error }] = useMutation<
    ForgotPasswordResponse,
    { auth: ForgotPasswordInput }
  >(FORGOT_PASSWORD_MUTATION)

  useEffect(() => {
    if (error) toast.error(error.message)
  }, [error])

  useEffect(() => {
    if (data === undefined) return

    toast.success(t("toast.forgot-password"))
    router.push("/auth/login")
  }, [data, router])

  const onSubmit = async (formData: ForgotPasswordInput) => {
    await forgotPasswordMutation({ variables: { auth: formData } })
  }

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isSubmitting,
    loading,
  }
}
