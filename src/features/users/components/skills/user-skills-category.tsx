"use client"

import SharedSkillsCategory from "@/components/shared/skills/shared-skills-category"
import UserSKillItem from "@/features/users/components/skills/user-skill-item"
import { UserSkill } from "@/types/graphql-types"

type Props = {
  category: string
  skills: UserSkill[]
  userId: string
}

export default function UserSKillsCategory({
  category,
  skills,
  userId,
}: Props) {
  return (
    <SharedSkillsCategory category={category}>
      {skills.map((skill) => (
        <UserSKillItem key={skill.name} skill={skill} userId={userId} />
      ))}
    </SharedSkillsCategory>
  )
}
