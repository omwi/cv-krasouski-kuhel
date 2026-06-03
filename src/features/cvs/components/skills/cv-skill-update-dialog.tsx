"use client"

import { SkillUpdateDialog } from "@/components/shared/skills/skill-update-dialog"
import { useCvSkillUpdateForm } from "@/features/cvs/hooks/skills/use-update-cv-skill-form"
import { CvSkill, CvUserId } from "@/types/graphql-types"

type Props = {
  children: React.ReactNode
  cvUserId: CvUserId
  cvSkill: CvSkill
}

export default function CvSkillUpdateDialog({
  children,
  cvUserId,
  cvSkill,
}: Props) {
  const formProps = useCvSkillUpdateForm(cvUserId, cvSkill)

  return (
    <SkillUpdateDialog {...formProps} skill={cvSkill}>
      {children}
    </SkillUpdateDialog>
  )
}
