import { Mastery } from "@/types/__generated__/graphql"

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
