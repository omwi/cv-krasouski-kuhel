import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useMutation } from "@apollo/client/react"
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { authUserVar } from "@/lib/apollo/authVar"
import { SignupInput, SignupResponse, SignupSchema } from "@/types/auth"

import { SIGNUP_MUTATION } from "../api/signup"

export function useSignupForm() {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupInput>({
    resolver: standardSchemaResolver(SignupSchema),
  })

  const [signupMutation, { loading, data, error }] = useMutation<
    SignupResponse,
    { auth: SignupInput }
  >(SIGNUP_MUTATION)

  useEffect(() => {
    if (error) toast.error(error.message)
  }, [error])

  useEffect(() => {
    if (!data) return

    document.cookie = `access_token=${data.signup.access_token}; path=/;`
    document.cookie = `refresh_token=${data.signup.refresh_token}; path=/;`

    authUserVar(data.signup.user)
    router.push(`/users/${data.signup.user.id}`)
  }, [data, router])

  const onSubmit = async (formData: SignupInput) => {
    await signupMutation({ variables: { auth: formData } })
  }

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isSubmitting,
    loading,
  }
}
