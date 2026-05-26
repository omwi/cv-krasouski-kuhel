import type { Metadata } from "next"
import { getT } from "next-i18next/server"

import { PreloadQuery } from "@/apollo-client"
import SkillsTable from "@/features/skills/components/table/skills-table"
import { GET_SKILLS } from "@/graphql/skills/queries"
import { getCurrentUser } from "@/utils/get-current-user"

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT("metadata")
  return {
    title: t("skills.title"),
    description: t("skills.description"),
  }
}

export default async function Skills() {
  const currentUser = await getCurrentUser()

  return (
    <PreloadQuery query={GET_SKILLS}>
      <SkillsTable currentUser={currentUser} />
    </PreloadQuery>
  )
}
