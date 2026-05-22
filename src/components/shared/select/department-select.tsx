"use client"

import { useQuery } from "@apollo/client/react"
import { useT } from "next-i18next/client"

import { FloatingSelect } from "@/components/ui/floating-select"
import { SelectItem } from "@/components/ui/select"
import { GET_DEPARTMENTS } from "@/graphql/departments/queries"

export type DepartmentSelectProps = {
  id?: string
  value: string
  onValueChangeAction: (val: string) => void
  disabled?: boolean
}

export function DepartmentSelect({
  value,
  onValueChangeAction,
  ...props
}: DepartmentSelectProps) {
  const { data, loading } = useQuery(GET_DEPARTMENTS)
  const departments = data?.departments || []
  const { t } = useT("input")

  return (
    <FloatingSelect
      id={props.id || "departmentId"}
      label={t("department")}
      value={value}
      onValueChange={onValueChangeAction}
      disabled={loading || props.disabled}
    >
      {departments.map((d) => (
        <SelectItem key={d.id} value={d.id.toString()}>
          {d.name}
        </SelectItem>
      ))}
    </FloatingSelect>
  )
}
