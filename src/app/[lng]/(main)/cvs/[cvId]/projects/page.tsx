import { getT } from "next-i18next/server"

import { PreloadQuery } from "@/apollo-client"
import CvProjectsTable from "@/features/cvs/components/projects/table/cv-projects-table"
import { GET_CV_PROJECTS } from "@/graphql/cvs/queries"
import { getCurrentUser } from "@/utils/get-current-user"

export async function generateMetadata() {
  const { t } = await getT("metadata")
  return {
    title: t("cv-projects.title"),
    description: t("cv-projects.description"),
  }
}

export default async function UserCvsPage({
  params,
}: {
  params: Promise<{ cvId: string }>
}) {
  const [currentUser, { cvId }] = await Promise.all([getCurrentUser(), params])

  return (
    <PreloadQuery query={GET_CV_PROJECTS} variables={{ cvId }}>
      <CvProjectsTable currentUser={currentUser} cvId={cvId} />
    </PreloadQuery>
  )
}
