import { GetUserSkillsQuery } from "@/types/__generated__/graphql"

export type UserSkill = GetUserSkillsQuery["profile"]["skills"][number]
