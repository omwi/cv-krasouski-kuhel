import { useMutation } from "@apollo/client/react"
import { useT } from "next-i18next/client"
import { toast } from "sonner"

import { UploadAvatarInput } from "@/types/__generated__/graphql"
import { fileToBase64 } from "@/utils/file"

import { DELETE_AVATAR, UPLOAD_AVATAR } from "../graphql/users/mutations"

export function useAvatarUpload(userId: string) {
  const { t } = useT(["user-profile"])

  const [uploadAvatar, { loading: isUploading }] = useMutation(UPLOAD_AVATAR)
  const [deleteAvatar, { loading: isDeleting }] = useMutation(DELETE_AVATAR)

  const isLoading = isUploading || isDeleting

  const onAvatarReject = (file: File, message: string) => {
    toast(message, {
      description: t("upload-avatar.rejected"),
    })
  }

  const onAvatarAccept = async (files: File[]) => {
    const file = files[0]
    if (!file) {
      console.error("No file uploaded")
      return
    }

    const base64 = await fileToBase64(file)
    const { size, type } = file
    const avatar: UploadAvatarInput = { base64, size, type, userId }

    try {
      await uploadAvatar({ variables: { avatar } })
    } catch (error) {
      console.error(error)
      toast.error(t("upload-avatar.error"))
      return
    }

    toast.success(t("upload-avatar.success"))
  }

  const onAvatarDelete = async () => {
    try {
      await deleteAvatar({ variables: { avatar: { userId } } })
    } catch (error) {
      console.error(error)
      toast.error(t("delete-avatar.error"))
      return
    }

    toast.success(t("delete-avatar.success"))
  }

  return { onAvatarReject, onAvatarAccept, onAvatarDelete, isLoading }
}
