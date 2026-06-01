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
import { UserRole } from "@/types/__generated__/graphql"
import { appendUniqueRef } from "@/utils/cache"

export function useCreateUserForm(
  open: boolean,
  setOpen: (open: boolean) => void
) {
  const { t } = useT(["user-actions", "input", "buttons"])

  const [mutateUser] = useMutation(CREATE_USER, {
    update(cache, { data }) {
      if (data?.createUser) {
        cache.modify({
          fields: {
            users(existingRefs = [], { readField }) {
              const newRef = { __ref: cache.identify(data.createUser)! }
              return appendUniqueRef(newRef, data.createUser.id)(existingRefs, {
                readField,
              })
            },
          },
        })
      }
    },
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
        departmentId: data.departmentId ?? null,
        positionId: data.positionId ?? null,
        profile: {
          first_name: data.firstName,
          last_name: data.lastName,
        },
        role: data.role as UserRole,
      }

      await mutateUser({
        variables: { user: userInput },
      })

      toast.success(t("create.success", { ns: "user-actions" }))
      setOpen(false)
    } catch (error) {
      console.error(error)
      const errorMessage =
        error instanceof Error
          ? error.message
          : t("create.error", { ns: "user-actions" })
      toast.error(errorMessage)
    }
  })

  return {
    ...form,
    onSubmit,
  }
}
