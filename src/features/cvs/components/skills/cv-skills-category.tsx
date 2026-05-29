import { useT } from "next-i18next/client"

import CvSKillItem from "@/features/cvs/components/skills/cv-skill-item"
import { CvSkill } from "@/types/graphql-types"

type Props = {
  category: string
  skills: CvSkill[]
  cvId: string
}

export default function CvSKillsCategory({ category, skills, cvId }: Props) {
  const { t } = useT("skills")

  return (
    <div className="flex flex-col gap-2">
      <p>{t(`category.${category}`)}</p>
      <div className="grid grid-cols-1 gap-1 sm:grid-cols-2 lg:grid-cols-3">
        {skills.map((skill) => (
          <CvSKillItem key={skill.name} skill={skill} cvId={cvId} />
        ))}
      </div>
    </div>
  )
}
