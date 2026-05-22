"use client"

import { useEffect } from "react"
import { useMutation } from "@apollo/client/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useT } from "next-i18next/client"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import {
  CreateUserFormValues,
  getCreateUserSchema,
} from "@/features/users/utils/validation"
import { CREATE_USER } from "@/graphql/users/mutations"
import { GET_USERS_LIST } from "@/graphql/users/queries"
import { UserRole } from "@/types/__generated__/graphql"
import { convertId } from "@/utils/convert-id"

export function useCreateUserForm(
  open: boolean,
  setOpen: (open: boolean) => void
) {
  const { t } = useT(["update-user", "input", "buttons"])

  const [mutateUser] = useMutation(CREATE_USER, {
    refetchQueries: [{ query: GET_USERS_LIST }],
  })

  const form = useForm<CreateUserFormValues>({
    resolver: zodResolver(getCreateUserSchema(t)),
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      departmentId: "",
      positionId: "",
      role: "",
    },
  })

  const { reset, handleSubmit } = form

  useEffect(() => {
    if (open) {
      reset({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        departmentId: "",
        positionId: "",
        role: "",
      })
    }
  }, [open, reset])

  const onSubmit = handleSubmit(async (data) => {
    try {
      const userInput = {
        auth: {
          email: data.email,
          password: data.password,
        },
        cvsIds: [],
        departmentId: data.departmentId ? convertId(data.departmentId) : null,
        positionId: data.positionId ? convertId(data.positionId) : null,
        profile: {
          first_name: data.firstName,
          last_name: data.lastName,
        },
        role: data.role as UserRole,
      }

      await mutateUser({
        variables: { user: userInput },
      })

      toast.success(t("update-user:success") || "User created successfully")
      setOpen(false)
    } catch (error) {
      console.error(error)
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create user"
      toast.error(errorMessage)
    }
  })

  return {
    ...form,
    onSubmit,
  }
}
