"use client"

import { SkillUpdateDialog } from "@/components/shared/skills/skill-update-dialog"
import { useUserSkillUpdateForm } from "@/features/users/hooks/skills/use-user-skill-update-form"
import { UserSkill } from "@/types/graphql-types"

type Props = {
  children: React.ReactNode
  userId: string
  userSkill: UserSkill
}

export default function UserSkillUpdateDialog({
  children,
  userId,
  userSkill,
}: Props) {
  const formProps = useUserSkillUpdateForm(userId, userSkill)

  return (
    <SkillUpdateDialog {...formProps} skill={userSkill}>
      {children}
    </SkillUpdateDialog>
  )
}
