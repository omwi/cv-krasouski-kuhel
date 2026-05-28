import { Language, UserLanguage } from "@/types/graphql-types"

export function hasUserLanguage(
  userLanguages: UserLanguage[],
  language: NonNullable<Language>
) {
  return userLanguages.some((ul) => ul.name === language.name)
}

export function getNotOwnedLanguages(
  userLanguages: UserLanguage[],
  languages: NonNullable<Language>[]
) {
  return languages.filter((l) => !hasUserLanguage(userLanguages, l))
}
