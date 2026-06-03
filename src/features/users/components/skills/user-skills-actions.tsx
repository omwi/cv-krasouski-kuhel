"use client"

import SharedSkillsActions from "@/components/shared/skills/shared-skills-actions"
import UserSkillAddDialog from "@/features/users/components/skills/user-skill-add-dialog"
import { useUserSkillsDelete } from "@/features/users/hooks/skills/use-user-skills-delete"
import { usePermissions } from "@/hooks/use-permissions"

export default function UserSkillsActions({
  userId,
  hasSkills,
}: {
  userId: string
  hasSkills: boolean
}) {
  const { canUpdateUser } = usePermissions()
  const hasPermissions = canUpdateUser(userId)

  const { handleStartDelete, handleCancelDelete, handleConfirmDelete } =
    useUserSkillsDelete(userId)

  return (
    <SharedSkillsActions
      hasSkills={hasSkills}
      hasPermissions={hasPermissions}
      handleStartDelete={handleStartDelete}
      handleCancelDelete={handleCancelDelete}
      handleConfirmDelete={handleConfirmDelete}
      renderAddDialog={(children) => (
        <UserSkillAddDialog userId={userId}>{children}</UserSkillAddDialog>
      )}
    />
  )
}
