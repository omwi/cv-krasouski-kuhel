import type { Metadata } from "next"
import { getT } from "next-i18next/server"

import { PreloadQuery } from "@/apollo-client"
import ProjectDetail from "@/features/projects/components/detail/project-detail"
import { GET_PROJECT } from "@/graphql/projects/queries"
import { getCurrentUser } from "@/utils/get-current-user"

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT("metadata")
  return {
    title: t("project.title"),
    description: t("project.description"),
  }
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ projectId: string }>
}) {
  const { projectId } = await params
  const currentUser = await getCurrentUser()

  return (
    <PreloadQuery query={GET_PROJECT} variables={{ projectId }}>
      <ProjectDetail currentUser={currentUser} projectId={projectId} />
    </PreloadQuery>
  )
}
