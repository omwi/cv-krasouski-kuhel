import { getT } from "next-i18next/server"

import { PreloadQuery } from "@/apollo-client"
import UserSKills from "@/features/users/components/skills/user-skills"
import { GET_USER_SKILLS } from "@/graphql/users/queries"

export async function generateMetadata() {
  const { t } = await getT("metadata")
  return {
    title: t("user-skills.title"),
    description: t("user-skills.description"),
  }
}

export default async function UserSkillsPage({
  params,
}: {
  params: Promise<{ userId: string }>
}) {
  const { userId } = await params

  return (
    <PreloadQuery query={GET_USER_SKILLS} variables={{ userId }}>
      <UserSKills userId={userId} />
    </PreloadQuery>
  )
}
