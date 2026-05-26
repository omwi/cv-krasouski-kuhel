import type { Metadata } from "next"
import { getT } from "next-i18next/server"

import { getCurrentUser } from "@/utils/get-current-user"

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT("metadata")
  return {
    title: t("projects.title"),
    description: t("projects.description"),
  }
}

export default async function Projects() {
  const currentUser = await getCurrentUser()

  return <p>projects</p>
}
