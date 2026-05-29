import { useMemo } from "react"
import { useQuery } from "@apollo/client/react"
import { useT } from "next-i18next/client"

import {
  Combobox,
  ComboboxOption,
  SingleComboboxProps,
} from "@/components/ui/combobox"
import { GET_SKILLS } from "@/graphql/skills/queries"
import { Skill } from "@/types/graphql-types"

type Props = Omit<SingleComboboxProps, "options" | "label" | "mode"> & {
  excludedNames?: string[]
}

export default function SkillSelect({ excludedNames, ...props }: Props) {
  const { t } = useT(["skills", "input"])

  const { data } = useQuery(GET_SKILLS)

  const skills: ComboboxOption[] = useMemo(() => {
    let result: Skill[] = data?.skills ?? []
    if (excludedNames) {
      result = result.filter((s) => !excludedNames.includes(s.name))
    }
    return result.map((s) => ({
      value: s.id,
      label: s.name,
    }))
  }, [data?.skills, excludedNames])

  return (
    <Combobox
      mode="single"
      label={t("skill", { ns: "input" })}
      options={skills}
      {...props}
    />
  )
}
