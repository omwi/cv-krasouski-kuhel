"use client"

import SharedSkillItem from "@/components/shared/skills/shared-skill-item"
import CvSkillUpdateDialog from "@/features/cvs/components/skills/cv-skill-update-dialog"
import { usePermissions } from "@/hooks/use-permissions"
import { CvSkill, CvUserId } from "@/types/graphql-types"

export default function CvSKillItem({
  skill,
  cvUserId,
}: {
  skill: CvSkill
  cvUserId: CvUserId
}) {
  const { canUpdateCv } = usePermissions()

  return (
    <SharedSkillItem
      skill={skill}
      disabled={!canUpdateCv(cvUserId.user?.id)}
      renderDialog={(children) => (
        <CvSkillUpdateDialog cvUserId={cvUserId} cvSkill={skill}>
          {children}
        </CvSkillUpdateDialog>
      )}
    />
  )
}
