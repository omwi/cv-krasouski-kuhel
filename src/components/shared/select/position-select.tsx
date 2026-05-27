"use client"

import { useQuery } from "@apollo/client/react"
import { useT } from "next-i18next/client"

import { FloatingSelect } from "@/components/ui/floating-select"
import { SelectItem } from "@/components/ui/select"
import { GET_POSITIONS } from "@/graphql/positions/queries"

export type PositionSelectProps = {
  value: string
  onValueChangeAction: (val: string) => void
  disabled?: boolean
}

export function PositionSelect({
  value,
  onValueChangeAction,
  ...props
}: PositionSelectProps) {
  const { data, loading } = useQuery(GET_POSITIONS)
  const positions = data?.positions || []
  const { t } = useT("input")

  return (
    <FloatingSelect
      id="positionId"
      label={t("position")}
      value={value}
      onValueChange={onValueChangeAction}
      disabled={loading || props.disabled}
    >
      {positions.map((p) => (
        <SelectItem key={p.id} value={p.id.toString()}>
          {p.name}
        </SelectItem>
      ))}
    </FloatingSelect>
  )
}
