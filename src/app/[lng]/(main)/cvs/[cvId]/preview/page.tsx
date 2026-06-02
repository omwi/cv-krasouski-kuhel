import { getT } from "next-i18next/server"

import { PreloadQuery } from "@/apollo-client"
import { GET_CV } from "@/graphql/cvs/queries"

export async function generateMetadata() {
  const { t } = await getT("metadata")
  return {
    title: t("cv-preview.title"),
    description: t("cv-preview.description"),
  }
}

export default async function CvPreview({
  params,
}: {
  params: Promise<{ cvId: string }>
}) {
  const { cvId } = await params

  return (
    <PreloadQuery query={GET_CV} variables={{ cvId }}>
      <div>CV preview</div>
    </PreloadQuery>
  )
}
