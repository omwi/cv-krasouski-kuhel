import { useT } from "next-i18next/client"

import UserSKill from "@/features/users/components/skills/user-skill"
import { UserSkill } from "@/types/graphql-types"

type Props = {
  category: string
  skills: UserSkill[]
  userId: string
}

export default function UserSKillsCategory({
  category,
  skills,
  userId,
}: Props) {
  const { t } = useT("skills")

  return (
    <div className="flex flex-col gap-2">
      <p>{t(`category.${category}`)}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {skills.map((skill) => (
          <UserSKill key={skill.name} skill={skill} userId={userId} />
        ))}
      </div>
    </div>
  )
}
