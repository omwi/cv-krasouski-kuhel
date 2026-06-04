"use client"

import { useSuspenseQuery } from "@apollo/client/react"

import { SkillAddDialog } from "@/components/shared/skills/skill-add-dialog"
import { useCvSkillAddForm } from "@/features/cvs/hooks/skills/use-add-cv-skill-form"
import { GET_CV_SKILLS } from "@/graphql/cvs/queries"
import { CvUserId } from "@/types/graphql-types"

type Props = {
  children: React.ReactNode
  cvUserId: CvUserId
}

export default function CvSkillAddDialog({ children, cvUserId }: Props) {
  const formProps = useCvSkillAddForm(cvUserId)

  const { data } = useSuspenseQuery(GET_CV_SKILLS, {
    variables: { cvId: cvUserId.id },
  })
  const cvSkills = data?.cv?.skills ?? []

  return (
    <SkillAddDialog
      {...formProps}
      excludedSkillNames={cvSkills.map((cs) => cs.name)}
    >
      {children}
    </SkillAddDialog>
  )
}
