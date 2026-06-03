import {
  BaseCvFragment,
  CvProjectFragment,
  GetCvQuery,
  GetCvSkillsQuery,
  GetLanguagesQuery,
  GetUserLanguagesQuery,
  GetUserSkillsQuery,
  ProjectFragment,
  SkillsQuery,
} from "@/types/__generated__/graphql"

export type UserSkill = GetUserSkillsQuery["profile"]["skills"][number]

export type Skill = SkillsQuery["skills"][number]

export type UserLanguage = GetUserLanguagesQuery["profile"]["languages"][number]

export type Language = GetLanguagesQuery["languages"][number]

export type Cv = BaseCvFragment

export type CvUserId = {
  id: string
  user: {
    id: string
  } | null
}

export type CvSkill = GetCvSkillsQuery["cv"]["skills"][number]

export type Project = ProjectFragment
export type CvProject = CvProjectFragment

export type CvPreviewData = {
  cv: GetCvQuery["cv"]
  skills: CvSkill[]
  projects: CvProject[]
}
