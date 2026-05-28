import { Mastery, Proficiency } from "@/types/__generated__/graphql"

export const COOKIES = {
  ACCESS_TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
  LANGUAGE: "i18next",
} as const

export const SKILL_MASTERIES: Mastery[] = [
  "Novice",
  "Advanced",
  "Competent",
  "Proficient",
  "Expert",
]

export const LANGUAGE_PROFICIENCIES: Proficiency[] = [
  "A1",
  "A2",
  "B1",
  "B2",
  "C1",
  "C2",
] as const
