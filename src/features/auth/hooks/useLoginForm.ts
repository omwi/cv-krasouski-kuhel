import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useLazyQuery } from "@apollo/client/react"
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { authUserVar } from "@/lib/apollo/authVar"
import { LoginInput, LoginResponse, LoginSchema } from "@/types/auth"

import { LOGIN_QUERY } from "../api/login"

export function useLoginForm() {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: standardSchemaResolver(LoginSchema),
  })

  const [loginQuery, { loading, data, error }] = useLazyQuery<
    LoginResponse,
    { auth: LoginInput }
  >(LOGIN_QUERY)

  useEffect(() => {
    if (error) toast.error(error.message)
  }, [error])

  useEffect(() => {
    if (!data) return

    document.cookie = `access_token=${data.login.access_token}; path=/;`
    document.cookie = `refresh_token=${data.login.refresh_token}; path=/;`

    authUserVar(data.login.user)

    router.push("/users")
  }, [data, router])

  const onSubmit = async (formData: LoginInput) => {
    await loginQuery({ variables: { auth: formData } })
  }

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isSubmitting,
    loading,
  }
}
