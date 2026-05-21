import { redirect } from "next/navigation"
import { getT } from "next-i18next/server"

import { PreloadQuery } from "@/apollo-client"
import { paths } from "@/config/paths"
import AvatarUpload from "@/features/users/components/profile/avatar-upload"
import ProfileTextInfo from "@/features/users/components/profile/profile-text-info"
import ProfileUpdateForm from "@/features/users/components/profile/profile-update-form"
import { GET_USER } from "@/features/users/graphql/users/queries"
import { canUpdateUser, getCurrentUser } from "@/utils/permissions"

export async function generateMetadata() {
  const { t } = await getT("metadata")
  return {
    title: t("user-profile.title"),
    description: t("user-profile.description"),
  }
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ userId: string }>
}) {
  const { userId } = await params
  const currentUser = await getCurrentUser()

  console.log("currentUser", currentUser)

  if (!canUpdateUser(userId)) {
    redirect(paths.users.get())
  }

  return (
    <PreloadQuery query={GET_USER} variables={{ userId }}>
      <section className="flex flex-col items-center gap-8 pt-8 md:gap-16">
        <AvatarUpload userId={userId} />
        <ProfileTextInfo userId={userId} />
        <ProfileUpdateForm userId={userId} />
      </section>
    </PreloadQuery>
  )
}
