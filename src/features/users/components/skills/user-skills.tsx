"use client"

import { useSuspenseQuery } from "@apollo/client/react"

import UserSkillsActions from "@/features/users/components/skills/user-skills-actions"
import UserSKillsCategory from "@/features/users/components/skills/user-skills-category"
import { GET_USER_SKILLS } from "@/graphql/users/queries"

export default function UserSKills({ userId }: { userId: string }) {
  const { data } = useSuspenseQuery(GET_USER_SKILLS, { variables: { userId } })
  const userSkills = data.profile.skills

  const skillsByCategory = Map.groupBy(userSkills, (skill) => skill.categoryId)
    .entries()
    .toArray()

  return (
    <div className="flex w-full max-w-4xl flex-col gap-8 self-center px-4 py-6">
      <div className="flex flex-col gap-8">
        {skillsByCategory.map(([categoryId, skills]) => (
          <UserSKillsCategory
            key={categoryId ?? "other"}
            category={categoryId ?? "other"}
            skills={skills}
            userId={userId}
          />
        ))}
      </div>

      <UserSkillsActions userId={userId} />
    </div>
  )
}
