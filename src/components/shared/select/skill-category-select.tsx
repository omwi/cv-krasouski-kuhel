"use client"

import { useQuery } from "@apollo/client/react"
import { useT } from "next-i18next/client"

import { FloatingSelect } from "@/components/ui/floating-select"
import { SelectItem } from "@/components/ui/select"
import { GET_SKILL_CATEGORIES } from "@/graphql/skills/queries"

export type SkillCategorySelectProps = {
  id?: string
  value: string
  onValueChangeAction: (val: string) => void
  disabled?: boolean
}

export function SkillCategorySelect({
  value,
  onValueChangeAction,
  ...props
}: SkillCategorySelectProps) {
  const { t } = useT(["input", "skill-actions"])
  const { data, loading: categoriesLoading } = useQuery(GET_SKILL_CATEGORIES)
  const categories = data?.skillCategories || []

  return (
    <FloatingSelect
      id={props.id || "categoryId"}
      label={t("category", { ns: "input" })}
      value={value}
      onValueChange={onValueChangeAction}
      disabled={props.disabled || categoriesLoading}
    >
      <SelectItem value="none">
        {t("no-category", {
          ns: "skill-actions",
        })}
      </SelectItem>
      {categories.map((category) => (
        <SelectItem key={category.id} value={category.id}>
          {category.name}
        </SelectItem>
      ))}
    </FloatingSelect>
  )
}
