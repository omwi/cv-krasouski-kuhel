import { getT } from "next-i18next/server"

import { PreloadQuery } from "@/apollo-client"
import AvatarUpload from "@/features/users/components/profile/avatar-upload"
import ProfileTextInfo from "@/features/users/components/profile/profile-text-info"
import ProfileUpdateForm from "@/features/users/components/profile/profile-update-form"
import { GET_USER } from "@/graphql/users/queries"

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

  return (
    <PreloadQuery query={GET_USER} variables={{ userId }}>
      <section className="flex flex-col items-center gap-6 pt-8 md:gap-12">
        <AvatarUpload userId={userId} />
        <ProfileTextInfo userId={userId} />
        <ProfileUpdateForm userId={userId} />
      </section>
    </PreloadQuery>
  )
}
