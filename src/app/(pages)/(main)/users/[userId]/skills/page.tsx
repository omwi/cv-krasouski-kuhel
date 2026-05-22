import { getT } from "next-i18next/server"

import { canUpdateUser } from "@/utils/permissions"

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

  const hasUpdatePermissions = await canUpdateUser(userId)
  console.log(hasUpdatePermissions)

  return <div>Skills</div>
}
