import {
  GetSkillsQuery,
  GetUserSkillsQuery,
} from "@/types/__generated__/graphql"

export type UserSkill = GetUserSkillsQuery["profile"]["skills"][number]

export type Skill = GetSkillsQuery["skills"][number]
