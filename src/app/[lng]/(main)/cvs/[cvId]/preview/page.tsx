import { notFound } from "next/navigation"
import { getT } from "next-i18next/server"

import { query } from "@/apollo-client"
import CvPreview from "@/features/cvs/components/preview/cv-preview"
import { GET_CV, GET_CV_PROJECTS, GET_CV_SKILLS } from "@/graphql/cvs/queries"
import { CvPreviewData } from "@/types/graphql-types"

export async function generateMetadata() {
  const { t } = await getT("metadata")
  return {
    title: t("cv-preview.title"),
    description: t("cv-preview.description"),
  }
}

async function getCvPreviewData(cvId: string): Promise<CvPreviewData | null> {
  try {
    const [cvData, cvSkillsData, cvProjectsData] = await Promise.all([
      query({ query: GET_CV, variables: { cvId } }),
      query({ query: GET_CV_SKILLS, variables: { cvId } }),
      query({ query: GET_CV_PROJECTS, variables: { cvId } }),
    ])
    if (
      !cvData.data ||
      !cvSkillsData.data ||
      !cvProjectsData.data?.cv.projects
    ) {
      return null
    }
    return {
      cv: cvData.data.cv,
      skills: cvSkillsData.data.cv.skills,
      projects: cvProjectsData.data.cv.projects,
    }
  } catch (error) {
    console.error("Error fetching cv:", error)
    return null
  }
}

export default async function CvPreviewPage({
  params,
}: {
  params: Promise<{ cvId: string }>
}) {
  const { cvId } = await params
  const previewData = await getCvPreviewData(cvId)
  if (!previewData) {
    return notFound()
  }

  return <CvPreview previewData={previewData} />
}
