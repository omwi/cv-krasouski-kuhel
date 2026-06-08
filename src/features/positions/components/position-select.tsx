"use client"

import { useQuery } from "@apollo/client/react"
import { useT } from "next-i18next/client"

import { FloatingSelect } from "@/components/ui/floating-select"
import { Select, SelectItem } from "@/components/ui/select"
import { GET_POSITIONS } from "@/graphql/positions/queries"

type Props = React.ComponentProps<typeof Select>

export default function PositionSelect({ value, ...props }: Props) {
  const { t } = useT(["input", "common"])
  const { data } = useQuery(GET_POSITIONS)
  const positions = data?.positions ?? []

  return (
    <FloatingSelect
      data-testid="select-position-trigger"
      label={t("position")}
      value={value || "none"}
      {...props}
    >
      <SelectItem value="none">{t("no-position", { ns: "common" })}</SelectItem>
      {positions.map((position) => (
        <SelectItem key={position.id} value={position.id}>
          {position.name}
        </SelectItem>
      ))}
    </FloatingSelect>
  )
}
