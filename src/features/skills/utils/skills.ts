import { Skill, UserSkill } from "@/types/graphql-types"

export function hasUserSkill(userSkills: UserSkill[], skill: Skill) {
  return userSkills.some((us) => us.name === skill.name)
}

export function getNotOwnedSkills(userSkills: UserSkill[], skills: Skill[]) {
  return skills.filter((s) => !hasUserSkill(userSkills, s))
}
