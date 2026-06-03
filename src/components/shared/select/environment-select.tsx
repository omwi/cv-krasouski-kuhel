"use client"

import * as React from "react"
import { useQuery } from "@apollo/client/react"
import { useT } from "next-i18next/client"

import { Combobox } from "@/components/ui/combobox"
import { GET_SKILLS } from "@/graphql/skills/queries"

export type EnvironmentSelectProps = {
  value: string[]
  onValueChange: (val: string[]) => void
  disabled?: boolean
}

const EMPTY_VALUES: string[] = []

export function EnvironmentSelect({
  value = EMPTY_VALUES,
  onValueChange,
  disabled,
}: EnvironmentSelectProps) {
  const { t } = useT(["input", "common"])
  const { data, loading } = useQuery(GET_SKILLS)

  const options = React.useMemo(() => {
    const skills = data?.skills || []
    return skills.map((skill) => ({
      value: skill.name,
      label: skill.name,
    }))
  }, [data?.skills])

  return (
    <Combobox
      id="environment"
      label={t("environment", { ns: "input" })}
      value={value}
      onValueChange={onValueChange}
      options={options}
      disabled={disabled || loading}
      searchPlaceholder={t("search-skill", { ns: "input" })}
      emptyText={t("not-found", { ns: "common" })}
    />
  )
}
