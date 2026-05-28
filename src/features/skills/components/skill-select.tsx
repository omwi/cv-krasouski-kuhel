import { useMemo } from "react"
import { useQuery } from "@apollo/client/react"
import { useT } from "next-i18next/client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getNotOwnedSkills } from "@/features/skills/utils/skills"
import { GET_SKILLS } from "@/graphql/skills/queries"
import { Skill, UserSkill } from "@/types/graphql-types"

type Props = React.ComponentProps<typeof Select> & {
  userSkills?: UserSkill[]
}

export default function SkillSelect({ userSkills, ...props }: Props) {
  const { t } = useT(["skills", "input"])

  const { data } = useQuery(GET_SKILLS)

  const skills = useMemo(() => {
    let result: Skill[] = data?.skills ?? []
    if (userSkills) {
      result = getNotOwnedSkills(userSkills, result)
    }
    return result
  }, [data?.skills, userSkills])

  return (
    <Select {...props}>
      <SelectTrigger>
        <SelectValue placeholder={t("skill", { ns: "input" })} />
      </SelectTrigger>

      <SelectContent>
        {skills.map((skill) => (
          <SelectItem key={skill.id} value={skill.id}>
            {skill.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
