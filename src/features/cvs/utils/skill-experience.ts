import { differenceInYears } from "date-fns"

import { CvProject, CvSkill } from "@/types/graphql-types"

export function getSkillExperienceYears(projects: CvProject[], skill: CvSkill) {
  return projects
    .filter((p) => p.environment.includes(skill.name))
    .reduce((acc, p) => acc + getYearsDuration(p), 0)
}

function getYearsDuration(project: CvProject) {
  const startDate = new Date(project.start_date)
  const endDate = project.end_date && new Date(project.end_date)
  if (!endDate) {
    return differenceInYears(new Date(), startDate)
  }
  return differenceInYears(endDate, startDate)
}

export function getSkillLastUsedYear(projects: CvProject[], skill: CvSkill) {
  return projects
    .filter((p) => p.environment.includes(skill.name))
    .map((p) => (p.end_date ? new Date(p.end_date) : new Date()))
    .map((d) => d.getFullYear())
    .sort((a, b) => b - a)
    .at(0)
}
