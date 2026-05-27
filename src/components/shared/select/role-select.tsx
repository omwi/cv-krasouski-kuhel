"use client"

import { useT } from "next-i18next/client"

import { FloatingSelect } from "@/components/ui/floating-select"
import { SelectItem } from "@/components/ui/select"

export type RoleSelectProps = {
  value: string
  onValueChangeAction: (val: string) => void
  disabled?: boolean
}

export function RoleSelect({
  value,
  onValueChangeAction,
  ...props
}: RoleSelectProps) {
  const { t } = useT("input")

  return (
    <FloatingSelect
      id="role"
      label={t("role")}
      value={value}
      onValueChange={onValueChangeAction}
      disabled={props.disabled}
    >
      <SelectItem value="Admin">Admin</SelectItem>
      <SelectItem value="Employee">Employee</SelectItem>
    </FloatingSelect>
  )
}
