import { useMemo } from "react"
import { useQuery } from "@apollo/client/react"
import { useT } from "next-i18next/client"

import {
  Combobox,
  ComboboxOption,
  SingleComboboxProps,
} from "@/components/ui/combobox"
import { GET_PROJECTS } from "@/graphql/projects/queries"

type Props = Omit<SingleComboboxProps, "options" | "label" | "mode"> & {
  excludedNames?: string[]
}

export default function ProjectSelect({ excludedNames, ...props }: Props) {
  const { t } = useT("input")

  const { data } = useQuery(GET_PROJECTS)
  const skills: ComboboxOption[] = useMemo(() => {
    let projects = data?.projects ?? []
    if (excludedNames) {
      projects = projects.filter((p) => !excludedNames.includes(p.name))
    }
    return projects.map((p) => ({
      value: p.id,
      label: p.name,
    }))
  }, [data?.projects, excludedNames])

  return (
    <Combobox mode="single" label={t("project")} options={skills} {...props} />
  )
}
