import { getT } from "next-i18next/server"

import { PreloadQuery } from "@/apollo-client"
import { SelectionProvider } from "@/components/shared/selection/selection-provider"
import CvSkills from "@/features/cvs/components/skills/cv-skills"
import { GET_CV_SKILLS } from "@/graphql/cvs/queries"

export async function generateMetadata() {
  const { t } = await getT("metadata")
  return {
    title: t("cv-skills.title"),
    description: t("cv-skills.description"),
  }
}

export default async function Cvs({
  params,
}: {
  params: Promise<{ cvId: string }>
}) {
  const { cvId } = await params

  return (
    <PreloadQuery query={GET_CV_SKILLS} variables={{ cvId }}>
      <SelectionProvider>
        <CvSkills cvId={cvId} />
      </SelectionProvider>
    </PreloadQuery>
  )
}
