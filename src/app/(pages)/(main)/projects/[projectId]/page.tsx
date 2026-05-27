import { getT } from "next-i18next/server"

import { getCurrentUser } from "@/utils/get-current-user"
import { userPermissions } from "@/utils/permissions"

export async function generateMetadata() {
  const { t } = await getT("metadata")
  return {
    title: t("user-profile.title"),
    description: t("user-profile.description"),
  }
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ userId: string }>
}) {
  return <p>project</p>
}
