import type { Metadata } from "next"
import { getT } from "next-i18next/server"

import { getClient, PreloadQuery } from "@/apollo-client"
import ProjectDetail from "@/features/projects/components/detail/project-detail"
import { GET_PROJECT } from "@/graphql/projects/queries"
import { getCurrentUser } from "@/utils/get-current-user"

type Props = {
  params: Promise<{ projectId: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { projectId } = await params
  const { t } = await getT("metadata")

  try {
    const client = getClient()
    const { data } = await client.query({
      query: GET_PROJECT,
      variables: { projectId },
    })

    const project = data?.project

    if (!project) {
      return {
        title: t("project.not-found-title"),
      }
    }

    return {
      title: `${project.name} | ${t("project.title")}`,
      description: project.description || t("project.description"),
    }
  } catch (error) {
    console.error("Error fetching project metadata:", error)
    return {
      title: t("project.title"),
      description: t("project.description"),
    }
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
