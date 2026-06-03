import type { Metadata } from "next"
import { getT } from "next-i18next/server"

import { PreloadQuery } from "@/apollo-client"
import ProjectsTable from "@/features/projects/components/table/projects-table"
import { GET_PROJECTS } from "@/graphql/projects/queries"

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT("metadata")
  return {
    title: t("projects.title"),
    description: t("projects.description"),
  }
}

export default async function Projects() {
  return (
    <PreloadQuery query={GET_PROJECTS}>
      <ProjectsTable />
    </PreloadQuery>
  )
}
