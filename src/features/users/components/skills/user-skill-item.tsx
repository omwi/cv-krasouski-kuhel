"use client"

import SharedSkillItem from "@/components/shared/skills/shared-skill-item"
import UserSkillUpdateDialog from "@/features/users/components/skills/user-skill-update-dialog"
import { usePermissions } from "@/hooks/use-permissions"
import { UserSkill } from "@/types/graphql-types"

export default function UserSKillItem({
  skill,
  userId,
}: {
  skill: UserSkill
  userId: string
}) {
  const { canUpdateUser } = usePermissions()

  return (
    <SharedSkillItem
      skill={skill}
      disabled={!canUpdateUser(userId)}
      renderDialog={(children) => (
        <UserSkillUpdateDialog userId={userId} userSkill={skill}>
          {children}
        </UserSkillUpdateDialog>
      )}
    />
  )
}
