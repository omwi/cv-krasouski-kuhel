import { GetUserSkillsQuery, SkillsQuery } from "@/types/__generated__/graphql"

export type UserSkill = GetUserSkillsQuery["profile"]["skills"][number]

export type Skill = SkillsQuery["skills"][number]
