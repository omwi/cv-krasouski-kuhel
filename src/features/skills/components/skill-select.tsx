import { useMemo } from "react"
import { useQuery } from "@apollo/client/react"
import { useT } from "next-i18next/client"

import {
  Combobox,
  ComboboxOption,
  SingleComboboxProps,
} from "@/components/ui/combobox"
import { getNotOwnedSkills } from "@/features/skills/utils/skills"
import { GET_SKILLS } from "@/graphql/skills/queries"
import { Skill, UserSkill } from "@/types/graphql-types"

type Props = Omit<SingleComboboxProps, "options" | "label" | "mode"> & {
  userSkills?: UserSkill[]
}

export default function SkillSelect({ userSkills, ...props }: Props) {
  const { t } = useT(["skills", "input"])

  const { data } = useQuery(GET_SKILLS)

  const skills: ComboboxOption[] = useMemo(() => {
    let result: Skill[] = data?.skills ?? []
    if (userSkills) {
      result = getNotOwnedSkills(userSkills, result)
    }
    return result.map((s) => ({
      value: s.id,
      label: s.name,
    }))
  }, [data?.skills, userSkills])

  return (
    <Combobox
      mode="single"
      label={t("skill", { ns: "input" })}
      options={skills}
      {...props}
    />
  )
}
