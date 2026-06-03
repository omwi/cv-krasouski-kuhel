"use client"

import { useSuspenseQuery } from "@apollo/client/react"

import { SkillAddDialog } from "@/components/shared/skills/skill-add-dialog"
import { useUserSkillAddForm } from "@/features/users/hooks/skills/use-user-skill-add-form"
import { GET_USER_SKILLS } from "@/graphql/users/queries"

type Props = {
  children: React.ReactNode
  userId: string
}

export default function UserSkillAddDialog({ children, userId }: Props) {
  const formProps = useUserSkillAddForm(userId)

  const { data } = useSuspenseQuery(GET_USER_SKILLS, { variables: { userId } })
  const userSkills = data.profile.skills

  return (
    <SkillAddDialog
      {...formProps}
      excludedSkillNames={userSkills.map((cs) => cs.name)}
    >
      {children}
    </SkillAddDialog>
  )
}
