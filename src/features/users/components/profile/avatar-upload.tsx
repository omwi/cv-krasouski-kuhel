"use client"

import { useSuspenseQuery } from "@apollo/client/react"
import { Upload, X } from "lucide-react"
import { useT } from "next-i18next/client"

import IconButton from "@/components/shared/icon-button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { FileUpload, FileUploadDropzone } from "@/components/ui/file-upload"
import { GET_USER } from "@/features/users/graphql/users/queries"
import { cn } from "@/lib/utils"

import { useAvatarUpload } from "../../hooks/use-avatar-upload"

export default function AvatarUpload({
  userId,
  hasUpdatePermission,
}: {
  userId: string
  hasUpdatePermission: boolean
}) {
  const { t } = useT("user-profile")

  const { data, refetch } = useSuspenseQuery(GET_USER, {
    variables: { userId },
  })
  const { user } = data

  const { isLoading, onAvatarReject, onAvatarAccept, onAvatarDelete } =
    useAvatarUpload(userId)

  const handleAvatarDelete = async () => {
    await onAvatarDelete()
    await refetch()
  }

  const displayName = user.profile.full_name || user.email

  return (
    <div className="flex flex-col items-center gap-4 md:flex-row md:gap-8">
      <div className="relative">
        <Avatar size="lg">
          <AvatarImage src={user.profile.avatar ?? ""} />
          <AvatarFallback className="text-5xl text-avatar-foreground">
            {displayName[0].toUpperCase()}
          </AvatarFallback>
          <IconButton
            disabled={isLoading || !hasUpdatePermission}
            className={cn(
              "absolute -top-6 -right-6",
              (user.profile.avatar === null || !hasUpdatePermission) && "hidden"
            )}
            onClick={handleAvatarDelete}
          >
            <X />
          </IconButton>
        </Avatar>
      </div>

      <FileUpload
        disabled={isLoading || !hasUpdatePermission}
        accept=".png, .jpg, .jpeg, .gif"
        maxSize={0.5 * 1024 * 1024}
        maxFiles={1}
        onFileReject={onAvatarReject}
        onAccept={onAvatarAccept}
        messages={{
          fileTooLarge: t("upload-avatar.status.too-large"),
          fileTypeNotAccepted: t("upload-avatar.status.type-not-accepted"),
        }}
        className={cn("flex cursor-pointer flex-col items-center gap-2", {
          hidden: !hasUpdatePermission,
        })}
      >
        <FileUploadDropzone>
          <span className="flex flex-row gap-4">
            <Upload />
            <p className="text-lg font-medium">{t("upload-avatar.text")}</p>
          </span>
          <p className="text-secondary-foreground">
            {t("upload-avatar.description")}
          </p>
        </FileUploadDropzone>
      </FileUpload>
    </div>
  )
}
