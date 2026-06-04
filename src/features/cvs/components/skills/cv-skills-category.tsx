"use client"

import SharedSkillsCategory from "@/components/shared/skills/shared-skills-category"
import CvSKillItem from "@/features/cvs/components/skills/cv-skill-item"
import { CvSkill, CvUserId } from "@/types/graphql-types"

type Props = {
  category: string
  skills: CvSkill[]
  cvUserId: CvUserId
}

export default function CvSKillsCategory({
  category,
  skills,
  cvUserId,
}: Props) {
  return (
    <SharedSkillsCategory category={category}>
      {skills.map((skill) => (
        <CvSKillItem key={skill.name} skill={skill} cvUserId={cvUserId} />
      ))}
    </SharedSkillsCategory>
  )
}
