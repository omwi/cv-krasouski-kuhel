"use client"

import SharedSkillsActions from "@/components/shared/skills/shared-skills-actions"
import CvSkillAddDialog from "@/features/cvs/components/skills/cv-skill-add-dialog"
import { useCvSkillsDelete } from "@/features/cvs/hooks/skills/use-cv-skill-delete"
import { usePermissions } from "@/hooks/use-permissions"
import { CvUserId } from "@/types/graphql-types"

export default function CvSkillsActions({
  cvUserId,
  hasSkills,
}: {
  cvUserId: CvUserId
  hasSkills: boolean
}) {
  const { canUpdateCv } = usePermissions()
  const hasPermissions = canUpdateCv(cvUserId.user?.id)

  const { handleStartDelete, handleCancelDelete, handleConfirmDelete } =
    useCvSkillsDelete(cvUserId)

  return (
    <SharedSkillsActions
      hasSkills={hasSkills}
      hasPermissions={hasPermissions}
      handleStartDelete={handleStartDelete}
      handleCancelDelete={handleCancelDelete}
      handleConfirmDelete={handleConfirmDelete}
      renderAddDialog={(children) => (
        <CvSkillAddDialog cvUserId={cvUserId}>{children}</CvSkillAddDialog>
      )}
    />
  )
}
