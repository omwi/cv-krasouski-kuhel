"use client"

import { useSuspenseQuery } from "@apollo/client/react"

import CvSkillsActions from "@/features/cvs/components/skills/cv-skills-actions"
import CvSKillsCategory from "@/features/cvs/components/skills/cv-skills-category"
import { GET_CV_SKILLS } from "@/graphql/cvs/queries"

export default function CvSKills({ cvId }: { cvId: string }) {
  const { data } = useSuspenseQuery(GET_CV_SKILLS, { variables: { cvId } })
  const cvSkill = data.cv.skills

  const skillsByCategory = Map.groupBy(cvSkill, (skill) => skill.categoryId)
    .entries()
    .toArray()

  return (
    <div className="flex w-full max-w-4xl flex-col gap-8 self-center px-4 py-6">
      <div className="flex flex-col gap-8">
        {skillsByCategory.map(([categoryId, skills]) => (
          <CvSKillsCategory
            key={categoryId ?? "other"}
            category={categoryId ?? "other"}
            skills={skills}
            cvUserId={data.cv}
          />
        ))}
      </div>

      <CvSkillsActions cvUserId={data.cv} hasSkills={cvSkill.length > 0} />
    </div>
  )
}
