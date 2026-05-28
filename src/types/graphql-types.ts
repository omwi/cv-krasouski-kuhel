import {
  GetCvsQuery,
  GetLanguagesQuery,
  GetUserLanguagesQuery,
  GetUserSkillsQuery,
  GetUserSkillsQuery,
  SkillsQuery,
  SkillsQuery,
} from "@/types/__generated__/graphql"

export type UserSkill = GetUserSkillsQuery["profile"]["skills"][number]

export type Skill = SkillsQuery["skills"][number]

export type UserLanguage = GetUserLanguagesQuery["profile"]["languages"][number]

export type Language = GetLanguagesQuery["languages"][number]

export type Cv = GetCvsQuery["cvs"][number]
