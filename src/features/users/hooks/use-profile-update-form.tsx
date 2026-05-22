import { useMutation, useSuspenseQuery } from "@apollo/client/react"
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema"
import { useT } from "next-i18next/client"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { usePermission } from "@/hooks/use-permissions"

import { UPDATE_PROFILE, UPDATE_USER } from "../graphql/users/mutations"
import { GET_USER } from "../graphql/users/queries"

const ProfileUpdateSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  departmentId: z.string(),
  positionId: z.string(),
})

type ProfileUpdateInput = z.infer<typeof ProfileUpdateSchema>

export function useProfileUpdateForm(userId: string) {
  const { t } = useT("user-profile")

  const { canUpdateUser } = usePermission()

  const { data } = useSuspenseQuery(GET_USER, { variables: { userId } })
  const { user } = data

  const [updateProfile, { loading: isUpdatingProfile }] =
    useMutation(UPDATE_PROFILE)
  const [updateUser, { loading: isUpdatingUser }] = useMutation(UPDATE_USER)

  const {
    register,
    control,
    handleSubmit,
    formState: { isDirty },
  } = useForm<ProfileUpdateInput>({
    resolver: standardSchemaResolver(ProfileUpdateSchema),
    defaultValues: {
      firstName: user.profile.first_name ?? "",
      lastName: user.profile.last_name ?? "",
      departmentId: user.department?.id ?? "",
      positionId: user.position?.id ?? "",
    },
  })

  const updateUserNames = async (values: ProfileUpdateInput) => {
    await updateProfile({
      variables: {
        profile: {
          userId,
          first_name: values.firstName,
          last_name: values.lastName,
        },
      },
    })
  }
  const updateUserJob = async (values: ProfileUpdateInput) => {
    await updateUser({
      variables: {
        user: {
          userId,
          departmentId: values.departmentId,
          positionId: values.positionId,
        },
      },
    })
  }
  const onSubmit = async (values: ProfileUpdateInput) => {
    if (!canUpdateUser(userId)) {
      console.error("Don't have permissions to update this user")
      return
    }

    try {
      const [nameRes, jobRes] = await Promise.allSettled([
        updateUserNames(values),
        updateUserJob(values),
      ])

      if (nameRes.status === "fulfilled" && jobRes.status === "fulfilled") {
        toast.success(t("update-profile.success"))
        return
      }
      toast.error(t("update-profile.error"))
    } catch (e) {
      console.error(e)
      toast.error(t("update-profile.error"))
    }
  }

  return {
    onSubmit: handleSubmit(onSubmit),
    register,
    control,
    isDirty,
    isPending: isUpdatingProfile || isUpdatingUser,
  }
}
