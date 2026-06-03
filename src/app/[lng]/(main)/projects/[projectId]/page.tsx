import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getT } from "next-i18next/server"

import { getClient, PreloadQuery } from "@/apollo-client"
import ProjectDetails from "@/features/projects/components/details/project-details"
import { GET_PROJECT } from "@/graphql/projects/queries"
import { getCurrentUser } from "@/utils/get-current-user"

type Props = {
  params: Promise<{ projectId: string }>
}

async function getProject(projectId: string) {
  try {
    const client = getClient()
    const { data } = await client.query({
      query: GET_PROJECT,
      variables: { projectId },
    })
    return data?.project ?? null
  } catch (error) {
    console.error("Error fetching project:", error)
    return null
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { projectId } = await params
  const [{ t }, project] = await Promise.all([
    getT("metadata"),
    getProject(projectId),
  ])

  if (!project) {
    return {
      title: t("project.not-found-title"),
    }
  }

  return {
    title: `${project.name} | ${t("project.title")}`,
    description: project.description || t("project.description"),
  }
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ projectId: string }>
}) {
  const { projectId } = await params
  const [currentUser, project] = await Promise.all([
    getCurrentUser(),
    getProject(projectId),
  ])

  if (!project) {
    notFound()
  }

  return (
    <PreloadQuery query={GET_PROJECT} variables={{ projectId }}>
      <ProjectDetails currentUser={currentUser} project={project} />
    </PreloadQuery>
  )
}
