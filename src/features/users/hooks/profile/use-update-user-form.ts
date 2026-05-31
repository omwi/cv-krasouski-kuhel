"use client"

import { useEffect } from "react"
import { useMutation } from "@apollo/client/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useT } from "next-i18next/client"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { TableUser } from "@/features/users/components/user-table/users-table"
import {
  getUpdateUserSchema,
  UpdateUserFormValues,
} from "@/features/users/utils/validation"
import { UPDATE_PROFILE, UPDATE_USER } from "@/graphql/users/mutations"
import { GET_USERS_LIST } from "@/graphql/users/queries"
import { UserRole } from "@/types/__generated__/graphql"

export function useUpdateUserForm(
  user: TableUser,
  open: boolean,
  setOpen: (open: boolean) => void
) {
  const { t } = useT(["user-actions", "input", "buttons"])

  const [mutateUser] = useMutation(UPDATE_USER, {
    refetchQueries: [{ query: GET_USERS_LIST }],
  })

  const [mutateProfile] = useMutation(UPDATE_PROFILE, {
    refetchQueries: [{ query: GET_USERS_LIST }],
  })

  const form = useForm<UpdateUserFormValues>({
    resolver: zodResolver(getUpdateUserSchema(t)),
    defaultValues: {
      firstName: user.profile?.first_name || "",
      lastName: user.profile?.last_name || "",
      email: user.email || "",
      departmentId: user.department?.id || "",
      positionId: user.position?.id || "",
      role: user.role || "",
    },
  })

  const {
    handleSubmit,
    formState: { dirtyFields },
    reset,
  } = form

  useEffect(() => {
    if (open) {
      reset({
        firstName: user.profile?.first_name || "",
        lastName: user.profile?.last_name || "",
        email: user.email || "",
        departmentId: user.department?.id || "",
        positionId: user.position?.id || "",
        role: user.role || "",
      })
    }
  }, [open, user, reset])

  const onSubmit = handleSubmit(async (data) => {
    const isFirstNameChanged = !!dirtyFields.firstName
    const isLastNameChanged = !!dirtyFields.lastName
    const isDepartmentChanged = !!dirtyFields.departmentId
    const isPositionChanged = !!dirtyFields.positionId
    const isRoleChanged = !!dirtyFields.role

    try {
      let changed = false

      if (isFirstNameChanged || isLastNameChanged) {
        const profileInput = {
          userId: user.id,
          first_name: data.firstName,
          last_name: data.lastName,
        }

        await mutateProfile({
          variables: { profile: profileInput },
        })
        changed = true
      }

      if (isDepartmentChanged || isPositionChanged || isRoleChanged) {
        const userInput = {
          userId: user.id,
          departmentId: data.departmentId ?? null,
          positionId: data.positionId ?? null,
          role: data.role as UserRole,
        }

        await mutateUser({
          variables: { user: userInput },
        })
        changed = true
      }

      if (changed) {
        toast.success(t("update.success", { ns: "user-actions" }))
        setOpen(false)
      } else {
        toast.info(t("update.no-changes", { ns: "user-actions" }))
        setOpen(false)
      }
    } catch (error) {
      console.error(error)
      const errorMessage =
        error instanceof Error
          ? error.message
          : t("update.error", { ns: "user-actions" })
      toast.error(errorMessage)
    }
  })

  return {
    ...form,
    onSubmit,
  }
}
