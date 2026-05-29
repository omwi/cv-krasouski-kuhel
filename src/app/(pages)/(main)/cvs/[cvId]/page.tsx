import { getT } from "next-i18next/server"

import { PreloadQuery } from "@/apollo-client"
import CvDetailsForm from "@/features/cvs/components/details/cv-details-form"
import { GET_CV } from "@/graphql/cvs/queries"

export async function generateMetadata() {
  const { t } = await getT("metadata")
  return {
    title: t("cv-details.title"),
    description: t("cv-details.description"),
  }
}

export default async function Cvs({
  params,
}: {
  params: Promise<{ cvId: string }>
}) {
  const { cvId } = await params

  return (
    <PreloadQuery query={GET_CV} variables={{ cvId }}>
      <CvDetailsForm cvId={cvId} />
    </PreloadQuery>
  )
}
