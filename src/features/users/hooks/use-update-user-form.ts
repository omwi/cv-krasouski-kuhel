"use client"

import { useEffect } from "react"
import { useMutation } from "@apollo/client/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useT } from "next-i18next/client"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { TableUser } from "@/features/users/components/user-table/users-table"
import { UPDATE_PROFILE, UPDATE_USER } from "@/graphql/users/mutations"
import { GET_USERS_LIST } from "@/graphql/users/queries"
import { UserRole } from "@/types/__generated__/graphql"
import { convertId } from "@/utils/convert-id"

import { getUpdateUserSchema, UpdateUserFormValues } from "../utils/validation"

export function useUpdateUserForm(
  user: TableUser,
  open: boolean,
  setOpen: (open: boolean) => void
) {
  const { t } = useT(["update-user", "input", "buttons"])

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

  const { reset, handleSubmit } = form

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
    const isFirstNameChanged =
      data.firstName !== (user.profile?.first_name || "")
    const isLastNameChanged = data.lastName !== (user.profile?.last_name || "")
    const isDepartmentChanged =
      data.departmentId !== (user.department?.id || "")
    const isPositionChanged = data.positionId !== (user.position?.id || "")
    const isRoleChanged = data.role !== (user.role || "")

    try {
      let changed = false

      // Profile changes
      if (isFirstNameChanged || isLastNameChanged) {
        const profileInput = {
          userId: convertId(user.id) as string | number,
          first_name: data.firstName,
          last_name: data.lastName,
        }

        await mutateProfile({
          variables: { profile: profileInput },
        })
        changed = true
      }

      // User changes
      if (isDepartmentChanged || isPositionChanged || isRoleChanged) {
        const userInput = {
          userId: convertId(user.id) as string | number,
          departmentId: data.departmentId ? convertId(data.departmentId) : null,
          positionId: data.positionId ? convertId(data.positionId) : null,
          role: data.role as UserRole,
        }

        await mutateUser({
          variables: { user: userInput },
        })
        changed = true
      }

      if (changed) {
        toast.success(t("update-user:success"))
        setOpen(false)
      } else {
        toast.info(t("update-user:no-changes"))
        setOpen(false)
      }
    } catch (error) {
      console.error(error)
      const errorMessage =
        error instanceof Error ? error.message : t("update-user:error")
      toast.error(errorMessage)
    }
  })

  return {
    ...form,
    onSubmit,
  }
}
